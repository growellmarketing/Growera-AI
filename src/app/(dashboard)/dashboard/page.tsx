import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardRoutePage() {
  let targetWorkspaceId: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Look up user's active workspaces
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (membership?.workspace_id) {
      targetWorkspaceId = membership.workspace_id;
    } else {
      // Auto-provision a default workspace for the user
      const adminSupabase = createAdminClient();
      const userName =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Business Owner";
      const baseSlug =
        userName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") ||
        "workspace";
      const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      await adminSupabase.from("profiles").upsert({
        id: user.id,
        full_name: userName,
      });

      const { data: newWs } = await adminSupabase
        .from("workspaces")
        .insert({
          name: `${userName}'s Workspace`,
          slug,
          business_type: "services",
          default_reply_tone: "professional",
          default_language: "en",
          created_by: user.id,
        })
        .select("id")
        .single();

      if (newWs?.id) {
        await adminSupabase.from("workspace_members").insert({
          workspace_id: newWs.id,
          user_id: user.id,
          role: "owner",
        });

        await adminSupabase.from("subscription_records").insert({
          workspace_id: newWs.id,
          plan_tier: "free_trial",
          status: "active",
          monthly_ai_replies_limit: 20,
          max_locations_limit: 3,
        });

        targetWorkspaceId = newWs.id;
      }
    }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Dashboard routing error:", err);
    redirect("/login");
  }

  if (targetWorkspaceId) {
    redirect(`/${targetWorkspaceId}/dashboard`);
  }

  redirect("/login");
}
