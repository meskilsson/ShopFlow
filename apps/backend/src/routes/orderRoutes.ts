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
import { requireSelfOrAdmin } from "../middleware/requireSelfOrAdmin";
import { authorizeRoles } from "../middleware/authorizeRoles";

const orderRouter = Router();

orderRouter.post(
  "/",
  validateRequest({ body: createOrderSchema }),
  createOrder,
);

orderRouter.post("/from-cart", resolveCartOwner, createOrderFromCart);

orderRouter.get("/", authorizeRoles("admin"), getAllOrders);

orderRouter.get(
  "/user/:userId",
  validateRequest({ params: userIdParamSchema }),
  requireSelfOrAdmin,
  getOrdersByUser,
);

orderRouter.get(
  "/user/:userId/with-items",
  validateRequest({ params: userIdParamSchema }),
  requireSelfOrAdmin,
  getOrdersWithItemsByUser,
);

orderRouter.get(
  "/:id",
  requireSelfOrAdmin,
  validateRequest({ params: orderIdParamSchema }),
  getOrderById,
);

orderRouter.patch(
  "/:id",
  validateRequest({
    params: orderIdParamSchema,
    body: updateOrderStatusSchema,
  }),
  requireSelfOrAdmin,
  updateOrderStatus,
);

export default orderRouter;