import React from "react";
import Link from "next/link";
import { Check, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PricingPage() {
  const plans = [
    {
      name: "Free Trial",
      description: "Experience the platform risk-free for 14 days on 1 location.",
      price: 0,
      period: "14 days",
      locations: "1 location",
      aiReplies: "20 AI drafts",
      features: [
        "Official Google OAuth 2.0 sync",
        "1 Google Business location",
        "20 AI reply drafts / mo",
        "Human approval workflow",
        "Standard email support",
      ],
      cta: "Start Free Trial",
      href: "/register?plan=free_trial",
      popular: false,
    },
    {
      name: "Starter",
      description: "Ideal for single-location shops, clinics, and neighborhood cafes.",
      price: 29,
      period: "/ month",
      locations: "Up to 3 locations",
      aiReplies: "100 AI drafts / mo",
      features: [
        "Everything in Free Trial",
        "Up to 3 connected locations",
        "100 AI review replies / mo",
        "Custom brand reply tones",
        "Sentiment analysis & badges",
        "Daily automated sync",
        "2 team members",
      ],
      cta: "Choose Starter",
      href: "/register?plan=starter",
      popular: false,
    },
    {
      name: "Growth",
      description: "For expanding multi-branch restaurants, salons, and franchise chains.",
      price: 79,
      period: "/ month",
      locations: "Up to 10 locations",
      aiReplies: "500 AI drafts / mo",
      features: [
        "Everything in Starter",
        "Up to 10 connected locations",
        "500 AI review replies / mo",
        "Multi-language response generation",
        "Recurring issue trend detection",
        "Hourly automated sync",
        "5 team members with RBAC",
        "Priority customer support",
      ],
      cta: "Choose Growth",
      href: "/register?plan=growth",
      popular: true,
    },
    {
      name: "Agency",
      description: "For marketing agencies managing multiple business clients.",
      price: 199,
      period: "/ month",
      locations: "Unlimited locations",
      aiReplies: "Unlimited AI drafts*",
      features: [
        "Everything in Growth",
        "Unlimited client workspaces",
        "Client permission boundaries",
        "Audit log exports",
        "Real-time review webhooks",
        "Dedicated account manager",
        "Custom billing invoicing",
      ],
      cta: "Contact Sales",
      href: "/register?plan=agency",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Simple, Transparent Pricing
            </span>
            <h1 className="mt-3 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Invest in Your Local Search Reputation
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Pick the plan that matches your business size. Upgrade or cancel anytime. All plans include official Google OAuth 2.0 integration and human-in-the-loop AI review draft controls.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl bg-white border p-6 shadow-sm transition-all ${
                  plan.popular
                    ? "border-indigo-600 ring-2 ring-indigo-600/20 shadow-xl"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.description}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                    <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex-1">
                  <div className="space-y-1 mb-4 text-xs font-semibold text-slate-700">
                    <p className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50/60 p-2 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5" /> {plan.locations}
                    </p>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-600">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link href={plan.href} className="w-full block">
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing FAQ Note */}
          <div className="mt-16 bg-white border border-slate-200 rounded-xl p-6 max-w-3xl mx-auto flex items-start gap-4 text-xs text-slate-600">
            <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Billing & Fair Usage Notice</h4>
              <p>
                During Phase 1 & 2 development, subscription limits are configured in preview mode. Live credit card processing will only be activated following user authorization. Quotas are strictly enforced on the server.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
