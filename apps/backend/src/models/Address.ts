import { Schema, model } from "mongoose";
import { IAddress } from "../types/address.types";

const addressSchema = new Schema<IAddress>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        street: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        postal_code: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["shipping", "billing"]
        },
    },
    {
        timestamps: true,
    },
);

const Address = model<IAddress>("Address", addressSchema);
export default Address;