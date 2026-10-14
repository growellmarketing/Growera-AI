import crypto from "crypto";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  id_token?: string;
}

/**
 * Creates a cryptographically signed state parameter to prevent CSRF attacks.
 */
export function generateOAuthState(workspaceId: string, userId: string): { state: string; signature: string } {
  const secret = process.env.ENCRYPTION_KEY || "fallback_secret_for_state_signing_32chars";
  const timestamp = Date.now();
  const payload = JSON.stringify({ workspaceId, userId, timestamp });
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const state = Buffer.from(payload).toString("base64url");

  return { state, signature: hmac };
}

/**
 * Verifies that the OAuth state parameter is authentic and not expired (valid for 15 minutes).
 */
export function verifyOAuthState(state: string, expectedSignature: string): { valid: boolean; workspaceId?: string; userId?: string } {
  try {
    const secret = process.env.ENCRYPTION_KEY || "fallback_secret_for_state_signing_32chars";
    const payloadStr = Buffer.from(state, "base64url").toString("utf8");
    const hmac = crypto.createHmac("sha256", secret).update(payloadStr).digest("hex");

    if (hmac !== expectedSignature) {
      return { valid: false };
    }

    const data = JSON.parse(payloadStr);
    const ageMs = Date.now() - data.timestamp;

    // 15 minute expiration
    if (ageMs > 15 * 60 * 1000) {
      return { valid: false };
    }

    return { valid: true, workspaceId: data.workspaceId, userId: data.userId };
  } catch {
    return { valid: false };
  }
}

/**
 * Resolves the Google OAuth redirect URI dynamically based on environment configuration.
 */
export function getGoogleRedirectUri(): string {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${appUrl.replace(/\/$/, "")}/api/auth/google/callback`;
}

/**
 * Generates the official Google OAuth 2.0 authorization URL for Google Business Profile.
 */
export function getGoogleOAuthUrl(state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = getGoogleRedirectUri();

  if (!clientId || clientId.includes("placeholder")) {
    throw new Error("GOOGLE_CLIENT_ID_NOT_CONFIGURED");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/business.manage openid email profile",
    access_type: "offline",
    prompt: "consent",
    state: state,
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Server-side exchange of Google authorization code for access and refresh tokens.
 */
export async function exchangeGoogleAuthCode(code: string): Promise<GoogleTokens> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getGoogleRedirectUri();

  if (!clientId || !clientSecret || clientId.includes("placeholder") || clientSecret.includes("placeholder")) {
    throw new Error("Google OAuth credentials are not properly configured in .env.local.");
  }

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google token exchange failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Fetches basic Google user profile information to identify the connected account.
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      id: data.sub,
      email: data.email,
      name: data.name || data.email,
      picture: data.picture,
    };
  } catch {
    return null;
  }
}

