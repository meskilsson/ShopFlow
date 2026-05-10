import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (err instanceof AppError) {
    console.warn("Application error:", {
      method: req.method,
      path: req.path,
      status: err.statusCode,
      message: err.message,
    });

    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
      ...(isDevelopment && { stack: err.stack }),
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    res.status(400).json({
      message: "Validation error",
      errors,
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      message: "Invalid ID format",
    });
    return;
  }

  if (err instanceof Error) {
    console.error("UNEXPECTED ERROR:", {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      message: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      message: isDevelopment ? err.message : "Unexpected server error",
      ...(isDevelopment && { stack: err.stack }),
    });
    return;
  }

  console.error("UNKNOWN ERROR:", {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err,
  });

  res.status(500).json({
    message: "Unexpected server error",
  });
}