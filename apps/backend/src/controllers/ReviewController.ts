import type { Request, Response, NextFunction } from "express";
import { createReview, getReviewsByProduct } from "../services/ReviewService";
import {
    CreateReviewInput,
    ReviewProductIdParams,
} from "../schemas/reviewSchemas"

type ProductIdParams = {
    productId: string;
}

export async function createProductReview (
    req: Request<ProductIdParams>,
    res: Response,
    next: NextFunction,
) {
    try {
        const params = req.validatedParams as ReviewProductIdParams;
        const body = req.validatedBody as CreateReviewInput;

        const review = await createReview({
            product: params.productId,
            user: req.user!.id,
            rating: body.rating,
            comment: body.comment,
        });

        res.status(201).json(review);
    } catch(error) {
        next(error)
    }
}

export async function getProductReviews(
    req: Request<ProductIdParams>,
    res: Response,
    next: NextFunction
) {
    try {
        const params = req.validatedParams as ReviewProductIdParams;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 3;
        
        const reviews = await getReviewsByProduct(
            params.productId,
            page,
            limit,
        );
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}


