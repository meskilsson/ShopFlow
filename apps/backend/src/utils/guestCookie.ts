import { randomUUID } from "crypto";
import type { Request, Response } from "express";

const GUEST_COOKIE_NAME = process.env.GUEST_COOKIE_NAME || "shopflow.guestId";
const GUEST_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

function setGuestCookie(res: Response, guestId: string) {
  res.cookie(GUEST_COOKIE_NAME, guestId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: GUEST_COOKIE_MAX_AGE,
  });
}

export function getGuestId(
  req: Request,
  res: Response,
  options: { create?: boolean } = {},
) {
  const existingGuestId = req.cookies?.[GUEST_COOKIE_NAME];

  if (typeof existingGuestId === "string" && existingGuestId.length > 0) {
    return existingGuestId;
  }

  if (options.create === false) {
    return undefined;
  }

  const guestId = randomUUID();
  setGuestCookie(res, guestId);

  return guestId;
}
