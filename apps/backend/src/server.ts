import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import logger from "./middleware/logger";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import userRouter from "./routes/userRoutes";
import orderRouter from "./routes/orderRoutes";
import authRouter from "./routes/authRoutes";
import { connectDB } from "./config/db";
import cartRouter from './routes/cartRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.json());
app.use(
  session({
    name: process.env.SESSION_COOKIE_NAME || "shopflow.sid",
    secret: process.env.SESSION_SECRET || "development_session_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
app.use(logger);

app.get("/", (_req, res) => {
  res.send("ShopFlow backend is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/auth", authRouter);

app.use(notFound);
app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
}

startServer();
