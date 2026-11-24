import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  createWorkspace,
  deleteWorkspace,
  getMyWorkspaces,
  getWorkspaceBySlug,
  updateWorkspace,
} from "../controller/workspace.controller.js";

const workspaceRouter = express.Router();
workspaceRouter.post("/", isAuth, createWorkspace);
workspaceRouter.get("/", isAuth, getMyWorkspaces);
workspaceRouter.get("/:slug", isAuth, getWorkspaceBySlug);
workspaceRouter.patch("/:slug", isAuth, updateWorkspace);
workspaceRouter.delete("/:slug", isAuth, deleteWorkspace);
export default workspaceRouter;
