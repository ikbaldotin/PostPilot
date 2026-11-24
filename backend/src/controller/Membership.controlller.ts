import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { updateRoleSchema } from "../validate/membership.validation.js";
export const addMember = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const otheruserId = req.params.id as string;
    const workspaceId = req.params.workspaceId as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!otheruserId || !workspaceId) {
      return res.status(400).json({ error: "Missing user ID or workspace ID" });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
    if (
      !membership ||
      (membership.role !== "OWNER" && membership.role !== "ADMIN")
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const otheruser = await prisma.user.findUnique({
      where: {
        id: otheruserId,
      },
    });
    if (!otheruser) {
      return res.status(404).json({ error: "User not found" });
    }
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId: otheruser.id,
          workspaceId,
        },
      },
    });
    if (existingMembership) {
      return res
        .status(409)
        .json({ error: "User is already a member of the workspace" });
    }
    const newMembership = await prisma.membership.create({
      data: {
        userId: otheruser.id,
        role: "MEMBER",
        workspaceId,
      },
    });

    return res.status(201).json({
      message: "Member added successfully",
      membership: newMembership,
    });
  } catch (error) {
    console.error("addMember error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const viewMembers = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const slug = req.params.slug as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!slug) {
      return res.status(400).json({ error: "Missing  workspace ID" });
    }
    const workspace = await prisma.workspace.findUnique({
      where: {
        slug,
      },
      include: {
        membership: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }
    const isMember = workspace.membership.some((m) => m.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return res.status(200).json({ members: workspace.membership });
  } catch (error) {
    console.error("viewMembers error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const updateMember = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const otheruserId = req.params.id as string;
    const workspaceId = req.params.workspaceId as string;
    const result = updateRoleSchema.safeParse(req.body);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!workspaceId || !otheruserId) {
      return res
        .status(400)
        .json({ error: "Missing other user ID or workspace ID" });
    }
    if (!result.success) {
      return res.status(400).json({ error: "Invalid role provided" });
    }
    const { role } = result.data;
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
    if (membership?.role !== "OWNER" && membership?.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId: otheruserId,
          workspaceId,
        },
      },
    });
    if (!existingMembership) {
      return res
        .status(404)
        .json({ error: "User is not a member of this workspace" });
    }
    if (existingMembership.role === "OWNER" || role === "OWNER") {
      return res
        .status(403)
        .json({ error: "Cannot change or assign OWNER role" });
    }
    if (
      membership.role === "ADMIN" ||
      (existingMembership.role === "ADMIN" && role === "ADMIN")
    ) {
      return res
        .status(403)
        .json({ error: "Only the owner can manage admins" });
    }
    await prisma.membership.update({
      where: {
        userId_workspaceId: {
          userId: otheruserId,
          workspaceId,
        },
      },
      data: {
        role,
      },
    });
    return res
      .status(200)
      .json({ message: "Member role updated successfully" });
  } catch (error) {
    console.error("updateMember error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const otheruserId = req.params.id as string;
    const workspaceId = req.params.workspaceId as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!workspaceId || !otheruserId) {
      return res
        .status(400)
        .json({ error: "Missing other user ID or workspace ID" });
    }
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
    if (membership?.role !== "OWNER") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const otheruserMembership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId: otheruserId,
          workspaceId,
        },
      },
    });
    if (!otheruserMembership) {
      return res
        .status(404)
        .json({ error: "User is not a member of this workspace" });
    }
    if (otheruserMembership?.role === "OWNER") {
      return res
        .status(403)
        .json({ error: "Cannot remove the owner of the workspace" });
    }
    await prisma.membership.delete({
      where: {
        userId_workspaceId: {
          userId: otheruserId,
          workspaceId,
        },
      },
    });
    return res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("removeMember error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const LeaveWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const workspaceId = req.params.workspaceId as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!workspaceId) {
      return res.status(400).json({ error: "Missing  workspace ID" });
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
      return res
        .status(404)
        .json({ error: "You are not a member of this workspace" });
    }
    if (membership?.role === "OWNER") {
      return res
        .status(403)
        .json({ error: "Owner cannot leave the workspace" });
    }
    await prisma.membership.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
    return res.status(200).json({ message: "Left workspace successfully" });
  } catch (error) {
    console.error("LeaveWorkspace error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
