import Review from "../models/Review";
import Product from"../models/Products";
import { NotFoundError } from "../errors/AppError";

type CreateReViewInput = {
    product: string;
    user: string;
    rating: number;
    comment: string;
};

export async function createReview(reviewData: CreateReViewInput) {
    const product = await Product.findById(reviewData.product);
    if (!product) {
        throw new NotFoundError("Product not found");
    }

    const review = {
        product: reviewData.product,
        user: reviewData.user,
        rating: reviewData.rating,
        comment: reviewData.comment,
    };

    return await Review.create(review);
}

// ===== GET BY PRODUCTID ===== //
export async function getReviewsByProduct(productId: string, page = 1, limit = 3) {
    const product = await Product.findById(productId);
    if(!product) {
        throw new NotFoundError("Product not found");
    }

    const reviews = await Review.find({ product: productId })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        const total = await Review.countDocuments({ product: productId})
        return {
            data: reviews,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit),
            },
        };
}

// ===== GET BY ID ===== //
export async function getReviewById(id: string) {
    const review = await Review.findById(id)
    .populate("user", "name email")
    .populate("product", "name price category");

    if(!review) {
        throw new NotFoundError("Review not found")
    }

    return review;
}
