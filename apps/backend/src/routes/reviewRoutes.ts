import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken";
import {
    createProductReview,
    getProductReviews,
} from "../controllers/ReviewController";
import { validateRequest } from "../middleware/validate";
import { createReviewBodySchema, reviewProductIdParamsSchema } from "../schemas/reviewSchemas";

const reviewRouter = Router();

reviewRouter.get(
    "/products/:productId/reviews",
    validateRequest({ params: reviewProductIdParamsSchema }),
    getProductReviews,
)

reviewRouter.post(
    "/products/:productId/reviews",
    authenticateToken,
    validateRequest({ 
        params: reviewProductIdParamsSchema,
        body: createReviewBodySchema,
     }),
    createProductReview,
);

export default reviewRouter;