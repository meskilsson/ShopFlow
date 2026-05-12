import { z } from "zod";
import { objectIdField } from "./common.schemas";

export const addressDataSchema = z.strictObject({
  type: z.enum(["shipping", "billing"]),
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be no more than 50 characters")
    .regex(/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u, "Please enter a valid name"),
  street: z
    .string()
    .trim()
    .min(2, "Street must be at least 2 characters")
    .max(100, "Street must be no more than 50 characters")
    .regex(
      /^(?=.*\p{L})(?=.*\d)[\p{L}0-9 .,'\-\/]+$/u,
      "Please enter a valid street address, including street name and number",
    ),
  postalCode: z
    .string()
    .trim()
    .regex(
      /^\d{3}\s?\d{2}$/,
      "Please enter a valid postal code, for example 123 49",
    ),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be no more than 100 characters")
    .regex(/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u, "Please enter a valid city name"),
  country: z
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be no more than 100 characters")
    .regex(/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u, "Please enter a valid country"),
});

export const updateAddressDataSchema = addressDataSchema
  .omit({ type: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one address field is required",
  });

export const idParamSchema = z.strictObject({
  id: objectIdField,
});

export type CreateAddressData = z.infer<typeof addressDataSchema>;
export type UpdateAddressData = z.infer<typeof updateAddressDataSchema>;
export type AddressIdParam = z.infer<typeof idParamSchema>;
