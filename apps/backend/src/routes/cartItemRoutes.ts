import { Router } from "express";
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "../controllers/cartItemController";

const cartItemRouter = Router();

cartItemRouter.post("/", addCartItem);
cartItemRouter.patch("/:productId", updateCartItemQuantity);
cartItemRouter.delete("/:productId", removeCartItem);

export default cartItemRouter;