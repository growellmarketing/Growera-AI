# LocalPilot AI — Environment Variables Reference

This document catalogs all environment variables used across LocalPilot AI.

> [!CAUTION]
> Never commit real secrets to Git. Copy `.env.example` to `.env.local` for local development.

---

## 📋 Variables Catalog

| Variable Name | Environment | Exposure | Required | Description |
|---|---|---|:---:|---|
| `NEXT_PUBLIC_APP_URL` | All | Public (Browser) | Yes | Base URL of the app (e.g. `http://localhost:3000` or `https://app.localpilot.ai`) |
| `NEXT_PUBLIC_SUPABASE_URL` | All | Public (Browser) | Yes | Supabase Project URL (e.g. `https://xyzproject.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Public (Browser) | Yes | Supabase Anonymous Client Key (RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | **SECRET (Server Only)** | Yes | Supabase Service Role Key (used for privileged admin tasks/migrations) |
| `ENCRYPTION_KEY` | Server | **SECRET (Server Only)** | Yes | 32-byte (64 hex characters) AES-256 key for encrypting OAuth refresh tokens |
| `GOOGLE_CLIENT_ID` | Server | Server Only | Yes | Google Cloud OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Server | **SECRET (Server Only)** | Yes | Google Cloud OAuth 2.0 Client Secret |
| `GOOGLE_REDIRECT_URI` | Server | Server Only | Yes | Authorized redirect URI (e.g. `http://localhost:3000/api/auth/google/callback`) |
| `OPENAI_API_KEY` | Server | **SECRET (Server Only)** | Yes | OpenAI API Key (starts with `sk-...`) |
| `CRON_SECRET` | Server | **SECRET (Server Only)** | Yes | Shared secret token for authenticating background sync cron jobs |

---

## 🛠️ Generating an AES-256 Encryption Key

For `ENCRYPTION_KEY`, generate a secure 32-byte (64-character hexadecimal) random key using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📄 Template: `.env.example`

```env
# ==============================================================================
# LOCALPILOT AI — ENVIRONMENT TEMPLATE
# Copy to .env.local for local development. Do not put real secrets here!
# ==============================================================================

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Public Keys (Safe for frontend bundle)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Supabase Server Key (NEVER expose to browser!)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Server Token Encryption (32-byte hex string)
ENCRYPTION_KEY=00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff

# Google Business Profile OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Background Cron Authentication Token
CRON_SECRET=your-long-random-cron-secret-string
```
