# Google Business Profile Setup Guide (Step-by-Step for Beginners)

This guide walks you through setting up Google Business Profile API access so LocalPilot AI can securely connect your locations, sync customer reviews, and publish replies.

---

## 🧭 Overview of Steps

1. Create a Google Cloud Project.
2. Enable the required Google Business Profile APIs.
3. Configure the OAuth Consent Screen.
4. Create OAuth 2.0 Credentials (Client ID & Client Secret).
5. Store credentials in `.env.local`.

---

## Step 1: Create a Google Cloud Project

1. Open your browser and go to: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Sign in with the Google Account that owns or manages your Google Business Profile.
3. In the top bar, click the **Project Dropdown** (next to the Google Cloud logo).
4. Click **New Project** in the top right of the modal.
5. In **Project name**, enter: `LocalPilot AI`
6. Click **Create** and wait a few seconds until the project is created.
7. Click the notification bell or project selector and ensure `LocalPilot AI` is the active project.

---

## Step 2: Enable the Business Profile APIs

Google splits Business Profile management into several APIs. Enable these:

1. In the left navigation menu, click **APIs & Services** > **Library**.
2. In the search box, search for: `My Business Business Information API`
   - Click on it and click **Enable**.
3. Return to the Library and search for: `My Business Account Management API`
   - Click on it and click **Enable**.
4. In the Library, search for: `Google My Business API`
   - Click on it and click **Enable**.

> [!NOTE]
> If Google prompts you that access to the Business Profile API requires requesting access or verification, see the **Google API Approval Notice** below.

---

## Step 3: Configure the OAuth Consent Screen

1. In the left menu, click **APIs & Services** > **OAuth consent screen**.
2. Under **User Type**, select **External** and click **Create**.
3. Fill in the **App information**:
   - **App name**: `LocalPilot AI`
   - **User support email**: Select your email address.
   - **Developer contact email**: Enter your email address.
4. Click **Save and Continue**.
5. Under **Scopes**, click **Add or Remove Scopes**:
   - In the filter/search, paste: `https://www.googleapis.com/auth/business.manage`
   - Check the box next to `business.manage`.
   - Also select standard scopes: `userinfo.email`, `userinfo.profile`, `openid`.
   - Click **Update** then click **Save and Continue**.
6. Under **Test Users**:
   - Click **Add Users**.
   - Enter your personal Google email (the one that manages your Google Business Profile).
   - Click **Add** then **Save and Continue**.
7. Click **Back to Dashboard**.

---

## Step 4: Create OAuth 2.0 Client Credentials

1. In the left menu, click **APIs & Services** > **Credentials**.
2. At the top, click **+ Create Credentials** > **OAuth client ID**.
3. In the **Application type** dropdown, choose: **Web application**.
4. In **Name**, enter: `LocalPilot AI Web Client`.
5. Under **Authorized redirect URIs**, click **+ Add URI**:
   - For local development: `http://localhost:3000/api/auth/google/callback`
   - For production (later): `https://your-domain.com/api/auth/google/callback`
6. Click **Create**.
7. A dialog will appear with:
   - **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abc123xyz...`)
8. Copy these values!

---

## Step 5: Store in `.env.local`

Open your `.env.local` file in your project folder and set:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

---

## ⚠️ Important Notice on Google Approval

- While your app is in **Testing** status in Google Cloud Console, only the specific email addresses added under **Test Users** can log in and connect their Google Business Profile.
- For public commercial production launch with multiple unrelated Google accounts, Google requires completing their OAuth Verification and Business Profile API access audit form. LocalPilot AI is fully structured to support this path cleanly.
