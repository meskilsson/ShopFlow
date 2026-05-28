import { Schema, model } from "mongoose";
import { Types } from "mongoose";

export type ProductCategory =
    | "T-Shirts"
    | "Shoes"
    | "Pants"
    | "Shirts"
    | "Jackets"
    | "Accessories";

export interface IProduct {
    name: string;
    price: number;
    category: ProductCategory;
    ProductImage?: string;
    seller?: Types.ObjectId | null;
    deletedAt?: Date | null;
    deletedBy?: Types.ObjectId | null;
    deleteReason?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            set: (value: string) => {
                if (!value) return value;
                return value.charAt(0).toUpperCase() + value.slice(1)
            },
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            enum: [
                "T-Shirts",
                "Shoes",
                "Pants",
                "Shirts",
                "Jackets",
                "Accessories",
            ],
        },

        ProductImage: {
            type: String,
            trim: true,
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
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
    }
)

productSchema.index({ seller: 1 });
productSchema.index({ deletedAt: 1 });

const Product = model<IProduct>("Product", productSchema);
export default Product;