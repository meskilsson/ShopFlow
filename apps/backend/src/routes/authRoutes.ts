import { Router } from "express";
import {
  loginUser,
  getProfile,
  getMe,
  logoutUser,
} from "../controllers/authController";
import { authorizeRoles } from "../middleware/authorizeRoles";
import { validateRequest } from "../middleware/validate";
import { loginSchema } from "../schemas/userSchemas";
import { requireAuth } from "../middleware/requireAuth";
import { authLimiter } from "../middleware/rateLimit";

const authRouter = Router();

authRouter.post("/login", authLimiter, validateRequest({ body: loginSchema }), loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get(
  "/profile",
  requireAuth,
  authorizeRoles("admin", "buyer", "seller"),
  getProfile,
);
authRouter.get("/me", requireAuth, getMe);


export default authRouter;
