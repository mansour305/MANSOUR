/**
 * usePrayerEngine — Phase 14
 * 
 * Prayer times engine that:
 * 1. Uses official_prayer_times from Supabase first
 * 2. Falls back to AlAdhan API with method=4 for Saudi Arabia
 * 3. Caches results with 6-hour expiry
 * 4. Supports location detection and manual city selection
 * 5. Live countdown ticks every second (does not refetch data)
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useOfficialPrayerTimes } from "./useOfficialData";
import { useLocationPrefs } from "./useLocationPrefs";
import {
  fetchAlAdhanPrayerTimes,
  getCachedPrayerTimes,
  cachePrayerTimes,
  clearPrayerCache,
  type AlAdhanTimings,
  type PrayerCacheEntry,
} from "@/lib/aladhanService";
import { getRiyadhNow, getRiyadhTodayKey, parseTimeToDateToday } from "@/lib/riyadhTime";
import { getCityName, normalizeCityKey } from "@/lib/prayerTimesService";

export type PrayerTimes = {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

export type PrayerStatus = "loading" | "error" | "empty" | "ready";

export type NextPrayer = {
  key: keyof PrayerTimes;
  label: string;
  time: Date;
  countdown: number;
};

export type UsePrayerEngineResult = {
  // State
  status: PrayerStatus;
  error: string | null;
  
  // Prayer times data
  timings: PrayerTimes | null;
  cityName: string;
  cityKey: string;
  
  // Next prayer
  nextPrayer: NextPrayer | null;
  countdown: string;
  
  // Refresh function
  refresh: () => void;
  
  // Location functions
  requestLocation: () => Promise<void>;
  setManualCity: (city: string) => void;
};

const PRAYER_LABELS: Record<keyof PrayerTimes, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

/**
 * Format countdown to HH:mm:ss
 */
function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Get the next prayer and countdown
 */
