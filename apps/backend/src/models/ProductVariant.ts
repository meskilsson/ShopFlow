import { Schema, model, Types } from "mongoose";

export interface IProductVariant {
    product: Types.ObjectId;
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