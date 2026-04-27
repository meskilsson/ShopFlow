import { NextFunction, Request, Response } from "express";
import * as cartItemService from "../services/cartItemService";
import { getCartOwner } from "../utils/getCartOwner";

type CartItemParams = {
  productId: string;
};

export async function addCartItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cart = await cartItemService.addItemToCart(getCartOwner(res), req.body);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function updateCartItemQuantity(
  req: Request<CartItemParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cart = await cartItemService.updateCartItemQuantity(
      getCartOwner(res),
      req.params.productId,
      req.body.quantity,
    );

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(
  req: Request<CartItemParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cart = await cartItemService.removeCartItem(
      getCartOwner(res),
      req.params.productId,
    );

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}