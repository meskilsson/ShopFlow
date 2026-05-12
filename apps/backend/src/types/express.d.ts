import type { AuthTokenPayload } from "./authTypes";

declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload;
            validatedBody?: unknown;
            validatedParams?: unknown;
            validatedQuery?: unknown;
        }
    }
}

export { };