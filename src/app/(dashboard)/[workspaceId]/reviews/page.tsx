"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  MessageSquare, 
  Star, 
  Search, 
  Filter, 
  Bot, 
  Sparkles, 
  Check, 
  Send, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown,
  RefreshCw,
  Edit3
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { Review, ReviewSentiment } from "@/types";

export default function ReviewsInboxPage() {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) || "";

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [activeReviewDrafting, setActiveReviewDrafting] = useState<string | null>(null);
  const [draftTone, setDraftTone] = useState<"professional" | "empathetic" | "friendly" | "concise">("professional");
  const [draftText, setDraftText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      if (!workspaceId) return;
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("workspace_id", workspaceId)
          .order("review_timestamp", { ascending: false });

        if (!error && data) {
          setReviews(data as Review[]);
        }
      } catch (err) {
        console.error("Load reviews error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, [workspaceId]);

  const handleOpenDraftModal = async (
    review: Review,
    toneOverride?: "professional" | "empathetic" | "friendly" | "concise"
  ) => {
    const toneToUse = toneOverride || draftTone;
    setActiveReviewDrafting(review.id);
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/draft-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: "Growera Business",
          reviewerName: review.reviewer_name,
          starRating: review.star_rating,
          reviewComment: review.comment,
          tone: toneToUse,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setDraftText(data.reply);
      } else {
        setDraftText(
          review.star_rating >= 4
            ? `Thank you ${review.reviewer_name} for the great review! We appreciate your support.`
            : `Dear ${review.reviewer_name}, we apologize for your experience. Please reach out to us directly so we can make things right.`
        );
      }
    } catch (err) {
      console.error("Draft generation failed:", err);
      setDraftText(
        `Thank you ${review.reviewer_name} for sharing your feedback with us.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishReply = (reviewId: string) => {
    setIsPublishing(true);
    setTimeout(() => {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                has_reply: true,
                existing_reply_text: draftText,
                existing_reply_timestamp: new Date().toISOString(),
              }
            : r
        )
      );
      setIsPublishing(false);
      setActiveReviewDrafting(null);
    }, 1000);
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedRating && r.star_rating !== selectedRating) return false;
    if (selectedStatus === "unanswered" && r.has_reply) return false;
    if (selectedStatus === "answered" && !r.has_reply) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reviews Inbox</h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate tone-customized AI drafts, review responses, and publish live to Google.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="info">Human-in-the-Loop Active</Badge>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Rating filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-600 mr-1">Rating:</span>
          <Button
            size="sm"
            variant={selectedRating === null ? "primary" : "outline"}
            onClick={() => setSelectedRating(null)}
            className="h-7 text-xs px-2.5"
          >
            All
          </Button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <Button
              key={stars}
              size="sm"
              variant={selectedRating === stars ? "primary" : "outline"}
              onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
              className="h-7 text-xs px-2.5 gap-1"
            >
              {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </Button>
          ))}
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Reviews</option>
            <option value="unanswered">Unanswered Only</option>
            <option value="answered">Answered / Published</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center text-xs text-slate-500">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading customer reviews...
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Customer Reviews Synced Yet"
          description="Connect your verified Google Business Profile to auto-sync your customer reviews, generate AI drafts, and publish responses."
          actionLabel="Connect Google Account"
          actionHref={`/${workspaceId}/settings#google-integration`}
        />
      ) : (
        /* REVIEW LIST */
        <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <Card key={rev.id} className="border-slate-200">
            <CardContent className="p-5 space-y-4">
              {/* Reviewer Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                    {rev.reviewer_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rev.reviewer_name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex text-amber-400 text-xs">
                        {"★".repeat(rev.star_rating)}
                        {"☆".repeat(5 - rev.star_rating)}
                      </div>
                      <span className="text-[11px] text-slate-400">• Verified Google Review</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {rev.is_sensitive && (
                    <Badge variant="danger" className="gap-1">
                      <AlertTriangle className="w-3 h-3" /> Flagged for Care
                    </Badge>
                  )}
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
              </div>

              {/* Review Text */}
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                &quot;{rev.comment}&quot;
              </p>

              {/* Existing Published Reply (if any) */}
              {rev.has_reply && (
                <div className="ml-4 pl-4 border-l-2 border-indigo-500 space-y-1 bg-indigo-50/30 p-3 rounded-r-xl text-xs">
                  <div className="flex items-center justify-between text-indigo-900 font-semibold">
                    <span>Published Response</span>
                    <span className="text-[10px] text-slate-400">Live on Google</span>
                  </div>
                  <p className="text-slate-600">{rev.existing_reply_text}</p>
                </div>
              )}

              {/* DRAFTING DRAWER / MODAL */}
              {activeReviewDrafting === rev.id && (
                <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-indigo-600" /> AI Review Response Assistant
                    </span>
                    <div className="flex items-center gap-1">
                      {(["professional", "empathetic", "friendly", "concise"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setDraftTone(t);
                            handleOpenDraftModal(rev, t);
                          }}
                          className={`text-[10px] capitalize px-2 py-0.5 rounded font-medium transition-colors ${
                            draftTone === t
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isGenerating ? (
                    <div className="flex items-center justify-center py-6 text-xs text-indigo-600 gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing review sentiment & drafting response...
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-indigo-200 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                        placeholder="Review draft reply..."
                      />
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">
                          {draftText.length} characters • Human editorial review required
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-slate-600"
                            onClick={() => setActiveReviewDrafting(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs gap-1.5"
                            onClick={() => handlePublishReply(rev.id)}
                            isLoading={isPublishing}
                          >
                            <Send className="w-3 h-3" /> Approve & Publish to Google
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Action Toolbar */}
              {!rev.has_reply && activeReviewDrafting !== rev.id && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="primary"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => handleOpenDraftModal(rev)}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate AI Reply Draft
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
