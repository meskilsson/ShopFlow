import { Schema, model, Types } from "mongoose";

export interface IProductVariant {
    product: Types.ObjectId;
    color: string
    size: string;
    inStock? : boolean;
    sku?: string;
}

const productVariantSchema = new Schema<IProductVariant>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product reference is required"],
        },
        color: {
            type: String,
            required: [true, "Color is required"],
            trim: true,
        },
        size: {
            type: String,
            required: [true, "Size is required"],
            trim: true,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        sku: {      // Stock Keeping Unit
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const ProductVariant = model<IProductVariant>("ProductVariant", productVariantSchema);
export default ProductVariant;