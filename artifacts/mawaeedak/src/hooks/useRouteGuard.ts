/**
 * Route Guards â€” ظ…ظˆط§ط¹ظٹط¯ظƒ Phase FINAL
 * 
 * ظ†ط¸ط§ظ… ط­ظ…ط§ظٹط© ظ…ظˆط­ط¯ ظ„ظ„ظ…ط³ط§ط±ط§طھ ط§ظ„ظ…ط­ظ…ظٹط©.
 * ظٹط³طھط®ط¯ظ… ظ„ظ„طھط­ظ‚ظ‚ ظ…ظ† طµظ„ط§ط­ظٹط§طھ ط§ظ„ظ…ط³طھط®ط¯ظ… ظ‚ط¨ظ„ ط§ظ„ظˆطµظˆظ„ ظ„ظ„طµظپط­ط§طھ ط§ظ„ظ…ط­ظ…ظٹط©.
 */

import { useStore } from "@/hooks/useStore";

export type RouteProtectionLevel = "public" | "authenticated" | "admin" | "owner";

interface RouteGuardConfig {
  protection: RouteProtectionLevel;
  redirectTo?: string;
  fallbackComponent?: React.ReactNode;
}

/**
 * ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ظ…ط³طھظˆظ‰ ط§ظ„ط­ظ…ط§ظٹط© ط§ظ„ظ…ط·ظ„ظˆط¨
 */
export function getRouteProtectionLevel(pathname: string): RouteProtectionLevel {
  // Admin routes - require admin role
  if (pathname.startsWith("/admin")) {
    return "admin";
  }

  // Protected user routes - require authentication
  const protectedPaths = [
    "/account",
    "/notifications",
    "/daily-card",
    "/calendar",
  ];

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    return "authenticated";
  }

  // Public routes
  return "public";
}

/**
 * ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† طµظ„ط§ط­ظٹط© ط§ظ„ظ…ط³طھط®ط¯ظ… ظ„ظ„ظˆطµظˆظ„ ظ„ظ„ظ…ط³ط§ط±
 */
export function canAccessRoute(
  pathname: string,
  user: ReturnType<typeof useStore>["user"]
): boolean {
  const protectionLevel = getRouteProtectionLevel(pathname);

  switch (protectionLevel) {
    case "public":
      return true;

    case "authenticated":
      // Require authenticated user
      return Boolean(user?.email);

    case "admin":
    case "owner":
      // Require admin role
      const role = user?.role;
      return ["admin", "super_admin", "owner"].includes(role as string);

    default:
      return false;
  }
}

/**
 * ط§ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ طµظپط­ط© ط§ظ„طھظˆط¬ظٹظ‡ ط¹ظ†ط¯ ط¹ط¯ظ… ط§ظ„طµظ„ط§ط­ظٹط©
 */
export function getRedirectPath(pathname: string, isAuthenticated: boolean): string {
  const protectionLevel = getRouteProtectionLevel(pathname);

  switch (protectionLevel) {
    case "authenticated":
      // Redirect to login with return URL
      return isAuthenticated ? "/" : "/login";

    case "admin":
    case "owner":
      // Redirect to home for non-admins
      return "/";

    default:
      return pathname;
  }
}

/**
 * Route Guard Component
 */
export function useRouteGuard(pathname: string) {
  const { user } = useStore();
  const isAuthenticated = Boolean(user?.email);
  const isAdmin = ["admin", "super_admin", "owner"].includes(user?.role || "");

  const protectionLevel = getRouteProtectionLevel(pathname);
  const canAccess = canAccessRoute(pathname, user);
  const redirectTo = getRedirectPath(pathname, isAuthenticated);

  return {
    protectionLevel,
    isAuthenticated,
    isAdmin,
    canAccess,
    redirectTo,
  };
}

/**
 * Admin Route Guard - ظ„ظ„طھط­ظ‚ظ‚ ظ…ظ† طµظ„ط§ط­ظٹط© ط§ظ„ظ…ط§ظ„ظƒ
 */
export function useAdminGuard() {
  const { user } = useStore();
  const role = user?.role;

  const isAdmin =
    user?.email &&
    ["admin", "super_admin", "owner"].includes(role as string);

  const hasAccess = Boolean(isAdmin);

  return {
    hasAccess,
    role,
    isOwner: role === "owner",
    isSuperAdmin: role === "super_admin",
    isAdmin: role === "admin",
  };
}

/**
 * Auth Route Guard - ظ„ظ„طھط­ظ‚ظ‚ ظ…ظ† طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„
 */
export function useAuthGuard() {
  const { user } = useStore();
  const isAuthenticated = Boolean(user?.email);

  return {
    isAuthenticated,
    user,
  };
}
