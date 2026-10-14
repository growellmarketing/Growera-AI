"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, 
  LayoutDashboard, 
  MapPin, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Building2, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  // Extract active workspace ID from URL path dynamically
  const segments = pathname.split("/").filter(Boolean);
  const currentWorkspaceId =
    segments[0] && segments[0] !== "dashboard" ? segments[0] : "";

  const [workspaceName, setWorkspaceName] = useState("My Business");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("Business Owner");

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.email) setUserEmail(user.email);
          if (user.user_metadata?.full_name) {
            setUserName(user.user_metadata.full_name);
          } else if (user.email) {
            setUserName(user.email.split("@")[0]);
          }

          if (currentWorkspaceId && currentWorkspaceId !== "demo-workspace") {
            const { data: ws } = await supabase
              .from("workspaces")
              .select("name")
              .eq("id", currentWorkspaceId)
              .maybeSingle();

            if (ws?.name) {
              setWorkspaceName(ws.name);
            }
          }
        }
      } catch (err) {
        console.error("Layout data load note:", err);
      }
    }
    loadData();
  }, [currentWorkspaceId]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const activeWorkspace = {
    id: currentWorkspaceId,
    name: workspaceName,
    role: "Owner",
    plan: "Growth Trial",
  };

  const navItems = [
    {
      name: "Overview",
      href: `/${currentWorkspaceId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Locations",
      href: `/${currentWorkspaceId}/locations`,
      icon: MapPin,
    },
    {
      name: "Reviews Inbox",
      href: `/${currentWorkspaceId}/reviews`,
      icon: MessageSquare,
      badge: "3", // Unanswered reviews count
    },
    {
      name: "Analytics & Sentiment",
      href: `/${currentWorkspaceId}/analytics`,
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: `/${currentWorkspaceId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* MOBILE TOPBAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">LocalPilot.ai</span>
        </Link>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Workspace Brand / Selector */}
        <div className="p-4 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 mb-5 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              LocalPilot<span className="text-indigo-400">.ai</span>
            </span>
          </Link>

          {/* Active Workspace Switcher */}
          <div className="relative">
            <button
              onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 truncate">
                  <p className="text-xs font-semibold text-white truncate">{activeWorkspace.name}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    Role: <span className="text-indigo-300 font-medium">{activeWorkspace.role}</span>
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {workspaceDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 space-y-1">
                <p className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Your Workspaces
                </p>
                <div className="px-2 py-1.5 rounded-lg bg-slate-700/60 text-xs font-medium text-white flex items-center justify-between">
                  <span>{activeWorkspace.name}</span>
                  <span className="text-[10px] text-emerald-400">Active</span>
                </div>
                <Link
                  href="/onboarding"
                  className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-indigo-300 hover:text-white hover:bg-slate-700/40 rounded-lg"
                  onClick={() => setWorkspaceDropdownOpen(false)}
                >
                  <Plus className="w-3.5 h-3.5" /> Create new workspace
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-indigo-300 text-xs font-bold flex items-center justify-center">
                {userName[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate max-w-[130px]">{userName}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{userEmail || "Signed in"}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{activeWorkspace.plan}</span>
            <Link href={`/${currentWorkspaceId}/settings`} className="text-indigo-400 hover:underline font-medium">
              Upgrade
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Connection Health Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              <strong>Google Business Profile Integration:</strong> Ready for OAuth linking. Connect your verified locations to begin real-time review sync.
            </span>
          </div>
          <Link
            href={`/${currentWorkspaceId}/settings#google-integration`}
            className="inline-flex items-center gap-1 font-semibold text-amber-900 hover:underline shrink-0"
          >
            Connect Account <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
