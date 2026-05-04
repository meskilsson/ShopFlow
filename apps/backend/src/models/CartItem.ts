import { Schema, Types, model } from "mongoose";

export interface ICartItem {
  cart: Types.ObjectId;
  productVariant: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: [true, "Cart is required"],
      index: true,
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
      default: 1,
    },
      unitPrice: {
        type: Number,
        required: [true, "Unit price is required"],
        min: [0, "Unit price cannot be negative"]
      }, 
  },
  {
    timestamps: true,
  },
);

cartItemSchema.index({ cart: 1, productVariant: 1 }, { unique: true });

const CartItem = model<ICartItem>("CartItem", cartItemSchema);

export default CartItem;
