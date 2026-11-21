import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { env } from "../config/env.js";

const ALGORITHM = "aes-256-gcm";

const ENCRYPTION_KEY = Buffer.from(env.INSTAGRAM_TOKEN_ENCRYPTION_KEY, "hex");
export const encryptToken = async (token: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(token, "utf-8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
};

export const decryptToken = (encryptedToken: string): string => {
  const [ivHex, authTagHex, encryptedHex] = encryptedToken.split(":");
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted token format.");
  }
  const decipher = createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
