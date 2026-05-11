declare global {
    namespace Express {
        interface Request {
            validatedBody?: unknown;
            validatedParams?: unknown;
            validatedQuery?: unknown;
        }
    }
}

export { };