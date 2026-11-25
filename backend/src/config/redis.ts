import Redis from "ioredis";
import { env } from "./env.js";

const redisConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export default redisConnection;
