import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { mergeCartOwners } from "../services/cartService";

async function resolveCartOwner(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.token;

  if (!token) {
    res.locals.cartOwner = { sessionId: req.sessionID };
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    const userOwner = {
      userId: payload.id,
    } as const;

    await mergeCartOwners({ sessionId: req.sessionID }, userOwner);

    res.locals.cartOwner = userOwner;
    next();
  } catch {
    res.status(403).json({ error: "Unauthorized or expired token" });
  }
}

export default resolveCartOwner;