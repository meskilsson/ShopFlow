import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  changePassword,
} from "../controllers/userController";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  userIdParamsSchema,
} from "../schemas/userSchemas";
import { validateRequest } from "../middleware/validate";
import { requireAuth } from "../middleware/requireAuth";
import { requireSelfOrRole } from "../middleware/requireSelfOrRole";
import { authorizeRoles } from "../middleware/authorizeRoles";

const userRouter = Router();


userRouter.post("/", validateRequest({ body: createUserSchema }), createUser);

userRouter.get("/", requireAuth, authorizeRoles("admin"), getAllUsers);

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
