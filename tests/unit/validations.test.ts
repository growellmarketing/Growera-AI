import { describe, it, expect } from "vitest";
import { 
  CreateWorkspaceSchema, 
  GenerateAiDraftSchema, 
  PublishReplySchema, 
  InviteMemberSchema 
} from "@/lib/validations";

describe("Input Validation Schemas (Zod)", () => {
  it("should validate workspace creation inputs", () => {
    const valid = {
      name: "Spice Symphony",
      business_type: "restaurant",
      default_reply_tone: "empathetic",
      default_language: "en",
    };
    expect(CreateWorkspaceSchema.parse(valid)).toEqual(valid);

    expect(() =>
      CreateWorkspaceSchema.parse({ name: "A", business_type: "invalid_type" })
    ).toThrow();
  });

  it("should validate AI reply draft requests", () => {
    const valid = {
      review_id: "123e4567-e89b-12d3-a456-426614174000",
      tone: "professional",
      language: "en",
    };
    expect(GenerateAiDraftSchema.parse(valid)).toEqual(valid);

    expect(() =>
      GenerateAiDraftSchema.parse({ review_id: "not-a-uuid", tone: "invalid" })
    ).toThrow();
  });

  it("should enforce Google character limit on reply publication", () => {
    const valid = {
      review_id: "123e4567-e89b-12d3-a456-426614174000",
      reply_text: "Thank you for visiting us!",
    };
    expect(PublishReplySchema.parse(valid)).toEqual(valid);

    const oversized = {
      review_id: "123e4567-e89b-12d3-a456-426614174000",
      reply_text: "A".repeat(4001),
    };
    expect(() => PublishReplySchema.parse(oversized)).toThrow();
  });

  it("should validate team member invitations", () => {
    expect(
      InviteMemberSchema.parse({ email: "colleague@brand.com", role: "admin" })
    ).toBeDefined();

    expect(() =>
      InviteMemberSchema.parse({ email: "invalid-email", role: "superadmin" })
    ).toThrow();
  });
});
