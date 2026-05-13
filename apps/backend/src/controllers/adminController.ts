import { Request, Response, NextFunction } from "express";
import * as adminService from '../services/adminService';

export async function getAdminUsers(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const users = await adminService.getAdminUsers();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}