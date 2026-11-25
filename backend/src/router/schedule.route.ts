import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  cancelScheduledPost,
  reschedulePost,
  schedulePost,
} from "../controller/schedule.controller.js";

const scheduleRouter = express.Router();

scheduleRouter.post(
  "/workspaces/:workspaceId/posts/:postId/schedule",
  isAuth,
  schedulePost,
);

scheduleRouter.patch(
  "/workspaces/:workspaceId/posts/:postId/cancel",
  isAuth,
  cancelScheduledPost,
);

scheduleRouter.patch(
  "/workspaces/:workspaceId/posts/:postId/reschedule",
  isAuth,
  reschedulePost,
);
export default scheduleRouter;
