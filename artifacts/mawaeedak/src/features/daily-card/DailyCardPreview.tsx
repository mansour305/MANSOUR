import { useMemo } from "react";
import { useStore } from "@/hooks/useStore";
import { useOfficialPrayerTimes, useOfficialFinancialDates } from "@/hooks/useOfficialData";
import { useGetPrayerTimes } from "@workspace/api-client-react";
import { useGatewayFinancialCountdown } from "@/hooks/useGatewayData";
import { formatHijriDate, formatGregorianDate, getDayName } from "@/lib/utils";
import { useTimeFormat } from "@/hooks/useTimeFormat";
import desertHeroImg from "@assets/desert-hero.png";

const GOLD = "#C9A063";
const BROWN = "#8A6B3D";
const INK = "#2F2B25";
const CREAM = "#FAF7F2";
const WARM_BG = "#F3E8D6";

// Prayer times display order (right to left for RTL)
const PRAYER_ORDER = [
  { key: "fajr", label: "الفجر" },
  { key: "sunrise", label: "الشروق" },
  { key: "dhuhr", label: "الظهر" },
  { key: "asr", label: "العصر" },
  { key: "maghrib", label: "المغرب" },
  { key: "isha", label: "العشاء" },
];

// Event icons
const EVENT_ICONS: Record<string, string> = {
  salary: "💼",
  citizen_account: "👨‍👩‍👧",
  housing_support: "🏠",
  social_security: "🛡️",
  retirement: "👴",
  insurance: "📄",
  saned: "📄",
  hafiz: "🎯",
  rehabilitation: "♿",
  agricultural_support: "🌾",
  other: "📅",
};

// Event name mapping
const EVENT_NAMES: Record<string, string> = {
  salary: "الراتب",
  citizen_account: "حساب المواطن",
  housing_support: "الدعم السكني",
  social_security: "الضمان",
  retirement: "التقاعد",
  insurance: "التأمينات",
  saned: "ساند",
  hafiz: "حافز",
  rehabilitation: "التأهيل الشامل",
  agricultural_support: "الدعم الزراعي",
  other: "دعم",
};

interface DailyCardPreviewProps {
  message: string;
  showPrayer?: boolean;
  showCountdowns?: boolean;
}

