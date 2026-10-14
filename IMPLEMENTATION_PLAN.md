# LocalPilot AI — Implementation Plan

This document outlines the detailed roadmap for building LocalPilot AI, an enterprise-grade multi-tenant AI business presence and review management platform.

---

## Phase 0: Foundations, Architecture & Documentation (COMPLETED)
- [x] Inspect workspace directory and verify developer toolchains (Node.js v24.19.0, npm 11.17.0).
- [x] Create comprehensive documentation suite:
  - `README.md`, `PROJECT_STATUS.md`, `IMPLEMENTATION_PLAN.md`, `ARCHITECTURE.md`
  - `DATABASE_SCHEMA.md`, `SECURITY.md`, `ENVIRONMENT_VARIABLES.md`
  - `GOOGLE_BUSINESS_PROFILE_SETUP.md`, `OPENAI_SETUP.md`
  - `DEPLOYMENT.md`, `TESTING.md`, `TROUBLESHOOTING.md`, `CHANGELOG.md`
- [x] Define project boundaries, technology stack, and zero-fabrication principles.

---

## Phase 1: Application Structure, Design System & Frontend Experience (IN PROGRESS)
- [ ] Initialize Next.js 15 App Router structure with TypeScript and Tailwind CSS.
- [ ] Build reusable UI Component Library:
  - Buttons, Inputs, Dialogs/Modals, Badges, Tabs, Tooltips, Cards, Dropdowns.
- [ ] Construct the Public Marketing Site:
  - Landing page (Hero, features, benefits for shops/restaurants/salons/agencies).
  - Pricing page with tier comparisons (Free Trial, Starter, Growth, Agency).
  - How It Works page with workflow visualization.
  - FAQ page addressing Google integration, AI review replies, and data security.
  - Legal & Compliance pages: Privacy Policy, Terms of Service, Data Deletion Policy.
- [ ] Build the Multi-Tenant Dashboard Shell:
  - Workspace switcher header with member role indicators.
  - Responsive sidebar with active navigation states.
  - Zero-data state screens with clear setup banners and Google connection triggers.
- [ ] Create Review Inbox & Location Management interfaces:
  - Review feed with rating filters (1-5 stars), sentiment badges, response status.
  - AI Reply Drawer with tone toggles (Professional, Empathetic, Friendly, Concise).
  - Location cards with sync timestamp indicators and status alerts.
- [ ] Verification: Build succeeds without TypeScript or lint errors; responsive on mobile, tablet, and desktop.

---

## Phase 2: Supabase Authentication, Multi-Tenancy & Database Migrations
- [ ] Write SQL migrations for core database schema:
  - `profiles`, `workspaces`, `workspace_members`, `invitations`.
  - `google_connections`, `business_locations`, `reviews`.
  - `review_reply_drafts`, `published_replies`, `sync_jobs`.
  - `ai_usage_records`, `audit_logs`, `subscription_records`.
- [ ] Implement Supabase client utilities for Server Components, Route Handlers, and Client Components.
- [ ] Implement authentication flows:
  - Sign Up with automatic profile creation via PostgreSQL trigger.
  - Login with password and email verification handling.
  - Password reset with secure token handling.
  - Auth callback route handler for session cookies.
- [ ] Implement Workspace Creation & Onboarding:
  - Onboarding wizard: Business name, industry category, location count estimate.
  - Automatic `owner` membership assignment on workspace creation.
  - Team member invitations with role selection (`admin`, `member`, `viewer`).
- [ ] Verification: Unit tests for membership roles and workspace isolation logic.

---

## Phase 3: Row Level Security (RLS) & Cross-Tenant Boundary Testing
- [ ] Define granular RLS policies for every table in `supabase/migrations/`:
  - Enforce access through `workspace_members` check using `auth.uid()`.
  - Prevent non-members from reading or writing tenant records.
  - Prevent `viewer` role from modifying locations, generating replies, or publishing.
  - Restrict billing and Google connection modifications to `owner` and `admin`.
- [ ] Write automated security tests in `tests/rls/`:
  - Attempt cross-tenant SELECT, INSERT, UPDATE, DELETE queries.
  - Confirm unauthorized attempts fail with permission denied errors.
  - Verify tokens and OAuth credentials are never accessible to client queries.
- [ ] Verification: Cross-tenant isolation automated test suite passes 100%.

