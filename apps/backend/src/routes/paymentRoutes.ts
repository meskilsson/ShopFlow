import { Router } from "express";
import {
  createPayment,
  getPaymentById,
  getPaymentsByOrder,
  updatePaymentStatus,
} from "../controllers/paymentController";

const paymentRouter = Router();

// CREATE payment
paymentRouter.post("/", createPayment);

// GET single payment
paymentRouter.get("/:id", getPaymentById);

// GET payments for a specific order
paymentRouter.get("/order/:orderId", getPaymentsByOrder);

// UPDATE payment status
paymentRouter.patch("/:id", updatePaymentStatus);

export default paymentRouter;
