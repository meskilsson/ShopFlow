import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { getGuestId } from "../utils/guestCookie";

export default function resolveAddressOwner(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.token;

  if (!token) {
    res.locals.addressOwner = { sessionId: getGuestId(req, res) };
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    res.locals.addressOwner = {
      userId: payload.id,
    };

    next();
  } catch {
    res.status(403).json({ error: "Unauthorized or expired token" });
  }
}
