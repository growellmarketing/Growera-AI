import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateOAuthState, getGoogleOAuthUrl } from "@/lib/google/oauth";
import { getRequestOrigin } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getRequestOrigin(request);
  const workspaceId = searchParams.get("workspaceId") || "demo-workspace";
  const userId = searchParams.get("userId") || "anonymous-user";

  try {
    // Generate secure state to prevent CSRF attacks
    const { state, signature } = generateOAuthState(workspaceId, userId);

    // Get authorization URL with official business.manage scope
    const googleAuthUrl = getGoogleOAuthUrl(state);

    // Save signature in HTTP-only cookie for verification during callback
    const cookieStore = await cookies();
    cookieStore.set("google_oauth_sig", signature, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    cookieStore.set("google_oauth_workspace", workspaceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return NextResponse.redirect(googleAuthUrl);
  } catch (error: any) {
    if (error.message === "GOOGLE_CLIENT_ID_NOT_CONFIGURED") {
      return NextResponse.redirect(
        `${origin}/${workspaceId}/settings?error=google_credentials_missing#google-integration`
      );
    }

    return NextResponse.redirect(
      `${origin}/${workspaceId}/settings?error=oauth_init_failed#google-integration`
    );
  }
}
