import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Caption is required")
    .max(2200, "Caption cannot exceed 2200 characters"),
  workspaceId: z.string().uuid("Invalid workspace ID"),
});

export const UpdatePostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Caption is required")
    .max(2200, "Caption cannot exceed 2200 characters"),
});
