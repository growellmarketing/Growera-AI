import { describe, it, expect } from "vitest";
import { encryptToken, decryptToken } from "@/lib/encryption";

describe("AES-256-GCM Token Encryption", () => {
  const testKeyHex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const sampleRefreshToken = "1//04abcDEF123456_GoogleOAuthRefreshTokenSampleValue";

  it("should encrypt and decrypt a refresh token accurately", () => {
    const encrypted = encryptToken(sampleRefreshToken, testKeyHex);

    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toHaveLength(24); // 12 bytes = 24 hex characters
    expect(encrypted.tag).toHaveLength(32); // 16 bytes = 32 hex characters
    expect(encrypted.ciphertext).not.toEqual(sampleRefreshToken);

    const decrypted = decryptToken(
      encrypted.ciphertext,
      encrypted.iv,
      encrypted.tag,
      testKeyHex
    );

    expect(decrypted).toEqual(sampleRefreshToken);
  });

  it("should fail decryption if ciphertext is tampered with", () => {
    const encrypted = encryptToken(sampleRefreshToken, testKeyHex);
    const tamperedCiphertext = encrypted.ciphertext.slice(0, -2) + "00";

    expect(() => {
      decryptToken(tamperedCiphertext, encrypted.iv, encrypted.tag, testKeyHex);
    }).toThrow();
  });

  it("should throw error if key is invalid length", () => {
    expect(() => {
      encryptToken(sampleRefreshToken, "too-short-key");
    }).toThrow(/Invalid ENCRYPTION_KEY/);
  });
});
