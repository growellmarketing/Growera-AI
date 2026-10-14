"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Star, 
  Smile, 
  Meh, 
  Frown, 
  Tag, 
  Info,
  Calendar
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AnalyticsPage() {
  const ratingDistribution = [
    { stars: 5, count: 104, percentage: 70 },
    { stars: 4, count: 28, percentage: 19 },
    { stars: 3, count: 8, percentage: 5 },
    { stars: 2, count: 5, percentage: 3 },
    { stars: 1, count: 3, percentage: 2 },
  ];

  const sentimentData = [
    { type: "Positive", percentage: 82, count: 121, color: "bg-emerald-500", icon: Smile },
    { type: "Neutral", percentage: 11, count: 17, color: "bg-slate-400", icon: Meh },
    { type: "Negative", percentage: 7, count: 10, color: "bg-red-500", icon: Frown },
  ];

  const commonThemes = [
    { topic: "Coffee Quality & Roasts", count: 64, sentiment: "positive", change: "+14%" },
    { topic: "Staff Friendliness & Speed", count: 42, sentiment: "positive", change: "+8%" },
    { topic: "Atmosphere & Seating", count: 31, sentiment: "neutral", change: "0%" },
    { topic: "Weekend Order Wait Time", count: 12, sentiment: "negative", change: "-4%" },
    { topic: "Bakery & Pastry Freshness", count: 19, sentiment: "positive", change: "+5%" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Sentiment Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated customer perception data from your verified Google Business Profile reviews.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Last 30 Days (Authorized API Dataset)</span>
        </div>
      </div>

      {/* RATING & SENTIMENT DISTRIBUTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Star Rating Distribution</CardTitle>
            <CardDescription>Breakdown across all authorized branches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-slate-700 flex items-center gap-1">
                  {item.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="w-16 text-right font-medium text-slate-600">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>AI Sentiment Classification</CardTitle>
            <CardDescription>Classified by OpenAI review sentiment model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {sentimentData.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.type} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <Icon className="w-5 h-5 mx-auto mb-1 text-slate-600" />
                    <p className="text-xl font-extrabold text-slate-900">{s.percentage}%</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{s.type}</p>
                    <p className="text-[10px] text-slate-400">{s.count} reviews</p>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Sentiment Health:</strong> 82% of customer sentiment is overwhelmingly positive. Negative reviews predominantly cite order wait times during peak weekend hours.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FREQUENTLY MENTIONED TOPICS & THEMES */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Mentioned Topics & Feedback Themes</CardTitle>
          <CardDescription>
            AI extracted clusters from customer comments to help store managers take operational action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonThemes.map((theme) => (
              <div
                key={theme.topic}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{theme.topic}</span>
                  <Badge
                    variant={
                      theme.sentiment === "positive"
                        ? "success"
                        : theme.sentiment === "negative"
                        ? "danger"
                        : "default"
                    }
                  >
                    {theme.sentiment}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Mentioned in {theme.count} reviews</span>
                  <span className={theme.change.startsWith("+") ? "text-emerald-600 font-semibold" : "text-slate-600"}>
                    {theme.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
