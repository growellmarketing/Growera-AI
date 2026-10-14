# LocalPilot AI — Database Schema Documentation

This document describes the PostgreSQL database schema for LocalPilot AI, designed for Supabase with PostgreSQL 15+ and Row-Level Security (RLS).

---

## 🗄️ Entity Relationship Diagram

```
[auth.users] (Supabase Managed)
    │
    ├── 1:1 ──► [profiles]
    │
    └── 1:N ──► [workspace_members] ◄── N:1 ── [workspaces]
                                                     │
               ┌─────────────────────────────────────┼──────────────────────────────────┐
               │                                     │                                  │
               ▼                                     ▼                                  ▼
      [google_connections]                  [business_locations]               [subscription_records]
               │                                     │                                  │
               │                                     ▼                                  ▼
               │                                 [reviews]                      [ai_usage_records]
               │                                     │                                  │
               │                                     ├───────────┐                      ▼
               │                                     ▼           ▼                 [audit_logs]
               │                         [review_reply_drafts] [published_replies]
               ▼                                     │
          [sync_jobs]                                ▼
                                           [invitations]
```

---

## 📋 Table Specifications

### 1. `profiles`
Stores extended user profile information linked to Supabase `auth.users`.
- `id` (UUID, PK, References `auth.users.id` on delete cascade)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMPTZ, default `NOW()`)
- `updated_at` (TIMESTAMPTZ, default `NOW()`)

### 2. `workspaces`
Represents an isolated tenant organization (e.g. single shop, multi-chain brand, or marketing agency).
- `id` (UUID, PK, default `gen_random_uuid()`)
- `name` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `business_type` (TEXT, e.g., `restaurant`, `retail`, `salon`, `healthcare`, `services`, `agency`)
- `default_reply_tone` (TEXT, default `professional`)
- `default_language` (TEXT, default `en`)
- `created_by` (UUID, References `profiles.id`)
- `created_at` (TIMESTAMPTZ, default `NOW()`)
- `updated_at` (TIMESTAMPTZ, default `NOW()`)

### 3. `workspace_members`
Junction table mapping users to workspaces with assigned RBAC roles.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `user_id` (UUID, References `profiles.id` on delete cascade)
- `role` (TEXT, NOT NULL, CHECK in `('owner', 'admin', 'member', 'viewer')`)
- `created_at` (TIMESTAMPTZ, default `NOW()`)
- Unique Constraint: `(workspace_id, user_id)`

### 4. `invitations`
Pending team member invitations.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `email` (TEXT, NOT NULL)
- `role` (TEXT, NOT NULL, CHECK in `('admin', 'member', 'viewer')`)
- `token` (TEXT, UNIQUE, NOT NULL)
- `invited_by` (UUID, References `profiles.id`)
- `expires_at` (TIMESTAMPTZ, NOT NULL)
- `created_at` (TIMESTAMPTZ, default `NOW()`)

### 5. `google_connections`
Stores encrypted OAuth credentials for connected Google Business Profile accounts.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `google_account_id` (TEXT, NOT NULL)
- `account_name` (TEXT)
- `email` (TEXT)
- `encrypted_refresh_token` (TEXT, NOT NULL) -- AES-256-GCM encrypted
- `encryption_iv` (TEXT, NOT NULL)
- `encryption_tag` (TEXT, NOT NULL)
- `token_expiry` (TIMESTAMPTZ)
- `status` (TEXT, default `'active'`, CHECK in `('active', 'expired', 'revoked', 'error')`)
- `last_sync_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ, default `NOW()`)
- `updated_at` (TIMESTAMPTZ, default `NOW()`)
- Unique Constraint: `(workspace_id, google_account_id)`

### 6. `business_locations`
Authorized Google Business Profile physical locations.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `google_connection_id` (UUID, References `google_connections.id` on delete cascade)
- `google_location_id` (TEXT, NOT NULL) -- Google resource name format: `locations/123456789`
- `location_name` (TEXT, NOT NULL)
- `store_code` (TEXT)
- `address_line1` (TEXT)
- `city` (TEXT)
- `state` (TEXT)
- `postal_code` (TEXT)
- `country_code` (TEXT)
- `phone_number` (TEXT)
- `primary_category` (TEXT)
- `is_verified` (BOOLEAN, default `false`)
- `average_rating` (NUMERIC(3, 2))
- `total_review_count` (INTEGER, default 0)
- `last_sync_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ, default `NOW()`)
- `updated_at` (TIMESTAMPTZ, default `NOW()`)
- Unique Constraint: `(workspace_id, google_location_id)`

