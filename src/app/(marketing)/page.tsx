import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Building2, 
  Store, 
  UtensilsCrossed, 
  Stethoscope, 
  Scissors,
  ArrowRight,
  Star,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-indigo-50/50 via-white to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Local Business Intelligence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Turn Google Reviews into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Loyal Customers</span> with AI
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Connect multiple Google Business Profile locations, generate empathetic, brand-tailored review responses in seconds, and detect recurring customer issues before they hurt your rating.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-200">
                    Start 14-Day Free Trial
                  </Button>
                </Link>
                <Link href="/how-it-works" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore How It Works
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Official Google OAuth 2.0
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Human approval workflow
                </span>
              </div>
            </div>

            {/* PRODUCT HERO PREVIEW CARD */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-slate-900/5 p-2 sm:p-4 shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <span className="ml-2 text-xs font-medium text-slate-500">LocalPilot AI Dashboard — Multi-Location Inbox</span>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">Platform Preview</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/40">
                  {/* Review Mock Item 1 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          RS
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">Rahul Sharma</p>
                          <p className="text-[10px] text-slate-500">Connaught Place Outlet • 3h ago</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {"★".repeat(5)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      &quot;Amazing coffee and warm staff! The croissant was freshly baked. Will definitely visit again with colleagues.&quot;
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Positive Sentiment</span>
                      <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Draft Ready
                      </span>
                    </div>
                  </div>

                  {/* Review Mock Item 2 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                          AP
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">Ananya Patel</p>
                          <p className="text-[10px] text-slate-500">Indiranagar Branch • 1d ago</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {"★".repeat(2)}<span className="text-slate-300">{"★".repeat(3)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      &quot;The waiting time was over 40 minutes even with a reservation. Staff was apologetic but disorganized.&quot;
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Service Delay</span>
                      <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Empathetic Draft
                      </span>
                    </div>
                  </div>

                  {/* Summary Metric Column */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Authorized Real-Time Stats</p>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900">4.8</span>
                        <div className="flex text-amber-400 text-sm">{"★".repeat(5)}</div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Calculated across 12 authorized locations</p>
                    </div>
                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Response Rate</span>
                        <span className="font-semibold text-slate-900">96.4%</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Avg. Reply Time</span>
                        <span className="font-semibold text-slate-900">&lt; 15 mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES SECTION */}
        <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Everything You Need</h2>
              <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Built for High-Growth Local Businesses & Agencies
              </p>
              <p className="mt-4 text-slate-600 text-base">
                Stop jumping between dozens of Google accounts. Manage all physical locations from one unified dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Multi-Location Sync</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Authorize your Google Business Profile via official OAuth 2.0. Automatically discover branches, store codes, addresses, and customer reviews.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">AI Review Reply Assistant</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generate thoughtful, empathetic replies in seconds. Choose from Professional, Empathetic, Friendly, or Concise tones in any language.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Human-in-the-Loop Safety</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  No AI reply is ever published without explicit approval. Review, edit, or regenerate drafts. Safeguards prevent promising unverified refunds or discounts.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Sentiment & Trend Analytics</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Categorize reviews into positive, neutral, and negative sentiment. Identify recurring complaint topics (cleanliness, staff, delays) before they escalate.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Multi-Tenant RBAC</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Separate client workspaces with granular roles (Owner, Admin, Member, Viewer). Keep team permissions secure with PostgreSQL Row-Level Security.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Agency Client Management</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Manage hundreds of independent client brands from one login. Assign account managers only to the workspaces they are authorized to manage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TARGET CUSTOMER PERSONAS */}
        <section id="solutions" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Industry Solutions</h2>
              <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Tailored for Businesses Where Reputation Drives Foot Traffic
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900">Restaurants & Cafes</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Address dine-in and food delivery feedback quickly. Compliment returning foodies and de-escalate order delays with warm empathy.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900">Clinics & Healthcare</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Respond to patient reviews with strictly HIPAA/privacy-compliant responses that acknowledge care without disclosing private health details.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Scissors className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900">Salons & Spas</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Highlight stylist mentions, celebrate positive hair and spa transformations, and maintain a pristine 5-star local brand image.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900">Multi-Branch Retail</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monitor branch-level performance across 5, 20, or 200 physical stores. Spot store manager trends and inventory issues in real time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Common Questions</h2>
              <p className="mt-2 text-3xl font-bold text-slate-900">Frequently Asked Questions</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">Does LocalPilot AI publish replies to Google automatically?</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  By default, <strong>no</strong>. All AI-generated replies are saved as editable drafts. A team member with Admin or Owner permissions must review and approve the draft before it is published to Google. This guarantees full control over your brand voice.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">How does LocalPilot AI connect to my Google Business Profile?</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  We use Google&apos;s official OAuth 2.0 authorization code flow with the official <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">business.manage</code> scope. We never ask for or store your Google password. Your refresh tokens are encrypted at rest with military-grade AES-256-GCM encryption.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">Can marketing agencies manage multiple client brands?</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Yes! Our multi-tenant architecture allows you to create separate workspaces for each client brand. Team members and clients only have access to the specific workspaces they are granted permission for.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">What happens if a customer writes an aggressive or false review?</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Our AI engine automatically flags reviews containing potential legal threats, harassment, or severe hygiene claims for special human handling. The assistant will propose a calm, legally protective de-escalation response that directs the reviewer offline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-20 bg-indigo-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Upgrade Your Google Business Reputation?
            </h2>
            <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto">
              Join local business owners and multi-location managers who use LocalPilot AI to reply faster, increase customer satisfaction, and climb Google local rankings.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg">
                  Start Your 14-Day Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-indigo-300 text-white hover:bg-indigo-700">
                  View Transparent Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
