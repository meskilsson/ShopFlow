import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  changePassword,
  getWishlist,
  toggleWishlist,
} from "../controllers/userController";

import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  userIdParamsSchema,
  toggleWishlistSchema,
} from "../schemas/userSchemas";

import { validateRequest } from "../middleware/validate";
import { requireAuth } from "../middleware/requireAuth";

const userRouter = Router();

// Temp: For debuging
userRouter.get("/test-wishlist", (req, res) => {
  res.json({ message: "✅ Wishlist-routen är registrerad och fungerar!" });
});

userRouter.get("/wishlist", requireAuth, getWishlist);

userRouter.post(
  "/wishlist",
  requireAuth,
  validateRequest({ body: toggleWishlistSchema }),
  toggleWishlist,
);

userRouter.get("/", requireAuth, getAllUsers);

userRouter.get(
  "/:id",
  requireAuth,
  validateRequest({ params: userIdParamsSchema }),
  getUserById,
);

userRouter.post("/", validateRequest({ body: createUserSchema }), createUser);

userRouter.patch(
  "/:id",
  requireAuth,
  validateRequest({ params: userIdParamsSchema, body: updateUserSchema }),
  updateUser,
);

userRouter.patch(
  "/:id/password",
  requireAuth,
  validateRequest({ params: userIdParamsSchema, body: changePasswordSchema }),
  changePassword,
);

userRouter.delete(
  "/:id",
  requireAuth,
  validateRequest({ params: userIdParamsSchema }),
  deleteUser,
);

export default userRouter;
