import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  createOrderFromCart,
  getOrdersWithItemsByUser,
} from "../controllers/orderController";
import resolveCartOwner from "../middleware/resolveCartOwner";
import { validateRequest } from "../middleware/validate";
import {
  createOrderSchema,
  orderIdParamSchema,
  userIdParamSchema,
  updateOrderStatusSchema,
} from "../schemas/orderSchemas";

const orderRouter = Router();

// CREATE - Create a new order (buyer checkout)
orderRouter.post(
  "/",
  validateRequest({ body: createOrderSchema }),
  createOrder,
);

// CREATE FROM CART
orderRouter.post("/from-cart", resolveCartOwner, createOrderFromCart);

// READ ALL - Get all orders (admin/seller)
orderRouter.get("/", getAllOrders);

// READ USER ORDERS
orderRouter.get(
  "/user/:userId",
  validateRequest({ params: userIdParamSchema }),
  getOrdersByUser,
);

// READ ONE - Get a specific order by ID
orderRouter.get(
  "/:id",
  validateRequest({ params: orderIdParamSchema }),
  getOrderById,
);

// READ USERS ORDERS WITH ITEMS
orderRouter.get(
  "/user/:userId/with-items",
  validateRequest({ params: userIdParamSchema }),
  getOrdersWithItemsByUser,
);

// UPDATE - Update order status (admin/seller)
orderRouter.patch(
  "/:id",
  validateRequest({
    params: orderIdParamSchema,
    body: updateOrderStatusSchema,
  }),
  updateOrderStatus,
);

export default orderRouter;
