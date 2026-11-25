import { Worker } from "bullmq";
import type { PublishJobData } from "../type/publish.type.js";
import { prisma } from "../lib/prisma.js";
import { publishInstagramImage } from "../provider/instagram.provider.js";
import { decryptToken } from "../utils/encryption.js";
import redisConnection from "../config/redis.js";

const publishWorker = new Worker<PublishJobData>(
  "publish-queue",
  async (job) => {
    const { postId, scheduleVersion } = job.data;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        media: true,
        user: {
          include: {
            instagramAccount: true,
          },
        },
      },
    });
    if (!post) {
      return { message: "Post not found" };
    }
    if (
      post.status !== "SCHEDULED" ||
      post.scheduleVersion !== scheduleVersion
    ) {
      return { message: "Post is no longer eligible" };
    }
    if (!post.scheduledAt || post.scheduledAt > new Date()) {
      return {
        message: "Scheduled time has not arrived",
      };
    }
    const media = post.media;
    const instagramAccount = post.user.instagramAccount;
    if (!media || !instagramAccount) {
      throw new Error("Post image or Instagram account is missing");
    }
    const claimed = await prisma.post.updateMany({
      where: {
        id: post.id,
        status: "SCHEDULED",
        scheduleVersion,
        scheduledAt: { lte: new Date() },
      },
      data: {
        status: "PUBLISHING",
      },
    });
    if (claimed.count === 0) {
      return { message: "Post could not be claimed" };
    }
    try {
      const accessToken = decryptToken(instagramAccount.accessTokenEncrypted);
      const result = await publishInstagramImage({
        imageUrl: media.url,
        caption: post.content,
        instagramUserId: instagramAccount.instagramUserId,
        accessToken,
      });
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          status: "PUBLISHED",
        },
      });
      return {
        message: "Published",
        instagramMediaId: result.instagramMediaId,
      };
    } catch (error) {
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          status: "FAILED",
        },
      });
      throw error;
    }
  },
  {
    connection: redisConnection,
  },
);
