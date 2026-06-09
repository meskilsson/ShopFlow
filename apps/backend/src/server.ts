import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./middleware/logger";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import orderRouter from "./routes/orderRoutes";
import authRouter from "./routes/authRoutes";
import addressRouter from "./routes/addressRoutes";
import { connectDB } from "./config/db";
import cartRouter from "./routes/cartRoutes";
import paymentRouter from "./routes/paymentRoutes";
import adminRouter from "./routes/adminRoutes";
import { authorizeRoles } from "./middleware/authorizeRoles";
import { requireAuth } from "./middleware/requireAuth";
import reviewRouter from "./routes/reviewRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(logger);

app.get("/", (_req, res) => {
  res.send("ShopFlow backend is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});


app.use("/api/v1/admin", requireAuth, authorizeRoles("admin"), adminRouter);
app.use("/api/v1/users", userRouter);

app.use("/api/v1/orders", orderRouter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/payments", paymentRouter);

app.use("/api/v1/address", addressRouter);
app.use("/api/v1/cart", cartRouter);

app.use("/api/v1/", reviewRouter)

app.use(notFound);
app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
