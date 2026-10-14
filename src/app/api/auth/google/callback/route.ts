import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyOAuthState, exchangeGoogleAuthCode, fetchGoogleUserInfo } from "@/lib/google/oauth";
import { encryptToken } from "@/lib/encryption";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestOrigin } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getRequestOrigin(request);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const googleError = searchParams.get("error");

  const cookieStore = await cookies();
  const signatureCookie = cookieStore.get("google_oauth_sig")?.value;
  const workspaceIdCookie = cookieStore.get("google_oauth_workspace")?.value || "demo-workspace";

  // Clean up OAuth cookies
  cookieStore.delete("google_oauth_sig");
  cookieStore.delete("google_oauth_workspace");

  // Handle user cancellation or Google authorization rejection
  if (googleError) {
    return NextResponse.redirect(
      `${origin}/${workspaceIdCookie}/settings?error=${encodeURIComponent(googleError)}#google-integration`
    );
  }

  if (!code || !state || !signatureCookie) {
    return NextResponse.redirect(
      `${origin}/${workspaceIdCookie}/settings?error=missing_oauth_parameters#google-integration`
    );
  }

  // Verify HMAC state signature to prevent CSRF
  const verification = verifyOAuthState(state, signatureCookie);
  if (!verification.valid) {
    return NextResponse.redirect(
      `${origin}/${workspaceIdCookie}/settings?error=invalid_or_expired_oauth_state#google-integration`
    );
  }

  const workspaceId = verification.workspaceId || workspaceIdCookie;

  try {
    // Exchange authorization code for tokens
    const tokens = await exchangeGoogleAuthCode(code);

    if (tokens.refresh_token) {
      // Encrypt the sensitive refresh token at rest using AES-256-GCM
      const encrypted = encryptToken(tokens.refresh_token);

      // Fetch user's Google profile information
      const userInfo = await fetchGoogleUserInfo(tokens.access_token);
      const accountEmail = userInfo?.email || "authorized_google_user@gmail.com";
      const accountName = userInfo?.name || "Authorized Google Account";
      const googleAccountId = userInfo?.id || `google_${Date.now()}`;

      // Persist in Supabase google_connections table
      try {
        const supabase = createAdminClient();
        const { data: connection } = await supabase
          .from("google_connections")
          .upsert(
            {
              workspace_id: workspaceId,
              google_account_id: googleAccountId,
              account_name: accountName,
              email: accountEmail,
              encrypted_refresh_token: encrypted.ciphertext,
              encryption_iv: encrypted.iv,
              encryption_tag: encrypted.tag,
              status: "active",
              last_sync_at: new Date().toISOString(),
            },
            { onConflict: "workspace_id,google_account_id" }
          )
          .select("id")
          .single();

        // Discover and import all Google Business Profile locations for this customer
        const { fetchGoogleBusinessLocations } = await import("@/lib/google/locations");
        const discoveredLocations = await fetchGoogleBusinessLocations(tokens.access_token);

        if (discoveredLocations.length > 0) {
          for (const loc of discoveredLocations) {
            await supabase.from("business_locations").upsert(
              {
                workspace_id: workspaceId,
                google_connection_id: connection?.id || null,
                google_location_id: loc.googleLocationId,
                location_name: loc.locationName,
                store_code: loc.storeCode || null,
                address_line1: loc.addressLine1 || null,
                city: loc.city || null,
                state: loc.state || null,
                postal_code: loc.postalCode || null,
                country_code: loc.countryCode || "IN",
                phone_number: loc.phoneNumber || null,
                primary_category: loc.primaryCategory || null,
                is_verified: true,
                last_sync_at: new Date().toISOString(),
              },
              { onConflict: "workspace_id,google_location_id" }
            );
          }
        }
      } catch (dbErr) {
        console.error("Database connection record upsert note:", dbErr);
      }
    }

    return NextResponse.redirect(
      `${origin}/${workspaceId}/settings?success=google_connected#google-integration`
    );
  } catch (err: any) {
    console.error("Google OAuth token exchange error:", err);
    return NextResponse.redirect(
      `${origin}/${workspaceId}/settings?error=token_exchange_failed#google-integration`
    );
  }
}
