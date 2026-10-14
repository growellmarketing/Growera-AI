import { z } from "zod";

/**
 * Validation schema for workspace creation.
 */
export const CreateWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters").max(60),
  business_type: z.enum([
    "restaurant",
    "salon",
    "healthcare",
    "retail",
    "services",
    "agency",
  ]),
  default_reply_tone: z
    .enum(["professional", "empathetic", "friendly", "concise"])
    .default("professional"),
  default_language: z.string().min(2).max(10).default("en"),
});

/**
 * Validation schema for generating an AI reply draft.
 */
export const GenerateAiDraftSchema = z.object({
  review_id: z.string().uuid("Invalid review ID format"),
  tone: z.enum(["professional", "empathetic", "friendly", "concise"]),
  language: z.string().min(2).max(10).default("en"),
  custom_instructions: z.string().max(300).optional(),
});

/**
 * Validation schema for approving and publishing a review reply to Google.
 */
export const PublishReplySchema = z.object({
  review_id: z.string().uuid("Invalid review ID format"),
  reply_text: z
    .string()
    .min(3, "Reply must be at least 3 characters")
    .max(4000, "Google review replies cannot exceed 4000 characters"),
});

/**
 * Validation schema for inviting a team member.
 */
export const InviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member", "viewer"]),
});
