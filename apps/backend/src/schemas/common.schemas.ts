import { z } from "zod";

export const objectIdField = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid id");