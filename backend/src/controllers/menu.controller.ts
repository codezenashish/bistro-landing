import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { Menu } from "../models/menu.model";
import { uploadOnCloudinary } from "../services/cloudinary";

const addDish = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, isAvailable, isVeg } =
    req.body;
  if (
    [name, description, price, category, image, isAvailable, isVeg].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "missing fields");
  }

  if (
    [name, description, price, category].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(
      400,
      "Name, description, price and category are required"
    );
  }

  const imageLocalPath = (req.files as any)?.image?.[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, " Dish image  is requried");
  }

  const dishImage = await uploadOnCloudinary(imageLocalPath);
  if (!dishImage) {
    throw new ApiError(400, "Error while uploading image to Cloudinary");
  }

  const menuItem = await Menu.create({
    name,
    description,
    price: Number(price),
    category,
    image: dishImage.url,
    isVeg: isVeg === "true" || isVeg === true,
    isAvailable: isAvailable === "false" ? false : true,
  });

  if (!menuItem) {
    throw new ApiError(500, "Something went wrong while adding the dish");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(201, menuItem, "Dish added successfully to the menu!")
    );
});

const getAllDishes = asyncHandler(async (req, res) => {
  const { category, sort } = req.query;
  const filter: any = { isAvailable: true };

  if (category) {
    filter.category = category;
  }

  const dishes = await Menu.find(filter).sort({
    price: sort === "desc" ? -1 : 1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, dishes, "Menu fetched successfully"));
});

export { addDish, getAllDishes };
