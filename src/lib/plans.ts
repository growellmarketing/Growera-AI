import { PlanConfig } from "@/types";

export const SAAS_PLANS: Record<string, PlanConfig> = {
  free_trial: {
    id: "free_trial",
    name: "Free Trial",
    priceMonthly: 0,
    maxLocations: 1,
    monthlyAiReplies: 20,
    features: [
      "1 Google Business Profile location",
      "20 AI reply drafts / mo",
      "Manual review sync",
      "Human-in-the-loop approval workflow",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceMonthly: 29,
    maxLocations: 3,
    monthlyAiReplies: 100,
    features: [
      "Up to 3 connected locations",
      "100 AI reply drafts / mo",
      "Daily automated sync",
      "Custom brand tones",
      "Sentiment classification",
      "2 team members",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceMonthly: 79,
    maxLocations: 10,
    monthlyAiReplies: 500,
    features: [
      "Up to 10 connected locations",
      "500 AI reply drafts / mo",
      "Hourly automated sync",
      "Multi-language response generator",
      "Feedback trend clustering",
      "5 team members with RBAC",
    ],
  },
  agency: {
    id: "agency",
    name: "Agency",
    priceMonthly: 199,
    maxLocations: 9999,
    monthlyAiReplies: 99999,
    features: [
      "Unlimited connected locations",
      "Unlimited AI drafts",
      "Unlimited client workspaces",
      "Full audit logs & webhooks",
      "Dedicated account manager",
    ],
  },
};

/**
 * Validates whether a workspace has remaining AI reply draft quota.
 */
export function canGenerateAiReply(
  planId: string,
  currentMonthUsage: number
): { allowed: boolean; remaining: number; limit: number } {
  const plan = SAAS_PLANS[planId] || SAAS_PLANS.free_trial;
  const remaining = Math.max(0, plan.monthlyAiReplies - currentMonthUsage);
  return {
    allowed: remaining > 0,
    remaining,
    limit: plan.monthlyAiReplies,
  };
}

/**
 * Validates whether a workspace can connect an additional location.
 */
export function canAddLocation(
  planId: string,
  currentLocationCount: number
): { allowed: boolean; remaining: number; limit: number } {
  const plan = SAAS_PLANS[planId] || SAAS_PLANS.free_trial;
  const remaining = Math.max(0, plan.maxLocations - currentLocationCount);
  return {
    allowed: remaining > 0,
    remaining,
    limit: plan.maxLocations,
  };
}
