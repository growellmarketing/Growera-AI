"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Building2, 
  MapPin, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { createWorkspaceAction } from "@/lib/actions/workspace";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get("businessName");
      if (name) {
        setBusinessName(name);
      }
    }
  }, []);
  const [businessType, setBusinessType] = useState<
    "restaurant" | "salon" | "healthcare" | "retail" | "services" | "agency"
  >("restaurant");
  const [defaultTone, setDefaultTone] = useState<
    "professional" | "empathetic" | "friendly" | "concise"
  >("professional");
  const [skipGoogle, setSkipGoogle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNext = async () => {
    if (step < 4) {
      if (step === 1 && !businessName.trim()) {
        setErrorMessage("Please enter a business or workspace name.");
        return;
      }
      setErrorMessage(null);
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const result = await createWorkspaceAction({
          name: businessName,
          business_type: businessType,
          default_reply_tone: defaultTone,
        });

        if (result.success && result.workspaceId) {
          window.location.href = `/${result.workspaceId}/dashboard`;
        } else {
          setErrorMessage(result.error || "Failed to create workspace. Please ensure you are signed in.");
          setIsSubmitting(false);
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to launch workspace.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-8">
        {/* LOGO & STEP INDICATOR */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              LocalPilot<span className="text-indigo-600">.ai</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Add New Business Workspace</h2>
          <p className="text-xs text-slate-500 mt-1">Step {step} of 4</p>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP CONTENT */}
        <Card className="shadow-lg border-slate-200">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: BUSINESS NAME & TYPE */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Business Details</h3>
                  <p className="text-xs text-slate-500">
                    What is the name of this brand, chain, or client business?
                  </p>
                </div>

                <Input
                  label="Business or Brand Name"
                  placeholder="e.g. Urban Cafe, Apex Dental, or Glow Salon"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Industry Category</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  >
                    <option value="restaurant">Restaurant / Cafe / Bakery</option>
                    <option value="salon">Salon / Spa / Beauty Wellness</option>
                    <option value="healthcare">Healthcare / Dental Clinic</option>
                    <option value="retail">Multi-Location Retail Store</option>
                    <option value="services">Local Professional Services</option>
                    <option value="agency">Marketing Agency Client</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: GOOGLE BUSINESS PROFILE CONNECTION */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Connect Google Business Profile</h3>
                  <p className="text-xs text-slate-500">
                    Authorize Google to sync locations and customer reviews for this business.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Google OAuth 2.0 Integration</p>
                      <p className="text-[11px] text-slate-500">Official business.manage API scope</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Connecting this business&apos;s Google account allows auto-importing all its physical outlets and live reviews. You can connect now or later in Settings.
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <Button size="sm" className="text-xs gap-1.5" onClick={() => setStep(3)}>
                      Connect in Settings Later
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setSkipGoogle(true);
                        setStep(3);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline"
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: AI BRAND VOICE */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Choose AI Brand Voice</h3>
                  <p className="text-xs text-slate-500">
                    Select how the AI should tone review responses for this specific business.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "professional", title: "Professional", desc: "Courteous, dignified, and structured" },
                    { id: "empathetic", title: "Empathetic", desc: "Warm, apologetic when needed, human" },
                    { id: "friendly", title: "Friendly & Casual", desc: "Enthusiastic, welcoming, upbeat" },
                    { id: "concise", title: "Short & Concise", desc: "Direct, thankful, quick to read" },
                  ].map((tone) => (
                    <div
                      key={tone.id}
                      onClick={() => setDefaultTone(tone.id as any)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        defaultTone === tone.id
                          ? "border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900">{tone.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tone.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & CONFIRMATION */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Review & Launch Business</h3>
                  <p className="text-xs text-slate-500">
                    Confirm your details to create this isolated workspace.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Business Name:</span>
                    <strong className="text-slate-900">{businessName || "My Business"}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Category:</span>
                    <strong className="text-slate-900 capitalize">{businessType}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Default AI Tone:</span>
                    <strong className="text-slate-900 capitalize">{defaultTone}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Data Isolation:</span>
                    <strong className="text-emerald-700">Dedicated Tenant (RLS Active)</strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Row-Level Security active. Separate client data is never mixed.</span>
                </div>
              </div>
            )}

            {/* BUTTON CONTROLS */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              {step > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(step - 1)}
                  className="gap-1 text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Button>
              ) : (
                <div></div>
              )}

              <Button
                size="sm"
                onClick={handleNext}
                isLoading={isSubmitting}
                className="gap-1.5 text-xs"
              >
                {step === 4 ? "Launch Business Workspace" : "Continue"} <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
