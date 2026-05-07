import { z } from 'zod';

import type { ValidationError, ValidationLocation } from "../types/validation.types";


export type ZodIssues = z.ZodError["issues"];

export function formatIssues(
    location: ValidationLocation,
    issues: ZodIssues
): ValidationError[] {
    return issues.map((issue) => ({
        location,
        field: issue.path.join("."),
        message: issue.message,
    }));
}
