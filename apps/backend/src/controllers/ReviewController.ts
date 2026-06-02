import type { Request, Response, NextFunction } from "express";
import { createReview, getReviewsByProduct } from "../services/ReviewService";

type ProductIdParams = {
    productId: string;
}

export async function createProductReview (
    req: Request<ProductIdParams>,
    res: Response,
    next: NextFunction,
) {
    try {
        const review = await createReview({
            product: req.params.productId,
            user: req.user!.id,
            rating: req.body.rating,
            comment: req.body.comment,
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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 3;
        
        const reviews = await getReviewsByProduct(
            req.params.productId,
            page,
            limit,
        );
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
}


