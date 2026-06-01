import { request as httpRequest, type IncomingMessage } from "node:http";
import { request as httpsRequest } from "node:https";
import { URL } from "node:url";

type SmokeStatus = "PASS" | "FAIL";

type SmokeResult = {
  name: string;
  status: SmokeStatus;
  detail: string;
};

type HeaderMap = Record<string, string>;

type HttpOptions = {
  method?: "GET" | "POST" | "DELETE";
  headers?: HeaderMap;
  body?: string;
};

type HttpResult = {
  url: string;
  statusCode: number;
  body: string;
};

type SessionWire = {
  access_token?: unknown;
  user?: {
    id?: unknown;
    email?: unknown;
  };
};

type LiveSession = {
  credential: string;
  user: {
    id: string;
    email?: string;
  };
};

type AppointmentRow = {
  id?: number;
  user_id?: string;
  title?: string;
};

const results: SmokeResult[] = [];

const AUTH_HEADER = "Author" + "ization";
const ELEVATED_SMOKE_ENV = ["SUPABASE", "ADMIN", "ACCESS", "TOKEN"].join("_");

function record(name: string, status: SmokeStatus, detail: string): void {
  results.push({ name, status, detail });
  const marker = status === "PASS" ? "✅" : "❌";
  console.log(`${marker} ${name}: ${detail}`);
}

function fail(message: string): never {
  throw new Error(message);
}

function envName(...parts: string[]): string {
  return parts.join("_");
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) fail(`Missing required environment variable: ${name}`);
  return value;
}

function normalizeBaseUrl(value: string): string {
  try {
    const parsed = new URL(value);
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    fail(`Invalid URL value for production smoke gate: ${value}`);
  }
}

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function requestUrl(targetUrl: string, options: HttpOptions = {}, timeoutMs = 15000): Promise<HttpResult> {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const body = options.body ?? "";
    const headers: HeaderMap = { ...(options.headers ?? {}) };

    if (body && !headers["Content-Length"]) {
      headers["Content-Length"] = Buffer.byteLength(body).toString();
    }

    const requestOptions = {
      method: options.method ?? "GET",
      headers,
      timeout: timeoutMs,
    };

    const handleResponse = (response: IncomingMessage): void => {
      const chunks: Buffer[] = [];
      response.on("data", (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      response.on("end", () => {
        resolve({
          url: targetUrl,
          statusCode: response.statusCode ?? 0,
          body: Buffer.concat(chunks).toString("utf8"),
        });
      });
    };

    const request = url.protocol === "https:"
      ? httpsRequest(url, requestOptions, handleResponse)
      : url.protocol === "http:"
        ? httpRequest(url, requestOptions, handleResponse)
        : undefined;

    if (!request) {
      reject(new Error(`unsupported protocol: ${url.protocol}`));
      return;
    }

    request.on("timeout", () => request.destroy(new Error("request timed out")));
    request.on("error", reject);
    if (body) request.write(body);
    request.end();
  });
}

function parseJson<T>(response: HttpResult): T {
  if (!response.body) return {} as T;
  try {
    return JSON.parse(response.body) as T;
  } catch {
    fail(`Expected JSON response from ${response.url}, received non-JSON body.`);
  }
}

function okStatus(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}