export default function DailyCardPreview({ 
  message, 
  showPrayer = true, 
  showCountdowns = true 
}: DailyCardPreviewProps) {
  const { user } = useStore();
  const { formatTime } = useTimeFormat();
  const todayIso = new Date().toISOString().split("T")[0];
  const cityName = user.city || "الرياض";
  const cityKey = cityName.trim().toLowerCase().replace(/\s+/g, "_");

  const { data: officialPrayer } = useOfficialPrayerTimes(cityKey, todayIso);
  const { data: officialFinancial } = useOfficialFinancialDates();
  const { data: fallbackPrayer } = useGetPrayerTimes({ city: cityName });
  const { data: fallbackCountdowns } = useGatewayFinancialCountdown();

  // Get user display name
  const displayName = (user?.name && user.name.length > 0) ? user.name.split(" ")[0] : null;
  
  // Determine greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const base = hour < 12 ? "صباح الخير" : "مساء الخير";
    return displayName ? `${base} يا ${displayName}` : base;
  }, [displayName]);

  // Prayer times
  const prayers = useMemo(() => {
    if (officialPrayer) {
      return {
        fajr: officialPrayer.fajr_time,
        sunrise: officialPrayer.sunrise_time,
        dhuhr: officialPrayer.dhuhr_time,
        asr: officialPrayer.asr_time,
        maghrib: officialPrayer.maghrib_time,
        isha: officialPrayer.isha_time,
      };
    }
    return {
      fajr: fallbackPrayer?.fajr ?? "04:03",
      sunrise: fallbackPrayer?.sunrise ?? "05:29",
      dhuhr: fallbackPrayer?.dhuhr ?? "12:18",
      asr: fallbackPrayer?.asr ?? "15:48",
      maghrib: fallbackPrayer?.maghrib ?? "18:49",
      isha: fallbackPrayer?.isha ?? "20:19",
    };
  }, [officialPrayer, fallbackPrayer]);

  // Financial countdowns
  const countdowns = useMemo(() => {
    const computeDays = (dateStr: string): number => {
      const today = new Date();
      const target = new Date(`${dateStr}T12:00:00`);
      return Math.max(0, Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    };

    const result: { key: string; name: string; days: number }[] = [];

    if (Array.isArray(officialFinancial) && officialFinancial.length > 0) {
      officialFinancial.forEach((r: any) => {
        const key = r.event_key ?? "other";
        result.push({
          key,
          name: EVENT_NAMES[key] ?? r.event_name_ar ?? key,
          days: computeDays(r.occurrence_date_gregorian),
        });
      });
    } else if (Array.isArray(fallbackCountdowns)) {
      fallbackCountdowns.forEach((r: any) => {
        const key = r.type ?? "other";
        result.push({
          key,
          name: EVENT_NAMES[key] ?? r.name ?? key,
          days: r.days_remaining ?? r.days ?? 0,
        });
      });
    }

    return result.slice(0, 10);
  }, [officialFinancial, fallbackCountdowns]);

  return (
    <div 
      className="relative overflow-hidden rounded-[24px] border"
      style={{
        background: "linear-gradient(180deg, #FDF9F3 0%, #F3E8D6 100%)",
        borderColor: "rgba(201,160,99,0.35)",
        boxShadow: "0 20px 60px rgba(138,107,61,0.15), 0 0 40px rgba(201,160,99,0.08) inset",
        width: "100%",
        maxWidth: "380px",
        margin: "0 auto",
      }}
    >
      {/* Background decoration - Building on left top */}
      <div 
        className="absolute top-0 right-0 w-32 h-40 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url(${desertHeroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "top right",
        }}
      />

      {/* Palm decorations - subtle */}
      <div className="absolute top-0 left-0 w-20 h-20 opacity-[0.04] pointer-events-none" style={{
        background: `radial-gradient(ellipse at 20% 0%, ${GOLD} 0%, transparent 60%)`,
      }} />
      <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.04] pointer-events-none" style={{
        background: `radial-gradient(ellipse at 80% 0%, ${GOLD} 0%, transparent 60%)`,
      }} />

      {/* Golden lantern icon top right */}
      <div className="absolute top-3 left-3 text-2xl opacity-40" style={{ color: GOLD }}>
        🏮
      </div>

      {/* Main content */}
      <div className="relative z-10 p-4 space-y-4">
        {/* Label badge */}
        <div className="text-center">
          <span 
            className="inline-block px-4 py-1 rounded-full text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}44)`,
              color: BROWN,
              border: `1px solid ${GOLD}44`,
            }}
          >
            بطاقة يومية
          </span>
        </div>

        {/* Logo and title */}
        <div className="text-center space-y-2">
          <div className="text-4xl" style={{ color: GOLD }}>✦</div>
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: INK }}>
            مواعيدك
          </h1>
          <p className="text-sm font-medium" style={{ color: BROWN }}>
            كل مواعيدك.. في مكان واحد
          </p>
          <div className="h-[1px] w-32 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        </div>

        {/* Date card */}
        <div 
          className="rounded-xl border p-4 text-center"
          style={{
            background: "rgba(255,255,255,0.8)",
            borderColor: "rgba(201,160,99,0.25)",
          }}
        >
          <div className="text-xl mb-2">📅</div>
          <div className="text-2xl font-extrabold" style={{ color: BROWN }}>
            {getDayName()}
          </div>
          <div className="text-sm font-medium mt-1" style={{ color: INK }}>
            🌙 {formatHijriDate()} هـ
          </div>
          <div className="text-sm font-medium" style={{ color: INK }}>
            🗓️ {formatGregorianDate()} م
          </div>
        </div>

        {/* Message card */}
        <div 
          className="rounded-xl border p-4"
          style={{
            background: "linear-gradient(145deg, #FFFBF4, #F3E8D6)",
            borderColor: "rgba(201,160,99,0.3)",
          }}
        >
          <div className="text-center mb-2">
            <span className="text-lg">💛</span>
          </div>
          <div className="text-center text-sm font-bold mb-3" style={{ color: BROWN }}>
            رسالة اليوم
          </div>
          <div className="text-center text-base font-medium mb-2" style={{ color: INK }}>
            {greeting}
          </div>
          <div className="text-center text-sm leading-relaxed mb-3" style={{ color: "#5D554A" }}>
            {message}
          </div>
          <div className="text-center text-xs font-medium" style={{ color: GOLD }}>
            واذكروا الله ذكراً كثيراً
          </div>
        </div>

        {/* Prayer times */}
        {showPrayer && (
          <div 
            className="rounded-xl border p-3"
            style={{
              background: "rgba(255,255,255,0.75)",
              borderColor: "rgba(201,160,99,0.2)",
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-base">🕌</span>
              <span className="text-sm font-bold" style={{ color: BROWN }}>مواقيت الصلاة</span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {PRAYER_ORDER.map(({ key, label }) => (
                <div key={key} className="flex flex-col items-center text-center">
                  <span className="text-lg mb-1">✨</span>
                  <span className="text-[10px] opacity-70 font-medium" style={{ color: INK }}>{label}</span>
                  <span className="text-[11px] font-bold" style={{ color: BROWN }}>
                    {formatTime(prayers[key as keyof typeof prayers])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Countdowns */}
        {showCountdowns && countdowns.length > 0 && (
          <div 
            className="rounded-xl border p-3"
            style={{
              background: "rgba(255,255,255,0.75)",
              borderColor: "rgba(201,160,99,0.2)",
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-base">⏰</span>
              <span className="text-sm font-bold" style={{ color: BROWN }}>كم باقي على</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {countdowns.slice(0, 6).map((item, i) => (
                <div 
                  key={i}
                  className="rounded-lg border p-2 text-center"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    borderColor: "rgba(201,160,99,0.2)",
                  }}
                >
                  <div className="text-sm mb-1">{EVENT_ICONS[item.key] ?? "📅"}</div>
                  <div className="text-[10px] font-medium truncate" style={{ color: INK }}>{item.name}</div>
                  <div className="text-lg font-extrabold" style={{ color: GOLD }}>{item.days}</div>
                  <div className="text-[9px] opacity-60" style={{ color: INK }}>يوم</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-2">
          <div className="h-[1px] w-full mb-3" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)` }} />
          <div className="text-sm font-extrabold tracking-wide" style={{ color: GOLD }}>
            مواعيدك
          </div>
          <div className="text-[10px] opacity-60 mt-1" style={{ color: INK }}>
            منصة تجمع وقتك، راتبك، دعمك، وأهم مواعيدك
          </div>
        </div>
      </div>
    </div>
  );
}