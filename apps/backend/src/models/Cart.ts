import { Schema, Types, model } from "mongoose";

export interface ICartItem {
  productId: string;
  quantity: number;
}

export interface ICart {
  user?: Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: String,
      required: [true, "Product ID is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
  },
  {
    _id: false,
  },
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    sessionId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

cartSchema.pre("validate", function validateCartOwner(next) {
  if (!this.user && !this.sessionId) {
    this.invalidate("user", "A cart must belong to a user or a session");
  }

  next();
});

const Cart = model<ICart>("Cart", cartSchema);

export default Cart;
