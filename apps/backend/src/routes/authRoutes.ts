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

const authRouter = Router();

authRouter.post("/login", validateRequest({ body: loginSchema }), loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get(
  "/profile",
  requireAuth,
  authorizeRoles("admin", "buyer", "seller"),
  getProfile,
);
authRouter.get("/me", requireAuth, getMe);

// TEST ROUTES!

authRouter.get("/buyer", requireAuth, authorizeRoles("buyer"), (req, res) => {
  res.json({ message: "Welcome buyer!", user: req.user });
});

authRouter.get("/seller", requireAuth, authorizeRoles("seller"), (req, res) => {
  res.json({ message: "Welcome seller!", user: req.user });
});

authRouter.get("/admin", requireAuth, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome admin!", req: req.user });
});

authRouter.get(
  "/seller-admin",
  requireAuth,
  authorizeRoles("seller", "admin"),
  (req, res) => {
    res.json({ message: "Welcome seller/admin", req: req.user });
  },
);

//END OF TEST ROUTES

export default authRouter;
