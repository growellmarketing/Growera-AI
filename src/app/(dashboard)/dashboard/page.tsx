import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardRoutePage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
      .single();

    if (membership?.workspace_id) {
      redirect(`/${membership.workspace_id}/dashboard`);
    }

    // If user has no workspace yet, route to onboarding to set up their business
    redirect("/onboarding");
  } catch (err: any) {
    // If redirect was thrown by Next.js, rethrow it
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    redirect("/login");
  }
}
