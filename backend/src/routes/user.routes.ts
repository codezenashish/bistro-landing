import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
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

export default userRouter;
