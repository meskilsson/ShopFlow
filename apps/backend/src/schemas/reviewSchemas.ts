import { z } from "zod"

const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createReviewSchema = 




export const reviewProductIdParamsSchema