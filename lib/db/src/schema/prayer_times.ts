import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Prayer times table.
 *
 * This schema extends the original by including a `date` field (ISO
 * YYYY-MM-DD), a `city_key` to identify the locality, and `source` / `method`
 * fields to describe how the times were obtained (e.g. official data from
 * ظˆط²ط§ط±ط© ط§ظ„ط´ط¤ظˆظ† ط§ظ„ط¥ط³ظ„ط§ظ…ظٹط© or calculations based on the Umm Alâ€‘Qura calendar).
 */
export const prayerTimesTable = pgTable("prayer_times", {
  id: serial("id").primaryKey(),
  /**
   * Key of the city, e.g. "riyadh", which should map to an entry in a
   * separate cities table or configuration.
   */
  city_key: text("city_key").notNull(),
  /**
   * Arabic name of the city for display purposes.
   */
  city_name_ar: text("city_name_ar").notNull(),
  /**
   * Gregorian date for these prayer times (YYYY-MM-DD).
   */
  date_gregorian: text("date_gregorian").notNull(),
  /**
   * Hijri date for these prayer times (DDâ€‘MMâ€‘YYYY), if available.
   */
  date_hijri: text("date_hijri"),
  fajr: text("fajr").notNull(),
  sunrise: text("sunrise").notNull(),
  dhuhr: text("dhuhr").notNull(),
  asr: text("asr").notNull(),
  maghrib: text("maghrib").notNull(),
  isha: text("isha").notNull(),
  /**
   * Optional description of the authority or method used to compute these
   * prayer times, e.g. "طھظ‚ظˆظٹظ… ط£ظ… ط§ظ„ظ‚ط±ظ‰" or "ظˆط²ط§ط±ط© ط§ظ„ط´ط¤ظˆظ† ط§ظ„ط¥ط³ظ„ط§ظ…ظٹط©".
   */
  source: text("source"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertPrayerTimesSchema = createInsertSchema(prayerTimesTable).omit({
  id: true,
  created_at: true,
});
export type InsertPrayerTimes = z.infer<typeof insertPrayerTimesSchema>;
export type PrayerTimes = typeof prayerTimesTable.$inferSelect;
