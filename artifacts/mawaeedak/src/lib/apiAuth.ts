/**
 * apiAuth.ts â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
 *
 * ظٹط±ط¨ط· ط¬ظ„ط³ط© Supabase ط¨ط·ظ„ط¨ط§طھ ط§ظ„ظ€ API:
 * - getAccessToken: ظٹظ‚ط±ط£ access token ط§ظ„ط­ط§ظ„ظٹ ظ…ظ† Supabase (ط£ظˆ null)
 * - registerApiAuth: ظٹط³ط¬ظ‘ظ„ getter ظپظٹ api-client ظ„ط¥ط±ظپط§ظ‚ Bearer طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ط¹ظ„ظ‰ hooks ط§ظ„ظ…ظˆظ„ظ‘ط¯ط©
 * - authedFetch: ط؛ظ„ط§ظپ fetch ظٹظڈط±ظپظ‚ Authorization طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ظ„ظ„ظ†ط¯ط§ط،ط§طھ ط§ظ„ط®ط§ظ… (gateway/automation/settings)
 * - authedFetchWithTimeout: fetch ظ…ط¹ timeout ظˆ AbortController
 *
 * SECURITY: ظ„ط§ ظٹظڈط®ط²ظژظ‘ظ† ط£ظٹ طھظˆظƒظ† â€” ظٹظڈظ‚ط±ط£ ظ…ظ† Supabase ط¹ظ†ط¯ ظƒظ„ ط·ظ„ط¨.
 */

import { setAuthTokenGetter, setBaseUrl } from "./api-client";
import { supabase } from "./supabase";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Default timeout for API requests (10 seconds)
const DEFAULT_TIMEOUT_MS = 10000;

function normalizeApiBaseUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : null;
}

export async function getAccessToken(): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export function registerApiAuth(): void {
  setBaseUrl(normalizeApiBaseUrl(apiBaseUrl));
  setAuthTokenGetter(getAccessToken);
}

export async function authedFetch(
  input: string,
  init: RequestInit = {},
  options: { timeoutMs?: number; signal?: AbortSignal } = {}
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const token = await getAccessToken();
    const headers = new Headers(init.headers);
    const baseUrl = normalizeApiBaseUrl(apiBaseUrl);
    const requestUrl = baseUrl && input.startsWith("/") ? `${baseUrl}${input}` : input;
    
    if (token) headers.set("Authorization", `Bearer ${token}`);
    
    // Combine external signal with timeout signal
    const combinedSignal = signal 
      ? (() => { 
          const combined = new AbortController(); 
          signal.addEventListener('abort', () => combined.abort());
          controller.signal.addEventListener('abort', () => combined.abort());
          return combined.signal;
        })()
      : controller.signal;
    
    const response = await fetch(requestUrl, { 
      credentials: "include", 
      ...init, 
      headers,
      signal: combinedSignal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// Legacy export for backwards compatibility
export { authedFetch as fetchWithAuth };

