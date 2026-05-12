import { z } from 'zod';

export type RequestSchemas = {
    body?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
};

export type ValidationLocation = "body" | "params" | "query";

export type ValidationError = {
    location: ValidationLocation;
    field: string;
    message: string;
};

