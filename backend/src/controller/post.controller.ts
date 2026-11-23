import type { Request, Response } from "express";
import {
  createPostSchema,
  UpdatePostSchema,
} from "../validate/post.validation.js";
import { prisma } from "../lib/prisma.js";

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = createPostSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const { content, workspaceId } = result.data;
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });
    if (!membership) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const post = await prisma.post.create({
      data: {
        content,
        userId,
        workspaceId,
      },
    });
    return res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Post creation failed" });
  }
};

export const getAllPost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const workspaceId = req.params.workspaceId as string;
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
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
      return res.status(404).json({ message: "Workspace not found" });
    }
    const posts = await prisma.post.findMany({
      where: {
        workspaceId,
      },
      include: {
        media: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const postId = req.params.postId as string;
    const workspaceId = req.params.workspaceId as string;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });
    if (!membership) {
      return res.status(404).json({ message: "Workspace not found" });
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
    return res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ message: "Failed to fetch single post" });
  }
};
export const UpdatePost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const workspaceId = req.params.workspaceId as string;
    const postId = req.params.postId as string;
    const result = UpdatePostSchema.safeParse(req.body);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const { content } = result.data;
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
    if (!membership) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const existingPost = await prisma.post.findFirst({
      where: {
        id: postId,
        workspaceId,
      },
    });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    const canUpdate =
      membership.role === "OWNER" ||
      membership.role === "ADMIN" ||
      (membership.role === "MEMBER" && existingPost.userId === userId);
    if (!canUpdate) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }
    const post = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        content,
      },
    });
    return res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId as string;
    const workspaceId = req.params.workspaceId as string;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });
    if (!membership) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const existingPost = await prisma.post.findFirst({
      where: {
        id: postId,
        workspaceId,
      },
    });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    const canDelete =
      membership.role === "OWNER" ||
      membership.role === "ADMIN" ||
      (membership.role === "MEMBER" && existingPost.userId === userId);
    if (!canDelete) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Failed to delete post" });
  }
};
