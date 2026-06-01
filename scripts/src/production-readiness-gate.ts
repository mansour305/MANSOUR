import { request as httpRequest, type IncomingMessage } from "node:http";
import { request as httpsRequest } from "node:https";
import { URL } from "node:url";

// This script intentionally avoids DOM fetch types so it typechecks under the
// repository's Node-only scripts tsconfig.

type CheckStatus = "passed" | "failed";

type CheckResult = {
  name: string;
  status: CheckStatus;
  detail: string;
};

type HeaderMap = Record<string, string>;

type HttpResult = {
  statusCode: number;
  body: string;
};

const results: CheckResult[] = [];

function pass(name: string, detail: string): void {
  results.push({ name, status: "passed", detail });
  console.log(`✅ ${name}: ${detail}`);
}

function fail(name: string, detail: string): void {
  results.push({ name, status: "failed", detail });
  console.error(`❌ ${name}: ${detail}`);
}

function requiredEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (!value) {
    fail(`env:${name}`, "missing");
    return undefined;
  }
  pass(`env:${name}`, "present");
  return value;
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (!value) {
    console.log(`⚠️ env:${name}: not set; related optional smoke skipped`);
    return undefined;
  }
  pass(`env:${name}`, "present");
  return value;
}

function normalizeUrl(name: string, raw: string | undefined): string | undefined {
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    const normalized = url.toString().replace(/\/+$/, "");
    pass(`url:${name}`, normalized);
    return normalized;
  } catch {
    fail(`url:${name}`, `invalid URL: ${raw}`);
    return undefined;
  }
}

function requestUrl(targetUrl: string, headers: HeaderMap = {}): Promise<HttpResult> {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const options = {
      method: "GET",
      headers,
      timeout: 15_000,
    };

    const handleResponse = (response: IncomingMessage): void => {
      const chunks: Buffer[] = [];

      response.on("data", (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });

      response.on("end", () => {
        resolve({
          statusCode: response.statusCode ?? 0,
          body: Buffer.concat(chunks).toString("utf8"),
        });
      });
    };

    const request = url.protocol === "https:"
      ? httpsRequest(url, options, handleResponse)
      : url.protocol === "http:"
        ? httpRequest(url, options, handleResponse)
        : undefined;

    if (!request) {
      reject(new Error(`unsupported protocol: ${url.protocol}`));
      return;
    }

    request.on("timeout", () => {
      request.destroy(new Error("request timed out"));
    });

    request.on("error", reject);
    request.end();
  });
}

async function expectStatus(
  name: string,
  url: string | undefined,
  expectedStatuses: number[],
  headers?: HeaderMap,
): Promise<void> {
  if (!url) return;

  try {
    const response = await requestUrl(url, headers);
    if (expectedStatuses.includes(response.statusCode)) {
      pass(name, `HTTP ${response.statusCode}`);
      return;
    }

    const bodyPreview = response.body ? ` — ${response.body.slice(0, 180)}` : "";
    fail(name, `expected ${expectedStatuses.join("/")}, got HTTP ${response.statusCode}${bodyPreview}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(name, message);
  }
}

async function main(): Promise<void> {
  const apiBase = normalizeUrl("PRODUCTION_API_BASE_URL", requiredEnv("PRODUCTION_API_BASE_URL"));
  const webBase = normalizeUrl("PRODUCTION_WEB_BASE_URL", optionalEnv("PRODUCTION_WEB_BASE_URL"));
  const serverSupabaseUrl = normalizeUrl("SUPABASE_URL", requiredEnv("SUPABASE_URL"));
  const clientSupabaseUrl = normalizeUrl("VITE_SUPABASE_URL", requiredEnv("VITE_SUPABASE_URL"));
  const serverAnonKey = requiredEnv("SUPABASE_ANON_KEY");
  const clientAnonKey = requiredEnv("VITE_SUPABASE_ANON_KEY");
  requiredEnv("DATABASE_URL");

  if (serverSupabaseUrl && clientSupabaseUrl && serverSupabaseUrl !== clientSupabaseUrl) {
    fail("supabase:url-consistency", "SUPABASE_URL and VITE_SUPABASE_URL point to different projects");
  } else if (serverSupabaseUrl && clientSupabaseUrl) {
    pass("supabase:url-consistency", "server and client URLs match");
  }

  if (serverAnonKey && clientAnonKey && serverAnonKey !== clientAnonKey) {
    fail("supabase:anon-key-consistency", "SUPABASE_ANON_KEY and VITE_SUPABASE_ANON_KEY differ");
  } else if (serverAnonKey && clientAnonKey) {
    pass("supabase:anon-key-consistency", "server and client anon keys match");
  }

  await expectStatus("api:healthz", apiBase ? `${apiBase}/api/healthz` : undefined, [200]);

  await expectStatus(
    "supabase:auth-user-with-anon-only-rejected",
    serverSupabaseUrl ? `${serverSupabaseUrl}/auth/v1/user` : undefined,
    [401, 403],
    serverAnonKey
      ? {
          apikey: serverAnonKey,
          Authorization: `Bearer ${serverAnonKey}`,
        }
      : undefined,
  );

  await expectStatus(
    "admin:protected-without-token",
    apiBase ? `${apiBase}/api/admin/stats` : undefined,
    [401],
  );

  const adminToken = optionalEnv("LIVE_ADMIN_BEARER_TOKEN");
  if (adminToken) {
    await expectStatus(
      "admin:authorized-smoke",
      apiBase ? `${apiBase}/api/admin/stats` : undefined,
      [200],
      { Authorization: `Bearer ${adminToken}` },
    );
  }

  if (webBase) {
    await expectStatus("web:root", webBase, [200]);
  }

  const failed = results.filter((result) => result.status === "failed");
  console.log("\nProduction readiness gate summary");
  console.table(results);

  if (failed.length > 0) {
    console.error(`\nProduction readiness gate failed with ${failed.length} blocker(s).`);
    process.exit(1);
  }

  console.log("\nProduction readiness gate passed.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exit(1);
});
