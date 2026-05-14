import { z } from 'zod';


export const softDeleteUserBodySchema = z.strictObject({
    deleteReason: z
        .string()
        .trim()
        .max(300, "Message can't be longer than 300 characters")
        .optional()
});


export type SoftDeleteUserBody = z.infer<typeof softDeleteUserBodySchema>;