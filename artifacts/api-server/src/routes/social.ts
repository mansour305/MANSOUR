/**
 * Social Automation Admin Routes â€” X / Twitter
 * GET   /api/admin/social/settings
 * PATCH /api/admin/social/settings
 * GET   /api/admin/social/logs
 * POST  /api/admin/social/preview
 * POST  /api/admin/social/test
 *
 * Live posting is intentionally deferred: the test endpoint validates the
 * pipeline and reports missing credentials honestly. It never fakes success.
 */

import { Router } from "express";
import { requireAdmin } from "../middlewares/requireAdmin";
import { db } from "@workspace/db";
import {
  socialAutomationSettingsTable,
  socialAutomationLogsTable,
  dailyMessagesTable,
} from "@workspace/db";
import { desc, eq, and } from "drizzle-orm";
import { getRiyadhDateString } from "../lib/dailyContentService";

const router = Router();

// X/Twitter credentials are owner-supplied secrets. We only check presence.
const REQUIRED_X_SECRETS = [
  "X_CLIENT_ID",
  "X_CLIENT_SECRET",
  "X_ACCESS_TOKEN",
  "X_ACCESS_TOKEN_SECRET",
];

function missingXSecrets(): string[] {
  return REQUIRED_X_SECRETS.filter((k) => !process.env[k] || process.env[k]!.trim() === "");
}

async function getOrCreateSettings() {
  const rows = await db
    .select()
    .from(socialAutomationSettingsTable)
    .where(eq(socialAutomationSettingsTable.platform, "x"))
    .limit(1);
  if (rows[0]) return rows[0];
  const [created] = await db
    .insert(socialAutomationSettingsTable)
    .values({
      platform: "x",
      is_enabled: false,
      post_time: "00:05",
      template: "{date}\n\n{message}\n\nظ…ظˆط§ط¹ظٹط¯ظƒ",
    })
    .returning();
  return created!;
}

async function buildPostContent(template: string): Promise<string> {
  const today = getRiyadhDateString();
  const rows = await db
    .select()
    .from(dailyMessagesTable)
    .where(and(eq(dailyMessagesTable.display_date, today), eq(dailyMessagesTable.is_active, true)))
    .limit(1);
  const message = rows[0]?.message ?? "";
  const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
    timeZone: "Asia/Riyadh",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const tpl = template && template.trim() !== "" ? template : "{date}\n\n{message}\n\nظ…ظˆط§ط¹ظٹط¯ظƒ";
  return tpl.replace(/\{date\}/g, hijri).replace(/\{message\}/g, message).trim();
}

router.get("/admin/social/settings", requireAdmin, async (_req, res) => {
  const settings = await getOrCreateSettings();
  return res.json(settings);
});

router.patch("/admin/social/settings", requireAdmin, async (req, res) => {
  const current = await getOrCreateSettings();
  const allowed: Record<string, unknown> = {};
  if (typeof req.body.is_enabled === "boolean") allowed.is_enabled = req.body.is_enabled;
  if (typeof req.body.post_time === "string") allowed.post_time = req.body.post_time;
  if (typeof req.body.template === "string") allowed.template = req.body.template;
  if (typeof req.body.account_handle === "string") allowed.account_handle = req.body.account_handle;
  const [row] = await db
    .update(socialAutomationSettingsTable)
    .set({ ...allowed, updated_at: new Date() })
    .where(eq(socialAutomationSettingsTable.id, current.id))
    .returning();
  return res.json(row);
});

router.get("/admin/social/logs", requireAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(socialAutomationLogsTable)
    .where(eq(socialAutomationLogsTable.platform, "x"))
    .orderBy(desc(socialAutomationLogsTable.created_at))
    .limit(50);
  return res.json(rows);
});

router.post("/admin/social/preview", requireAdmin, async (req, res) => {
  const settings = await getOrCreateSettings();
  const content = await buildPostContent(settings.template);
  await db.insert(socialAutomationLogsTable).values({
    platform: "x",
    kind: "preview",
    status: "ok",
    content,
    detail: "ظ…ط¹ط§ظٹظ†ط© ظ…ظ† ط¨ظٹط§ظ†ط§طھ ط­ظٹط©",
  });
  req.log.info("[Social] preview generated");
  return res.json({ content });
});

router.post("/admin/social/test", requireAdmin, async (req, res) => {
  const settings = await getOrCreateSettings();
  const content = await buildPostContent(settings.template);
  const missing = missingXSecrets();

  if (missing.length > 0) {
    const message = `ط§ظ„ظ†ط´ط± ط§ظ„ظ…ط¨ط§ط´ط± ط؛ظٹط± ظ…ظڈظپط¹ظ‘ظ„: ط§ظ„ظ…ظپط§طھظٹط­ ط§ظ„ظ†ط§ظ‚طµط© ${missing.join("طŒ ")}. ط£ط¶ظپ ظ…ظپط§طھظٹط­ X ظپظٹ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ظ„طھظپط¹ظٹظ„ ط§ظ„ظ†ط´ط± ط§ظ„ظپط¹ظ„ظٹ.`;
    await db.insert(socialAutomationLogsTable).values({
      platform: "x",
      kind: "test",
      status: "missing_credentials",
      content,
      detail: `missing: ${missing.join(",")}`,
    });
    req.log.warn({ missing }, "[Social] test â€” missing credentials");
    return res.json({ ok: false, status: "missing_credentials", message, content, missing_secrets: missing });
  }

  // Credentials present but live posting is deferred (P2). Report honestly.
  const message = "طھظ… ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظ…ظپط§طھظٹط­ ط¨ظ†ط¬ط§ط­. ط§ظ„ظ†ط´ط± ط§ظ„ظ…ط¨ط§ط´ط± ط¥ظ„ظ‰ X ط³ظٹظڈظپط¹ظ‘ظ„ ظ„ط§ط­ظ‚ط§ظ‹ (ظ‚ظٹط¯ ط§ظ„ط¥ط¹ط¯ط§ط¯) â€” ظ„ظ… ظٹطھظ… ظ†ط´ط± طھط؛ط±ظٹط¯ط© ظپط¹ظ„ظٹط©.";
  await db.insert(socialAutomationLogsTable).values({
    platform: "x",
    kind: "test",
    status: "validated",
    content,
    detail: "credentials present; live posting deferred",
  });
  req.log.info("[Social] test â€” credentials validated, posting deferred");
  return res.json({ ok: true, status: "validated", message, content, missing_secrets: [] });
});

export default router;

