import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validate/auth.validation.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
export const register = async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const { name, email, password } = result.data;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(201)
      .json({ message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const { email, password } = result.data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isPassword = await bcrypt.compare(password, user?.password);
    if (!isPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const myProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
