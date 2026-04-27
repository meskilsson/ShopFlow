import type { Response } from "express";
import type { CartOwner } from "../types/cart.types"
import { createHttpError} from "../middleware/HttpError";

export function getCartOwner(res: Response): CartOwner {
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

  throw createHttpError("Cart owner could not be resolved", 500);
}