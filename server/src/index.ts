import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";
import rateLimit from "express-rate-limit";
import userRouter from "./modules/users/userRoutes";
import { RedisReply } from "rate-limit-redis";
import helmet from "helmet";
import logger from "./utils/logger";

dotenv.config();

const redisClient = new Redis({
  port: 6379,
  host: "127.0.0.1",
});

const limit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: [string, ...string[]]) =>
      redisClient.call(...args) as Promise<RedisReply>,
  }),
  windowMs: 5 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 50,
  message: "Too many requests, slow down",
});

export const app = express();

app.use(limit);
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api", userRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("server up!");
  logger.info("SERVER UP!!!");
});

// (origin, callback) => {
//   const allowedOrigins = [process.env.CLIENT_URL];
//   console.log(origin);

//   if (!origin || !allowedOrigins.includes(origin)) {
//     callback(new Error("Origin blocked by cors"), false);
//   } else {
//     callback(null, true);
//   }
// },
