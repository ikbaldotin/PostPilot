import { createApp } from "./app.js";
import { prisma } from "./lib/prisma.js";
import { startServer } from "./server.js";

async function bootstrap() {
  const app = createApp();
  startServer(app);
}

bootstrap().catch(async (err) => {
  console.error("Failed to start application:", err);
  await prisma.$disconnect();
  process.exit(1);
});
