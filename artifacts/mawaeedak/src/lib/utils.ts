import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInitials(name: string): string {
  if (!name) return "ظ…";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0);
  return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
}

// ظƒظ„ ط¹ط±ظˆط¶ ط§ظ„طھط§ط±ظٹط® طھطھط¨ط¹ ط­ط¯ظˆط¯ ظٹظˆظ… ط§ظ„ط±ظٹط§ط¶ (Asia/Riyadh) ط¨طµط±ظپ ط§ظ„ظ†ط¸ط± ط¹ظ† ظ…ظ†ط·ظ‚ط© ط§ظ„ط¬ظ‡ط§ط².
const KSA_TZ = "Asia/Riyadh";

export function formatHijriDate(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
      timeZone: KSA_TZ,
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "طھط§ط±ظٹط® ظ‡ط¬ط±ظٹ ط؛ظٹط± ظ…طھط§ط­";
  }
}

export function formatGregorianDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
    timeZone: KSA_TZ,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getDayName(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("ar-SA", { timeZone: KSA_TZ, weekday: "long" }).format(date);
}

// ظ„ط­ط¸ط© ظ…ظ†طھطµظپ ظ„ظٹظ„ ظٹظˆظ… ظ…ط¹ظٹظ† (YYYY-MM-DD) ط¨طھظˆظ‚ظٹطھ ط§ظ„ط±ظٹط§ط¶ (UTC+3طŒ ط¨ظ„ط§ طھظˆظ‚ظٹطھ طµظٹظپظٹ).
// طھظڈط³طھط®ط¯ظ… ظƒظ‡ط¯ظپ ط«ط§ط¨طھ ظ„ظ„ط¹ط¯ظ‘ط§ط¯ ط§ظ„ط­ظٹ ط¨ط­ظٹط« ظٹطµط­ ظ„ط£ظٹ ظ…ط³طھط®ط¯ظ… ظ…ظ‡ظ…ط§ ظƒط§ظ†طھ ظ…ظ†ط·ظ‚طھظ‡.
export function ksaMidnight(dateStr: string): Date {
  return new Date(String(dateStr).slice(0, 10) + "T00:00:00+03:00");
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount == null) return "";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
  }).format(num);
}

/**
 * formatAppTime - ظ…ط±ظƒط²ظٹط© طھظ†ط³ظٹظ‚ ط§ظ„ظˆظ‚طھ (12h / 24h)
 *
 * @param value - ظˆظ‚طھ ط¨طµظٹط؛ط© "HH:mm" (ظ…ط«ظ„ "03:45")طŒ ط£ظˆ null/undefined
 * @param format - "12h" | "24h" (ط§ظ„ط§ظپطھط±ط§ط¶ظٹ "12h")
 */
export function formatAppTime(
  value: string | null | undefined,
  format: "12h" | "24h" = "12h",
): string {
  if (!value) return "-";
  try {
    const [hStr, mStr] = value.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return value;
    const mm = String(m).padStart(2, "0");
    if (format === "24h") {
      return `${String(h).padStart(2, "0")}:${mm}`;
    }
    const period = h < 12 ? "طµ" : "ظ…";
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${mm} ${period}`;
  } catch {
    return value;
  }
}

