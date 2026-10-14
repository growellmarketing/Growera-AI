import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateOAuthState, verifyOAuthState, getGoogleRedirectUri } from "@/lib/google/oauth";
import { getRequestOrigin } from "@/lib/utils";

describe("OAuth Security & Utility Suite", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should generate cryptographically verifiable state and signature", () => {
    const { state, signature } = generateOAuthState("ws-test-123", "usr-456");
    expect(state).toBeDefined();
    expect(signature).toBeDefined();

    const verification = verifyOAuthState(state, signature);
    expect(verification.valid).toBe(true);
    expect(verification.workspaceId).toBe("ws-test-123");
    expect(verification.userId).toBe("usr-456");
  });

  it("should reject tampered OAuth state signatures", () => {
    const { state } = generateOAuthState("ws-test-123", "usr-456");
    const fakeSignature = "bad_signature_tampered_value";

    const verification = verifyOAuthState(state, fakeSignature);
    expect(verification.valid).toBe(false);
  });

  it("should correctly resolve redirect URI dynamically", () => {
    process.env.GOOGLE_REDIRECT_URI = "https://myapp.vercel.app/api/auth/google/callback";
    expect(getGoogleRedirectUri()).toBe("https://myapp.vercel.app/api/auth/google/callback");

    delete process.env.GOOGLE_REDIRECT_URI;
    process.env.NEXT_PUBLIC_APP_URL = "https://customdomain.com";
    expect(getGoogleRedirectUri()).toBe("https://customdomain.com/api/auth/google/callback");
  });

  it("should extract public request origin safely considering proxies", () => {
    const requestWithProxy = new Request("http://127.0.0.1:3000/api/test", {
      headers: {
        "x-forwarded-host": "production-app.vercel.app",
        "x-forwarded-proto": "https",
      },
    });

    expect(getRequestOrigin(requestWithProxy)).toBe("https://production-app.vercel.app");
  });
});
