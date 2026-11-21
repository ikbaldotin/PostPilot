import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  connectInstagram,
  disconnectInstagram,
  getInstagramStatus,
  instagramCallback,
} from "../controller/instagram.controller.js";

const instagramRouter = express.Router();
instagramRouter.get("/connect", isAuth, connectInstagram);
instagramRouter.get("/callback", isAuth, instagramCallback);
instagramRouter.get("/status", isAuth, getInstagramStatus);
instagramRouter.delete("/disconnect", isAuth, disconnectInstagram);
export default instagramRouter;
