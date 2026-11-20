import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import type { JwtPayload } from "jsonwebtoken";
const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default isAuth;
