import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import type { UserRole } from "../models/User";
import { createHttpError } from "../middleware/HttpError";

type UserIdParams = {
  id: string;
};

interface UpdateUserBody {
  name?: string;
  email?: string;
  username?: string;
  role?: UserRole;
}

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request<UserIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request<UserIdParams, unknown, UpdateUserBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request<UserIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    res.status(200).json(deletedUser);

  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request<UserIdParams, unknown, ChangePasswordBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw createHttpError(
        "Current password and new password are required",
        400
      );
    }

    const result = await userService.changePasswordService(
      id,
      currentPassword,
      newPassword
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}