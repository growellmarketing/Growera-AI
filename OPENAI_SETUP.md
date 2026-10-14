# OpenAI Setup Guide (Step-by-Step for Beginners)

LocalPilot AI uses OpenAI to analyze customer review sentiment, extract customer feedback themes, and generate professional, brand-aligned review response drafts.

---

## 🧭 Overview of Steps

1. Create or log in to your OpenAI Platform account.
2. Generate an API Key.
3. Configure usage limits to prevent surprise charges.
4. Add the key to `.env.local`.

---

## Step 1: Open OpenAI Platform

1. In your browser, open: [https://platform.openai.com/](https://platform.openai.com/)
2. Sign in or create an account.
3. If new, add a small prepaid credit balance (e.g. $5 - $10) under **Settings** > **Billing**.

---

## Step 2: Create an API Key

1. In the left navigation bar, click on **API Keys** (or go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)).
2. Click the green button **+ Create new secret key**.
3. In the popup:
   - **Name**: `LocalPilot AI Development`
   - **Permissions**: Default (All permissions) or Restricted to `Model Capabilities: Read & Write`.
4. Click **Create secret key**.
5. Copy the key immediately (starts with `sk-proj-...` or `sk-...`).
   > [!WARNING]
   > OpenAI will only show this key once. If you close the window, you will have to create a new key.

---

## Step 3: Configure Usage Limits (Recommended)

1. In the left menu, click **Settings** > **Limits** or **Billing** > **Usage limits**.
2. Set a **Soft limit** (e.g. \$10/month) to receive an email alert.
3. Set a **Hard limit** (e.g. \$20/month) so OpenAI automatically rejects requests if your spending limit is reached.

---

## Step 4: Add the Key to `.env.local`

Open your `.env.local` file in the project folder and paste:

```env
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

---

## 🤖 Recommended Models & Privacy Notice

- **Default Model**: `gpt-4o-mini` is used by default because it is extremely fast, highly capable at empathetic business responses, and costs a fraction of larger models (approx. \$0.0001 per review reply).
- **Data Privacy**: Calls made through the official OpenAI API are **not** used to train OpenAI's foundation models.
- **Guardrails**: LocalPilot AI injects business context, brand tone, and safety directives, forbidding the model from acknowledging prompt injections, promising discounts, or admitting liability.
