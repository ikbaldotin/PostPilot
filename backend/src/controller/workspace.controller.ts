import type { Request, Response } from "express";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../validate/workspace.validation.js";
import { prisma } from "../lib/prisma.js";
import { slugify } from "../utils/slug.helper.js";
import { Prisma } from "../generated/prisma/edge.js";

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = createWorkspaceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const { name } = result.data;
    const slug = slugify(name);
    const newWorkspace = await prisma.$transaction(async (tx) => {
      const existingWorkspace = await tx.workspace.findUnique({
        where: {
          slug,
        },
      });
      if (existingWorkspace) {
        throw new Error("WORKSPACE_EXISTS");
      }
      const workspace = await tx.workspace.create({
        data: {
          name,
          slug,
        },
      });
      await tx.membership.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: "OWNER",
        },
      });
      return workspace;
    });
    return res.status(201).json({
      message: "Workspace created successfully",
      workspace: newWorkspace,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "WORKSPACE_EXISTS") {
      return res
        .status(409)
        .json({ message: "Workspace slug already taken, please try again" });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getMyWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const workspaces = await prisma.workspace.findMany({
      where: {
        membership: {
          some: {
            userId,
          },
        },
      },
    });
    return res.status(200).json({ workspaces });
  } catch (error) {
    console.error("Error fetching my workspaces:", error);
    return res.status(500).json({ message: "Failed to fetch my workspaces" });
  }
};
export const getWorkspaceBySlug = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const slug = req.params.slug as string;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!slug) {
      return res.status(400).json({ message: "Workspace slug is required" });
    }
    const workspace = await prisma.workspace.findUnique({
      where: {
        slug,
      },
    });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: workspace.id,
        },
      },
    });
    if (!membership) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this workspace" });
    }
    return res.status(200).json({ workspace });
  } catch (error) {
    console.error("Error fetching workspace:", error);
    return res.status(500).json({ message: "Failed to fetch workspace" });
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const slug = req.params.slug as string;
    const result = updateWorkspaceSchema.safeParse(req.body);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!slug) {
      return res.status(400).json({ message: "Workspace slug is required" });
    }
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const workspace = await prisma.workspace.findUnique({
      where: {
        slug,
      },
    });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: workspace.id,
        },
      },
    });
    if (
      !membership ||
      (membership?.role !== "OWNER" && membership.role !== "ADMIN")
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this workspace" });
    }
    const { name } = result.data;
    const newSlug = slugify(name);
    const updateWorkspace = await prisma.workspace.update({
      where: {
        id: workspace.id,
      },
      data: {
        name,
        slug: newSlug,
      },
    });
    return res.status(200).json({
      message: "Workspace updated successfully",
      workspace: updateWorkspace,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ message: "Workspace slug already taken, please try again" });
    }
    console.error("Error updating workspace:", error);
    return res.status(500).json({ message: "Failed to update workspace" });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const slug = req.params.slug as string;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!slug) {
      return res.status(400).json({ message: "Workspace slug is required" });
    }
    const workspace = await prisma.workspace.findUnique({
      where: {
        slug,
      },
    });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: workspace.id,
        },
      },
    });
    if (membership?.role !== "OWNER") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this workspace" });
    }
    await prisma.workspace.delete({
      where: {
        slug,
      },
    });
    return res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return res.status(500).json({ message: "Failed to delete workspace" });
  }
};