function computeNextPrayer(timings: PrayerTimes): NextPrayer | null {
  const now = getRiyadhNow();
  const prayerOrder: (keyof PrayerTimes)[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

  for (const key of prayerOrder) {
    const prayerTime = parseTimeToDateToday(timings[key]);
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
  const fajrTime = parseTimeToDateToday(timings.fajr);
  if (fajrTime) {
    // Create a new Date object to avoid mutating the original
    const nextFajrTime = new Date(fajrTime);
    nextFajrTime.setDate(nextFajrTime.getDate() + 1);
    return {
      key: "fajr",
      label: PRAYER_LABELS.fajr,
      time: nextFajrTime,
      countdown: nextFajrTime.getTime() - now.getTime(),
    };
  }

  return null;
}

/**
 * Main hook for prayer times engine
 */
export function usePrayerEngine(): UsePrayerEngineResult {
  const { prefs, requestGPS, setManual } = useLocationPrefs();
  const cityKey = normalizeCityKey(prefs.city) ?? "";
  const cityName = cityKey ? getCityName(cityKey) : prefs.city;
  const todayIso = getRiyadhTodayKey();
  const coords = useMemo(() => {
    if (typeof prefs.lat === "number" && typeof prefs.lng === "number") {
      return { lat: prefs.lat, lng: prefs.lng };
    }
    return null;
  }, [prefs.lat, prefs.lng]);

  // Local state for AlAdhan fallback
  const [aladhanTimings, setAladhanTimings] = useState<AlAdhanTimings | null>(null);
  const [aladhanLoading, setAladhanLoading] = useState(false);
  const [aladhanError, setAladhanError] = useState<string | null>(null);

  // Live ticking countdown state (updates every second without refetching)
  const [liveCountdown, setLiveCountdown] = useState("--:--:--");
  const liveNextPrayerRef = useRef<NextPrayer | null>(null);

  // Fetch official prayer times from Supabase
  const {
    data: officialPrayer,
    isLoading: isOfficialLoading,
    isError: isOfficialError,
    refetch: refetchOfficial,
  } = useOfficialPrayerTimes(cityKey, todayIso);

  // Fetch AlAdhan if official not available
  const fetchAlAdhan = useCallback(async () => {
    // Check cache first
    if (!cityKey && !coords) {
      setAladhanError("اختر مدينة مدعومة أو فعّل الموقع لتحميل مواقيت الصلاة.");
      return;
    }

    const cached = getCachedPrayerTimes(cityKey, todayIso, coords);
    if (cached) {
      setAladhanTimings(cached.timings);
      return;
    }

    setAladhanLoading(true);
    setAladhanError(null);

    try {
      const timings = await fetchAlAdhanPrayerTimes(cityKey, todayIso, coords);
      if (timings) {
        setAladhanTimings(timings);

        // Cache the result
        const cacheEntry: PrayerCacheEntry = {
          date: todayIso,
          cityKey,
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
          timings,
          fetchedAt: new Date().toISOString(),
          sourceType: "aladhan",
          isConfirmed: false, // AlAdhan is not official
        };
        cachePrayerTimes(cacheEntry);
      } else {
        setAladhanError("تعذر جلب مواقيت الصلاة من المصدر الاحتياطي");
      }
    } catch (err) {
      setAladhanError("حدث خطأ أثناء تحميل المواقيت");
    } finally {
      setAladhanLoading(false);
    }
  }, [cityKey, todayIso, coords]);

  // Determine final timings
  const timings = useMemo<PrayerTimes | null>(() => {
    // Prefer official if available and confirmed
    if (officialPrayer?.fajr_time) {
      return {
        fajr: officialPrayer.fajr_time,
        sunrise: officialPrayer.sunrise_time,
        dhuhr: officialPrayer.dhuhr_time,
        asr: officialPrayer.asr_time,
        maghrib: officialPrayer.maghrib_time,
        isha: officialPrayer.isha_time,
      };
    }

    // Fall back to AlAdhan
    if (aladhanTimings) {
      return aladhanTimings;
    }

    return null;
  }, [officialPrayer, aladhanTimings]);

  // Compute next prayer and update ref (recalculates when timings change)
  const nextPrayer = useMemo<NextPrayer | null>(() => {
    if (!timings) return null;
    const next = computeNextPrayer(timings);
    liveNextPrayerRef.current = next;
    return next;
  }, [timings]);

  // Determine overall status
  const status = useMemo<PrayerStatus>(() => {
    if (isOfficialLoading || aladhanLoading) return "loading";
    if (isOfficialError && !aladhanTimings) return "error";
    if (!timings) return "empty";
    return "ready";
  }, [isOfficialLoading, aladhanLoading, isOfficialError, aladhanTimings, timings]);

  const error = useMemo<string | null>(() => {
    if (status === "error") {
      return "تعذر تحميل مواقيت الصلاة حالياً.";
    }
    if (status === "empty") {
      return "مواقيت الصلاة غير متاحة حالياً. فعّل الموقع أو اختر المدينة.";
    }
    return null;
  }, [status]);

  // Auto-fetch AlAdhan when official fails
  useEffect(() => {
    if (!officialPrayer && !aladhanLoading && !aladhanTimings && !isOfficialLoading) {
      fetchAlAdhan();
    }
  }, [officialPrayer, aladhanLoading, aladhanTimings, isOfficialLoading, fetchAlAdhan]);

  // Live countdown ticker - updates every second without refetching data
  useEffect(() => {
    if (!nextPrayer) {
      setLiveCountdown("--:--:--");
      return;
    }

    // Update immediately
    const updateCountdown = () => {
      const now = getRiyadhNow();
      const current = liveNextPrayerRef.current;
      if (current && current.time) {
        const remaining = current.time.getTime() - now.getTime();
        if (remaining > 0) {
          setLiveCountdown(formatCountdown(remaining));
        } else {
          // Prayer time passed, recalculate next prayer
          if (timings) {
            const newNext = computeNextPrayer(timings);
            liveNextPrayerRef.current = newNext;
            if (newNext && newNext.time) {
              const newRemaining = newNext.time.getTime() - now.getTime();
              setLiveCountdown(newRemaining > 0 ? formatCountdown(newRemaining) : "--:--:--");
            } else {
              setLiveCountdown("--:--:--");
            }
          } else {
            setLiveCountdown("--:--:--");
          }
        }
      } else {
        setLiveCountdown("--:--:--");
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(intervalId);
  }, [nextPrayer, timings]);

  // Refresh function
  const refresh = useCallback(() => {
    clearPrayerCache();
    setAladhanTimings(null);
    refetchOfficial();
    fetchAlAdhan();
  }, [refetchOfficial, fetchAlAdhan]);

  // Location request
  const requestLocation = useCallback(async () => {
    try {
      await requestGPS();
      clearPrayerCache();
      setAladhanTimings(null);
    } catch {
      // Error handled in requestGPS
    }
  }, [requestGPS]);

  // Manual city selection
  const setManualCity = useCallback((city: string) => {
    setManual(city, prefs.timezone || "Asia/Riyadh");
    clearPrayerCache();
    setAladhanTimings(null);
  }, [setManual, prefs.timezone]);

  return {
    status,
    error,
    timings,
    cityName,
    cityKey,
    nextPrayer,
    countdown: liveCountdown,
    refresh,
    requestLocation,
    setManualCity,
  };
}

/**
 * Status messages
 */
export const PRAYER_STATUS_MESSAGES: Record<PrayerStatus, string> = {
  loading: "جاري تحميل مواقيت الصلاة...",
  error: "تعذر تحميل مواقيت الصلاة حالياً.",
  empty: "مواقيت الصلاة غير متاحة حالياً. فعّل الموقع أو اختر المدينة.",
  ready: "", // Empty when ready
};
