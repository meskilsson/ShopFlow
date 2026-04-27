import { Schema, model} from "mongoose";

export interface IBrand {
    name: string;
}

const brandSchema = new Schema<IBrand>(
    {
        name: {
            type: String,
            required: [true, "Brand name is required."],
            trim: true,
            unique: true
        },
    }, {timestamps: true}
);

const Brand = model<IBrand>("Brand", brandSchema);

export default Brand;