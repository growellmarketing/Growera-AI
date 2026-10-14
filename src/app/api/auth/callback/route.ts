import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRequestOrigin } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getRequestOrigin(request);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const errorDescription = searchParams.get("error_description");
  const error = searchParams.get("error");

  // Handle provider-level error (e.g. redirect_uri_mismatch or access_denied)
  if (error || errorDescription) {
    const message = errorDescription || error || "Google sign in was cancelled or failed.";
    console.error("Google Auth callback error from provider:", message);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(message)}`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      console.error("exchangeCodeForSession error:", exchangeError.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    } catch (err: any) {
      console.error("Unexpected callback exception:", err);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(err.message || "Failed to exchange auth session")}`
      );
    }
  }

  // Fallback if code is missing
  return NextResponse.redirect(`${origin}/login?error=auth_callback_missing_code`);
}
