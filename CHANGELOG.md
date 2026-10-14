# LocalPilot AI — Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-10-14

### Added
- Live Supabase integration with `@supabase/ssr`:
  - `src/lib/supabase/client.ts` for Client Components in the browser.
  - `src/lib/supabase/server.ts` for Server Components, Server Actions, and Admin client.
  - `src/lib/supabase/middleware.ts` for automatic auth token and session refresh.
  - `src/middleware.ts` global Next.js middleware protecting routes and handling session cookies.
  - `src/app/api/auth/callback/route.ts` auth callback route handler.
- Live database verification against Supabase project:
  - 13/13 tables verified online with active Row-Level Security policies.
- Real authentication wiring for Sign In (`supabase.auth.signInWithPassword`) and Sign Up (`supabase.auth.signUp`).

---

## [0.1.0] - 2026-10-14

### Added
- Complete Phase 0 documentation suite:
  - `README.md`, `PROJECT_STATUS.md`, `IMPLEMENTATION_PLAN.md`, `ARCHITECTURE.md`
  - `DATABASE_SCHEMA.md`, `SECURITY.md`, `ENVIRONMENT_VARIABLES.md`
  - `GOOGLE_BUSINESS_PROFILE_SETUP.md`, `OPENAI_SETUP.md`
  - `DEPLOYMENT.md`, `TESTING.md`, `TROUBLESHOOTING.md`, `CHANGELOG.md`
- Multi-Tenant UI Application and Design System:
  - Responsive marketing site: Landing page, Pricing, How It Works, FAQ, Privacy Policy, Terms of Service.
  - Multi-tenant workspace dashboard shell with RBAC indicators and workspace switcher.
  - Zero-data state screens with clear onboarding CTAs.
  - Review inbox with star rating filters, sentiment badges, and tone controls.
  - Location management and store code tracking.
  - Analytics & sentiment intelligence dashboard.
  - Workspace settings with team management, brand voice, and data deletion.
- Automated unit and security test suites (16/16 tests passing).
- AES-256-GCM token encryption and tamper prevention utilities.
- PostgreSQL migrations for schema and RLS policies (`0001_initial_schema.sql`, `0002_rls_policies.sql`).
