# LocalPilot AI

> **Multi-Tenant AI Business Management SaaS** inspired by modern local business intelligence platforms (such as Vera by magicpin), designed specifically for multi-location brands, restaurants, clinics, salons, local service businesses, and marketing agencies.

---

## 🌟 Overview

**LocalPilot AI** enables multi-location businesses and agencies to:
- Connect multiple Google Business Profile accounts securely via OAuth 2.0.
- Synchronize locations, ratings, and customer reviews in near real-time.
- Generate contextual, tone-tailored, multi-lingual AI review responses using OpenAI GPT models.
- Review, edit, and approve AI drafts through a human-in-the-loop workflow before publishing back to Google.
- Analyze customer sentiment, rating distributions, and recurring customer feedback themes.
- Support strict multi-tenancy with isolated workspaces, roles (Owner, Admin, Member, Viewer), and PostgreSQL Row-Level Security (RLS).

---

## 🚀 Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components & Server Actions) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling & UI** | Tailwind CSS, Lucide React icons, Radix UI primitives |
| **Authentication** | Supabase Auth (Email/Password, Sessions, SSR cookies) |
| **Database & Security**| Supabase PostgreSQL with Row Level Security (RLS) & UUIDs |
| **AI Engine** | OpenAI API (GPT-4o / GPT-4o-mini structured outputs) |
| **Integrations** | Google Business Profile API (OAuth 2.0 with `business.manage` scope) |
| **Validation** | Zod for schema-first runtime input/output validation |
| **Testing** | Vitest / Jest with React Testing Library |

---

## 📂 Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth routes (login, register, forgot-password)
│   │   ├── (marketing)/          # Public website (landing, pricing, privacy, terms)
│   │   ├── (onboarding)/         # Guided post-signup onboarding wizard
│   │   ├── (dashboard)/          # Authenticated workspace dashboard
│   │   │   ├── [workspaceId]/
│   │   │   │   ├── dashboard/    # Main analytics & review metrics
│   │   │   │   ├── locations/    # Google Business locations & sync controls
│   │   │   │   ├── reviews/      # Review inbox, AI reply drafting & publishing
│   │   │   │   ├── analytics/    # Rating trends, sentiment & themes
│   │   │   │   ├── settings/     # Workspace, team, AI preferences & billing
│   │   │   └── page.tsx          # Workspace selector / router
│   │   ├── api/                  # Route handlers (Google OAuth callbacks, webhooks, cron)
│   │   └── layout.tsx            # Global layout & providers
│   ├── components/               # Modular UI components
│   │   ├── ui/                   # Primitive design system components (buttons, badges, modals)
│   │   ├── marketing/            # Landing page sections
│   │   ├── dashboard/            # Dashboard widgets, stats cards, tables
│   │   ├── reviews/              # Review card, AI reply generator modal, sentiment badges
│   │   └── shared/               # Navigation, headers, empty states, loading skeletons
│   ├── lib/                      # Core backend utilities
│   │   ├── supabase/             # Supabase client, server & middleware helpers
│   │   ├── google/               # Google OAuth & Business Profile API client
│   │   ├── openai/               # OpenAI review reply & sentiment service
│   │   ├── encryption.ts         # Server-side AES-256 token encryption
│   │   ├── permissions.ts        # RBAC role validation (Owner, Admin, Member, Viewer)
│   │   └── utils.ts              # Common helpers and classNames
│   └── types/                    # Shared TypeScript interfaces & database definitions
├── supabase/
│   └── migrations/               # Versioned PostgreSQL migrations with RLS policies
├── docs/                         # Extended architectural documentation
├── public/                       # Static brand assets and SVGs
└── tests/                        # Unit, integration, and RLS security tests
```

---

## 🔒 Security Standards

1. **Strict Multi-Tenancy**: Every database table includes `workspace_id` protected by PostgreSQL RLS. Users can only read and write data in workspaces where they hold active membership.
2. **Server-Side Token Encryption**: Google OAuth refresh tokens are encrypted at rest using AES-256-GCM before storage and never returned to browser clients.
3. **No Direct Auto-Publishing**: AI-generated responses default to draft status and require human review and role-based approval before transmission to Google APIs.
4. **Untrusted Review Input**: All customer review text is treated as untrusted strings, wrapped in isolated system prompt delimiters, and prevented from executing prompt injections.

---

## 📖 Quick Links & Documentation

- [Project Status & Progress Log](PROJECT_STATUS.md)
- [Step-by-Step Implementation Plan](IMPLEMENTATION_PLAN.md)
- [System Architecture](ARCHITECTURE.md)
- [Database Schema & Migrations](DATABASE_SCHEMA.md)
- [Security & Threat Model](SECURITY.md)
- [Environment Variables Reference](ENVIRONMENT_VARIABLES.md)
- [Google Business Profile Setup Guide](GOOGLE_BUSINESS_PROFILE_SETUP.md)
- [OpenAI Integration Guide](OPENAI_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Testing & Quality Assurance](TESTING.md)
- [Troubleshooting & FAQs](TROUBLESHOOTING.md)
- [Changelog](CHANGELOG.md)

---

## 💻 Getting Started (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
