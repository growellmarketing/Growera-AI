-- ==============================================================================
-- LOCALPILOT AI — MIGRATION 0002: ROW LEVEL SECURITY (RLS) POLICIES
-- Enforces multi-tenant data isolation and RBAC directly in PostgreSQL
-- ==============================================================================

-- Helper function to check if current user is an active member of the workspace
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has specific roles in workspace
CREATE OR REPLACE FUNCTION public.has_workspace_role(ws_id UUID, allowed_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id
    AND user_id = auth.uid()
    AND role = ANY(allowed_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- 2. WORKSPACES RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their workspaces"
  ON public.workspaces FOR SELECT
  USING (public.is_workspace_member(id));

CREATE POLICY "Owners can update workspace details"
  ON public.workspaces FOR UPDATE
  USING (public.has_workspace_role(id, ARRAY['owner']));

CREATE POLICY "Owners can delete workspace"
  ON public.workspaces FOR DELETE
  USING (public.has_workspace_role(id, ARRAY['owner']));

-- 3. WORKSPACE_MEMBERS RLS
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view fellow members in same workspace"
  ON public.workspace_members FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins and Owners can manage members"
  ON public.workspace_members FOR INSERT
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));

CREATE POLICY "Owners can remove members"
  ON public.workspace_members FOR DELETE
  USING (public.has_workspace_role(workspace_id, ARRAY['owner']));

-- 4. GOOGLE_CONNECTIONS RLS (Protected: Never exposed to viewer/member)
ALTER TABLE public.google_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and Owners can view connection status"
  ON public.google_connections FOR SELECT
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));

CREATE POLICY "Admins and Owners can manage Google connections"
  ON public.google_connections FOR ALL
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));

-- 5. BUSINESS_LOCATIONS RLS
ALTER TABLE public.business_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view authorized locations"
  ON public.business_locations FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins and Owners can manage locations"
  ON public.business_locations FOR ALL
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));

-- 6. REVIEWS RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view reviews"
  ON public.reviews FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins can update review status"
  ON public.reviews FOR UPDATE
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));

-- 7. REVIEW_REPLY_DRAFTS RLS
ALTER TABLE public.review_reply_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view drafts"
  ON public.review_reply_drafts FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Members can create drafts"
  ON public.review_reply_drafts FOR INSERT
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin', 'member']));

CREATE POLICY "Members can update drafts"
  ON public.review_reply_drafts FOR UPDATE
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin', 'member']));

-- 8. PUBLISHED_REPLIES RLS
ALTER TABLE public.published_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view published replies"
  ON public.published_replies FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins and Owners can publish replies"
  ON public.published_replies FOR INSERT
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));

-- 9. AUDIT_LOGS RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));

-- 10. SUBSCRIPTION_RECORDS RLS
ALTER TABLE public.subscription_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view subscription tier"
  ON public.subscription_records FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Only Owners can modify subscription records"
  ON public.subscription_records FOR ALL
  USING (public.has_workspace_role(workspace_id, ARRAY['owner']));
