/**
 * apiAuth.ts — مواعيدك
 *
 * يربط جلسة Supabase بطلبات الـ API:
 * - getAccessToken: يقرأ access token الحالي من Supabase (أو null)
 * - registerApiAuth: يسجّل getter في api-client لإرفاق Bearer تلقائياً على hooks المولّدة
 * - authedFetch: غلاف fetch يُرفق Authorization تلقائياً للنداءات الخام (gateway/automation/settings)
 *
 * لا يُخزَّن أي توكن — يُقرأ من Supabase عند كل طلب.
 */

import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";
import { supabase } from "./supabase";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function normalizeApiBaseUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : null;
}

export async function getAccessToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export function registerApiAuth(): void {
  setBaseUrl(normalizeApiBaseUrl(apiBaseUrl));
  setAuthTokenGetter(getAccessToken);
}

export async function authedFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  const headers = new Headers(init.headers);
  const baseUrl = normalizeApiBaseUrl(apiBaseUrl);
  const requestUrl = baseUrl && input.startsWith("/") ? `${baseUrl}${input}` : input;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(requestUrl, { credentials: "include", ...init, headers });
}
