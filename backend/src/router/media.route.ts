import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../config/multer.js";
import {
  deletePostMedia,
  getPostMedia,
  uploadPostMedia,
} from "../controller/media.controller.js";

const mediaRouter = express.Router();

mediaRouter.post(
  "/:workspaceId/:postId",
  isAuth,
  upload.single("image"),
  uploadPostMedia,
);
mediaRouter.get("/:workspaceId/:postId", isAuth, getPostMedia);
mediaRouter.delete("/:workspaceId/:postId", isAuth, deletePostMedia);
export default mediaRouter;
