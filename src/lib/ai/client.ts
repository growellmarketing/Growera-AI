/**
 * Unified AI Client supporting both OpenRouter and OpenAI
 * Supports 100% free models on OpenRouter with automatic failover fallback.
 */

export interface GenerateReviewReplyParams {
  businessName: string;
  businessType?: string;
  reviewerName: string;
  starRating: number;
  reviewComment: string;
  tone?: "professional" | "empathetic" | "friendly" | "concise";
  language?: string;
}

export interface GenerateReviewReplyResult {
  success: boolean;
  reply?: string;
  sentiment?: "positive" | "neutral" | "negative";
  modelUsed?: string;
  error?: string;
}

// Top active free models on OpenRouter (zero cost)
export const FREE_MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-3.5-lightning:free",
];

/**
 * Resolves the active AI provider, base URL, and default models.
 */
function getAIConfig() {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;

  // Check if key is OpenRouter (starts with sk-or-)
  const isKeyOpenRouter = (key?: string) => key && key.startsWith("sk-or-");

  if (openRouterKey || isKeyOpenRouter(openAIKey)) {
    const key = openRouterKey || openAIKey;
    const specifiedModel = process.env.AI_MODEL || process.env.OPENROUTER_MODEL;

    return {
      apiKey: key,
      baseUrl: "https://openrouter.ai/api/v1",
      models: specifiedModel ? [specifiedModel, ...FREE_MODELS.filter((m) => m !== specifiedModel)] : FREE_MODELS,
      provider: "openrouter" as const,
    };
  }

  // Standard OpenAI fallback
  return {
    apiKey: openAIKey,
    baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    models: [process.env.AI_MODEL || "gpt-4o-mini"],
    provider: "openai" as const,
  };
}

/**
 * Generates an empathetic, brand-aligned customer review reply using AI.
 */
export async function generateReviewReply(
  params: GenerateReviewReplyParams
): Promise<GenerateReviewReplyResult> {
  const config = getAIConfig();

  if (!config.apiKey || config.apiKey.includes("placeholder")) {
    return {
      success: false,
      error: "AI_KEY_NOT_CONFIGURED",
    };
  }

  const systemPrompt = `You are an expert customer relations manager representing "${params.businessName}" (${params.businessType || "local business"}).
Your task is to write a thoughtful, authentic reply to a Google customer review.

Brand Voice & Tone Guidelines:
- Tone: ${params.tone || "professional"}
- Language: ${params.language || "English"} (if review is in Hindi/Hinglish, reply respectfully in polite Hindi/Hinglish)
- Star Rating: ${params.starRating} out of 5 stars.

Critical Guardrails:
1. NEVER admit legal fault, negligence, or legal liability under any circumstances.
2. NEVER promise monetary refunds, free products, or specific unverified discounts.
3. For negative reviews (1-3 stars): Express genuine empathy, acknowledge their specific frustration, and politely invite them to resolve the issue directly with management via email or phone.
4. For positive reviews (4-5 stars): Thank the customer warmly, reference specific positive highlights they mentioned, and invite them back.
5. Keep the reply concise and professional (2 to 4 sentences). Do NOT include placeholders like [Your Name] or [Phone Number].`;

  const userPrompt = `Customer Reviewer: ${params.reviewerName}
Rating: ${params.starRating}/5 stars
Review Content: "${params.reviewComment}"

Please draft the response now:`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.apiKey}`,
  };

  if (config.provider === "openrouter") {
    headers["HTTP-Referer"] = process.env.NEXT_PUBLIC_APP_URL || "https://growera-ai.vercel.app";
    headers["X-Title"] = "Growera AI";
  }

  // Try candidate models in order (primary free model first, then fallback free models)
  for (const modelToTry of config.models) {
    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: modelToTry,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Model ${modelToTry} returned ${response.status}: ${errText}. Attempting fallback...`);
        continue;
      }

      const data = await response.json();
      const replyText = data.choices?.[0]?.message?.content?.trim();

      if (replyText) {
        let sentiment: "positive" | "neutral" | "negative" = "neutral";
        if (params.starRating >= 4) sentiment = "positive";
        else if (params.starRating <= 2) sentiment = "negative";

        return {
          success: true,
          reply: replyText,
          sentiment,
          modelUsed: modelToTry,
        };
      }
    } catch (err: any) {
      console.warn(`Request failed with model ${modelToTry}:`, err.message);
    }
  }

  return {
    success: false,
    error: "All free AI models currently unavailable. Please try again shortly.",
  };
}
