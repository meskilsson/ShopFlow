import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken"
import {
    createProductReview,
    getProductReviews,
} from "../controllers/ReviewController"

const reviewRouter = Router();

reviewRouter.get(
    "/products/:productId/reviews",
    getProductReviews,
)

reviewRouter.post(
    "/products/:productId/reviews",
    authenticateToken,
    createProductReview,
);

export default reviewRouter;