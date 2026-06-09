import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import type { LoginInput } from "../schemas/userSchemas";
import { signAccessToken } from "../utils/jwt";
import User from "../models/User";

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.validatedBody as LoginInput;

    const { user } = await authService.loginUser(body);

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = signAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out" });
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

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
