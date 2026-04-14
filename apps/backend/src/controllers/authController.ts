import { Request, Response, NextFunction } from "express";
import * as authService from '../services/authService';

export async function loginUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await authService.loginUser(req.body);
        res.status(200).json(user)
    } catch (error) {
        next(error);
    }
}