/**
 * Riyadh Time Utilities — مواعيدك
 * 
 * يوفر وظائف للتعامل مع توقيت السعودية (Asia/Riyadh)
 * بداية اليوم = 00:00 بتوقيت السعودية
 */

export const RIYADH_TIMEZONE = "Asia/Riyadh";

/**
 * getRiyadhNow — الحصول على التاريخ والوقت الحالي بتوقيت السعودية
 */
export function getRiyadhNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: RIYADH_TIMEZONE }));
}

/**
 * getRiyadhTodayKey — مفتاح فريد لليوم الحالي بتوقيت السعودية
 * يستخدم للـ caching والتحديث عند منتصف الليل
 */
export function getRiyadhTodayKey(): string {
  const riyadh = getRiyadhNow();
  return `${riyadh.getFullYear()}-${String(riyadh.getMonth() + 1).padStart(2, "0")}-${String(riyadh.getDate()).padStart(2, "0")}`;
}

/**
 * getRiyadhStartOfDay — بداية اليوم بتوقيت السعودية (00:00)
 */
export function getRiyadhStartOfDay(): Date {
  const riyadh = getRiyadhNow();
  return new Date(Date.UTC(riyadh.getFullYear(), riyadh.getMonth(), riyadh.getDate(), 0, 0, 0, 0));
}

/**
 * getNextMidnightRiyadh — منتصف الليل القادم بتوقيت السعودية
 */
export function getNextMidnightRiyadh(): Date {
  const riyadh = getRiyadhNow();
  const tomorrow = new Date(Date.UTC(riyadh.getFullYear(), riyadh.getMonth(), riyadh.getDate() + 1, 0, 0, 0, 0));
  return tomorrow;
}

/**
 * shouldRolloverToday — هل يجب التحديث بسبب بداية يوم جديد؟
 * يقارن اليوم الحالي باليوم المحفوظ في localStorage
 */
export function shouldRolloverToday(storageKey = "mawaeedak_riyadh_day"): boolean {
  const todayKey = getRiyadhTodayKey();
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored !== todayKey) {
      localStorage.setItem(storageKey, todayKey);
      return true;
    }
  } catch {
    // Ignore storage errors
  }
  return false;
}

/**
 * getTimeUntilMidnightRiyadh — الوقت المتبقي حتى منتصف الليل بتوقيت السعودية (بالمللي ثانية)
 */
export function getTimeUntilMidnightRiyadh(): number {
  const now = getRiyadhNow();
  const midnight = getNextMidnightRiyadh();
  return midnight.getTime() - now.getTime();
}

/**
 * formatTimeByPreference — تنسيق الوقت حسب تفضيل المستخدم (12h/24h)
 */
export function formatTimeByPreference(
  time: string | null | undefined,
  preference: "12h" | "24h" = "24h"
): string {
  if (!time) return "--:--";
  
  const match = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return time;
  
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  
  if (preference === "24h") {
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }
  
  const period = hours >= 12 ? "م" : "ص";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
}

/**
 * calculateDaysRemaining — حساب الأيام المتبقية حتى تاريخ معين
 */
export function calculateDaysRemaining(targetDate: string | Date): number {
  const today = getRiyadhStartOfDay();
  const target = new Date(targetDate);
  const diffMs = target.getTime() - today.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * calculateCountdownToDate — حساب العد التنازلي حتى تاريخ معين (بالمللي ثانية)
 */
export function calculateCountdownToDate(targetDate: string | Date): number {
  const now = getRiyadhNow().getTime();
  const target = new Date(targetDate).getTime();
  return Math.max(0, target - now);
}

/**
 * parseTimeToDateToday — تحويل وقت إلى Date لليوم الحالي بتوقيت السعودية
 */
export function parseTimeToDateToday(time: string | null | undefined): Date | null {
  if (!time) return null;
  
  const match = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;
  
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  
  const today = getRiyadhNow();
  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0));
}

/**
 * getNextPrayerTime — الحصول على وقت الصلاة القادمة
 */
export function getNextPrayerTime(prayers: {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}): { key: string; label: string; time: Date } | null {
  const now = getRiyadhNow();
  const prayerKeys = [
    { key: "fajr", label: "الفجر", timeKey: "fajr" },
    { key: "sunrise", label: "الشروق", timeKey: "sunrise" },
    { key: "dhuhr", label: "الظهر", timeKey: "dhuhr" },
    { key: "asr", label: "العصر", timeKey: "asr" },
    { key: "maghrib", label: "المغرب", timeKey: "maghrib" },
    { key: "isha", label: "العشاء", timeKey: "isha" },
  ];
  
  for (const prayer of prayerKeys) {
    const prayerTime = parseTimeToDateToday(prayers[prayer.timeKey as keyof typeof prayers]);
    if (prayerTime && prayerTime > now) {
      return { key: prayer.key, label: prayer.label, time: prayerTime };
    }
  }
  
  // All prayers passed, return fajr of next day
  const fajrTime = parseTimeToDateToday(prayers.fajr);
  if (fajrTime) {
    fajrTime.setDate(fajrTime.getDate() + 1);
    return { key: "fajr", label: "الفجر", time: fajrTime };
  }
  
  return null;
}

/**
 * getPrayerCountdown — حساب العد التنازلي للصلاة القادمة (بالمللي ثانية)
 */
export function getPrayerCountdown(prayers: {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}): number | null {
  const nextPrayer = getNextPrayerTime(prayers);
  if (!nextPrayer) return null;
  
  const now = getRiyadhNow().getTime();
  return Math.max(0, nextPrayer.time.getTime() - now);
}
