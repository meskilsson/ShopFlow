import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  createOrderFromCart,
} from "../controllers/orderController";
import resolveCartOwner from "../middleware/resolveCartOwner";

const orderRouter = Router();

// CREATE - Create a new order (buyer checkout)
orderRouter.post("/", createOrder);
orderRouter.post("/from-cart", resolveCartOwner, createOrderFromCart);

// READ ALL - Get all orders (admin/seller)
orderRouter.get("/", getAllOrders);

// READ USER ORDERS - Get all orders for a specific user
orderRouter.get("/user/:userId", getOrdersByUser);

// READ ONE - Get a specific order by ID
orderRouter.get("/:id", getOrderById);

// UPDATE - Update order status (admin/seller)
orderRouter.patch("/:id", updateOrderStatus);

export default orderRouter;
