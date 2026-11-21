import type { Request, Response } from "express";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";
import {
  disconnectInstagramAccount,
  exchangeInstagramCode,
  getInstagramAccountStatus,
  getInstagramProfile,
  saveInstagramAccount,
} from "../service/instagram.service.js";
import { encryptToken } from "../utils/encryption.js";

const META_AUTH_URL = "https://www.facebook.com/dialog/oauth";

export const connectInstagram = (_req: Request, res: Response) => {
  try {
    const state = randomBytes(32).toString("hex");

    res.cookie("ig_oauth_state", state, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
      path: "/api/instagram",
    });

    const params = new URLSearchParams({
      client_id: env.INSTAGRAM_APP_ID,
      config_id: env.INSTAGRAM_CONFIG_ID,
      redirect_uri: env.INSTAGRAM_REDIRECT_URI,
      response_type: "code",
      override_default_response_type: "true",
      display: "popup",
      state,
      prompt: "login",
    });

    const authorizationUrl = `${META_AUTH_URL}?${params.toString()}`;

    return res.redirect(302, authorizationUrl);
  } catch (error) {
    console.error("Instagram authorization error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to initiate Instagram authorization",
    });
  }
};

export const instagramCallback = async (req: Request, res: Response) => {
  const savedState = req.cookies.ig_oauth_state;
  const { code, state, error } = req.query;
  res.clearCookie("ig_oauth_state", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/instagram",
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Instagram authorization was denied.",
    });
  }
  if (typeof savedState !== "string" || typeof state !== "string") {
    return res.status(400).json({
      success: false,
      message: "Missing OAuth state.",
    });
  }
  const savedBuffer = Buffer.from(savedState);
  const receivedBuffer = Buffer.from(state);
  if (
    savedBuffer.length !== receivedBuffer.length ||
    !timingSafeEqual(savedBuffer, receivedBuffer)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid OAuth state.",
    });
  }
  if (typeof code !== "string" || !code) {
    return res.status(400).json({
      success: false,
      message: "Authorization code missing.",
    });
  }
  try {
    const tokenData = await exchangeInstagramCode(code);
    if (typeof tokenData.expiresIn !== "number" || tokenData.expiresIn <= 0) {
      throw new Error("Invalid Instagram token expiration.");
    }
    const instagramProfile = await getInstagramProfile(tokenData.accessToken);
    const accessTokenEncrypted = await encryptToken(tokenData.accessToken);
    const tokenExpiresAt = new Date(Date.now() + tokenData.expiresIn * 1000);
    const account = await saveInstagramAccount({
      userId: req.userId as string,
      username: instagramProfile.username,
      instagramUserId: instagramProfile.instagramUserId,
      accessTokenEncrypted,
      tokenExpiresAt,
    });
    return res.status(200).json({
      success: true,
      message: "Instagram access token received successfully.",
      account,
    });
  } catch (error) {
    console.error(
      "Instagram token exchange failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "This Instagram account is already connected to another user.",
      });
    }
    return res.status(502).json({
      success: false,
      message: "Unable to exchange Instagram authorization code.",
    });
  }
};
export const getInstagramStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing.",
      });
    }
    const account = await getInstagramAccountStatus(userId);
    if (!account) {
      return res.status(200).json({
        success: true,
        connected: false,
        account: null,
      });
    }
    return res.status(200).json({
      success: true,
      connected: true,
      account,
    });
  } catch (error) {
    console.error("Instagram status error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve Instagram connection status.",
    });
  }
};

export const disconnectInstagram = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing.",
      });
    }
    const disconnected = await disconnectInstagramAccount(userId);
    if (!disconnected) {
      return res.status(404).json({
        success: false,
        message: "No Instagram account is connected.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Instagram account disconnected successfully.",
    });
  } catch (error) {
    console.error("Instagram disconnect error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to disconnect Instagram account.",
    });
  }
};
