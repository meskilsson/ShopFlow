import { z } from "zod"

const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const reviewProductIdParamsSchema = z.strictObject({
    productId: mongoIdSchema,
});

export const createReviewBodySchema = z.strictObject({
    rating: z.number().int().min(1). max(5),
    comment: z.string().trim().min(1).max(100),
})

export type ReviewProductIdParams = z.infer<typeof reviewProductIdParamsSchema>;
export type CreateReviewInput = z.infer<typeof createReviewBodySchema>;

