import type { AuthTokenPayload } from "./authTypes";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload & {
        id: string;
      };
      validatedBody?: unknown;
      validatedParams?: unknown;
      validatedQuery?: unknown;
    }
  }
}

export {};
