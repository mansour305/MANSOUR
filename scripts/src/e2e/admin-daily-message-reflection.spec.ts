/// <reference lib="dom" />
import { test, expect, type Page } from "@playwright/test";

const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:80";
const adminEmail = process.env.ADMIN_E2E_EMAIL ?? "";
const adminPassword = process.env.ADMIN_E2E_PASSWORD ?? "";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

async function waitForAdminReady(page: Page) {
  await page.waitForFunction(
    () => {
      const title = document.querySelector("header h1")?.textContent?.trim();
      return title === "لوحة المالك" || document.body.innerText.includes("لوحة المالك");
    },
    {},
    { timeout: 15_000 }
  );
}

async function login(page: Page) {
  await page.goto(`${baseUrl}/admin?reset=1`);
  await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 8_000 });
  await page.locator('input[type="email"]').first().fill(adminEmail);
  await page.locator('input[type="password"]').first().fill(adminPassword);
  await page.locator('button[type="submit"]').first().click();
  await waitForAdminReady(page);
}

test.beforeAll(() => {
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_E2E_EMAIL and ADMIN_E2E_PASSWORD are required");
  }
});

test("admin daily message is visible on home after create and refresh", async ({ page }) => {
  test.setTimeout(60_000);
  const message = `رسالة لوحة المالك ${Date.now()}`;

  await login(page);
  await page.goto(`${baseUrl}/admin/messages`);
  await waitForAdminReady(page);
  await expect(page.getByRole("heading", { name: "الرسائل اليومية" })).toBeVisible({ timeout: 8_000 });

  await page.getByRole("button", { name: /إضافة رسالة/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
  await page.locator("textarea").first().fill(message);
  await page.locator('input[type="date"]').first().fill(todayIso());
  await page.getByRole("button", { name: "حفظ" }).click();
  await expect(page.getByText(message)).toBeVisible({ timeout: 15_000 });

  await page.reload();
  await waitForAdminReady(page);
  await expect(page.getByText(message)).toBeVisible({ timeout: 15_000 });

  await page.goto(`${baseUrl}/`);
  await expect(page.getByText(message)).toBeVisible({ timeout: 15_000 });
  await page.reload();
  await expect(page.getByText(message)).toBeVisible({ timeout: 15_000 });
});
