import jwt from "jsonwebtoken";

export type JwtPayload = {
  id: string;
  email: string;
  role: "buyer" | "seller" | "admin";
};

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
