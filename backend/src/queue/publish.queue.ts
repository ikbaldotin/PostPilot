import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";
import type { PublishJobData } from "../type/publish.type.js";

const publishQueue = new Queue<PublishJobData>("publish-queue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "exponential", delay: 10_000 },
    removeOnComplete: { age: 24 * 3600, count: 1000 },
    removeOnFail: { age: 7 * 24 * 3600 },
  },
});

export default publishQueue;
