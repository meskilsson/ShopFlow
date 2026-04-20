import { NextFunction, Request, Response } from "express";
import * as cartService from "../services/cartService";
import type { CartOwner } from "../services/cartService";

type CartItemParams = {
  productId: string;
};

function getCartOwner(res: Response): CartOwner {
  const cartOwner = res.locals.cartOwner as
    | CartOwner
    | {
        userId?: string;
        sessionId?: string;
      }
    | undefined;

  if (cartOwner?.userId) {
    return { userId: cartOwner.userId };
  }

  if (cartOwner?.sessionId) {
    return { sessionId: cartOwner.sessionId };
  }

  const error = new Error("Cart owner could not be resolved") as Error & {
    statusCode?: number;
  };
  error.statusCode = 500;
  throw error;
}

export async function createCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cart = await cartService.createCart(getCartOwner(res), req.body.items);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function getCart(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cart = await cartService.getCartByOwner(getCartOwner(res));
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function addItemToCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cart = await cartService.addItemToCart(getCartOwner(res), req.body);
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
    const cart = await cartService.updateCartItemQuantity(
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
    const cart = await cartService.removeCartItem(
      getCartOwner(res),
      req.params.productId,
    );
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function clearCart(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cart = await cartService.clearCart(getCartOwner(res));
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}
