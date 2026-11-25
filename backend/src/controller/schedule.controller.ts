import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { schedulePostBodySchema } from "../validate/schedulePost.validation.js";

export const schedulePost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId as string;
    const workspaceId = req.params.workspaceId as string;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!postId || !workspaceId) {
      return res
        .status(400)
        .json({ message: "Post ID and Workspace ID are required" });
    }
    const parsed = schedulePostBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]?.message,
      });
    }
    const { scheduledAt } = parsed.data;
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
    if (!membership) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        userId,
        workspaceId,
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.status !== "DRAFT" && post.status !== "CANCELLED") {
      return res.status(400).json({
        message: "Only draft or cancelled posts can be scheduled",
      });
    }
    const scheduled = await prisma.post.updateMany({
      where: {
        id: post.id,
        userId,
        status: { in: ["DRAFT", "CANCELLED"] },
        scheduleVersion: post.scheduleVersion,
      },
      data: {
        status: "SCHEDULED",
        scheduledAt,
        scheduleVersion: { increment: 1 },
      },
    });
    if (scheduled.count === 0) {
      return res.status(409).json({
        message: "Post could not be scheduled. Its status may have changed.",
      });
    }
    return res.status(200).json({
      message: "Post scheduled successfully",
      postId: post.id,
      status: "SCHEDULED",
      scheduledAt,
    });
  } catch (error) {
    console.error("schedulePost error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelScheduledPost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId as string;
    const workspaceId = req.params.workspaceId as string;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!postId || !workspaceId) {
      return res
        .status(400)
        .json({ message: "Post ID and Workspace ID are required" });
    }
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        workspaceId,
        workspace: {
          membership: {
            some: {
              userId,
            },
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId !== userId) {
      return res.status(403).json({
        message: "You can only cancel your own posts",
      });
    }
    if (post.status !== "SCHEDULED") {
      return res.status(400).json({
        message: "Only scheduled posts can be cancelled",
      });
    }
    const cancelledPost = await prisma.post.updateMany({
      where: {
        id: post.id,
        userId,
        status: "SCHEDULED",
        scheduleVersion: post.scheduleVersion,
      },
      data: {
        status: "CANCELLED",
        scheduleVersion: { increment: 1 },
      },
    });
    if (cancelledPost.count === 0) {
      return res.status(409).json({
        message: "Post could not be cancelled. Its status may have changed.",
      });
    }
    return res.status(200).json({
      message: "Post cancelled successfully",
      postId: post.id,
      status: "CANCELLED",
    });
  } catch (error) {
    console.error("cancelScheduledPost error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const reschedulePost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId as string;
    const workspaceId = req.params.workspaceId as string;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!postId || !workspaceId) {
      return res
        .status(400)
        .json({ message: "Post ID and Workspace ID are required" });
    }
    const parsed = schedulePostBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]?.message,
      });
    }
    const { scheduledAt } = parsed.data;
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        workspaceId,
        workspace: {
          membership: {
            some: { userId },
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId !== userId) {
      return res.status(403).json({
        message: "You can only reschedule your own posts",
      });
    }
    if (post.status !== "SCHEDULED") {
      return res.status(400).json({
        message: "Only scheduled posts can be rescheduled",
      });
    }
    const updatePost = await prisma.post.updateMany({
      where: {
        id: post.id,
        userId,
        status: "SCHEDULED",
        scheduleVersion: post.scheduleVersion,
      },
      data: {
        scheduledAt,
        scheduleVersion: { increment: 1 },
      },
    });
    if (updatePost.count === 0) {
      return res.status(409).json({
        message: "Post could not be rescheduled. Its status may have changed.",
      });
    }
    return res.status(200).json({
      message: "Post rescheduled successfully",
      postId: post.id,
      scheduledAt,
    });
  } catch (error) {
    console.error("reschedulePost error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
