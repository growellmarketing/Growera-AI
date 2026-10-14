import { Role } from "@/types";

export type Permission =
  | "view_reviews"
  | "draft_replies"
  | "publish_replies"
  | "manage_locations"
  | "connect_google"
  | "manage_members"
  | "manage_billing"
  | "delete_workspace";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    "view_reviews",
    "draft_replies",
    "publish_replies",
    "manage_locations",
    "connect_google",
    "manage_members",
    "manage_billing",
    "delete_workspace",
  ],
  admin: [
    "view_reviews",
    "draft_replies",
    "publish_replies",
    "manage_locations",
    "connect_google",
    "manage_members",
  ],
  member: [
    "view_reviews",
    "draft_replies",
  ],
  viewer: [
    "view_reviews",
  ],
};

/**
 * Checks whether a given role has permission to perform an action.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role];
  return allowed ? allowed.includes(permission) : false;
}

/**
 * Validates that a user role meets the minimum required role.
 */
export function isRoleSufficient(currentRole: Role, requiredRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    owner: 4,
    admin: 3,
    member: 2,
    viewer: 1,
  };

  return (hierarchy[currentRole] || 0) >= (hierarchy[requiredRole] || 0);
}
