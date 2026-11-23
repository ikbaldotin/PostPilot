import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  createPost,
  deletePost,
  getAllPost,
  getSinglePost,
  UpdatePost,
} from "../controller/post.controller.js";

const postRouter = express.Router();
postRouter.post("/", isAuth, createPost);
postRouter.get("/workspaces/:workspaceId/posts", isAuth, getAllPost);
postRouter.get("/workspaces/:workspaceId/posts/:postId", isAuth, getSinglePost);
postRouter.patch("/:workspaceId/posts/:postId", isAuth, UpdatePost);
postRouter.delete("/workspaces/:workspaceId/posts/:postId", isAuth, deletePost);

export default postRouter;
