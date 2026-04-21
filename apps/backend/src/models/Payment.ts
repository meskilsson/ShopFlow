import { Schema, model, Types } from "mongoose";

export interface IPayment {
  order: Types.ObjectId;
  paymentMethod: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  transactionId?: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["card", "swish", "invoice", "klarna", "paypal"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      required: true,
    },
    transactionId: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = model<IPayment>("Payment", paymentSchema);

export default Payment;
