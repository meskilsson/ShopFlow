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
  deleteMyAccount,
  getMyGdprData
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
import { requireSelfOrRole } from "../middleware/requireSelfOrRole";
import { authorizeRoles } from "../middleware/authorizeRoles";

const userRouter = Router();


userRouter.post("/", validateRequest({ body: createUserSchema }), createUser);

userRouter.get("/", requireAuth, authorizeRoles("admin"), getAllUsers);
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
  "/me/data",
  requireAuth,
  getMyGdprData,
);

userRouter.delete(
  "/me",
  requireAuth,
  deleteMyAccount,
);

userRouter.get(
  "/:id",
  requireAuth,
  validateRequest({ params: userIdParamsSchema }),
  requireSelfOrRole("id", "admin"),
  getUserById,
);


userRouter.patch(
  "/:id",
  requireAuth,
  validateRequest({ params: userIdParamsSchema, body: updateUserSchema }),
  requireSelfOrRole("id", "admin"),
  updateUser,
);

userRouter.patch(
  "/:id/password",
  requireAuth,
  validateRequest({ params: userIdParamsSchema, body: changePasswordSchema }),
  requireSelfOrRole("id", "admin"),
  changePassword,
);

userRouter.delete(
  "/:id",
  requireAuth,
  validateRequest({ params: userIdParamsSchema }),
  requireSelfOrRole("id", "admin"),
  deleteUser,
);


export default userRouter;
