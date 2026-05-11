import { Request, Response, NextFunction } from "express";

function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("Server, error: ", err.message);
  const statusCode =
    (err as Error & { statusCode?: number }).statusCode ?? 500;

  res.status(statusCode).json({
    message:
      statusCode === 500 ? "Something went wrong server side." : err.message,
  });
}

export default errorHandler;
