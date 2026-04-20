import { Schema, model } from "mongoose";

export interface IProduct {
    name: string;
    price: number;
    category: string;
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
        }
    },  
    {
        timestamps: true,
    }
)

const Product = model<IProduct>("Product", productSchema);
export default Product;