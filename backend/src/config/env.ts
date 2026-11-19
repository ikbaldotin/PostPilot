import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number(),
  DATABASE_URL: z.url(),
  CORS_ORIGIN: z.string(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;