### 7. `reviews`
Synchronized customer reviews fetched from authorized Google Business locations.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `location_id` (UUID, References `business_locations.id` on delete cascade)
- `google_review_id` (TEXT, NOT NULL)
- `reviewer_name` (TEXT)
- `reviewer_photo_url` (TEXT)
- `star_rating` (INTEGER, NOT NULL, CHECK `star_rating BETWEEN 1 AND 5`)
- `comment` (TEXT)
- `review_timestamp` (TIMESTAMPTZ, NOT NULL)
- `has_reply` (BOOLEAN, default `false`)
- `existing_reply_text` (TEXT)
- `existing_reply_timestamp` (TIMESTAMPTZ)
- `sentiment` (TEXT, CHECK in `('positive', 'neutral', 'negative')`)
- `sentiment_score` (NUMERIC(3, 2))
- `is_sensitive` (BOOLEAN, default `false`)
- `sensitive_reason` (TEXT)
- `created_at` (TIMESTAMPTZ, default `NOW()`)
- `updated_at` (TIMESTAMPTZ, default `NOW()`)
- Unique Constraint: `(workspace_id, google_review_id)`

### 8. `review_reply_drafts`
AI-generated or user-composed response drafts awaiting review or publication.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `review_id` (UUID, References `reviews.id` on delete cascade)
- `draft_text` (TEXT, NOT NULL)
- `tone` (TEXT, default `'professional'`)
- `language` (TEXT, default `'en'`)
- `status` (TEXT, default `'draft'`, CHECK in `('draft', 'approved', 'rejected', 'published')`)
- `generated_by_ai` (BOOLEAN, default `true`)
- `created_by` (UUID, References `profiles.id`)
- `approved_by` (UUID, References `profiles.id`)
- `created_at` (TIMESTAMPTZ, default `NOW()`)
- `updated_at` (TIMESTAMPTZ, default `NOW()`)

### 9. `published_replies`
Audit log of reply transmissions to Google Business Profile API.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `review_id` (UUID, References `reviews.id` on delete cascade)
- `draft_id` (UUID, References `review_reply_drafts.id`)
- `reply_text` (TEXT, NOT NULL)
- `published_by` (UUID, References `profiles.id`)
- `published_at` (TIMESTAMPTZ, default `NOW()`)
- `google_response_status` (INTEGER)
- `google_response_body` (JSONB)
- `error_message` (TEXT)

### 10. `sync_jobs`
Tracks manual and scheduled review/location synchronization jobs.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `job_type` (TEXT, CHECK in `('locations_sync', 'reviews_sync', 'reply_publish')`)
- `status` (TEXT, CHECK in `('queued', 'running', 'completed', 'failed')`)
- `records_processed` (INTEGER, default 0)
- `error_details` (TEXT)
- `started_at` (TIMESTAMPTZ)
- `completed_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ, default `NOW()`)

### 11. `ai_usage_records`
Usage tracking and quota accounting per workspace.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `operation` (TEXT, e.g. `'generate_reply'`, `'sentiment_analysis'`)
- `model` (TEXT, e.g. `'gpt-4o-mini'`)
- `tokens_used` (INTEGER, NOT NULL)
- `created_at` (TIMESTAMPTZ, default `NOW()`)

### 12. `audit_logs`
Immutable security and compliance log.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `actor_id` (UUID, References `profiles.id`)
- `action` (TEXT, NOT NULL)
- `entity_type` (TEXT, NOT NULL)
- `entity_id` (TEXT)
- `metadata` (JSONB)
- `created_at` (TIMESTAMPTZ, default `NOW()`)

### 13. `subscription_records`
Workspace billing status and limits.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `workspace_id` (UUID, References `workspaces.id` on delete cascade)
- `plan_tier` (TEXT, default `'free_trial'`, CHECK in `('free_trial', 'starter', 'growth', 'agency')`)
- `status` (TEXT, default `'active'`, CHECK in `('active', 'past_due', 'canceled', 'trialing')`)
- `monthly_ai_replies_limit` (INTEGER, default 20)
- `max_locations_limit` (INTEGER, default 1)
- `current_period_start` (TIMESTAMPTZ)
- `current_period_end` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ, default `NOW()`)
- `updated_at` (TIMESTAMPTZ, default `NOW()`)
