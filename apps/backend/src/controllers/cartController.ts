import { NextFunction, Request, Response } from "express";
import * as cartService from "../services/cartService";
import { getCartOwner } from "../utils/getCartOwner";

export async function createCart(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cart = await cartService.createCart(getCartOwner(res));
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