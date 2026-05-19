import Payment, { IPayment } from "../models/Payment";
import { NotFoundError } from "../errors/AppError";

export async function createPayment(
  paymentData: Omit<IPayment, "createdAt" | "updatedAt">,
) {
  return await Payment.create(paymentData);
}

export async function getPaymentById(id: string) {
  const payment = await Payment.findById(id).populate("order");

  if (!payment) {
    throw new NotFoundError("Payment not found");
  }

  return payment;
}

export async function getPaymentsByOrder(orderId: string) {
  return await Payment.find({ order: orderId }).populate("order");
}

export async function updatePaymentStatus(
  id: string,
  status: IPayment["status"],
  transactionId?: string,
) {
  const updatedPayment = await Payment.findByIdAndUpdate(
    id,
    { status, ...(transactionId && { transactionId }) },
    { returnDocument: "after" },
  ).populate("order");

  if (!updatedPayment) {
    throw new NotFoundError("Payment not found");
  }

  return updatedPayment;
}
