import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import type { LoginInput } from "../schemas/userSchemas";

export async function loginUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const body = req.validatedBody as LoginInput;

        const result = await authService.loginUser(body);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getProfile(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        res.status(200).json({
            message: `Hello ${req.user?.username}`,
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
}