---

## Phase 4: Google OAuth 2.0 & Business Profile API Integration
- [ ] Implement secure Google OAuth 2.0 authorization code flow:
  - State token generator with HMAC signature and expiry to prevent CSRF.
  - Authorization URL generator requesting `https://www.googleapis.com/auth/business.manage`.
  - Server-side code exchange endpoint (`/api/auth/google/callback`).
  - AES-256-GCM encryption of refresh tokens before persisting to `google_connections`.
- [ ] Build Google Account & Location Discovery service:
  - Query `https://mybusinessaccountmanagement.googleapis.com/v1/accounts`.
  - Query `https://mybusinessbusinessinformation.googleapis.com/v1/{parent}/locations`.
  - Store discovered locations in `business_locations` with unique Google resource names.
- [ ] Build Review Synchronization pipeline:
  - Fetch reviews via `https://mybusiness.googleapis.com/v4/{parent}/reviews`.
  - Upsert reviews idempotently using `google_review_id` unique constraint.
  - Store star rating, comment text, review timestamp, and existing merchant replies.
- [ ] Verification: Mock and live OAuth flow tests; token encryption/decryption tests.

---

## Phase 5: OpenAI Review Assistant & Human-in-the-Loop Workflow
- [ ] Design server-side OpenAI service in `src/lib/openai/`:
  - System prompt enforcing professional guidelines, empathetic framing, and zero hallucinated facts.
  - Input sanitization wrapping untrusted user review text to prevent prompt injection.
  - Tone options: Professional, Empathetic, Friendly, Short & Punchy.
  - Structured output schema using Zod: suggested reply text, sentiment classification (Positive/Neutral/Negative), and key themes.
- [ ] Implement Quota & Rate Limiting:
  - Track monthly token and request usage in `ai_usage_records`.
  - Enforce workspace plan tiers (e.g., Free Trial: 20 replies/mo, Growth: 500/mo).
- [ ] Build Draft & Approval Interface:
  - "Generate AI Draft" button with inline loading state.
  - Editable text area with character counts and tone regeneration.
  - Sensitive review flagging: Highlight reviews mentioning legal action, safety hazards, or hygiene issues for human attention.
- [ ] Verification: Unit tests verifying AI prompt boundaries, Zod validation, and quota decrement logic.

---

## Phase 6: Safe Reply Publishing, Sync Workers & Audit Logging
- [ ] Build Google Reply Publisher:
  - Endpoint to publish approved reply via Google Business Profile API (`PUT /{parent}/reviews/{reviewId}/reply`).
  - Server-side authorization check: verify user is `owner` or `admin` in the review's workspace immediately before calling Google.
  - Save publication result in `published_replies` with timestamp and HTTP status.
- [ ] Implement Background Sync & Cron Handlers:
  - Protected route (`/api/cron/sync-reviews`) with shared bearer secret.
  - Exponential backoff and retry handling for 429 (Rate Limit) and 5xx Google errors.
  - Token refresh workflow: automatically acquire new access token when expired.
- [ ] Implement Audit Trail:
  - Record key operations in `audit_logs`: Google connection, disconnection, reply published, member invited/removed.
- [ ] Verification: Integration tests simulating Google API rate limits, expired tokens, and duplicate publish prevention.

---

## Phase 7: Subscription Model & Commercial Readiness
- [ ] Create subscription plan registry in `src/lib/plans.ts`:
  - Free Trial: 1 location, 20 AI drafts/mo.
  - Starter: 3 locations, 100 AI drafts/mo, daily sync.
  - Growth: 10 locations, 500 AI drafts/mo, hourly sync, multi-user.
  - Agency: Unlimited locations, unlimited AI drafts, custom tones, client workspaces.
- [ ] Implement workspace plan enforcement middleware.
- [ ] Setup billing abstraction layer (ready for Stripe / Razorpay integration upon user approval).
- [ ] Verification: Unit tests for quota exhaustion and feature gate blocking.

---

## Phase 8: Quality Assurance, Security Audit & Launch Documentation
- [ ] Run full automated test suite (Unit, Integration, Security).
- [ ] Run production build (`npm run build`) and fix any remaining warnings.
- [ ] Validate responsive design across screen sizes.
- [ ] Finalize manual operational guides for Google Cloud Console and Supabase.
- [ ] Provide comprehensive handoff report to the user.
