import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import type {
  UserIdParams,
  CreateUserInput,
  UpdateUserInput,
  ChangePasswordInput,
  ToggleWishlistInput,
} from "../schemas/userSchemas";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.validatedBody as CreateUserInput;

    const user = await userService.createUser(body);

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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as UserIdParams;

    const user = await userService.getUserById(params.id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as UserIdParams;
    const body = req.validatedBody as UpdateUserInput;

    const updatedUser = await userService.updateUser(params.id, body);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as UserIdParams;

    const deletedUser = await userService.deleteUser(params.id);

    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as UserIdParams;
    const body = req.validatedBody as ChangePasswordInput;

    const result = await userService.changePasswordService(
      params.id,
      body.currentPassword,
      body.newPassword,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?._id;
    const wishlist = await userService.getWishlist(userId!);
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
}

export async function toggleWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?._id;
    const { productId } = req.validatedBody as ToggleWishlistInput;

    const result = await userService.toggleWishlist(userId!, productId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
