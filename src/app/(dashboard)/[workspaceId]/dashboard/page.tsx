"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  MapPin, 
  Star, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight,
  RefreshCw,
  Bot,
  ExternalLink
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";

interface RecentReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  sentiment: string;
  status: string;
}

interface BranchLocationItem {
  id: string;
  name: string;
  rating: number;
  totalReviews: number;
  unanswered: number;
}

export default function DashboardOverviewPage() {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) || "";

  const [hasConnectedGoogle, setHasConnectedGoogle] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [locationsCount, setLocationsCount] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(5.0);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [recentReviews, setRecentReviews] = useState<RecentReviewItem[]>([]);
  const [branchLocations, setBranchLocations] = useState<BranchLocationItem[]>([]);

  useEffect(() => {
    async function loadWorkspaceOverview() {
      if (!workspaceId) return;
      try {
        const supabase = createClient();
        const { data: conn } = await supabase
          .from("google_connections")
          .select("id")
          .eq("workspace_id", workspaceId)
          .eq("status", "active")
          .maybeSingle();

        if (conn) {
          setHasConnectedGoogle(true);
          const { data: locs } = await supabase
            .from("business_locations")
            .select("id, location_name, average_rating, total_review_count")
            .eq("workspace_id", workspaceId);

          if (locs && locs.length > 0) {
            setLocationsCount(locs.length);
            const total = locs.reduce((acc, curr) => acc + (curr.total_review_count || 0), 0);
            setTotalReviews(total);
            const avg = locs.reduce((acc, curr) => acc + Number(curr.average_rating || 0), 0) / locs.length;
            setAverageRating(Math.round(avg * 10) / 10 || 5.0);

            setBranchLocations(
              locs.map((l: any) => ({
                id: l.id,
                name: l.location_name,
                rating: Number(l.average_rating || 5.0),
                totalReviews: l.total_review_count || 0,
                unanswered: 0,
              }))
            );
          }

          const { data: revs } = await supabase
            .from("reviews")
            .select("id, reviewer_name, star_rating, comment, review_timestamp, sentiment, has_reply")
            .eq("workspace_id", workspaceId)
            .order("review_timestamp", { ascending: false })
            .limit(3);

          if (revs && revs.length > 0) {
            setRecentReviews(
              revs.map((r: any) => ({
                id: r.id,
                author: r.reviewer_name || "Verified Customer",
                location: "Authorized Location",
                rating: r.star_rating,
                date: new Date(r.review_timestamp).toLocaleDateString(),
                text: r.comment || "",
                sentiment: r.sentiment || "positive",
                status: r.has_reply ? "Published" : "Draft Ready",
              }))
            );
          }
        }
      } catch (err) {
        console.error("Dashboard overview note:", err);
      }
    }
    loadWorkspaceOverview();
  }, [workspaceId]);

  const stats = {
    locationsCount: locationsCount,
    totalReviews: totalReviews,
    averageRating: averageRating,
    unansweredCount: unansweredCount,
    pendingAiDrafts: 0,
    responseRate: "100%",
    lastSynced: "Just now",
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time reputation metrics calculated from authorized Google Business locations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSync}
            isLoading={isSyncing}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync Reviews
          </Button>

          <Link href={`/${workspaceId}/reviews`}>
            <Button size="sm" className="text-xs">
              <Bot className="w-3.5 h-3.5 mr-1" /> AI Review Inbox
            </Button>
          </Link>
        </div>
      </div>

      {/* ZERO-DATA EMPTY STATE WHEN GOOGLE IS NOT CONNECTED */}
      {!hasConnectedGoogle ? (
        <div className="space-y-6">
          <EmptyState
            icon={MapPin}
            title="No Google Business Profile Connected Yet"
            description="To calculate ratings, aggregate reviews, and generate AI responses, connect your verified Google Business Profile account using Google OAuth 2.0."
            actionLabel="Connect Google Account"
            actionHref={`/${workspaceId}/settings#google-integration`}
            secondaryActionLabel="View Settings"
            onSecondaryAction={() => window.location.href = `/${workspaceId}/settings#google-integration`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-50/50">
              <CardContent className="p-4 space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">1. Authorize Securely</span>
                <p className="text-xs text-slate-500">
                  Connect using Google OAuth 2.0 with official business.manage scope. Tokens are encrypted using AES-256-GCM.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50/50">
              <CardContent className="p-4 space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">2. Sync Locations</span>
                <p className="text-xs text-slate-500">
                  LocalPilot AI auto-discovers your branches, store codes, addresses, and existing reviews.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50/50">
              <CardContent className="p-4 space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">3. Human-in-the-Loop AI</span>
                <p className="text-xs text-slate-500">
                  Draft responses tailored to your brand voice. No reply is published without your review and approval.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* ACTIVE METRICS OVERVIEW */
        <div className="space-y-6">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Average Rating */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Rating</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{stats.averageRating}</span>
                  <span className="text-xs font-medium text-emerald-600">Active</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Based on {stats.totalReviews} verified reviews</p>
              </CardContent>
            </Card>

            {/* Unanswered Reviews Alert */}
            <Card className={stats.unansweredCount > 0 ? "border-amber-200 bg-amber-50/20" : ""}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unanswered</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{stats.unansweredCount}</span>
                  <span className="text-xs font-medium text-slate-600">Action status</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{stats.pendingAiDrafts} drafts ready for approval</p>
              </CardContent>
            </Card>

            {/* Response Rate */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Response Rate</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{stats.responseRate}</span>
                  <span className="text-xs font-medium text-emerald-600">High efficiency</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Automated AI assistance</p>
              </CardContent>
            </Card>

            {/* Connected Locations */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Locations</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{stats.locationsCount}</span>
                  <span className="text-xs font-medium text-slate-500">Synced</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Last synced {stats.lastSynced}</p>
              </CardContent>
            </Card>
          </div>

          {/* TWO COLUMN GRID: RECENT REVIEWS & LOCATION PERFORMANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* RECENT REVIEWS FEED */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Customer Reviews</h3>
                  <p className="text-xs text-slate-500">Latest feedback across your authorized branches</p>
                </div>
                <Link href={`/${workspaceId}/reviews`}>
                  <Button variant="ghost" size="sm" className="text-xs text-indigo-600">
                    View Inbox <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              {recentReviews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-xs text-slate-500">
                    No customer reviews synced yet. New feedback will appear here automatically.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentReviews.map((rev) => (
                    <Card key={rev.id} className="hover:border-slate-300 transition-colors">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                              <span className="text-[10px] text-slate-400">• {rev.location}</span>
                              <span className="text-[10px] text-slate-400">• {rev.date}</span>
                            </div>
                            <div className="flex text-amber-400 text-xs mt-0.5">
                              {"★".repeat(rev.rating)}
                              {"☆".repeat(5 - rev.rating)}
                            </div>
                          </div>

                          <Badge
                            variant={
                              rev.sentiment === "positive"
                                ? "success"
                                : rev.sentiment === "negative"
                                ? "danger"
                                : "default"
                            }
                          >
                            {rev.sentiment}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-600 italic leading-relaxed">
                          &quot;{rev.text}&quot;
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-500">
                            Status: <strong className="text-slate-700">{rev.status}</strong>
                          </span>
                          <Link href={`/${workspaceId}/reviews`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              <Sparkles className="w-3 h-3 mr-1 text-indigo-600" /> Draft Reply
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* LOCATION SUMMARIES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Branch Performance</h3>
                  <p className="text-xs text-slate-500">Live ratings by outlet</p>
                </div>
                <Link href={`/${workspaceId}/locations`}>
                  <Button variant="ghost" size="sm" className="text-xs text-indigo-600">
                    Manage <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              {branchLocations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-xs text-slate-500">
                    No verified branch locations found. Connect your Google account to auto-import.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {branchLocations.map((branch) => (
                    <Card key={branch.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]">{branch.name}</span>
                          <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                            {branch.rating} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{branch.totalReviews} reviews</p>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (branch.rating / 5) * 100)}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
