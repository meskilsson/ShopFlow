import { Schema, model, Types} from "mongoose";

export interface IReview {
    product: Types.ObjectId;
    user: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
};

const reviewSchema = new Schema<IReview>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product reference is required"],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, "Comment is required"],
            trim: true,
            maxlength: 100,
        },
    },
    { 
        timestamps: true 
    },
)
const Review = model<IReview>("Review", reviewSchema);
export default Review;
