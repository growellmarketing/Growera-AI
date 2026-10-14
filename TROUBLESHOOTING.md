# LocalPilot AI — Troubleshooting Guide

Solutions to common issues encountered during development, local testing, and production deployment.

---

## 🔍 Google OAuth & API Issues

### 1. `redirect_uri_mismatch` Error
- **Symptom**: Google displays "Error 400: redirect_uri_mismatch" when attempting to connect an account.
- **Cause**: The URI where your app is running doesn't match the list of **Authorized redirect URIs** in Google Cloud Console.
- **Solution**:
  1. Open [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
  2. Click on your OAuth 2.0 Client ID.
  3. Ensure `http://localhost:3000/api/auth/google/callback` (or your production URL) is listed under **Authorized redirect URIs** character-for-character with no trailing slash.

### 2. `access_denied` / App not verified
- **Symptom**: Google warns "This app has not been verified" or blocks sign-in.
- **Cause**: The app is in "Testing" mode in Google Cloud Console, and the current user's email was not added.
- **Solution**:
  1. Go to **APIs & Services** > **OAuth consent screen**.
  2. Under **Test users**, click **Add Users**.
  3. Add the exact email address you are attempting to log in with.

### 3. `invalid_grant` during token refresh
- **Symptom**: Review sync fails with `invalid_grant`.
- **Cause**: The user revoked app access in their Google Account settings, or the refresh token expired (after 6 months of inactivity in testing mode).
- **Solution**: Click **Reconnect Google Account** in LocalPilot AI Location settings to initiate a fresh OAuth consent flow.

---

## ⚡ OpenAI API Issues

### 1. `401 Unauthorized` / Invalid API Key
- **Symptom**: "Error generating AI draft: 401 Incorrect API key provided".
- **Cause**: `OPENAI_API_KEY` is missing or contains typo/extra spaces in `.env.local`.
- **Solution**: Verify the key in `.env.local` begins with `sk-proj-` or `sk-` and restart the development server.

### 2. `429 Too Many Requests` / Quota Exceeded
- **Symptom**: "Rate limit reached or billing limit exceeded".
- **Cause**: OpenAI account has no prepaid credits or reached the monthly hard limit.
- **Solution**: Visit [OpenAI Billing](https://platform.openai.com/account/billing) and add funds or adjust usage limits.

---

## 🗄️ Supabase & Database Issues

### 1. `Invalid API key` or failed auth request
- **Symptom**: Supabase client returns `401 Unauthorized`.
- **Cause**: `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` mismatch.
- **Solution**: Double-check values in `.env.local` match the API settings in your Supabase project dashboard.

### 2. Cross-tenant permission denied
- **Symptom**: Query returns empty array `[]` when data is expected.
- **Cause**: Row-Level Security (RLS) is working as intended; the signed-in user does not have a membership record in `workspace_members` for that `workspace_id`.
- **Solution**: Verify `workspace_members` contains a row linking `user_id` to the target `workspace_id`.

---

## 💻 Local Machine & Node.js Issues

### 1. Port 3000 already in use
- **Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`.
- **Solution**:
  ```powershell
  # Find and kill the process using port 3000
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
  ```
  Or run on a different port: `npx next dev -p 3001`.
