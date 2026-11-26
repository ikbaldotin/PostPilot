import { Worker } from "bullmq";
import type { PublishJobData } from "../type/publish.type.js";
import { prisma } from "../lib/prisma.js";
import {
  createInstagramContainer,
  getInstagramContainerStatus,
  publishInstagramContainer,
} from "../provider/instagram.provider.js";
import { decryptToken } from "../utils/encryption.js";
import redisConnection from "../config/redis.js";

const publishWorker = new Worker<PublishJobData>(
  "publish-queue",
  async (job) => {
    const { postId, scheduleVersion } = job.data;
    const currentAttempt = job.attemptsMade + 1;
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

    let result;
    try {
      const accessToken = decryptToken(instagramAccount.accessTokenEncrypted);
      let containerId = post.instagramContainerId;
      if (!containerId) {
        containerId = await createInstagramContainer({
          imageUrl: media.url,
          caption: post.content,
          instagramUserId: instagramAccount.instagramUserId,
          accessToken,
        });
      }
      const saved = await prisma.post.updateMany({
        where: {
          id: post.id,
          status: "PUBLISHING",
          scheduleVersion,
          instagramContainerId: null,
        },
        data: {
          instagramContainerId: containerId,
        },
      });
      if (saved.count === 0) {
        throw new Error("Could not save Instagram container ID.");
      }
      const containerStatus = await getInstagramContainerStatus(
        containerId,
        accessToken,
      );
      if (containerStatus !== "FINISHED") {
        throw new Error(
          `Instagram container is not ready. Status: ${containerStatus}`,
        );
      }
      result = await publishInstagramContainer({
        containerId,
        instagramUserId: instagramAccount.instagramUserId,
        accessToken,
      });
    } catch (error) {
      const totalAttempts = job.opts.attempts ?? 1;
      const isFinalAttempt = currentAttempt >= totalAttempts;
      const current = await prisma.post.findUnique({
        where: {
          id: post.id,
        },
        select: {
          publishAttempts: true,
        },
      });
      const publishWasAttempted = current?.publishAttempts !== null;
      await prisma.$transaction(async (tx) => {
        await tx.publishAttempt.create({
          data: {
            postId: post.id,
            attemptNo: currentAttempt,
            success: false,
            error: error instanceof Error ? error.message : String(error),
          },
        });
        if (!publishWasAttempted) {
          await tx.post.updateMany({
            where: {
              id: post.id,
              status: "PUBLISHING",
              scheduleVersion,
            },
            data: {
              status: isFinalAttempt ? "FAILED" : "SCHEDULED",
            },
          });
        }
      });
      throw error;
    }
    await prisma.$transaction(async (tx) => {
      await tx.publishAttempt.create({
        data: {
          postId: post.id,
          attemptNo: currentAttempt,
          success: true,
        },
      });
      const update = await tx.post.updateMany({
        where: {
          id: post.id,
          status: "PUBLISHING",
          scheduleVersion,
        },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          instagramMediaId: result.instagramMediaId,
        },
      });
      if (update.count === 0) {
        throw new Error("Could not update post publishing status.");
      }
    });
    return {
      message: "Published",
      instagramMediaId: result.instagramMediaId,
    };
  },
  { connection: redisConnection },
);

export default publishWorker;
