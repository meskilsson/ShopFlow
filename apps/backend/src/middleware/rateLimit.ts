import rateLimit from "express-rate-limit";

const isTest = () => process.env.NODE_ENV === "test";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTest,
  message: {
    message: "Too many requests, please try again later",
  },
});

export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isTest() || !["POST", "PUT", "PATCH", "DELETE"].includes(req.method),
  message: {
    message: "Too many write requests, please try again later",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isTest,
  message: {
    message: "Too many authentication attempts, please try again later",
  },
});

