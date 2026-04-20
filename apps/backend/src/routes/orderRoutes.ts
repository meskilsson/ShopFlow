import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
} from "../controllers/orderController";

const orderRouter = Router();

// CREATE - Create a new order (buyer checkout)
orderRouter.post("/", createOrder);

// READ ALL - Get all orders (admin/seller)
orderRouter.get("/", getAllOrders);

// READ ONE - Get a specific order by ID
orderRouter.get("/:id", getOrderById);

// READ USER ORDERS - Get all orders for a specific user
orderRouter.get("/user/:userId", getOrdersByUser);

// UPDATE - Update order status (admin/seller)
orderRouter.patch("/:id", updateOrderStatus);

export default orderRouter;
