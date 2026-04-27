import Payment, { IPayment } from "../models/Payment";

export async function createPayment(
  paymentData: Omit<IPayment, "createdAt" | "updatedAt">,
) {
  return await Payment.create(paymentData);
}

export async function getPaymentById(id: string) {
  const payment = await Payment.findById(id).populate("order");

  if (!payment) {
    const error = new Error("Payment not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
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
    const error = new Error("Payment not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }

  return updatedPayment;
}
