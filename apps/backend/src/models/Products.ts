import { Schema, model } from "mongoose";

export interface IProduct {
    // id: number;
    name: string;
    price: number;
    category: string;
    inStock?: boolean;
}

const productSchema = new Schema<IProduct>(
    {
        // id: {
        //     type: Number, 
        //     required: [true, "ID is missing"],
        //     trim: true,
        // },
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
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
             trim: true,
        },
        inStock: {
            type: Boolean,
            default: true,
        }
    },

    {
        timestamps: true,
    }
)

const Product = model<IProduct>("Product", productSchema);
export default Product;