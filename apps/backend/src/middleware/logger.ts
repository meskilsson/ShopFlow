import { Response, Request, NextFunction } from "express";

function logger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const timestamp = new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
    });
    const duration = Date.now() - start;

    console.log(
      `[${timestamp}] ${req.method} ${req.path} => ${res.statusCode} (${duration}ms)`,
    );
  });

  next();
}

export default logger;
