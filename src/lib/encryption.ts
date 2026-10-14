import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard 96-bit IV for AES-GCM
const TAG_LENGTH = 16; // Standard 128-bit authentication tag

/**
 * Encrypt a sensitive plaintext string (such as an OAuth refresh token).
 * Uses AES-256-GCM with a random initialization vector (IV) and authentication tag.
 *
 * @param plaintext The secret string to encrypt
 * @param masterKeyHex 64-char hex string (32 bytes)
 */
export function encryptToken(
  plaintext: string,
  masterKeyHex?: string
): { ciphertext: string; iv: string; tag: string } {
  const keyHex = masterKeyHex || process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error(
      "Invalid ENCRYPTION_KEY. Must be a 32-byte hexadecimal string (64 characters)."
    );
  }

  const key = Buffer.from(keyHex, "hex");
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return {
    ciphertext,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

/**
 * Decrypt a sensitive ciphertext string using AES-256-GCM.
 * Verifies authenticity via the authentication tag before returning plaintext.
 *
 * @param ciphertext Hex-encoded ciphertext
 * @param ivHex Hex-encoded initialization vector
 * @param tagHex Hex-encoded authentication tag
 * @param masterKeyHex 64-char hex string (32 bytes)
 */
export function decryptToken(
  ciphertext: string,
  ivHex: string,
  tagHex: string,
  masterKeyHex?: string
): string {
  const keyHex = masterKeyHex || process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error(
      "Invalid ENCRYPTION_KEY. Must be a 32-byte hexadecimal string (64 characters)."
    );
  }

  const key = Buffer.from(keyHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
