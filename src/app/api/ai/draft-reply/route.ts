import { NextRequest, NextResponse } from "next/server";
import { generateReviewReply } from "@/lib/ai/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName = "Our Business",
      businessType,
      reviewerName = "Valued Customer",
      starRating = 5,
      reviewComment = "",
      tone = "professional",
      language = "English",
    } = body;

    const result = await generateReviewReply({
      businessName,
      businessType,
      reviewerName,
      starRating,
      reviewComment,
      tone,
      language,
    });

    if (result.success && result.reply) {
      return NextResponse.json({
        success: true,
        reply: result.reply,
        sentiment: result.sentiment,
        modelUsed: process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
      });
    }

    // Graceful fallback if AI key is missing or model quota exceeded
    let fallbackReply = "";
    if (starRating >= 4) {
      if (tone === "friendly") {
        fallbackReply = `Hi ${reviewerName}! Thank you so much for the glowing review and support! We're thrilled you had a great experience and can't wait to see you again soon.`;
      } else if (tone === "concise") {
        fallbackReply = `Thank you ${reviewerName}! We truly appreciate your feedback and look forward to welcoming you back.`;
      } else {
        fallbackReply = `Dear ${reviewerName}, thank you for taking the time to share your review. We are delighted to hear you had a positive experience with us and look forward to serving you again.`;
      }
    } else {
      if (tone === "empathetic" || tone === "professional") {
        fallbackReply = `Dear ${reviewerName}, thank you for your feedback. We sincerely apologize that your experience did not meet expectations. We take this seriously and would appreciate the opportunity to make things right. Please reach out to our team directly so we can assist you.`;
      } else {
        fallbackReply = `Hi ${reviewerName}, we're sorry to hear about your experience. Your satisfaction is very important to us, and we would love to connect directly to resolve this for you.`;
      }
    }

    return NextResponse.json({
      success: true,
      reply: fallbackReply,
      sentiment: starRating >= 4 ? "positive" : "negative",
      fallback: true,
      notice: result.error || "Using template draft (AI key not configured)",
    });
  } catch (error: any) {
    console.error("AI Draft API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate draft reply",
      },
      { status: 500 }
    );
  }
}
