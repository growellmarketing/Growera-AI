import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getRequestOrigin } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/server";

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
    const redirectUrl = `${origin}${next}`;
    const response = NextResponse.redirect(redirectUrl);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("cookie");
          if (!cookieHeader) return [];
          return cookieHeader.split("; ").map((c) => {
            const [name, ...val] = c.split("=");
            return { name, value: val.join("=") };
          });
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError && data?.user) {
        // Ensure user profile exists
        try {
          const adminSupabase = createAdminClient();
          const userName =
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            "Business Owner";

          await adminSupabase.from("profiles").upsert({
            id: data.user.id,
            full_name: userName,
          });

          // Check if user already has a workspace
          const { data: member } = await adminSupabase
            .from("workspace_members")
            .select("workspace_id")
            .eq("user_id", data.user.id)
            .limit(1)
            .maybeSingle();

          if (!member?.workspace_id) {
            // Automatically provision a personal business workspace
            const baseSlug =
              userName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") ||
              "workspace";
            const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

            const { data: newWs } = await adminSupabase
              .from("workspaces")
              .insert({
                name: `${userName}'s Workspace`,
                slug,
                business_type: "services",
                default_reply_tone: "professional",
                default_language: "en",
                created_by: data.user.id,
              })
              .select("id")
              .single();

            if (newWs?.id) {
              await adminSupabase.from("workspace_members").insert({
                workspace_id: newWs.id,
                user_id: data.user.id,
                role: "owner",
              });

              await adminSupabase.from("subscription_records").insert({
                workspace_id: newWs.id,
                plan_tier: "free_trial",
                status: "active",
                monthly_ai_replies_limit: 20,
                max_locations_limit: 3,
              });

              // Redirect directly to the newly created workspace dashboard!
              const targetUrl = `${origin}/${newWs.id}/dashboard`;
              const directResponse = NextResponse.redirect(targetUrl);
              // Copy all auth cookies to directResponse
              response.cookies.getAll().forEach((c) => {
                directResponse.cookies.set(c.name, c.value, c);
              });
              return directResponse;
            }
          } else {
            // Redirect directly to existing workspace dashboard!
            const targetUrl = `${origin}/${member.workspace_id}/dashboard`;
            const directResponse = NextResponse.redirect(targetUrl);
            response.cookies.getAll().forEach((c) => {
              directResponse.cookies.set(c.name, c.value, c);
            });
            return directResponse;
          }
        } catch (dbErr) {
          console.error("Workspace provision check error:", dbErr);
        }

        return response;
      }

      if (exchangeError) {
        console.error("exchangeCodeForSession error:", exchangeError.message);
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
        );
      }
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