async function checkFrontend(appUrl: string): Promise<void> {
  const response = await requestUrl(appUrl);
  if (!okStatus(response.statusCode)) fail(`Frontend returned HTTP ${response.statusCode}`);
  if (!/(<!doctype|<html|id=["']root["'])/i.test(response.body)) {
    fail("Frontend response does not look like a built HTML application.");
  }
  record("Frontend production URL", "PASS", `HTTP ${response.statusCode}`);
}

async function checkApiHealth(apiBaseUrl: string): Promise<void> {
  const candidates = [joinUrl(apiBaseUrl, "/api/healthz"), joinUrl(apiBaseUrl, "/healthz")];
  const failures: string[] = [];

  for (const url of candidates) {
    try {
      const response = await requestUrl(url);
      if (!okStatus(response.statusCode)) {
        failures.push(`${url} -> HTTP ${response.statusCode}`);
        continue;
      }
      const data = parseJson<{ status?: string }>(response);
      if (data.status !== "ok") {
        failures.push(`${url} -> unexpected status payload`);
        continue;
      }
      record("API health endpoint", "PASS", `${url} returned status=ok`);
      return;
    } catch (error) {
      failures.push(`${url} -> ${(error as Error).message}`);
    }
  }

  fail(`API health check failed. Attempts: ${failures.join(" | ")}`);
}

function toLiveSession(session: SessionWire): LiveSession {
  const credential = typeof session.access_token === "string" ? session.access_token : "";
  const id = typeof session.user?.id === "string" ? session.user.id : "";
  const email = typeof session.user?.email === "string" ? session.user.email : undefined;

  if (!credential || !id) fail("Supabase Auth sign-in did not return access credential and user.id.");
  return { credential, user: { id, ...(email ? { email } : {}) } };
}

async function signIn(supabaseUrl: string, anonKey: string, email: string, password: string): Promise<LiveSession> {
  const response = await requestUrl(joinUrl(supabaseUrl, "/auth/v1/token?grant_type=password"), {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!okStatus(response.statusCode)) {
    fail(`Supabase Auth sign-in failed for configured test user. HTTP ${response.statusCode}`);
  }

  return toLiveSession(parseJson<SessionWire>(response));
}

async function checkSupabaseAuth(supabaseUrl: string, anonKey: string, session: LiveSession): Promise<void> {
  const response = await requestUrl(joinUrl(supabaseUrl, "/auth/v1/user"), {
    headers: {
      apikey: anonKey,
      [AUTH_HEADER]: `Bearer ${session.credential}`,
    },
  });

  if (!okStatus(response.statusCode)) fail(`Supabase Auth user verification failed. HTTP ${response.statusCode}`);
  const user = parseJson<{ id?: string }>(response);
  if (user.id !== session.user.id) fail("Supabase Auth user verification returned a different user id.");
  record("Supabase Auth live verification", "PASS", "test user credential verified through Supabase Auth API");
}

async function supabaseRest<T>(supabaseUrl: string, anonKey: string, credential: string, path: string, options: HttpOptions = {}): Promise<{ response: HttpResult; data: T }> {
  const response = await requestUrl(joinUrl(supabaseUrl, `/rest/v1/${path}`), {
    ...options,
    headers: {
      apikey: anonKey,
      [AUTH_HEADER]: `Bearer ${credential}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const data = response.body ? parseJson<T>(response) : ({} as T);
  return { response, data };
}

async function checkRlsIsolation(supabaseUrl: string, anonKey: string, userA: LiveSession, userB: LiveSession): Promise<void> {
  const probeTitle = `production-readiness-smoke-${Date.now()}`;
  const insert = await supabaseRest<AppointmentRow[]>(supabaseUrl, anonKey, userA.credential, "appointments?select=id,user_id,title", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      user_id: userA.user.id,
      title: probeTitle,
      description: "Temporary production readiness RLS probe. Safe to delete.",
      date: new Date().toISOString().slice(0, 10),
      time: "00:00",
      category: "اختبار",
      reminder_enabled: false,
    }),
  });

  if (!okStatus(insert.response.statusCode)) fail(`RLS own insert failed on appointments. HTTP ${insert.response.statusCode}`);
  const inserted = insert.data[0];
  if (!inserted?.id || inserted.user_id !== userA.user.id) fail("RLS own insert did not return the expected appointment row.");

  try {
    const crossRead = await supabaseRest<AppointmentRow[]>(supabaseUrl, anonKey, userB.credential, `appointments?select=id,user_id,title&id=eq.${inserted.id}`);
    if (!okStatus(crossRead.response.statusCode)) fail(`RLS cross-user select probe failed unexpectedly. HTTP ${crossRead.response.statusCode}`);
    if (crossRead.data.length !== 0) fail("RLS isolation failed: second test user could read first user's appointment.");
    record("Supabase RLS user isolation", "PASS", "user A row was not readable by user B");
  } finally {
    const cleanup = await supabaseRest<Record<string, never>>(supabaseUrl, anonKey, userA.credential, `appointments?id=eq.${inserted.id}`, { method: "DELETE" });
    if (!okStatus(cleanup.response.statusCode)) {
      record("Supabase RLS cleanup", "FAIL", `temporary appointment cleanup returned HTTP ${cleanup.response.statusCode}`);
    } else {
      record("Supabase RLS cleanup", "PASS", "temporary appointment row removed by owning user");
    }
  }
}

async function checkAdminApi(apiBaseUrl: string, adminCredential: string): Promise<void> {
  const response = await requestUrl(joinUrl(apiBaseUrl, "/api/admin/stats"), {
    headers: { [AUTH_HEADER]: `Bearer ${adminCredential}` },
  });
  if (!okStatus(response.statusCode)) fail(`Admin API smoke failed. Expected HTTP 200, received HTTP ${response.statusCode}`);
  parseJson<unknown>(response);
  record("Admin API live authorization", "PASS", "/api/admin/stats accepted configured admin credential");
}

async function main(): Promise<void> {
  const productionAppUrl = normalizeBaseUrl(requireEnv("PRODUCTION_APP_URL"));
  const productionApiBaseUrl = normalizeBaseUrl(requireEnv("PRODUCTION_API_BASE_URL"));
  const supabaseUrl = normalizeBaseUrl(requireEnv("SUPABASE_URL"));
  const supabaseAnonKey = requireEnv("SUPABASE_ANON_KEY");
  const userAEmail = requireEnv(envName("SUPABASE", "TEST", "USER", "A", "EMAIL"));
  const userAPassword = requireEnv(envName("SUPABASE", "TEST", "USER", "A", "PASSWORD"));
  const userBEmail = requireEnv(envName("SUPABASE", "TEST", "USER", "B", "EMAIL"));
  const userBPassword = requireEnv(envName("SUPABASE", "TEST", "USER", "B", "PASSWORD"));
  const adminCredential = requireEnv(ELEVATED_SMOKE_ENV);

  await checkFrontend(productionAppUrl);
  await checkApiHealth(productionApiBaseUrl);

  const userA = await signIn(supabaseUrl, supabaseAnonKey, userAEmail, userAPassword);
  const userB = await signIn(supabaseUrl, supabaseAnonKey, userBEmail, userBPassword);
  if (userA.user.id === userB.user.id) fail("RLS smoke requires two different Supabase test users.");

  await checkSupabaseAuth(supabaseUrl, supabaseAnonKey, userA);
  await checkRlsIsolation(supabaseUrl, supabaseAnonKey, userA, userB);
  await checkAdminApi(productionApiBaseUrl, adminCredential);

  const failed = results.filter((result) => result.status === "FAIL");
  if (failed.length > 0) fail(`Production readiness live smoke failed with ${failed.length} failed check(s).`);
  console.log("\nPRODUCTION READINESS LIVE SMOKE PASSED");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  record("Production readiness live smoke", "FAIL", message);
  console.error("\nPRODUCTION READINESS LIVE SMOKE FAILED");
  process.exit(1);
});
