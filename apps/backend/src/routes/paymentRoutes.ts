import { Router } from "express";
import {
  createPayment,
  getPaymentById,
  getPaymentsByOrder,
  updatePaymentStatus,
} from "../controllers/paymentController";
import { requireAuth } from "../middleware/requireAuth";
import { authorizeRoles } from "../middleware/authorizeRoles";

const paymentRouter = Router();

paymentRouter.use(requireAuth);
paymentRouter.use(authorizeRoles("admin"));


// CREATE payment
paymentRouter.post("/", createPayment);

// GET single payment
paymentRouter.get("/:id", getPaymentById);

// GET payments for a specific order
paymentRouter.get("/order/:orderId", getPaymentsByOrder);

// UPDATE payment status
paymentRouter.patch("/:id", updatePaymentStatus);

export default paymentRouter;
