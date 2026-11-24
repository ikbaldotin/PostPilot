import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters long")
    .max(50, "Slug must be at most 50 characters long"),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters long")
    .max(50, "Slug must be at most 50 characters long"),
});
