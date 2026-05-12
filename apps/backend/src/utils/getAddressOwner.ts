import type { Response } from "express";
import { createHttpError } from "../middleware/HttpError";
import type { AddressOwner } from "../types/address.types";

export function getAddressOwner(res: Response): AddressOwner {
  const addressOwner = res.locals.addressOwner as
    | AddressOwner
    | {
        userId?: string;
        sessionId?: string;
      }
    | undefined;

  if (addressOwner?.userId) {
    return { userId: addressOwner.userId };
  }

  if (addressOwner?.sessionId) {
    return { sessionId: addressOwner.sessionId };
  }

  throw createHttpError("Address owner could not be resolved", 500);
}
