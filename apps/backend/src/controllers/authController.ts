import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";

export async function loginUser(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getProfile(
    req: Request,
    res: Response,
    next: NextFunction,
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