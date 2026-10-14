# LocalPilot AI — Architecture Documentation

This document describes the high-level system architecture, multi-tenant data model, external integration boundaries, and security design of LocalPilot AI.

---

## 🏛️ System Architecture Overview

```
                          ┌─────────────────────────────────────┐
                          │         Web Client / Browser        │
                          │   (Next.js 15 React Server & Client)│
                          └──────────────────┬──────────────────┘
                                             │ HTTPS
                                             ▼
                          ┌─────────────────────────────────────┐
                          │       Next.js 15 App Router         │
                          │  - Server Components (SSR / RSC)    │
                          │  - Server Actions & Route Handlers  │
                          │  - Session & Role Middleware        │
                          └──────┬───────────┬───────────┬──────┘
                                 │           │           │
                     Encrypted   │           │ Supabase  │ Untrusted
                     Tokens      │           │ Client    │ Prompt Bounds
                                 ▼           ▼           ▼
                      ┌───────────────┐ ┌─────────┐ ┌───────────────┐
                      │ Google OAuth  │ │Supabase │ │  OpenAI API   │
                      │ & GBP APIs    │ │Postgres │ │ (GPT-4o mini) │
                      │- OAuth 2.0    │ │with RLS │ │- Reply Drafts │
                      │- Location API │ │- Tables │ │- Sentiment    │
                      │- Reviews API  │ │- Triggers│ │- Themes       │
                      └───────────────┘ └─────────┘ └───────────────┘
```

---

## 🏢 Multi-Tenant Data Isolation Model

LocalPilot AI implements a **Shared Database, Shared Schema with Row-Level Security (RLS)** tenancy model.

### 1. Workspace Isolation
- Every user account belongs to one or more `workspaces`.
- The junction table `workspace_members` binds a `user_id` to a `workspace_id` with an assigned `role`.
- Every tenant resource (`business_locations`, `reviews`, `google_connections`, `review_reply_drafts`, `published_replies`, `audit_logs`) has a non-nullable `workspace_id` foreign key.
- Database queries executed by the frontend or backend use Row-Level Security policies that evaluate:
  ```sql
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = table.workspace_id
    AND workspace_members.user_id = auth.uid()
  )
  ```

### 2. Role-Based Access Control (RBAC)

| Permission | Owner | Admin | Member | Viewer |
|---|:---:|:---:|:---:|:---:|
| View reviews & analytics | Yes | Yes | Yes | Yes |
| Generate AI reply drafts | Yes | Yes | Yes | No |
| Edit & approve reply drafts | Yes | Yes | Yes | No |
| Publish replies to Google | Yes | Yes | No | No |
| Connect / Disconnect Google GBP | Yes | Yes | No | No |
| Manage team members | Yes | Yes | No | No |
| Manage billing & subscription | Yes | No | No | No |
| Delete workspace | Yes | No | No | No |

---

## 🔄 Core Integration Workflows

### 1. Google OAuth 2.0 & Token Storage
1. **Initiation**: User clicks "Connect Google Business Profile". The server generates a signed state parameter containing `{ workspaceId, userId, nonce, hmac }` to prevent CSRF.
2. **Consent**: User authorizes Google with scope `https://www.googleapis.com/auth/business.manage` with `access_type=offline` and `prompt=consent`.
3. **Callback Exchange**: Google redirects to `/api/auth/google/callback?code=...&state=...`. The server verifies the HMAC signature and expiration of `state`.
4. **Token Encryption**: The server exchanges `code` for an access token and refresh token. The refresh token is encrypted using AES-256-GCM before writing to `google_connections`. Raw refresh tokens are never returned to the browser.

### 2. Review Synchronization Pipeline
1. **Location Discovery**: Server fetches verified locations for the connected account via Google Business Profile APIs.
2. **Review Fetching**: Server queries `accounts/{accountId}/locations/{locationId}/reviews`.
3. **Idempotent Upsert**: Reviews are written to the `reviews` table with unique constraint on `(workspace_id, google_review_id)` to prevent duplicates.
4. **Existing Replies**: If Google returns an existing `merchant_reply`, it is recorded as already published.

### 3. Human-in-the-Loop AI Review Assistant
1. **Trigger**: Member clicks "Draft Reply" for an unanswered review.
2. **Sanitization**: Review text and rating are sanitized and wrapped in rigid XML boundary tags (`<review_content>`) inside system instructions.
3. **Inference**: Server calls OpenAI `gpt-4o-mini` with structured JSON output enforcing:
   - Polite, brand-aligned response matching selected tone.
   - Strict prohibition against promising free items, refunds, or admitting legal liabilities.
   - Sentiment classification (Positive, Neutral, Negative).
   - Flagging of sensitive reviews (threats, medical claims, discrimination) for manual management.
4. **Draft Persistence**: Reply is saved in `review_reply_drafts` with status `draft`.
5. **Human Approval & Publication**: Admin/Owner edits or approves draft. Upon explicit click, the server re-authenticates the user's role and transmits the reply to Google's API endpoint (`PUT /{review}/reply`).

---

## 🛡️ Security Architecture

1. **Row-Level Security (RLS)**: Enforced directly inside PostgreSQL so that even a misconfigured frontend query cannot leak cross-tenant data.
2. **Token Security**: OAuth refresh tokens stored with AES-256-GCM using a server-side encryption key (`ENCRYPTION_KEY`). Never transmitted to client-side code.
3. **Untrusted AI Inputs**: Customer reviews are external untrusted content. Prompts are constructed to forbid the model from executing prompt injections or revealing internal prompts.
4. **Session Protections**: Supabase SSR uses HTTP-only, Secure, SameSite cookies to protect session JWTs.
5. **No Client Side Secrets**: Service role keys and API keys are strictly kept server-side in Node.js runtime environments.
