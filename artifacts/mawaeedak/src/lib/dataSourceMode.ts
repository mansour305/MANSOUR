/**
 * dataSourceMode.ts — مواعيدك
 *
 * Feature Flag لتحديد مصدر البيانات.
 *
 * قاعدة الإنتاج المعتمدة:
 * - Vercel الحالي ينشر الواجهة فقط ولا ينشر api-server.
 * - لذلك لا يجوز أن يرجع الإنتاج تلقائياً إلى api عند غياب VITE_DATA_SOURCE_MODE.
 * - إذا كانت مفاتيح Supabase موجودة في الإنتاج ولم يحدد المتغير، يكون Supabase هو المصدر.
 * - وضع api في الإنتاج مسموح فقط عند وجود VITE_API_BASE_URL صريح يشير إلى api-server منشور فعلاً.
 */

export type DataSourceMode = "api" | "supabase_shadow" | "supabase";

const rawMode = import.meta.env.VITE_DATA_SOURCE_MODE as string | undefined;
const isProductionRuntime = import.meta.env.PROD || import.meta.env.NODE_ENV === "production";
const hasSupabaseConfig = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
const hasApiBaseUrl = Boolean((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim());

function resolveMode(): DataSourceMode {
  if (rawMode === "supabase") return "supabase";
  if (rawMode === "supabase_shadow") return "supabase_shadow";

  if (rawMode === "api") {
    if (isProductionRuntime && !hasApiBaseUrl && hasSupabaseConfig) {
      console.warn(
        "[DataLayer] VITE_DATA_SOURCE_MODE=api ignored in production because VITE_API_BASE_URL is missing. Using Supabase."
      );
      return "supabase";
    }
    return "api";
  }

  if (isProductionRuntime && hasSupabaseConfig) {
    return "supabase";
  }

  return "api";
}

export const DATA_SOURCE_MODE: DataSourceMode = resolveMode();
export const DATA_SOURCE_CONFIG_STATUS = {
  rawMode: rawMode ?? null,
  isProductionRuntime,
  hasSupabaseConfig,
  hasApiBaseUrl,
  usingImplicitProductionSupabase: isProductionRuntime && !rawMode && hasSupabaseConfig && DATA_SOURCE_MODE === "supabase",
  apiModeRequiresDeployedServer: DATA_SOURCE_MODE === "api" && isProductionRuntime,
} as const;

export const isApiMode = DATA_SOURCE_MODE === "api";
export const isShadowMode = DATA_SOURCE_MODE === "supabase_shadow";
export const isSupabaseMode = DATA_SOURCE_MODE === "supabase";

if (import.meta.env.DEV) {
  console.info(`[DataLayer] وضع البيانات: ${DATA_SOURCE_MODE}`);
}