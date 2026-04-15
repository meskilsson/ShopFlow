import type { AuthTokenPayload } from "./authTypes";

declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload;
        }
    }
}

export { };