import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  placeOrder,
  getMyOrders,
  getAdminAnalytics,
} from "../controllers/order.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const orderRouter = Router();
orderRouter.use(verifyJWT);
orderRouter.route("/place-order").post(placeOrder);
orderRouter.route("/my-history").get(getMyOrders);
orderRouter
  .route("/admin/analytics")
  .get(verifyJWT, verifyAdmin, getAdminAnalytics);

export default orderRouter;
