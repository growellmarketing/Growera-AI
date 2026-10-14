import { describe, it, expect } from "vitest";
import { hasPermission, isRoleSufficient } from "@/lib/permissions";

describe("Role-Based Access Control (RBAC)", () => {
  it("should allow owner all permissions", () => {
    expect(hasPermission("owner", "delete_workspace")).toBe(true);
    expect(hasPermission("owner", "manage_billing")).toBe(true);
    expect(hasPermission("owner", "publish_replies")).toBe(true);
    expect(hasPermission("owner", "connect_google")).toBe(true);
  });

  it("should allow admin to publish and manage locations but not delete workspace", () => {
    expect(hasPermission("admin", "publish_replies")).toBe(true);
    expect(hasPermission("admin", "manage_locations")).toBe(true);
    expect(hasPermission("admin", "manage_billing")).toBe(false);
    expect(hasPermission("admin", "delete_workspace")).toBe(false);
  });

  it("should restrict member to drafting replies and viewing", () => {
    expect(hasPermission("member", "draft_replies")).toBe(true);
    expect(hasPermission("member", "view_reviews")).toBe(true);
    expect(hasPermission("member", "publish_replies")).toBe(false);
    expect(hasPermission("member", "connect_google")).toBe(false);
  });

  it("should restrict viewer to read-only operations", () => {
    expect(hasPermission("viewer", "view_reviews")).toBe(true);
    expect(hasPermission("viewer", "draft_replies")).toBe(false);
    expect(hasPermission("viewer", "publish_replies")).toBe(false);
  });

  it("should correctly evaluate role hierarchy", () => {
    expect(isRoleSufficient("owner", "admin")).toBe(true);
    expect(isRoleSufficient("admin", "admin")).toBe(true);
    expect(isRoleSufficient("member", "admin")).toBe(false);
    expect(isRoleSufficient("viewer", "member")).toBe(false);
  });
});
