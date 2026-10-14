import React from "react";
import Link from "next/link";
import { 
  KeyRound, 
  RefreshCw, 
  Bot, 
  Send, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      icon: KeyRound,
      title: "Authorize Google Business Profile",
      description: "Sign in with your Google account through our secure OAuth 2.0 flow. LocalPilot AI requests the standard business.manage scope to discover your verified business locations and read customer reviews. We never ask for or store your Google password.",
      highlight: "Bank-Grade Token Security: Refresh tokens are encrypted with AES-256-GCM.",
    },
    {
      number: "02",
      icon: RefreshCw,
      title: "Automatic Multi-Location Review Sync",
      description: "Whether you have 1 cafe or 50 retail outlets across the country, LocalPilot AI aggregates all your customer reviews, ratings, and existing replies into a single unified dashboard.",
      highlight: "Idempotent Data Sync: Eliminates duplicate reviews and tracks sync timestamps.",
    },
    {
      number: "03",
      icon: Bot,
      title: "AI Review Reply Generation",
      description: "Our server-side AI analyzes the customer's star rating, specific comments, and sentiment. It drafts a personalized response tailored to your chosen brand tone (Professional, Empathetic, Friendly, or Concise).",
      highlight: "Safety Guardrails: AI is strictly prohibited from inventing discounts or admitting legal liability.",
    },
    {
      number: "04",
      icon: Send,
      title: "Human Approval & One-Click Publishing",
      description: "No reply is sent blindly. Your store manager, admin, or agency account manager can preview the draft, edit any phrasing, and click 'Publish to Google'. The approved reply updates on Google Maps and Google Search instantly.",
      highlight: "Human-in-the-Loop: You always retain full editorial control over your public presence.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Simple 4-Step Process
            </span>
            <h1 className="mt-3 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              How LocalPilot AI Works
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Designed specifically for multi-location businesses, restaurants, clinics, and marketing agencies who want to maintain an active 5-star reputation without spending hours typing manual replies.
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col md:flex-row items-start gap-8 p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 md:flex-col md:items-start shrink-0">
                    <span className="text-4xl font-black text-indigo-600/30">{step.number}</span>
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {step.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to action */}
          <div className="mt-16 text-center bg-indigo-50 border border-indigo-200 rounded-2xl p-8 sm:p-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Ready to automate your review replies securely?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
              Connect your first location in under 2 minutes. Start with our 14-day risk-free trial.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
