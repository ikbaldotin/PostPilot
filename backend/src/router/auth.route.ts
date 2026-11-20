import express from "express";
import {
  login,
  logout,
  myProfile,
  register,
} from "../controller/auth.controller.js";
import isAuth from "../middleware/isAuth.js";

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", isAuth, myProfile);
authRouter.post("/logout", logout);

export default authRouter;
