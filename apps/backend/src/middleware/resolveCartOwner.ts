import { NextFunction, Request, Response } from "express";

function resolveCartOwner(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const sessionUserId = req.session?.userId;

  res.locals.cartOwner = sessionUserId
    ? { userId: sessionUserId }
    : { sessionId: req.sessionID };

  next();
}

export default resolveCartOwner;
