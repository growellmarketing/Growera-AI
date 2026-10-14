"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateWorkspaceSchema } from "@/lib/validations";

export interface CreateWorkspaceResult {
  success: boolean;
  workspaceId?: string;
  error?: string;
}

/**
 * Server Action to create a new multi-tenant business workspace.
 * Automatically assigns the creator as the 'owner' in workspace_members.
 */
export async function createWorkspaceAction(formData: {
  name: string;
  business_type: "restaurant" | "salon" | "healthcare" | "retail" | "services" | "agency";
  default_reply_tone?: "professional" | "empathetic" | "friendly" | "concise";
  default_language?: string;
}): Promise<CreateWorkspaceResult> {
  try {
    const validated = CreateWorkspaceSchema.parse({
      name: formData.name,
      business_type: formData.business_type,
      default_reply_tone: formData.default_reply_tone || "professional",
      default_language: formData.default_language || "en",
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Generate unique slug
    const baseSlug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Insert workspace
    const { data: workspace, error: wsError } = await supabase
      .from("workspaces")
      .insert({
        name: validated.name,
        slug: slug,
        business_type: validated.business_type,
        default_reply_tone: validated.default_reply_tone,
        default_language: validated.default_language,
        created_by: user?.id || null,
      })
      .select("id")
      .single();

    if (wsError || !workspace) {
      console.error("Workspace creation database error:", wsError);
      return { success: false, error: wsError?.message || "Failed to create workspace in database." };
    }

    // If user is authenticated, register them as the owner in workspace_members
    if (user?.id) {
      // Ensure profile exists
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || "Workspace Admin",
      });

      await supabase.from("workspace_members").insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: "owner",
      });
    }

    // Initialize default free trial subscription record
    await supabase.from("subscription_records").insert({
      workspace_id: workspace.id,
      plan_tier: "free_trial",
      status: "active",
      monthly_ai_replies_limit: 20,
      max_locations_limit: 3,
    });

    return {
      success: true,
      workspaceId: workspace.id,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred while creating the workspace.",
    };
  }
}
