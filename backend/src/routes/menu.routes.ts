import { Router } from "express";
import { addDish, getAllDishes } from "../controllers/menu.controller";
import { verifyAdmin } from "../middlewares/admin.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import { fileUploadMiddleware } from "../middlewares/multer.middleware";

const menuRoute = Router();

menuRoute.route("/list").get(getAllDishes);
menuRoute.route("/add-dish").post(
  verifyJWT,
  verifyAdmin,
  fileUploadMiddleware.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  addDish
);

export default menuRoute;
