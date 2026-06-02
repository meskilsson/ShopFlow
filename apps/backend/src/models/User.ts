import { Schema, model } from "mongoose";
import type { Types } from "mongoose";

export type UserRole = "buyer" | "seller" | "admin";

export interface IUser {
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  wishlist: Types.ObjectId[];
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | null;
  deleteReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot be more than 20 characters"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
      required: true,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deleteReason: {
      type: String,
      trim: true,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

const User = model<IUser>("User", userSchema);

export default User;
