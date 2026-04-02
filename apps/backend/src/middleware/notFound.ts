import { Request, Response, NextFunction } from "express";

function notFound(req: Request, res: Response, _next: NextFunction): void {
  res
    .status(404)
    .json({ message: `The route ${req.method} ${req.path} does not exist` });
}

export default notFound;
