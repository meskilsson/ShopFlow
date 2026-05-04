import { Schema, model, Types } from "mongoose";

export interface IOrder {
  user?: Types.ObjectId;
  sessionId?: string;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sessionId: {
      type: String,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: [true, "Status is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      required: [true, "Payment status is required"],
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("validate", function validateOrderOwner() {
  if (!this.user && !this.sessionId) {
    this.invalidate("user", "An order must belong to a user or a session");
  }
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
