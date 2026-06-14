/**
 * Supabase Client â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
 *
 * ط§ظ„ط­ط§ظ„ط© ط§ظ„ط­ط§ظ„ظٹط©: ط¬ط§ظ‡ط² ظ„ظ„ط±ط¨ط· ط§ظ„ظپط¹ظ„ظٹ
 * ط¹ظ†ط¯ ط¥ط¶ط§ظپط© VITE_SUPABASE_URL ظˆ VITE_SUPABASE_ANON_KEYطŒ
 * ظٹظڈظپط¹ظژظ‘ظ„ ط§ظ„ط§طھطµط§ظ„ طھظ„ظ‚ط§ط¦ظٹط§ظ‹.
 *
 * طھط­ط°ظٹط± ط£ظ…ظ†ظٹ:
 * - ط§ط³طھط®ط¯ظ… VITE_SUPABASE_ANON_KEY ظپظ‚ط· ظ‡ظ†ط§ (client-side)
 * - ظ„ط§ طھط¶ط¹ ظ…ظپط§طھظٹط­ ط§ظ„ط®ط§ط¯ظ… ط¹ط§ظ„ظٹط© ط§ظ„طµظ„ط§ط­ظٹط© ظ‡ظ†ط§ ط£ط¨ط¯ط§ظ‹
 * - RLS ظٹط­ظ…ظٹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…ظ† ط¬ط§ظ†ط¨ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * isProduction â€” ظ‡ظ„ ظ†ط­ظ† ظپظٹ ط¨ظٹط¦ط© ط§ظ„ط¥ظ†طھط§ط¬طں
 */
export const isProduction = import.meta.env.PROD || import.meta.env.NODE_ENV === "production";

/**
 * isSupabaseConfigured â€” ظ‡ظ„ Supabase ظ…ظپط¹ظ„طں
 */
export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * supabase â€” null ط¥ط°ط§ ط§ظ„ظ…ظپط§طھظٹط­ ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط© (demo/fallback mode)
 * ظٹظڈط³طھط®ط¯ظ… Supabase ظپظ‚ط· ط¥ط°ط§ ظƒط§ظ† ط§ظ„ط§طھطµط§ظ„ ظ…طھط§ط­ط§ظ‹
 */
export const supabase: SupabaseClient | null =
  isSupabaseEnabled && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    : null;

/**
 * PRODUCTION VALIDATION
 * ظ„ط§ ظٹظڈط¹ط±ط¶ ط§ظ„طھط·ط¨ظٹظ‚ ظƒظ€ "ط¬ط§ظ‡ط²" ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬ ط¨ط¯ظˆظ† Supabase
 */
if (isProduction && !isSupabaseEnabled) {
  console.error(
    "[ظ…ظˆط§ط¹ظٹط¯ظƒ] ط®ط·ط£ ط¥ط¹ط¯ط§ط¯: ط§ظ„طھط·ط¨ظٹظ‚ ظپظٹ ظˆط¶ط¹ ط§ظ„ط¥ظ†طھط§ط¬ ظ„ظƒظ† ظ…ظپط§طھظٹط­ Supabase ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط©.\n" +
    "VITE_SUPABASE_URL ظˆ VITE_SUPABASE_ANON_KEY ظ…ط·ظ„ظˆط¨ط©.\n" +
    "ط§ظ„طھط·ط¨ظٹظ‚ ظ„ط§ ظٹط¹ظ…ظ„ ط¨ط¯ظˆظ† Supabase ظپظٹ ط¨ظٹط¦ط© ط§ظ„ط¥ظ†طھط§ط¬."
  );
}

if (import.meta.env.DEV) {
  if (!isSupabaseEnabled) {
    console.info(
      "[Supabase] ط؛ظٹط± ظ…ظپط¹ظ‘ظ„ â€” VITE_SUPABASE_URL ط£ظˆ VITE_SUPABASE_ANON_KEY ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط§ظ†. " +
        "ط§ظ„طھط·ط¨ظٹظ‚ ظٹط¹ظ…ظ„ ط¨ظ€ demo/fallback mode (development ظپظ‚ط·)."
    );
  } else {
    console.info("[Supabase] ظ…طھطµظ„ âœ…");
  }
}

/**
 * PRODUCTION BLOCK: ظٹظ…ظ†ط¹ ط§ظ„طھط·ط¨ظٹظ‚ ظ…ظ† ط§ظ„ط¹ظ…ظ„ ط¨ط¯ظˆظ† Supabase ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬
 */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    if (isProduction) {
      throw new Error(
        "ط®ط·ط£ ط¥ط¹ط¯ط§ط¯: ط§ظ„طھط·ط¨ظٹظ‚ ظٹطھط·ظ„ط¨ Supabase ظپظٹ ط¨ظٹط¦ط© ط§ظ„ط¥ظ†طھط§ط¬. " +
        "ط£ط¶ظپ VITE_SUPABASE_URL ظˆ VITE_SUPABASE_ANON_KEY ظپظٹ ظ…ظ„ظپ .env"
      );
    }
    throw new Error("Supabase ط؛ظٹط± ظ…ظ‡ظٹط£. ط£ط¶ظپ ظ…ظپط§طھظٹط­ Supabase ظپظٹ .env");
  }
  return supabase;
}

