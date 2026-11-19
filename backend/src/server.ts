import type { Application } from "express";
import http from "http";
import { env } from "./config/env.js";

export function startServer(app: Application): http.Server {
  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
  return server;
}
