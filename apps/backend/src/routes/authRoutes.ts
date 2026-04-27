import { Router } from "express";
import { loginUser, getProfile } from "../controllers/authController";
import authenticateToken from "../middleware/authenticateToken";
import { authorizeRoles } from "../middleware/authorizeRoles";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.get("/profile", authenticateToken, authorizeRoles("admin", "buyer", "seller"), getProfile);

// TEST ROUTES!

authRouter.get("/buyer", authenticateToken, authorizeRoles("buyer"), (req, res) => {
    res.json({ message: "Welcome buyer!", user: req.user });
});

authRouter.get("/seller", authenticateToken, authorizeRoles("seller"), (req, res) => {
    res.json({ message: "Welcome seller!", user: req.user });
});

authRouter.get("/admin", authenticateToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome admin!", req: req.user });
});

authRouter.get("/seller-admin", authenticateToken, authorizeRoles("seller", "admin"), (req, res) => {
    res.json({ message: "Welcome seller/admin", req: req.user });
});



//END OF TEST ROUTES


export default authRouter;