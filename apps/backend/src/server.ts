import dotenv from "dotenv";
dotenv.config();

import { Response, Request } from "express";
<<<<<<< HEAD
import mongoose from 'mongoose';
=======
>>>>>>> f42d6328b62f258c9e35431f819427f6db1c77c7

import express from "express";
import cors from "cors";
import logger from "./middleware/logger";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
<<<<<<< HEAD
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import orderRouter from "./routes/orderRoutes";
import authRouter from "./routes/authRoutes";
import { connectDB } from "./config/db";
import cartRouter from './routes/cartRoutes';
=======
>>>>>>> f42d6328b62f258c9e35431f819427f6db1c77c7

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.json());
app.use(logger);

app.get("/", (_req, res) => {
  res.send("ShopFlow backend is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

<<<<<<< HEAD
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/products", productRouter);

=======
>>>>>>> f42d6328b62f258c9e35431f819427f6db1c77c7
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
