import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser
} from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);


userRouter.post("/", createUser);


userRouter.patch("/:id", updateUser);


userRouter.delete("/:id", deleteUser);

export default userRouter;
