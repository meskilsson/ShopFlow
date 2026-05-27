import { z } from "zod";

export const userIdParamsSchema = z.strictObject({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id"),
});

const nameSchema = z.string().trim().min(2).max(50);

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(20)
  .regex(
    /^[a-z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  );

const passwordSchema = z.string().min(8).max(100);

export const createUserSchema = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  role: z.enum(["buyer", "seller"]).default("buyer"),
});

export const loginSchema = z.strictObject({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z
  .strictObject({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    username: usernameSchema.optional(),
  })

  //if key === pass
  // else ===  message
  .refine((data) => Object.keys(data).length > 0, {
    message: "Send at least one field to update",
  });

export const changePasswordSchema = z.strictObject({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const toggleWishlistSchema = z.strictObject({
  productId: mongoIdSchema,
});

export type ToggleWishlistInput = z.infer<typeof toggleWishlistSchema>;
