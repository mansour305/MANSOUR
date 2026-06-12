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
 *
 * مهمة:
 * - في الإنتاج، إذا لم يكن Supabase مهيأً ولم يكن VITE_API_BASE_URL متاحاً، أظهر خطأ بدء واضح.
 * - لا تسقط بصمت إلى وضع api في الإنتاج بدون خادم API منشور.
 */

export type DataSourceMode = "api" | "supabase_shadow" | "supabase" | "error";

export type DataSourceConfigStatus = {
  rawMode: string | null;
  isProductionRuntime: boolean;
  hasSupabaseConfig: boolean;
  hasApiBaseUrl: boolean;
  usingImplicitProductionSupabase: boolean;
  apiModeRequiresDeployedServer: boolean;
  productionModeError: string | null;
};

const rawMode = import.meta.env.VITE_DATA_SOURCE_MODE as string | undefined;
const isProductionRuntime = import.meta.env.PROD || import.meta.env.NODE_ENV === "production";
const hasSupabaseConfig = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
const hasApiBaseUrl = Boolean((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim());

function resolveMode(): { mode: DataSourceMode; error: string | null } {
  if (rawMode === "supabase") return { mode: "supabase", error: null };
  if (rawMode === "supabase_shadow") return { mode: "supabase_shadow", error: null };

  if (rawMode === "api") {
    if (isProductionRuntime && !hasApiBaseUrl && hasSupabaseConfig) {
      console.warn(
        "[DataLayer] VITE_DATA_SOURCE_MODE=api ignored in production because VITE_API_BASE_URL is missing. Using Supabase."
      );
      return { mode: "supabase", error: null };
    }
    if (isProductionRuntime && !hasApiBaseUrl && !hasSupabaseConfig) {
      const error = "[DataLayer] PRODUCTION ERROR: No Supabase config (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) and no VITE_API_BASE_URL. Cannot use 'api' mode in production without a deployed API server.";
      console.error(error);
      return { mode: "error", error };
    }
    return { mode: "api", error: null };
  }

  if (isProductionRuntime) {
    if (!hasSupabaseConfig && !hasApiBaseUrl) {
      const error = "[DataLayer] PRODUCTION ERROR: No Supabase config and no API URL. Production deployment requires either VITE_SUPABASE_URL+VITE_SUPABASE_ANON_KEY or VITE_API_BASE_URL.";
      console.error(error);
      return { mode: "error", error };
    }
    if (hasSupabaseConfig) {
      return { mode: "supabase", error: null };
    }
    if (hasApiBaseUrl) {
      const error = "[DataLayer] PRODUCTION WARNING: Using API mode without Supabase. API server must be deployed separately.";
      console.warn(error);
      return { mode: "api", error };
    }
  }

  // Development fallback
  if (hasSupabaseConfig) {
    return { mode: "supabase", error: null };
  }
  
  return { mode: "api", error: null };
}

const { mode: resolvedMode, error: productionError } = resolveMode();

export const DATA_SOURCE_MODE: DataSourceMode = resolvedMode;
export const DATA_SOURCE_CONFIG_STATUS: DataSourceConfigStatus = {
  rawMode: rawMode ?? null,
  isProductionRuntime,
  hasSupabaseConfig,
  hasApiBaseUrl,
  usingImplicitProductionSupabase: isProductionRuntime && !rawMode && hasSupabaseConfig && DATA_SOURCE_MODE === "supabase",
  apiModeRequiresDeployedServer: DATA_SOURCE_MODE === "api" && isProductionRuntime,
  productionModeError: productionError,
};

export const isApiMode = DATA_SOURCE_MODE === "api";
export const isShadowMode = DATA_SOURCE_MODE === "supabase_shadow";
export const isSupabaseMode = DATA_SOURCE_MODE === "supabase";
export const isErrorMode = DATA_SOURCE_MODE === "error";

// Production mode error - throw in production if not properly configured
if (isProductionRuntime && DATA_SOURCE_MODE === "error") {
  throw new Error(
    `Mawaeedak Production Configuration Error:\n\n` +
    `No valid data source configured for production deployment.\n\n` +
    `Required: Either set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, ` +
    `or set VITE_API_BASE_URL to a deployed API server.\n\n` +
    `Current status:\n` +
    `- hasSupabaseConfig: ${hasSupabaseConfig}\n` +
    `- hasApiBaseUrl: ${hasApiBaseUrl}\n` +
    `- VITE_DATA_SOURCE_MODE: ${rawMode ?? 'not set'}`
  );
}

if (import.meta.env.DEV) {
  console.info(`[DataLayer] وضع البيانات: ${DATA_SOURCE_MODE}${productionError ? ` (${productionError})` : ''}`);
}