/**
 * Prayer Times Service â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
 * 
 * ط®ط¯ظ…ط© ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©
 * ظٹط³طھط®ط¯ظ… Asia/Riyadh ظ„ظ„طھظˆظ‚ظٹطھ
 * ط§ظ„ظ‚ط±ط§ط،ط© ط­ط³ط¨ city_key
 */

import { supabase, isSupabaseEnabled } from "./supabase";
import { getRiyadhNow, getRiyadhTodayKey, parseTimeToDateToday, formatTimeByPreference } from "./riyadhTime";

export type PrayerTimes = {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

export type PrayerTimeRecord = {
  id: string;
  city_key: string;
  city_name_ar: string;
  date_gregorian: string;
  date_hijri: string;
  timezone: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  source_name: string | null;
  source_url: string | null;
  is_official: boolean;
  is_confirmed: boolean;
  approval_status: string;
  last_verified_at: string | null;
};

export type NextPrayer = {
  key: keyof PrayerTimes;
  label: string;
  time: Date;
  countdown: number;
};

const PRAYER_LABELS: Record<keyof PrayerTimes, string> = {
  fajr: "ط§ظ„ظپط¬ط±",
  sunrise: "ط§ظ„ط´ط±ظˆظ‚",
  dhuhr: "ط§ظ„ط¸ظ‡ط±",
  asr: "ط§ظ„ط¹طµط±",
  maghrib: "ط§ظ„ظ…ط؛ط±ط¨",
  isha: "ط§ظ„ط¹ط´ط§ط،",
};

// Saudi cities with their keys
export const SAUDI_CITIES: Record<string, string> = {
  riyadh: "ط§ظ„ط±ظٹط§ط¶",
  jeddah: "ط¬ط¯ط©",
  makkah: "ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©",
  madinah: "ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ظ…ظ†ظˆط±ط©",
  dammam: "ط§ظ„ط¯ظ…ط§ظ…",
  khobar: "ط§ظ„ط®ط¨ط±",
  dhahran: "ط§ظ„ط¸ظ‡ط±ط§ظ†",
  taif: "ط§ظ„ط·ط§ط¦ظپ",
  qatif: "ط§ظ„ظ‚ط·ظٹظپ",
  jubail: "ط§ظ„ط¬ط¨ظٹظ„",
  alkobar: "ط§ظ„ط®ط¨ط±",
  alahsa: "ط§ظ„ط£ط­ط³ط§ط،",
  najran: "ظ†ط¬ط±ط§ظ†",
  jazan: "ط¬ط§ط²ط§ظ†",
  abha: "ط£ط¨ظ‡ط§",
  hail: "ط­ط§ط¦ظ„",
  tabuk: "طھط¨ظˆظƒ",
  bisha: "ط¨ظٹط´ط©",
  rafha: "ط±ظپط­ط©",
  hofuf: "ط§ظ„ظ‡ظپظˆظپ",
  buraydah: "ط¨ط±ظٹط¯ط©",
  unaizah: "ط¹ظ†ظٹط²ط©",
  arar: "ط¹ط±ط¹ط±",
  sakaka: "ط³ظƒط§ظƒط§",
};

const CITY_KEY_ALIASES: Record<string, string> = {
  alkobar: "khobar",
  alkhobar: "khobar",
  al_hasa: "alhasa",
  alahsa: "alhasa",
  ahsa: "alhasa",
  "ط§ظ„ط£ط­ط³ط§ط،": "alhasa",
  "ط§ظ„ط§ط­ط³ط§ط،": "alhasa",
  "ط§ظ„ط®ط¨ط±": "khobar",
  "ط§ظ„ط±ظٹط§ط¶": "riyadh",
  "ط¬ط¯ط©": "jeddah",
  "ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©": "makkah",
  "ظ…ظƒط©": "makkah",
  "ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ظ…ظ†ظˆط±ط©": "madinah",
  "ط§ظ„ظ…ط¯ظٹظ†ط©": "madinah",
  "ط§ظ„ط¯ظ…ط§ظ…": "dammam",
  "ط§ظ„ط¸ظ‡ط±ط§ظ†": "dhahran",
  "ط§ظ„ط·ط§ط¦ظپ": "taif",
  "ط§ظ„ظ‚ط·ظٹظپ": "qatif",
  "ط§ظ„ط¬ط¨ظٹظ„": "jubail",
  "ظ†ط¬ط±ط§ظ†": "najran",
  "ط¬ط§ط²ط§ظ†": "jazan",
  "ط£ط¨ظ‡ط§": "abha",
  "ط§ط¨ظ‡ط§": "abha",
  "ط­ط§ط¦ظ„": "hail",
  "طھط¨ظˆظƒ": "tabuk",
  "ط¨ظٹط´ط©": "bisha",
  "ط±ظپط­ط§ط،": "rafha",
  "ط§ظ„ظ‡ظپظˆظپ": "hofuf",
  "ط¨ط±ظٹط¯ط©": "buraydah",
  "ط¹ظ†ظٹط²ط©": "unaizah",
  "ط¹ط±ط¹ط±": "arar",
  "ط³ظƒط§ظƒط§": "sakaka",
};

export function normalizeCityKey(cityKey: string | null | undefined): string | null {
  if (!cityKey) return null;

  const trimmed = cityKey.trim();
  if (!trimmed) return null;

  const canonical = trimmed.toLowerCase().replace(/\s+/g, "_");
  const alias = CITY_KEY_ALIASES[trimmed] || CITY_KEY_ALIASES[canonical] || canonical;
  return SAUDI_CITIES[alias] ? alias : null;
}

/**
 * getPrayerTimesForCity â€” ط¬ظ„ط¨ ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ظ„ظ„ظ…ط¯ظٹظ†ط©
 */
export async function getPrayerTimesForCity(cityKey: string): Promise<PrayerTimeRecord | null> {
  if (!isSupabaseEnabled || !supabase) return null;
  
  const normalizedCityKey = normalizeCityKey(cityKey);
  if (!normalizedCityKey) return null;

  const today = getRiyadhTodayKey();
  
  const { data, error } = await supabase
    .from("official_prayer_times")
    .select("*")
    .eq("city_key", normalizedCityKey)
    .eq("date_gregorian", today)
    .eq("is_confirmed", true)
    .single();
  
  if (error) return null;
  return data as PrayerTimeRecord;
}

/**
 * getNextPrayer â€” ط­ط³ط§ط¨ ط§ظ„طµظ„ط§ط© ط§ظ„ظ‚ط§ط¯ظ…ط©
 */
export function getNextPrayer(prayers: PrayerTimes): NextPrayer | null {
  const now = getRiyadhNow();
  const prayerOrder: (keyof PrayerTimes)[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  
  for (const key of prayerOrder) {
    const prayerTime = parseTimeToDateToday(prayers[key]);
    if (prayerTime && prayerTime > now) {
      return {
        key,
        label: PRAYER_LABELS[key],
        time: prayerTime,
        countdown: prayerTime.getTime() - now.getTime(),
      };
    }
  }
  
  // All prayers passed, return fajr of next day
  const fajrTime = parseTimeToDateToday(prayers.fajr);
  if (fajrTime) {
    fajrTime.setDate(fajrTime.getDate() + 1);
    return {
      key: "fajr",
      label: PRAYER_LABELS.fajr,
      time: fajrTime,
      countdown: fajrTime.getTime() - now.getTime(),
    };
  }
  
  return null;
}

/**
 * getPrayerCountdown â€” ط­ط³ط§ط¨ ط§ظ„ط¹ط¯ ط§ظ„طھظ†ط§ط²ظ„ظٹ ظ„ظ„طµظ„ط§ط© ط§ظ„ظ‚ط§ط¯ظ…ط©
 */
export function getPrayerCountdown(prayers: PrayerTimes): number | null {
  const next = getNextPrayer(prayers);
  return next ? next.countdown : null;
}

/**
 * formatCountdown â€” طھظ†ط³ظٹظ‚ ط§ظ„ط¹ط¯ ط§ظ„طھظ†ط§ط²ظ„ظٹ
 */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * formatPrayerTime â€” طھظ†ط³ظٹظ‚ ظˆظ‚طھ ط§ظ„طµظ„ط§ط©
 */
export function formatPrayerTime(time: string, preference: "12h" | "24h" = "24h"): string {
  return formatTimeByPreference(time, preference);
}

/**
 * getPrayerStatus â€” ط­ط§ظ„ط© ط§ظ„طµظ„ط§ط© ط§ظ„ط­ط§ظ„ظٹط©
 */
export function getPrayerStatus(prayers: PrayerTimes): {
  current: string | null;
  next: NextPrayer | null;
  isBetweenPrayers: boolean;
} {
  const now = getRiyadhNow();
  const prayerOrder: (keyof PrayerTimes)[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  
  let currentPrayer: string | null = null;
  let nextPrayer: NextPrayer | null = null;
  let isBetweenPrayers = false;
  
  for (let i = 0; i < prayerOrder.length; i++) {
    const key = prayerOrder[i];
    const prayerTime = parseTimeToDateToday(prayers[key]);
    
    if (prayerTime && prayerTime <= now) {
      currentPrayer = PRAYER_LABELS[key];
      
      // Check if next prayer is after now
      for (let j = i + 1; j < prayerOrder.length; j++) {
        const nextKey = prayerOrder[j];
        const nextTime = parseTimeToDateToday(prayers[nextKey]);
        if (nextTime && nextTime > now) {
          nextPrayer = {
            key: nextKey,
            label: PRAYER_LABELS[nextKey],
            time: nextTime,
            countdown: nextTime.getTime() - now.getTime(),
          };
          break;
        }
      }
      
      // Check if we're between prayers (within 30 minutes after prayer time)
      if (i < prayerOrder.length - 1) {
        const nextKey = prayerOrder[i + 1];
        const nextTime = parseTimeToDateToday(prayers[nextKey]);
        if (nextTime && nextTime > now) {
          isBetweenPrayers = true;
        }
      }
    }
  }
  
  return { current: currentPrayer, next: nextPrayer, isBetweenPrayers };
}

/**
 * getAllCities â€” ط¬ظ„ط¨ ظƒظ„ ط§ظ„ظ…ط¯ظ† ط§ظ„ظ…ط¯ط¹ظˆظ…ط©
 */
export function getAllCities(): { key: string; name: string }[] {
  return Object.entries(SAUDI_CITIES).map(([key, name]) => ({ key, name }));
}

/**
 * getCityName â€” ط§ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ ط§ط³ظ… ط§ظ„ظ…ط¯ظٹظ†ط© ظ…ظ† key
 */
export function getCityName(cityKey: string): string {
  const normalizedCityKey = normalizeCityKey(cityKey);
  return normalizedCityKey ? SAUDI_CITIES[normalizedCityKey] : cityKey;
}

/**
 * createPrayerTimeRecord â€” ط¥ظ†ط´ط§ط، ط³ط¬ظ„ ظ…ظˆط§ظ‚ظٹطھ (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function createPrayerTimeRecord(
  record: Omit<PrayerTimeRecord, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("official_prayer_times")
    .insert({
      ...record,
      is_confirmed: false,
      approval_status: "pending",
    });
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * updatePrayerTimeRecord â€” طھط­ط¯ظٹط« ط³ط¬ظ„ ظ…ظˆط§ظ‚ظٹطھ (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function updatePrayerTimeRecord(
  id: string,
  updates: Partial<PrayerTimeRecord>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("official_prayer_times")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * confirmPrayerTime â€” ط§ط¹طھظ…ط§ط¯ ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function confirmPrayerTime(id: string): Promise<{ success: boolean; error?: string }> {
  return updatePrayerTimeRecord(id, {
    is_confirmed: true,
    approval_status: "approved",
    last_verified_at: new Date().toISOString(),
  });
}

