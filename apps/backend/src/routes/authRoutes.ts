import { Router } from "express";
import { loginUser, getProfile } from "../controllers/authController";
import authenticateToken from "../middleware/authenticateToken";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.get("/profile", authenticateToken, getProfile);

export default authRouter;