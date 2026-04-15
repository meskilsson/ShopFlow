import { Schema, model } from "mongoose";

export interface IProduct {
    name: string;
    price: number;
    category: string;
    inStock?: boolean;
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
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            set: (value: string) => {
                if (!value) return value;
                return value.charAt(0).toUpperCase() + value.slice(1)
            },    
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