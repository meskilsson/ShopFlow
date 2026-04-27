import { Schema, model, Types} from "mongoose";

export interface ICategory {
    name: string;
    parent?: Types.ObjectId | null;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null
        }
    }
);

const Category = model<ICategory>("Category", categorySchema);

export default Category;