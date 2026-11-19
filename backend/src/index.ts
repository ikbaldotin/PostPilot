import { createApp } from "./app.js";
import { startServer } from "./server.js";

async function bootstrap() {
  const app = createApp();
  startServer(app);
}

bootstrap().catch((err) => {
  console.error("Failed to start application:", err);
  process.exit(1);
});
