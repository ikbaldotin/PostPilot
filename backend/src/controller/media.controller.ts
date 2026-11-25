import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

import imageFileSchema from "../validate/media.validation.js";
import cloudinary from "../config/cloudinary.js";

export const uploadPostMedia = async (req: Request, res: Response) => {
  let uploadedPublicId: string | undefined;
  try {
    const userId = req.userId;
    const workspaceId = req.params.workspaceId as string;
    const postId = req.params.postId as string;
    const file = req.file;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!workspaceId || !postId) {
      return res.status(400).json({
        message: "Workspace ID and post ID are required",
      });
    }
    if (!file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }
    const parsedFile = imageFileSchema.safeParse(file);
    if (!parsedFile.success) {
      return res.status(400).json({ error: parsedFile.error.issues });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        workspaceId,
      },
      include: {
        media: true,
      },
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    const canUpload =
      membership.role === "OWNER" ||
      membership.role === "ADMIN" ||
      post.userId === userId;
    if (!canUpload) {
      return res.status(403).json({
        message: "You cannot modify this post",
      });
    }
    if (post.media) {
      return res.status(409).json({
        message: "This post already has an image",
      });
    }
    const result = await uploadToCloudinary(file.buffer);
    uploadedPublicId = result.public_id;
    const media = await prisma.media.create({
      data: {
        postId,
        url: result.secure_url,
        publicId: result.public_id,
        mimetype: file.mimetype,
        size: file.size,
        originalName: file.originalname,
        format: result.format,
      },
    });
    return res.status(201).json({
      message: "Image uploaded successfully",
      media,
    });
  } catch (error) {
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId).catch((err) => {
        console.error("Cloudinary cleanup failed:", err);
      });
    }
    console.error("uploadPostMedia error:", error);
    return res.status(500).json({
      message: "Failed to upload image",
    });
  }
};

export const getPostMedia = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const workspaceId = req.params.workspaceId as string;
    const postId = req.params.postId as string;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!workspaceId || !postId) {
      return res.status(400).json({
        message: "Workspace ID and post ID are required",
      });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
    if (!membership) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        workspaceId,
      },
      include: {
        media: true,
      },
    });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Image retrieved successfully",
      media: post.media,
    });
  } catch (error) {
    console.error("getPostMedia error:", error);
    return res.status(500).json({
      message: "Failed to retrieve image",
    });
  }
};

export const deletePostMedia = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId as string;
    const workspaceId = req.params.workspaceId as string;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!workspaceId || !postId) {
      return res.status(400).json({
        message: "Workspace ID and post ID are required",
      });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
    if (!membership) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        workspaceId,
      },
      include: {
        media: true,
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.media) {
      return res.status(404).json({ message: "Image not found" });
    }
    const canDelete =
      membership.role === "OWNER" ||
      membership.role === "ADMIN" ||
      post.userId === userId;
    if (!canDelete) {
      return res.status(403).json({ message: "You cannot modify this post" });
    }
    const imageId = post.media.publicId;
    const result = await cloudinary.uploader.destroy(imageId);
    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(502).json({ message: "Failed to delete image" });
    }
    await prisma.media.delete({
      where: {
        postId,
      },
    });
    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("deletePostMedia error:", error);
    return res.status(500).json({ message: "Failed to delete image" });
  }
};
