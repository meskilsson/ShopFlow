import { Schema, Types, model, type HydratedDocument, type Model } from "mongoose";

export interface ICart {
  user?: Types.ObjectId;
  sessionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CartDocument = HydratedDocument<ICart>;
type CartModel = Model<ICart, {}, {}, {}, CartDocument>;

const cartSchema = new Schema<ICart, CartModel>(
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
  },
  {
    timestamps: true,
  },
);

cartSchema.pre("validate", function validateCartOwner() {
  if (!this.user && !this.sessionId) {
    this.invalidate("user", "A cart must belong to a user or a session");
  }
});

const Cart = model<ICart, CartModel>("Cart", cartSchema);

export default Cart;
