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

orderRouter.post(
  "/",
  validateRequest({ body: createOrderSchema }),
  createOrder,
);

orderRouter.post("/from-cart", resolveCartOwner, createOrderFromCart);

orderRouter.get("/", getAllOrders);

orderRouter.get(
  "/user/:userId",
  validateRequest({ params: userIdParamSchema }),
  getOrdersByUser,
);

orderRouter.get(
  "/user/:userId/with-items",
  validateRequest({ params: userIdParamSchema }),
  getOrdersWithItemsByUser,
);

orderRouter.get(
  "/:id",
  validateRequest({ params: orderIdParamSchema }),
  getOrderById,
);

orderRouter.patch(
  "/:id",
  validateRequest({
    params: orderIdParamSchema,
    body: updateOrderStatusSchema,
  }),
  updateOrderStatus,
);

export default orderRouter;