import { z } from "zod";

const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const productIdParamsSchema = z.strictObject({
    id: mongoIdSchema,
});

export const variantIdParamsSchema = z.strictObject({
    variantId: mongoIdSchema,
});

const productNameSchema = z.string().trim().min(2).max(100);
const productPriceSchema = z.number().positive();
const productCategorySchema = z.enum([
    "T-shirts",
    "Shoes",
    "Pants",
    "Shirts",
    "Jackets",
    "Accessories",
]);
const productDescriptionSchema = z.string().trim().max(1000).optional();
const productActiveSchema = z.boolean().optional();
const productImageSchema = z.string().trim().url().optional();

export const productQuerySchema = z.strictObject({
    category: productCategorySchema.optional(),
    search: z.string().trim().min(1).max(100).optional(),
    inStock: z.enum(["true", "false"]).optional(),
    sort: z.enum(["createdAt", "name", "price", "category"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("asc"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createProductSchema = z.strictObject({
    name: productNameSchema,
    price: productPriceSchema,
    category: productCategorySchema,
    description: productDescriptionSchema,
    active: productActiveSchema,
    ProductImage: productImageSchema,
});

export const updateProductSchema = z.strictObject({
    name: productNameSchema.optional(),
    price: productPriceSchema.optional(),
    category: productCategorySchema.optional(),
    description: productDescriptionSchema,
    active: productActiveSchema,
    ProductImage: productImageSchema,
})
    .refine((data) => Object.keys(data).length > 0, {
        message: "Send at least one field to update",
    });

export const createProductVariantSchema = z.strictObject({
    size: z.string().trim().min(1).max(20),
    inStock: z.boolean().optional(),
    sku: z.string().trim().max(100).optional(),
});

export const updateProductVariantSchema = z.strictObject({
    size: z.string().trim().min(1).max(20).optional(),
    inStock: z.boolean().optional(),
    sku: z.string().trim().max(100).optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
        message: "Send at least one field to update",
    });

export type ProductIdParams = z.infer<typeof productIdParamsSchema>;
export type VariantIdParams = z.infer<typeof variantIdParamsSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateProductInputVariant = z.infer<typeof createProductVariantSchema>;
export type UpdateProductInputVariant = z.infer<typeof updateProductVariantSchema>;
