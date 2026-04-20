import { Schema, model, Types } from "mongoose";

export interface IOrderItem {
  order: Types.ObjectId; // Which order this item belongs to
  productVariant: Types.ObjectId; // Which product variant was purchased
  quantity: number; // How many units were purchased
  priceAtPurchase: number; // The price at the time the order was created
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },
    productVariant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: [true, "Product variant is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    priceAtPurchase: {
      type: Number,
      required: [true, "Price at purchase is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

const OrderItem = model<IOrderItem>("OrderItem", orderItemSchema);

export default OrderItem;
