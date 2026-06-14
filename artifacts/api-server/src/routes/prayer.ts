import { Router } from "express";
import { db } from "@workspace/db";
import { prayerTimesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

const CITIES = [
  { value: "riyadh",        label: "ط§ظ„ط±ظٹط§ط¶" },
  { value: "jeddah",        label: "ط¬ط¯ط©" },
  { value: "mecca",         label: "ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©" },
  { value: "medina",        label: "ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ظ…ظ†ظˆط±ط©" },
  { value: "dammam",        label: "ط§ظ„ط¯ظ…ط§ظ…" },
  { value: "khobar",        label: "ط§ظ„ط®ط¨ط±" },
  { value: "abha",          label: "ط£ط¨ظ‡ط§" },
  { value: "khamis",        label: "ط®ظ…ظٹط³ ظ…ط´ظٹط·" },
  { value: "taif",          label: "ط§ظ„ط·ط§ط¦ظپ" },
  { value: "tabuk",         label: "طھط¨ظˆظƒ" },
  { value: "qassim",        label: "ط§ظ„ظ‚طµظٹظ…" },
  { value: "hail",          label: "ط­ط§ط¦ظ„" },
  { value: "jouf",          label: "ط§ظ„ط¬ظˆظپ" },
  { value: "jazan",         label: "ط¬ظٹط²ط§ظ†" },
  { value: "najran",        label: "ظ†ط¬ط±ط§ظ†" },
  { value: "baha",          label: "ط§ظ„ط¨ط§ط­ط©" },
  { value: "sakaka",        label: "ط³ظƒط§ظƒط§" },
  { value: "arar",          label: "ط¹ط±ط¹ط±" },
  { value: "yanbu",         label: "ظٹظ†ط¨ط¹" },
  { value: "jubail",        label: "ط§ظ„ط¬ط¨ظٹظ„" },
  { value: "ahsa",          label: "ط§ظ„ط£ط­ط³ط§ط،" },
];

const ARABIC_TO_KEY: Record<string, string> = {
  "ط§ظ„ط±ظٹط§ط¶": "riyadh",
  "ط¬ط¯ط©": "jeddah",
  "ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©": "mecca",
  "ظ…ظƒط©": "mecca",
  "ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ظ…ظ†ظˆط±ط©": "medina",
  "ط§ظ„ظ…ط¯ظٹظ†ط©": "medina",
  "ط§ظ„ط¯ظ…ط§ظ…": "dammam",
  "ط§ظ„ط®ط¨ط±": "khobar",
  "ط£ط¨ظ‡ط§": "abha",
  "ط®ظ…ظٹط³ ظ…ط´ظٹط·": "khamis",
  "ط§ظ„ط·ط§ط¦ظپ": "taif",
  "طھط¨ظˆظƒ": "tabuk",
  "ط¨ط±ظٹط¯ط©": "qassim",
  "ط§ظ„ظ‚طµظٹظ…": "qassim",
  "ط­ط§ط¦ظ„": "hail",
  "ط§ظ„ط¬ظˆظپ": "jouf",
  "ط³ظƒط§ظƒط§": "sakaka",
  "ط¬ظٹط²ط§ظ†": "jazan",
  "ط¬ط§ط²ط§ظ†": "jazan",
  "ظ†ط¬ط±ط§ظ†": "najran",
  "ط§ظ„ط¨ط§ط­ط©": "baha",
  "ط¹ط±ط¹ط±": "arar",
  "ظٹظ†ط¨ط¹": "yanbu",
  "ط§ظ„ط¬ط¨ظٹظ„": "jubail",
  "ط§ظ„ط£ط­ط³ط§ط،": "ahsa",
};

function resolveCity(raw: string): string {
  const trimmed = raw.trim();
  return ARABIC_TO_KEY[trimmed] ?? trimmed.toLowerCase();
}

function riyadhDateParts(): { dateKey: string; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(new Date());
  const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  const dateKey = `${String(read("year")).padStart(4, "0")}-${String(read("month")).padStart(2, "0")}-${String(read("day")).padStart(2, "0")}`;
  const hour = read("hour");
  return { dateKey, hour: hour === 24 ? 0 : hour, minute: read("minute") };
}

function getNextPrayer(times: { fajr: string; sunrise: string; dhuhr: string; asr: string; maghrib: string; isha: string }): { next_prayer: string; time_remaining: string } {
  const now = riyadhDateParts();
  const currentTime = now.hour * 60 + now.minute;
  const prayers = [
    { name: "ط§ظ„ظپط¬ط±", time: times.fajr },
    { name: "ط§ظ„ط´ط±ظˆظ‚", time: times.sunrise },
    { name: "ط§ظ„ط¸ظ‡ط±", time: times.dhuhr },
    { name: "ط§ظ„ط¹طµط±", time: times.asr },
    { name: "ط§ظ„ظ…ط؛ط±ط¨", time: times.maghrib },
    { name: "ط§ظ„ط¹ط´ط§ط،", time: times.isha },
  ];

  for (const prayer of prayers) {
    const [h, m] = prayer.time.split(":").map(Number);
    const prayerMinutes = h * 60 + m;
    if (prayerMinutes > currentTime) {
      const diff = prayerMinutes - currentTime;
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      const timeStr = hours > 0 ? `${hours} ط³ط§ط¹ط© ${minutes} ط¯ظ‚ظٹظ‚ط©` : `${minutes} ط¯ظ‚ظٹظ‚ط©`;
      return { next_prayer: prayer.name, time_remaining: timeStr };
    }
  }

  const [h, m] = times.fajr.split(":").map(Number);
  const fajrMinutes = h * 60 + m;
  const diff = 24 * 60 - currentTime + fajrMinutes;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return { next_prayer: "ط§ظ„ظپط¬ط±", time_remaining: `${hours} ط³ط§ط¹ط© ${minutes} ط¯ظ‚ظٹظ‚ط©` };
}

router.get("/prayer-times/cities", (_req, res) => {
  return res.json(CITIES);
});

router.get("/prayer-times", async (req, res) => {
  const rawCity = (req.query.city as string) ?? "riyadh";
  const city = resolveCity(rawCity);
  const today = riyadhDateParts().dateKey;
  
  // Query official prayer times for today from DB
  const dbRows = await db.select().from(prayerTimesTable).where(
    and(
      eq(prayerTimesTable.city_key, city),
      eq(prayerTimesTable.date_gregorian, today)
    )
  );
  
  const dbRow = dbRows[0];
  
  // No built-in fallback values: return error if no official data.
  if (!dbRow) {
    return res.status(404).json({
      error: "ظ„ط§ طھطھظˆظپط± ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ط§ظ„ط±ط³ظ…ظٹط© ظ„ظ‡ط°ط§ ط§ظ„ظٹظˆظ… ظˆط§ظ„ظ…ط¯ظٹظ†ط©",
      city,
      date: today,
      available: false,
      message: "ظٹط±ط¬ظ‰ ط¥ط¶ط§ظپط© ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ط§ظ„ط±ط³ظ…ظٹط© ظ…ظ† ط®ظ„ط§ظ„ ظ„ظˆط­ط© ط§ظ„ظ…ط§ظ„ظƒ ط£ظˆ ط§ظ„ط§طھطµط§ظ„ ط¨ظ…ط³ط¤ظˆظ„ ط§ظ„ظ†ط¸ط§ظ…",
    });
  }
  
  const { next_prayer, time_remaining } = getNextPrayer(dbRow);

  return res.json({
    city,
    date: today,
    fajr: dbRow.fajr,
    sunrise: dbRow.sunrise,
    dhuhr: dbRow.dhuhr,
    asr: dbRow.asr,
    maghrib: dbRow.maghrib,
    isha: dbRow.isha,
    next_prayer,
    time_remaining,
    source: dbRow.source ?? null,
    is_official: true,
  });
});

export default router;

