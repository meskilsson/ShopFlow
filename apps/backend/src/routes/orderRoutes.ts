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
import { requireAuth } from "../middleware/requireAuth";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { requireSelfOrRole } from "../middleware/requireSelfOrRole";
import { requireOrderOwnerOrRole } from "../middleware/requireOrderOwnerOrRole";
import {
  createOrderSchema,
  orderIdParamSchema,
  userIdParamSchema,
  updateOrderStatusSchema,
} from "../schemas/orderSchemas";

const orderRouter = Router();

orderRouter.post(
  "/from-cart",
  resolveCartOwner,
  createOrderFromCart,
);

orderRouter.post(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  validateRequest({ body: createOrderSchema }),
  createOrder,
);

orderRouter.get(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  getAllOrders,
);

orderRouter.get(
  "/user/:userId",
  requireAuth,
  validateRequest({ params: userIdParamSchema }),
  requireSelfOrRole("userId", "admin"),
  getOrdersByUser,
);

orderRouter.get(
  "/user/:userId/with-items",
  requireAuth,
  validateRequest({ params: userIdParamSchema }),
  requireSelfOrRole("userId", "admin"),
  getOrdersWithItemsByUser,
);

orderRouter.get(
  "/:id",
  requireAuth,
  validateRequest({ params: orderIdParamSchema }),
  requireOrderOwnerOrRole("admin"),
  getOrderById,
);

orderRouter.patch(
  "/:id",
  requireAuth,
  authorizeRoles("admin"),
  validateRequest({
    params: orderIdParamSchema,
    body: updateOrderStatusSchema,
  }),
  updateOrderStatus,
);

export default orderRouter;