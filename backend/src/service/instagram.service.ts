import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

interface MetaTokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in: number;
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

export const exchangeInstagramCode = async (code: string) => {
  const url = new URL(`https://graph.facebook.com/v26.0/oauth/access_token`);
  url.searchParams.set("client_id", env.INSTAGRAM_APP_ID);
  url.searchParams.set("client_secret", env.INSTAGRAM_APP_SECRET);
  url.searchParams.set("code", code);

  const response = await fetch(url, {
    method: "GET",
    signal: AbortSignal.timeout(15000),
  });
  const data = (await response.json()) as MetaTokenResponse;
  if (!response.ok || !data.access_token) {
    throw new Error(data.error?.message ?? "Instagram token exchange failed");
  }
  return {
    accessToken: data.access_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in ?? null,
  };
};

interface InstagramAccountResponse {
  data?: {
    id: string;
    username: string;
  }[];
  error?: {
    message?: string;
  };
}
export const getInstagramProfile = async (accessToken: string) => {
  const url = new URL("https://graph.instagram.com/v26.0/me");
  url.searchParams.set("fields", "id,username");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
  });
  const result = (await response.json()) as InstagramAccountResponse;

  if (!response.ok) {
    throw new Error(
      result.error?.message ?? "Unable to retrieve Instagram account",
    );
  }
  const accounts = result.data ?? [];

  if (accounts.length === 0) {
    throw new Error("No Instagram account is assigned to this authorization.");
  }
  if (accounts.length > 1) {
    throw new Error("Multiple Instagram accounts found. Expected exactly one.");
  }
  const account = accounts[0]!;
  return {
    instagramUserId: account.id,
    username: account.username,
  };
};

interface SaveInstagramAccountInput {
  userId: string;
  instagramUserId: string;
  username: string;
  accessTokenEncrypted: string;
  tokenExpiresAt: Date;
}
export const saveInstagramAccount = async (data: SaveInstagramAccountInput) => {
  const account = await prisma.instagramAccount.upsert({
    where: {
      userId: data.userId,
    },
    create: {
      username: data.username,
      userId: data.userId,
      instagramUserId: data.instagramUserId,
      accessTokenEncrypted: data.accessTokenEncrypted,
      tokenExpiresAt: data.tokenExpiresAt,
    },
    update: {
      instagramUserId: data.instagramUserId,
      username: data.username,
      accessTokenEncrypted: data.accessTokenEncrypted,
      tokenExpiresAt: data.tokenExpiresAt,
    },
    select: {
      id: true,
      instagramUserId: true,
      username: true,
      tokenExpiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return account;
};
export const getInstagramAccountStatus = async (userId: string) => {
  const account = await prisma.instagramAccount.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      instagramUserId: true,
      username: true,
      tokenExpiresAt: true,
      createdAt: true,
    },
  });
  if (!account) {
    return null;
  }
  return {
    connected: true,
    ...account,
    tokenExpired: account.tokenExpiresAt <= new Date(),
  };
};
export const disconnectInstagramAccount = async (userId: string) => {
  const result = await prisma.instagramAccount.deleteMany({
    where: {
      userId,
    },
  });
  return result.count > 0;
};
