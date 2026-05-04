import { Router } from "express";
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "../controllers/cartItemController";

const cartItemRouter = Router();

cartItemRouter.post("/", addCartItem);
cartItemRouter.patch("/:productVariantId", updateCartItemQuantity);
cartItemRouter.delete("/:productVariantId", removeCartItem);

export default cartItemRouter;
