import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { env } from "./config/env.js";
import helmet from "helmet";
export function createApp(): Application {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
    }),
  );
  app.use(express.json());
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });
  return app;
}
