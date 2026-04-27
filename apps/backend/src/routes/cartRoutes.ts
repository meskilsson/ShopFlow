import { Router } from "express";
import {
  clearCart,
  createCart,
  getCart,
} from "../controllers/cartController";
import resolveCartOwner from "../middleware/resolveCartOwner";
import cartItemRouter from "./cartItemRoutes";

const cartRouter = Router();

cartRouter.use(resolveCartOwner);

cartRouter.post("/", createCart);
cartRouter.get("/", getCart);
cartRouter.delete("/", clearCart);
cartRouter.use("/items", cartItemRouter);

export default cartRouter;