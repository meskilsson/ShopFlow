import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  changePassword,
} from "../controllers/userController";
import { createUserSchema, updateUserSchema, changePasswordSchema, userIdParamsSchema } from "../schemas/userSchemas";
import { validateRequest } from "../middleware/validate";
import authenticateToken from "../middleware/authenticateToken";

const userRouter = Router();

userRouter.get("/", authenticateToken, getAllUsers);
userRouter.get("/:id", authenticateToken, validateRequest({ params: userIdParamsSchema }), getUserById);

userRouter.post("/", validateRequest({ body: createUserSchema }), createUser);

userRouter.patch("/:id", authenticateToken, validateRequest({ params: userIdParamsSchema, body: updateUserSchema }), updateUser);
userRouter.patch("/:id/password", authenticateToken, validateRequest({ params: userIdParamsSchema, body: changePasswordSchema }), changePassword);

userRouter.delete("/:id", authenticateToken, validateRequest({ params: userIdParamsSchema }), deleteUser);

export default userRouter;