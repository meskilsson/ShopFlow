import { Router } from "express";
import {
  addItemToCart,
  clearCart,
  createCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../controllers/cartController";
import resolveCartOwner from "../middleware/resolveCartOwner";

const cartRouter = Router();

cartRouter.use(resolveCartOwner);

cartRouter.post("/", createCart);
cartRouter.get("/", getCart);
cartRouter.post("/items", addItemToCart);
cartRouter.patch("/items/:productId", updateCartItemQuantity);
cartRouter.delete("/items/:productId", removeCartItem);
cartRouter.delete("/", clearCart);

export default cartRouter;
