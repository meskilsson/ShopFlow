import { NextFunction, Request, Response } from "express";
import * as cartItemService from "../services/cartItemService";
import { getCartOwner } from "../utils/getCartOwner";
import type {
  AddCartItemInput,
  UpdateCartItemInput,
  ProductVariantIdParam,
} from "../schemas/cartSchemas";

export async function addCartItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.validatedBody as AddCartItemInput;

    const cart = await cartItemService.addItemToCart(getCartOwner(res), body);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function updateCartItemQuantity(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as ProductVariantIdParam;
    const body = req.validatedBody as UpdateCartItemInput;

    const cart = await cartItemService.updateCartItemQuantity(
      getCartOwner(res),
      params.productVariantId,
      body.quantity,
    );

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as ProductVariantIdParam;

    const cart = await cartItemService.removeCartItem(
      getCartOwner(res),
      params.productVariantId,
    );

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}
