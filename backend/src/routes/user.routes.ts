import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  chnageCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
} from "../controllers/user.controller";
import { fileUploadMiddleware } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter
  .route("/register")
  .post(
    fileUploadMiddleware.fields([{ name: "avatar", maxCount: 1 }]),
    registerUser
  );

userRouter.route("/login").post(fileUploadMiddleware.none(), loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/change-password").post(verifyJWT, chnageCurrentPassword);
userRouter.route("/get-user").get(verifyJWT, getCurrentUser);
userRouter
  .route("/update-account")
  .post(verifyJWT, fileUploadMiddleware.none(), updateAccountDetails);
userRouter
  .route("/avatar-update")
  .post(
    verifyJWT,
    fileUploadMiddleware.fields([{ name: "avatar", maxCount: 1 }]),
    updateAvatar
  );

export default userRouter;
