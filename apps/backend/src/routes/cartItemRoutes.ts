import { Router } from "express";
import { validateRequest } from "../middleware/validate";
import {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "../controllers/cartItemController";
import {
  addCartItemSchema,
  updateCartItemQuantitySchema,
  productVariantIdParamSchema,
} from "../schemas/cartSchemas";

const cartItemRouter = Router();

cartItemRouter.post(
  "/",
  validateRequest({ body: addCartItemSchema }),
  addCartItem,
);
cartItemRouter.patch(
  "/:productVariantId",
  validateRequest({
    body: updateCartItemQuantitySchema,
    params: productVariantIdParamSchema,
  }),
  updateCartItemQuantity,
);
cartItemRouter.delete(
  "/:productVariantId",
  validateRequest({ params: productVariantIdParamSchema }),
  removeCartItem,
);

export default cartItemRouter;
