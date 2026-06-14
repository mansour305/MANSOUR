/**
 * Auth Service â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
 *
 * ظٹظˆظپط± ظˆط§ط¬ظ‡ط© ظ…ظˆط­ط¯ط© ظ„ظ„ظ…طµط§ط¯ظ‚ط©:
 * - Supabase Auth ط¹ظ†ط¯ طھظˆظپط± ط§ظ„ظ…ظپط§طھظٹط­
 * - ظ…ظ…ظ†ظˆط¹ Demo mode ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬
 */

import { supabase, isSupabaseEnabled, isProduction } from "./supabase";

export type AuthUser = {
  id: string;
  email?: string;
  role?: "user" | "admin" | "super_admin" | "owner";
  displayName?: string;
};

export type AuthSession = {
  user: AuthUser;
  isDemo: boolean;
};

// â”€â”€ Demo mode constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DEMO_ADMIN_USERNAME = "admin";
const DEMO_ADMIN_PASSWORD = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "admin123";
const DEMO_SESSION_KEY = "mawaeedak_demo_session";
// Demo mode allowed in development when no Supabase, or when explicitly configured
const isDemoAuthAllowed = import.meta.env.DEV && !isProduction;

// â”€â”€ Admin roles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ADMIN_ROLES = ["admin", "super_admin", "owner"] as const;

// â”€â”€ Supabase Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * signInWithSupabase â€” طھط³ط¬ظٹظ„ ط¯ط®ظˆظ„ ط¹ط¨ط± Supabase Auth
 */
async function signInWithSupabase(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * signOutFromSupabase â€” طھط³ط¬ظٹظ„ ط®ط±ظˆط¬ ظ…ظ† Supabase
 */
async function signOutFromSupabase(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * getSupabaseSession â€” ظ‚ط±ط§ط،ط© session ط§ظ„ط­ط§ظ„ظٹط©
 */
async function getSupabaseSession(): Promise<AuthSession | null> {
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return null;

  const user = data.session.user;

  // Trust roles only from app_metadata. user_metadata is user-editable and
  // must not grant production admin access.
  const rawRole =
    (user.app_metadata?.role as AuthUser["role"] | undefined) ??
    "user";

  return {
    user: {
      id: user.id,
      email: user.email,
      role: rawRole,
      displayName:
        user.user_metadata?.display_name ??
        user.user_metadata?.name ??
        user.email?.split("@")[0],
    },
    isDemo: false,
  };
}

// â”€â”€ Demo mode Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * signInDemo â€” طھط³ط¬ظٹظ„ ط¯ط®ظˆظ„ demo (username/password)
 */
function signInDemo(
  username: string,
  password: string
): { success: boolean; error?: string } {
  if (!isDemoAuthAllowed) {
    return { success: false, error: "طھط³ط¬ظٹظ„ ط¯ط®ظˆظ„ ط§ظ„ط¹ط±ط¶ ط؛ظٹط± ظ…طھط§ط­ ظپظٹ ط¨ظٹط¦ط© ط§ظ„ط¥ظ†طھط§ط¬" };
  }

  if (username === DEMO_ADMIN_USERNAME && password === DEMO_ADMIN_PASSWORD) {
    const demoUser = {
      user: { id: "demo-admin", role: "admin", displayName: "ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ…" },
      isDemo: true,
    };
    sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser));
    // Also save to localStorage so useStore picks it up
    localStorage.setItem('app-user', JSON.stringify({
      id: "demo-admin",
      name: "ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ…",
      email: "demo@mawaeedak.local",
      city: "ط§ظ„ط±ظٹط§ط¶",
      cityKey: "riyadh",
      timezone: "Asia/Riyadh",
      role: "admin",
      onboardingComplete: true,
      interests: [],
    }));
    return { success: true };
  }
  return { success: false, error: "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ط£ظˆ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط؛ظٹط± طµط­ظٹط­ط©" };
}

/**
 * signOutDemo â€” طھط³ط¬ظٹظ„ ط®ط±ظˆط¬ demo
 */
function signOutDemo(): void {
  sessionStorage.removeItem(DEMO_SESSION_KEY);
}

/**
 * getDemoSession â€” ظ‚ط±ط§ط،ط© session demo
 */
function getDemoSession(): AuthSession | null {
  if (!isDemoAuthAllowed) {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    return null;
  }

  try {
    const raw = sessionStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed || !parsed.user || typeof parsed.user.id !== "string") {
      sessionStorage.removeItem(DEMO_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    return null;
  }
}

// â”€â”€ Unified Auth API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * authSignIn â€” طھط³ط¬ظٹظ„ ط¯ط®ظˆظ„ ظ…ظˆط­ط¯
 * Supabase Auth ظپظ‚ط· ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬
 * Demo mode ظ…ظ…ظ†ظˆط¹ ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬
 */
export async function authSignIn(
  usernameOrEmail: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  // Production requires Supabase
  if (isProduction && !isSupabaseEnabled) {
    return { success: false, error: "ط§ظ„طھط·ط¨ظٹظ‚ ظٹطھط·ظ„ط¨ ط¥ط¹ط¯ط§ط¯ Supabase ظ„ظ„ط§طھطµط§ظ„" };
  }
  
  if (isSupabaseEnabled) {
    return signInWithSupabase(usernameOrEmail, password);
  }
  
  // Demo mode only in development
  if (isDemoAuthAllowed) {
    return signInDemo(usernameOrEmail, password);
  }
  
  return { success: false, error: "طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ظٹطھط·ظ„ط¨ ط¥ط¹ط¯ط§ط¯ Supabase" };
}

/**
 * authSignOut â€” طھط³ط¬ظٹظ„ ط®ط±ظˆط¬ ظ…ظˆط­ط¯
 */
export async function authSignOut(): Promise<void> {
  if (isSupabaseEnabled) {
    await signOutFromSupabase();
  } else {
    signOutDemo();
  }
}

/**
 * getAuthSession â€” ظ‚ط±ط§ط،ط© session ظ…ظˆط­ط¯ط©
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  if (isSupabaseEnabled) {
    return getSupabaseSession();
  }
  return getDemoSession();
}

/**
 * isAdminUser â€” ظ‡ظ„ ط§ظ„ظ…ط³طھط®ط¯ظ… admin ط£ظˆ super_adminطں
 */
export function isAdminUser(session: AuthSession | null): boolean {
  if (!session?.user?.id) return false;

  if (session.isDemo) {
    return (
      isDemoAuthAllowed &&
      session.user.id === "demo-admin" &&
      session.user.role === "admin"
    );
  }

  return ADMIN_ROLES.includes(session.user.role as typeof ADMIN_ROLES[number]);
}

/**
 * isAllowedAdminSession â€” guard for legacy admin login call sites.
 */
export function isAllowedAdminSession(session: AuthSession | null): boolean {
  return isAdminUser(session);
}

declare global {
  var isAllowedAdminSession: ((session: AuthSession | null) => boolean) | undefined;
}

globalThis.isAllowedAdminSession = isAllowedAdminSession;

/**
 * getAuthMode â€” ظˆط¶ط¹ ط§ظ„ظ…طµط§ط¯ظ‚ط© ط§ظ„ط­ط§ظ„ظٹ
 */
export function getAuthMode(): "supabase" | "demo" {
  return isSupabaseEnabled ? "supabase" : "demo";
}

