import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  changePassword,
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

userRouter.post("/", createUser);

userRouter.patch("/:id", updateUser);
userRouter.patch("/:id/password", changePassword);

userRouter.delete("/:id", deleteUser);

export default userRouter;