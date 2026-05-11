// src/middleware/validateRequest.ts
import { RequestHandler } from "express";
import { formatIssues } from "../utils/formatIssues";
import type { RequestSchemas, ValidationError } from "../types/validation.types";

export function validateRequest(schemas: RequestSchemas): RequestHandler {
    return (req, res, next) => {
        const errors: ValidationError[] = [];

        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);

            if (!result.success) {
                errors.push(...formatIssues("body", result.error.issues));
            } else {
                req.validatedBody = result.data;
            }
        }

        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);

            if (!result.success) {
                errors.push(...formatIssues("params", result.error.issues));
            } else {
                req.validatedParams = result.data;
            }
        }

        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);

            if (!result.success) {
                errors.push(...formatIssues("query", result.error.issues));
            } else {
                req.validatedQuery = result.data;
            }
        }

        if (errors.length > 0) {
            res.status(400).json({
                message: "Validation error",
                errors,
            });
            return;
        }

        next();
    };
}