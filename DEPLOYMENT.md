# LocalPilot AI — Production Deployment Guide (Vercel & Supabase)

> **For Beginners**: This guide explains every step to deploy LocalPilot AI to production. You do not need developer experience to follow these steps.

---

## 🚦 Pre-Deployment Architecture Summary

| Component | Provider | Purpose |
|---|---|---|
| **Frontend & API Routes** | Vercel | Serves the Next.js 15 App Router web application with global edge caching and automatic SSL. |
| **Database & Auth** | Supabase | Managed PostgreSQL 15+ database, Row Level Security (RLS), and email authentication. |
| **OAuth & Reviews** | Google Cloud | Official Google Business Profile OAuth 2.0 authorization code flow (`business.manage`). |
| **AI Intelligence** | OpenAI | `gpt-4o-mini` review sentiment analysis, theme extraction, and draft generation. |

---

## 📋 Step 1: Push Code to GitHub

Vercel deploys directly from your private or public GitHub repository.

### Option A: Using GitHub Desktop (Easiest for Beginners)
1. Download and install [GitHub Desktop](https://desktop.github.com/).
2. Open GitHub Desktop and sign in with your GitHub account.
3. Click **File** > **Add Local Repository...**
4. Choose path: `E:\Growera AI`
5. If prompted that the directory is not a Git repository, click **Create a Repository here**.
6. Set name to `localpilot-ai` and click **Create Repository**.
7. Click **Publish repository** to push it to your GitHub account (you can check "Keep this code private").

### Option B: Using Git Command Line
```powershell
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "feat: initial LocalPilot AI multi-tenant SaaS build"

# 4. Link to your GitHub repo and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/localpilot-ai.git
git push -u origin main
```

---

## 🗄️ Step 2: Set Up Supabase Database & Security Policies

1. Go to [https://supabase.com/](https://supabase.com/) and create a free account.
2. Click **New Project**:
   - **Name**: `LocalPilot AI Production`
   - **Database Password**: Choose a strong password and save it in a password manager.
   - **Region**: Select a region close to your target users (e.g., `South Asia (Mumbai)` or `US East`).
3. Click **Create new project** (takes ~90 seconds).

### Apply Migrations in Supabase
1. In the Supabase left sidebar, click **SQL Editor**.
2. Click **+ New query**.
3. Open `supabase/migrations/0001_initial_schema.sql` from your project folder, copy all code, paste it into the SQL Editor, and click **Run**.
4. Click **+ New query** again.
5. Open `supabase/migrations/0002_rls_policies.sql`, copy all code, paste it into the SQL Editor, and click **Run**.
6. Click **Table Editor** in the left menu to verify all 13 tables are present with green **RLS** badges.

### Copy Supabase API Keys
1. In Supabase, go to **Project Settings** (gear icon at bottom left) > **API**.
2. You will need:
   - **Project URL** (e.g., `https://xyzabc.supabase.co`)
   - **Project API Keys (`anon public`)**
   - **Project API Keys (`service_role secret`)**

---

## 🌐 Step 3: Google Cloud OAuth 2.0 Configuration

1. Visit [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project named `LocalPilot AI`.
3. In **APIs & Services** > **Library**, enable:
   - `My Business Business Information API`
   - `My Business Account Management API`
   - `Google My Business API`
4. In **APIs & Services** > **OAuth consent screen**:
   - Select **External**.
   - App Name: `LocalPilot AI`.
   - Add scopes: `https://www.googleapis.com/auth/business.manage`, `email`, `profile`.
   - Under **Test users**, add your own Google email.
5. In **APIs & Services** > **Credentials**:
   - Click **+ Create Credentials** > **OAuth client ID**.
   - Type: **Web application**.
   - Name: `LocalPilot AI Vercel Production`.
   - Under **Authorized redirect URIs**, add:
     - `http://localhost:3000/api/auth/google/callback` (for local testing)
     - `https://your-app-name.vercel.app/api/auth/google/callback` (update after Vercel gives you your URL)
6. Copy the **Client ID** and **Client Secret**.

---

## 🤖 Step 4: Get OpenAI API Key

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Click **+ Create new secret key**.
3. Name it `LocalPilot Production`.
4. Copy the secret key (starts with `sk-proj-...`).
5. (Recommended) Set a monthly spend cap of \$10-\$20 under **Billing** > **Limits**.

---

## 🔑 Step 5: Generate Server Encryption Key

Open PowerShell or command prompt on your computer and run:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
This generates a 64-character random key. Copy it (it will be your `ENCRYPTION_KEY`).

---

## 🚀 Step 6: Deploy to Vercel

1. Go to [https://vercel.com/](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** > **Project**.
3. Select your `localpilot-ai` repository and click **Import**.
4. In the **Environment Variables** section, add the following:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://your-app-name.vercel.app` (or custom domain) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role secret key |
| `ENCRYPTION_KEY` | Your 64-char hex key from Step 5 |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |
| `GOOGLE_REDIRECT_URI` | `https://your-app-name.vercel.app/api/auth/google/callback` |
| `OPENAI_API_KEY` | Your OpenAI API key (`sk-proj-...`) |
| `CRON_SECRET` | A random 32+ character string for background jobs |

5. Click **Deploy**.
6. Vercel will build and launch your application in ~60 seconds.

---

## 🔄 Step 7: Update Google Cloud Redirect URI

Once Vercel assigns your production URL (e.g., `https://localpilot-ai.vercel.app`):
1. Return to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Click on your OAuth Client ID.
3. Under **Authorized redirect URIs**, add your live Vercel URL:
   `https://localpilot-ai.vercel.app/api/auth/google/callback`
4. Click **Save**.

---

### Configure Supabase Auth Redirect URLs
1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**.
2. Set **Site URL** to: `https://your-app-name.vercel.app` (or `http://localhost:3000` during local dev).
3. In **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `https://your-app-name.vercel.app/**`
4. Click **Save**.

---

## 🛡️ Verification & Launch Checklist

- [ ] All 20 automated tests pass (`npm test`).
- [ ] TypeScript compiles cleanly with 0 errors (`npm run typecheck`).
- [ ] Production build succeeds with 16 routes optimized (`npm run build`).
- [ ] Supabase tables have RLS enabled (green shield in Supabase UI).
- [ ] Supabase Auth Redirect URLs include your Vercel domain.
- [ ] No server secrets are prefixed with `NEXT_PUBLIC_`.
- [ ] `.env.local` is strictly in `.gitignore` and never committed.
- [ ] Tested Google OAuth sign-in and passwordless/password flows.
- [ ] Successfully generated an AI reply draft in the review inbox.

