import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { uploadOnCloudinary } from "../services/cloudinary";

interface RefreshTokenPayload extends JwtPayload {
  _id: string;
}

const generateAccessAndRefreshToken = async (userID: any) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new ApiError(400, "User not found while generating tokens");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "somthing went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, phoneNumber } = req.body;

  if (
    [fullName, email, username, password, phoneNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = (req.files as any)?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    phoneNumber,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body || {};

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const isPasswordValid = await user.isPasswordValid(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options: any = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (incomingRefreshToken) {
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as RefreshTokenPayload;

      await User.findOneAndUpdate(
        { _id: decodedToken?._id, refreshToken: incomingRefreshToken },
        { $set: { refreshToken: undefined } },
        { returnDocument: "after" }
      );
    } catch {
      // Even if token is invalid/expired, proceed to clear cookies for idempotent logout.
    }
  }

  const options: any = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out succesfully"));
});

export { generateAccessAndRefreshToken, registerUser, loginUser, logoutUser };
