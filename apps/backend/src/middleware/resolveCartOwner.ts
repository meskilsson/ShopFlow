import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "../types/authTypes";
import { mergeCartOwners } from "../services/cartService";

const JWT_SECRET = process.env.JWT_SECRET || "server_jwt_token";

async function resolveCartOwner(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    res.locals.cartOwner = { sessionId: req.sessionID };
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    const userOwner = { userId: payload.userId } as const;

    await mergeCartOwners({ sessionId: req.sessionID }, userOwner);

    res.locals.cartOwner = userOwner;
    next();
  } catch {
    res.status(403).json({ error: "Unauthorized or expired token" });
  }
}

export default resolveCartOwner;
