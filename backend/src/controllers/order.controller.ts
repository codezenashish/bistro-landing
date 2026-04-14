import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Order } from "../models/order.model.js";
import { Menu } from "../models/menu.model.js";

// 1. Order Place Karna (Checkout)
const placeOrder = asyncHandler(async (req, res) => {
  const { items, address } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }

  if (!address) {
    throw new ApiError(400, "Delivery address is required");
  }

  let calculatedTotal = 0;

  for (const item of items) {
    const dish = await Menu.findById(item.menuItem);
    if (dish) {
      calculatedTotal += dish.price * item.quantity;
    }
  }

  const order = await Order.create({
    customer: req.user?._id, // Logged-in user ki ID
    items,
    totalAmount: calculatedTotal,
    address,
    status: "Pending",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully!"));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user?._id })
    .populate("items.menuItem", "name price image")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Order history fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Check karein ki status valid hai ya nahi
  const validStatuses = [
    "Pending",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];
  if (!validStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid status. Use: Pending, Preparing, Out for Delivery, Delivered, or Cancelled"
    );
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status: status } },
    { new: true } // updated document return karne ke liye
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, `Order status changed to ${status}`));
});

const getAdminAnalytics = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
        },
      },
    },
  ]);

  const statusCounts = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const analytics = {
    totalRevenue: stats[0]?.totalRevenue || 0,
    totalOrders: stats[0]?.totalOrders || 0,
    deliveredOrders: stats[0]?.deliveredOrders || 0,
    statusBreakdown: statusCounts,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, analytics, "Analytics fetched successfully"));
});

export { placeOrder, getMyOrders, updateOrderStatus, getAdminAnalytics };
