import { Router } from "express";
import { db } from "@workspace/db";
import { appSettingsTable, auditLogsTable, themesTable, DEFAULT_THEME_KEY } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

const DEFAULT_THEME_FALLBACK = "heritage";

function parseSlug(body: unknown): { slug: string } | null {
  if (!body || typeof body !== "object") return null;
  const slug = (body as Record<string, unknown>).slug;
  if (typeof slug !== "string") return null;
  const trimmed = slug.trim();
  if (trimmed.length < 1 || trimmed.length > 64) return null;
  return { slug: trimmed };
}

/**
 * GET /api/settings/default-theme â€” ط§ظ„ط«ظٹظ… ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ط§ظ„ط¹ط§ظ… (ط¹ط§ظ… ظ„ظ„ظ‚ط±ط§ط،ط©).
 * ظٹط¹ظ…ظ„ ظپظٹ ظƒظ„ ط£ظˆط¶ط§ط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ„ط£ظ† Express ظ…طھط§ط­ ط¯ط§ط¦ظ…ط§ظ‹.
 */
router.get("/settings/default-theme", async (_req, res) => {
  const [row] = await db
    .select()
    .from(appSettingsTable)
    .where(eq(appSettingsTable.key, DEFAULT_THEME_KEY));
  return res.json({ slug: row?.value ?? DEFAULT_THEME_FALLBACK });
});

/**
 * PUT /api/settings/default-theme â€” طھط¹ظٹظٹظ† ط§ظ„ط«ظٹظ… ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ط§ظ„ط¹ط§ظ… (ظ„ظ„ظ…ط§ظ„ظƒ ظپظ‚ط·).
 */
router.put("/settings/default-theme", requireAdmin, async (req, res) => {
  const parsed = parseSlug(req.body);
  if (!parsed) return res.status(400).json({ error: "slug ط؛ظٹط± طµط§ظ„ط­" });

  const { slug } = parsed;
  const adminUser = (req as any).adminUser;
  const actorId = adminUser?.id ?? adminUser?.email ?? null;

  const [theme] = await db.select().from(themesTable).where(eq(themesTable.slug, slug));
  if (!theme) return res.status(404).json({ error: "ط«ظٹظ… ط؛ظٹط± ظ…ظˆط¬ظˆط¯" });
  if (!theme.is_active) return res.status(400).json({ error: "ظ„ط§ ظٹظ…ظƒظ† طھط¹ظٹظٹظ† ط«ظٹظ… ظ…ط¹ط·ظ‘ظ„ ظƒط§ظپطھط±ط§ط¶ظٹ" });

  await db
    .insert(appSettingsTable)
    .values({ key: DEFAULT_THEME_KEY, value: slug, updated_at: new Date() })
    .onConflictDoUpdate({
      target: appSettingsTable.key,
      set: { value: slug, updated_at: new Date() },
    });

  await db.insert(auditLogsTable).values({
    action: "update",
    entity_type: "app_setting",
    entity_id: null,
    entity_name: DEFAULT_THEME_KEY,
    description: `طھط¹ظٹظٹظ† ط§ظ„ط«ظٹظ… ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ط§ظ„ط¹ط§ظ…: ${theme.name}`,
    performed_by: actorId ?? "system",
    status: "success",
  });

  return res.json({ slug });
});

export default router;

