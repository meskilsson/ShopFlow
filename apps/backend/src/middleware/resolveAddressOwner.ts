import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "../types/authTypes";

const JWT_SECRET = process.env.JWT_SECRET || "server_jwt_token";
import { verifyAccessToken } from "../utils/jwt";
import { getGuestId } from "../utils/guestCookie";

export default function resolveAddressOwner(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    res.locals.addressOwner = { sessionId: getGuestId(req, res) };
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    res.locals.addressOwner = { userId: payload.userId };
    next();
  } catch {
    res.status(403).json({ error: "Unauthorized or expired token" });
  }
}
