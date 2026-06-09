import { z } from "zod";
import { objectIdField } from "./common.schemas";

const quantityField = z
    .number({ message: "Quantity is required" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be larger than 0")
    .max(50, "Quantity cannot exceed 50");

export const addCartItemSchema = z.strictObject({
    productVariantId: objectIdField,
    quantity: quantityField,
});

export const updateCartItemQuantitySchema = z.strictObject({
  quantity: quantityField,
});

export const productVariantIdParamSchema = z.strictObject({
  productVariantId: objectIdField,
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemQuantitySchema>;
export type ProductVariantIdParam = z.infer<typeof productVariantIdParamSchema>;
