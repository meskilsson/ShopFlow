import { Request, Response, NextFunction } from "express";

function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("Server, error: ", err.message);
  res.status(500).json({ message: "Something went wrong server side." });
}

export default errorHandler;
