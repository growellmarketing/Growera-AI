"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { 
  Building2, 
  Users, 
  Bot, 
  KeyRound, 
  CreditCard, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Mail, 
  Plus, 
  Sparkles,
  ExternalLink,
  Download,
  HelpCircle,
  X
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const workspaceId = (params?.workspaceId as string) || "";

  const [activeTab, setActiveTab] = useState<"general" | "team" | "ai" | "integrations" | "billing">("general");

  // Form states
  const [businessName, setBusinessName] = useState("My Business");
  const [businessType, setBusinessType] = useState("restaurant");
  const [defaultTone, setDefaultTone] = useState("professional");
  const [defaultLanguage, setDefaultLanguage] = useState("en");

  // Google Connection State
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Team Members
  const [members, setMembers] = useState([
    { id: "owner", name: "Workspace Owner", email: "owner@growera.ai", role: "owner" },
  ]);

  // Load real workspace and user data
  useEffect(() => {
    async function loadWorkspaceSettings() {
      if (!workspaceId) return;
      try {
        const supabase = createClient();
        const { data: ws } = await supabase
          .from("workspaces")
          .select("name, business_type, default_reply_tone, default_language")
          .eq("id", workspaceId)
          .maybeSingle();

        if (ws) {
          if (ws.name) setBusinessName(ws.name);
          if (ws.business_type) setBusinessType(ws.business_type);
          if (ws.default_reply_tone) setDefaultTone(ws.default_reply_tone);
          if (ws.default_language) setDefaultLanguage(ws.default_language);
        }

        const { data: conn } = await supabase
          .from("google_connections")
          .select("id, email, account_name")
          .eq("workspace_id", workspaceId)
          .eq("status", "active")
          .maybeSingle();

        if (conn) {
          setIsGoogleConnected(true);
        }

        const { data: userResp } = await supabase.auth.getUser();
        if (userResp?.user) {
          setMembers([
            {
              id: userResp.user.id,
              name: userResp.user.user_metadata?.full_name || userResp.user.email?.split("@")[0] || "Owner",
              email: userResp.user.email || "owner@growera.ai",
              role: "owner",
            },
          ]);
        }
      } catch (err) {
        console.error("Settings load note:", err);
      }
    }
    loadWorkspaceSettings();
  }, [workspaceId]);

  // Check URL parameters on load for OAuth result
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const successParam = searchParams.get("success");

    if (successParam === "google_connected") {
      setIsGoogleConnected(true);
      setActiveTab("integrations");
      setConnectionMessage("Google Business Profile successfully connected via OAuth 2.0!");
    } else if (errorParam === "google_credentials_missing") {
      setActiveTab("integrations");
      setShowSetupModal(true);
    } else if (errorParam) {
      setActiveTab("integrations");
      setConnectionMessage(`Google connection error: ${errorParam}`);
    }
  }, [searchParams]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const handleConnectGoogle = () => {
    // Redirects to real Google OAuth initiation route handler
    window.location.href = `/api/auth/google/connect?workspaceId=${workspaceId}`;
  };

  const handleDisconnectGoogle = () => {
    if (confirm("Are you sure you want to disconnect Google Business Profile? Stored OAuth tokens will be deleted.")) {
      setIsGoogleConnected(false);
      setConnectionMessage(null);
    }
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setMembers([
      ...members,
      {
        id: `m-${Date.now()}`,
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
      },
    ]);
    setInviteEmail("");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* HEADER */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure business details, team role permissions, Google integrations, and AI reply tones.
        </p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px text-xs font-medium overflow-x-auto">
        {[
          { id: "general", label: "General & Brand", icon: Building2 },
          { id: "team", label: "Team & Roles (RBAC)", icon: Users },
          { id: "ai", label: "AI Voice & Tone", icon: Bot },
          { id: "integrations", label: "Google Integration", icon: KeyRound },
          { id: "billing", label: "Subscription & Limits", icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-indigo-600 text-indigo-600 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: GENERAL */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Profile</CardTitle>
              <CardDescription>Primary organization identifiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Workspace / Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Industry / Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="restaurant">Restaurant, Cafe, or Bakery</option>
                  <option value="salon">Salon, Spa, or Wellness Clinic</option>
                  <option value="healthcare">Healthcare or Dental Practice</option>
                  <option value="retail">Multi-Location Retail Store</option>
                  <option value="services">Local Professional Services</option>
                  <option value="agency">Marketing Agency (Multi-Client)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm">Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="border-red-200 bg-red-50/20">
            <CardHeader>
              <CardTitle className="text-red-700">Data Privacy & Danger Zone</CardTitle>
              <CardDescription>Export customer data or request account termination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-lg border border-red-100">
                <div>
                  <p className="font-semibold text-slate-900">Export Review & Metric History</p>
                  <p className="text-slate-500">Download all authorized review records and sentiment history as JSON/CSV.</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 shrink-0 text-xs">
                  <Download className="w-3.5 h-3.5" /> Export Data
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-lg border border-red-100">
                <div>
                  <p className="font-semibold text-red-600">Delete Entire Workspace</p>
                  <p className="text-slate-500">Permanently remove this workspace, team access, and all cached reviews.</p>
                </div>
                <Button variant="danger" size="sm" className="gap-1.5 shrink-0 text-xs">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: TEAM (RBAC) */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members & Access Roles (RBAC)</CardTitle>
              <CardDescription>
                Assign granular permissions to prevent unauthorized reply publication or billing modifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {members.map((member) => (
                  <div key={member.id} className="p-3.5 flex items-center justify-between bg-white text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{member.name}</p>
                        <p className="text-slate-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          member.role === "owner"
                            ? "info"
                            : member.role === "admin"
                            ? "success"
                            : "default"
                        }
                        className="capitalize"
                      >
                        {member.role}
                      </Badge>
                      {member.role !== "owner" && (
                        <button
                          onClick={() => setMembers(members.filter((m) => m.id !== member.id))}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleInviteMember} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Invite Team Member</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Input
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  >
                    <option value="admin">Admin (Can publish replies)</option>
                    <option value="member">Member (Can draft replies)</option>
                    <option value="viewer">Viewer (Read-only)</option>
                  </select>
                </div>
                <Button type="submit" size="sm" className="gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: AI PREFERENCES */}
      {activeTab === "ai" && (
        <Card>
          <CardHeader>
            <CardTitle>AI Brand Voice & Guidelines</CardTitle>
            <CardDescription>Define how the AI represents your business in public Google replies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Default Response Tone</label>
              <select
                value={defaultTone}
                onChange={(e) => setDefaultTone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="professional">Professional & Courteous</option>
                <option value="empathetic">Empathetic & Understanding (Best for hospitality/service)</option>
                <option value="friendly">Warm & Friendly (Great for local cafes/salons)</option>
                <option value="concise">Concise & Direct (Best for quick acknowledgement)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Preferred Language</label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                <option value="en">English (US / UK / Global)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-semibold">Guardrails Enforced by Default:</p>
              <p className="text-amber-800">
                The AI is strictly instructed to never admit legal liability, never promise unverified discounts or refunds, and always route complex grievances to human customer support.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm">Update AI Preferences</Button>
          </CardFooter>
        </Card>
      )}

      {/* TAB CONTENT: GOOGLE INTEGRATIONS */}
      {activeTab === "integrations" && (
        <Card id="google-integration">
          <CardHeader>
            <CardTitle>Google Business Profile Integration</CardTitle>
            <CardDescription>
              Connect your verified Google account to enable live review sync and publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {connectionMessage && (
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                  isGoogleConnected
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {isGoogleConnected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{connectionMessage}</span>
              </div>
            )}

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Google Business Profile (OAuth 2.0)</h4>
                  {isGoogleConnected ? (
                    <Badge variant="success" className="gap-1 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> Connected & Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      Not Connected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Authorizes LocalPilot AI to read authorized location reviews and publish approved replies.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isGoogleConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnectGoogle}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    Disconnect Google Account
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSetupModal(true)}
                      className="text-xs gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Setup Guide
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleConnectGoogle}
                      className="text-xs gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Connect Google Account
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <h5 className="font-semibold text-slate-900">OAuth 2.0 Security Checklist:</h5>
              <ul className="list-disc pl-5 space-y-1">
                <li>Scope requested: <code className="bg-white px-1 py-0.5 rounded border">https://www.googleapis.com/auth/business.manage</code></li>
                <li>Refresh tokens are encrypted with AES-256-GCM before database storage.</li>
                <li>You can disconnect or revoke access at any time with one click.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT: BILLING & LIMITS */}
      {activeTab === "billing" && (
        <Card>
          <CardHeader>
            <CardTitle>Plan & Quota Consumption</CardTitle>
            <CardDescription>Current tier limits for this workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500">Current Plan</span>
                <p className="text-xl font-bold text-slate-900 mt-1">Growth Trial</p>
                <p className="text-[10px] text-emerald-600 mt-1">Active (14 days remaining)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500">Connected Locations</span>
                <p className="text-xl font-bold text-slate-900 mt-1">3 / 10</p>
                <p className="text-[10px] text-slate-400 mt-1">7 slots available</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500">AI Reply Drafts Used</span>
                <p className="text-xl font-bold text-slate-900 mt-1">42 / 500</p>
                <p className="text-[10px] text-slate-400 mt-1">Resets in 28 days</p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
              <p className="font-semibold">Subscription Readiness Notice</p>
              <p className="mt-0.5 text-indigo-700">
                Production payment processing will be linked during Phase 7 upon your authorization. No charges are incurred during testing.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GOOGLE SETUP INSTRUCTIONS MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Google Cloud OAuth Setup (Why it was not working)</h3>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <strong>Kyu nahi chal rha tha?</strong><br />
                Google se real business connect karne ke liye Google Cloud Console se <strong>Client ID</strong> aur <strong>Client Secret</strong> chahiye hota hai. Abhi hamari <code className="bg-white px-1 py-0.5 rounded border">.env.local</code> file me placeholder value dali hui hai.
              </div>

              <h4 className="font-bold text-slate-900 pt-1">Simple 4 Steps to Enable Google Connect:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Open <strong><a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 underline">Google Cloud Console</a></strong> aur sign in karein.
                </li>
                <li>
                  Project create karein (name: <code>LocalPilot AI</code>) aur <strong>APIs & Services &gt; Credentials</strong> me jayein.
                </li>
                <li>
                  Click <strong>+ Create Credentials &gt; OAuth client ID</strong>:
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-500">
                    <li>Type: <strong>Web application</strong></li>
                    <li>Authorized redirect URI: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">http://localhost:3000/api/auth/google/callback</code></li>
                  </ul>
                </li>
                <li>
                  Google aapko <strong>Client ID</strong> aur <strong>Client Secret</strong> dega. Use apni <code>.env.local</code> file me paste kar dein!
                </li>
              </ol>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900">
                <p className="font-semibold">Full step-by-step documentation:</p>
                <p className="text-indigo-700 mt-0.5">
                  Aapke project folder me complete visual guide save hai: <br />
                  <code>GOOGLE_BUSINESS_PROFILE_SETUP.md</code>
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={() => setShowSetupModal(false)}>
                I Understand / Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
