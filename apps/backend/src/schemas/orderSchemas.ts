import { z } from "zod";
import { objectIdField } from "./common.schemas";

export const orderIdParamSchema = z.strictObject({
  id: objectIdField,
});

export const userIdParamSchema = z.strictObject({
  userId: objectIdField,
});

// For CreateOrder
export const createOrderItemSchema = z.strictObject({
  productVariant: objectIdField,
  quantity: z
    .number({ message: "Quantity is required" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be at least 1")
    .max(50, "Quantity cannot exceed 50"),
  priceAtPurchase: z
    .number({ message: "Price at purchase is required" })
    .nonnegative("Price cannot be negative"),
});

export const createOrderSchema = z
  .strictObject({
    items: z
      .array(createOrderItemSchema)
      .min(1, "Order must contain at least one item"),
    totalPrice: z.number().nonnegative("Total price cannot be negative"),
    status: z
      .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
      .default("pending")
      .optional(),
    paymentStatus: z
      .enum(["pending", "paid", "failed", "refunded"])
      .default("pending")
      .optional(),
    user: objectIdField.optional(),
    sessionId: z.string().trim().optional(),
  })
  .refine((data) => data.user || data.sessionId, {
    message: "Order must belong to a user or have a sessionId",
    path: ["user", "sessionId"],
  });

export const updateOrderStatusSchema = z
  .strictObject({
    status: z
      .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
      .optional(),
    paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field (status or paymentStatus) is required",
  });

export type OrderIdParam = z.infer<typeof orderIdParamSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
