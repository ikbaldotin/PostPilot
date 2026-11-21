import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import helmet from "helmet";
import authRouter from "./router/auth.route.js";
import instagramRouter from "./router/instagram.route.js";
export function createApp(): Application {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/instagram", instagramRouter);
  return app;
}
