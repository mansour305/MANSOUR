import type { Request, RequestHandler } from "express";

const ADMIN_ROLES = new Set(["admin", "super_admin", "owner"]);

type SupabaseUser = {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

/**
 * ظٹط³طھط®ط±ط¬ ط§ظ„ط¯ظˆط± ظ…ظ† app_metadata ظپظ‚ط·.
 *
 * طھط­ط°ظٹط± ط£ظ…ظ†ظٹ: user_metadata ظ‚ط§ط¨ظ„ ظ„ظ„طھط¹ط¯ظٹظ„ ظ…ظ† ط§ظ„ظ…ط³طھط®ط¯ظ… ظ†ظپط³ظ‡ ط¹ط¨ط±
 * supabase.auth.updateUser({ data: {...} }) â†’ ط§ظ„ظˆط«ظˆظ‚ ط¨ظ‡ ظٹط³ظ…ط­ ط¨ط±ظپط¹ ط§ظ„طµظ„ط§ط­ظٹط§طھ.
 * app_metadata ظ„ط§ ظٹظڈط¹ط¯ظژظ‘ظ„ ط¥ظ„ط§ ظ…ظ† ط¬ط§ظ†ط¨ ط§ظ„ط®ط§ط¯ظ… (service_role) â†’ ظ…طµط¯ط± ط«ظ‚ط© ط§ظ„ط¯ظˆط±.
 */
function extractRole(user: SupabaseUser): string {
  const appRole = user.app_metadata?.role;
  if (typeof appRole === "string") return appRole;
  const appRoles = user.app_metadata?.roles;
  if (Array.isArray(appRoles)) {
    const match = appRoles.find((r) => typeof r === "string" && ADMIN_ROLES.has(r));
    if (typeof match === "string") return match;
  }
  return "user";
}

/**
 * requireAdmin â€” ظٹطھط­ظ‚ظ‚ ظ…ظ† Supabase JWT ظپظٹ ط±ط£ط³ Authorization ط«ظ… ظٹظپط­طµ ط§ظ„ط¯ظˆط±.
 *
 * - ظٹط·ظ„ط¨ Authorization: Bearer <supabase_access_token>
 * - ظٹطھط­ظ‚ظ‚ ظ…ظ† ط§ظ„طھظˆظƒظ† ط¹ط¨ط± Supabase Auth API (/auth/v1/user) ط¨ط§ط³طھط®ط¯ط§ظ… anon key
 * - ظٹط³ظ…ط­ ظپظ‚ط· ظ„ظ„ط£ط¯ظˆط§ط±: admin, super_admin, owner
 * - ظ„ط§ ظٹط«ظ‚ ط¨ط£ظٹ ط¹ظ„ظ… ظ…ط­ظ„ظٹ (localStorage) â€” ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط¬ط§ظ†ط¨ ط§ظ„ط®ط§ط¯ظ… ط­طµط±ط§ظ‹
 */
export const requireAdmin: RequestHandler = async (req, res, next) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    req.log?.error("requireAdmin: SUPABASE_URL ط£ظˆ SUPABASE_ANON_KEY ط؛ظٹط± ظ…ط¶ط¨ظˆط·ظٹظ†");
    res.status(503).json({ error: "ط®ط¯ظ…ط© ط§ظ„ظ…طµط§ط¯ظ‚ط© ط؛ظٹط± ظ…ظ‡ظٹط£ط© ط¹ظ„ظ‰ ط§ظ„ط®ط§ط¯ظ…" });
    return;
  }

  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!token) {
    res.status(401).json({ error: "ظ…ط·ظ„ظˆط¨ طھط³ط¬ظٹظ„ ط¯ط®ظˆظ„ ط§ظ„ظ…ط§ظ„ظƒ" });
    return;
  }

  try {
    const resp = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      res.status(401).json({ error: "ط¬ظ„ط³ط© ط؛ظٹط± طµط§ظ„ط­ط© ط£ظˆ ظ…ظ†طھظ‡ظٹط©" });
      return;
    }

    const user = (await resp.json()) as SupabaseUser;
    const role = extractRole(user);

    if (!ADMIN_ROLES.has(role)) {
      res.status(403).json({ error: "طµظ„ط§ط­ظٹط§طھ ط؛ظٹط± ظƒط§ظپظٹط©" });
      return;
    }

    (req as Request & { adminUser?: SupabaseUser }).adminUser = user;
    next();
  } catch (err) {
    req.log?.error({ err }, "requireAdmin: ظپط´ظ„ ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† Supabase");
    res.status(401).json({ error: "طھط¹ط°ط± ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ط¬ظ„ط³ط©" });
  }
};

