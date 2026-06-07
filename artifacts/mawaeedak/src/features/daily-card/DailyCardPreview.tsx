import { useMemo, type ReactNode } from "react";
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

// SVG Icons
const CalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const QuoteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={GOLD}>
    <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"/>
  </svg>
);

const PrayerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={GOLD}>
    <path d="M12 2L14 6H10L12 2ZM12 6V8M12 8C8 8 4 10 4 14V18H20V14C20 10 16 8 12 8ZM6 18V22H18V18"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={GOLD}>
    <circle cx="12" cy="12" r="10" fill="none" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M12 6V18M9 9H15M9 15H15"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={GOLD}>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20C4 16 7.6 13 12 13C16.4 13 20 16 20 20"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={GOLD}>
    <path d="M3 12L12 3L21 12V21H3V12Z"/>
    <rect x="10" y="15" width="4" height="6"/>
  </svg>
);

const PRAYER_ORDER = [
  { key: "fajr", label: "الفجر" },
  { key: "sunrise", label: "الشروق" },
  { key: "dhuhr", label: "الظهر" },
  { key: "asr", label: "العصر" },
  { key: "maghrib", label: "المغرب" },
  { key: "isha", label: "العشاء" },
];

const EVENT_NAMES: Record<string, string> = {
  salary: "الراتب",
  citizen_account: "حساب المواطن",
  housing_support: "الدعم السكني",
};

interface DailyCardPreviewProps {
  message: string;
}

function getCountdownIcon(type: string): ReactNode {
  switch (type) {
    case "salary": return <MoneyIcon />;
    case "citizen_account": return <PersonIcon />;
    case "housing_support": return <HomeIcon />;
    default: return <MoneyIcon />;
  }
}

export default function DailyCardPreview({ message }: DailyCardPreviewProps) {
  const { user } = useStore();
  const { formatTime } = useTimeFormat();
  const todayIso = new Date().toISOString().split("T")[0];
  const cityName = user.city || "الرياض";
  const cityKey = cityName.trim().toLowerCase().replace(/\s+/g, "_");

  const { data: officialPrayer } = useOfficialPrayerTimes(cityKey, todayIso);
  const { data: officialFinancial } = useOfficialFinancialDates();
  const { data: fallbackPrayer } = useGetPrayerTimes({ city: cityName });
  const { data: fallbackCountdowns } = useGatewayFinancialCountdown();

  // Greeting without name - just morning/evening
  const greeting = useMemo(() => {
    const saudiHour = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" })).getHours();
    return saudiHour < 12 ? "صباح الخير" : "مساء الخير";
  }, []);

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

  const countdowns = useMemo(() => {
    const computeDays = (dateStr: string): number => {
      const today = new Date();
      const target = new Date(`${dateStr}T12:00:00`);
      return Math.max(0, Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    };

    const result: { key: string; name: string; days: number; icon: ReactNode }[] = [];

    if (Array.isArray(officialFinancial) && officialFinancial.length > 0) {
      officialFinancial.forEach((r: any) => {
        const key = r.event_key ?? "other";
        result.push({
          key,
          name: EVENT_NAMES[key] ?? r.event_name_ar ?? key,
          days: computeDays(r.occurrence_date_gregorian),
          icon: getCountdownIcon(key),
        });
      });
    } else if (Array.isArray(fallbackCountdowns)) {
      fallbackCountdowns.forEach((r: any) => {
        const key = r.type ?? "other";
        result.push({
          key,
          name: EVENT_NAMES[key] ?? r.name ?? key,
          days: r.days_remaining ?? r.days ?? 0,
          icon: getCountdownIcon(key),
        });
      });
    }

    return result.slice(0, 3);
  }, [officialFinancial, fallbackCountdowns]);

  return (
    <div 
      className="relative overflow-hidden rounded-[24px]"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF5EE 100%)",
        border: "1px solid rgba(201,160,99,0.3)",
        boxShadow: "0 20px 60px rgba(138,107,61,0.15), 0 0 40px rgba(201,160,99,0.06) inset",
        width: "100%",
        maxWidth: "360px",
        margin: "0 auto",
      }}
    >
      {/* Background - Saudi architecture on right */}
      <div 
        className="absolute top-0 right-0 w-2/5 h-full opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url(${desertHeroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      />
      
      {/* Palm decorations */}
      <div className="absolute top-0 left-0 w-28 h-28 opacity-[0.06] pointer-events-none" style={{
        background: "radial-gradient(ellipse at 15% 5%, #C9A063 0%, transparent 55%)",
      }} />
      <div className="absolute bottom-0 left-0 w-24 h-32 opacity-[0.05] pointer-events-none" style={{
        background: "radial-gradient(ellipse at 10% 95%, #C9A063 0%, transparent 50%)",
      }} />
      <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.05] pointer-events-none" style={{
        background: "radial-gradient(ellipse at 85% 5%, #C9A063 0%, transparent 55%)",
      }} />

      {/* Golden lantern top left */}
      <div className="absolute top-3 left-3 opacity-60 pointer-events-none" style={{ color: GOLD }}>
        <svg width="36" height="48" viewBox="0 0 48 64" fill="currentColor">
          <path d="M24 0L28 8H20L24 0Z" fill="currentColor"/>
          <rect x="18" y="8" width="12" height="4" rx="1" fill="currentColor"/>
          <path d="M16 12H32V48C32 52 28 56 24 56C20 56 16 52 16 48V12Z" fill="currentColor" opacity="0.9"/>
          <rect x="20" y="16" width="8" height="28" rx="2" fill="#FFFBF4" opacity="0.35"/>
          <rect x="14" y="48" width="20" height="4" rx="1" fill="currentColor"/>
          <rect x="12" y="52" width="24" height="6" rx="2" fill="currentColor"/>
          <rect x="20" y="58" width="8" height="4" rx="1" fill="currentColor"/>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-5 space-y-4">
        {/* Label badge */}
        <div className="text-center pt-2">
          <span 
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
            style={{
              background: "linear-gradient(135deg, rgba(201,160,99,0.12), rgba(201,160,99,0.22))",
              color: BROWN,
              border: "1px solid rgba(201,160,99,0.3)",
            }}
          >
            بطاقة يومية
          </span>
        </div>

        {/* Logo and title */}
        <div className="text-center space-y-1.5">
          <div className="text-4xl" style={{ color: GOLD }}>✦</div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: INK }}>
            مواعيدك
          </h1>
          <p className="text-sm font-medium" style={{ color: BROWN }}>
            كل مواعيدك.. في مكان واحد
          </p>
          <div className="h-[1px] w-28 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        </div>

        {/* Date card */}
        <div 
          className="rounded-xl p-4 text-center"
          style={{
            background: "linear-gradient(145deg, #FFFFFF, #FAF5EE)",
            border: "1px solid rgba(201,160,99,0.22)",
          }}
        >
          <div className="flex justify-center mb-2"><CalIcon /></div>
          <div className="text-xl font-extrabold" style={{ color: BROWN }}>
            {getDayName()}
          </div>
          <div className="text-sm font-medium mt-1" style={{ color: INK }}>
            {formatHijriDate()} هـ
          </div>
          <div className="text-sm font-medium" style={{ color: INK }}>
            {formatGregorianDate()} م
          </div>
        </div>

        {/* Message card */}
        <div 
          className="rounded-xl p-4"
          style={{
            background: "linear-gradient(145deg, #FFFFFF, #FAF5EE)",
            border: "1px solid rgba(201,160,99,0.22)",
          }}
        >
          <div className="flex justify-center mb-2"><QuoteIcon /></div>
          <div className="text-center text-sm font-bold mb-2" style={{ color: BROWN }}>
            رسالة اليوم
          </div>
          <div className="text-center text-sm font-medium mb-2" style={{ color: INK }}>
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
        <div 
          className="rounded-xl p-3"
          style={{
            background: "linear-gradient(145deg, #FFFFFF, #FAF5EE)",
            border: "1px solid rgba(201,160,99,0.2)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <PrayerIcon />
            <span className="text-sm font-bold" style={{ color: BROWN }}>مواقيت الصلاة</span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {PRAYER_ORDER.map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center text-center">
                <div className="w-5 h-5 rounded-full flex items-center justify-center mb-1" style={{ background: "rgba(201,160,99,0.12)" }}>
                  <span className="text-[7px]" style={{ color: GOLD }}>✦</span>
                </div>
                <span className="text-[9px] opacity-70 font-medium" style={{ color: INK }}>{label}</span>
                <span className="text-[10px] font-bold" style={{ color: BROWN }}>
                  {formatTime(prayers[key as keyof typeof prayers])}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Countdowns */}
        <div 
          className="rounded-xl p-3"
          style={{
            background: "linear-gradient(145deg, #FFFFFF, #FAF5EE)",
            border: "1px solid rgba(201,160,99,0.2)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <ClockIcon />
            <span className="text-sm font-bold" style={{ color: BROWN }}>كم باقي على</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {countdowns.map((item, i) => (
              <div 
                key={i}
                className="rounded-lg p-2 text-center"
                style={{
                  background: "linear-gradient(145deg, #FFFFFF, #FAF5EE)",
                  border: "1px solid rgba(201,160,99,0.18)",
                }}
              >
                <div className="flex justify-center mb-1">{item.icon}</div>
                <div className="text-[10px] font-medium truncate" style={{ color: INK }}>{item.name}</div>
                <div className="text-lg font-extrabold" style={{ color: GOLD }}>{item.days}</div>
                <div className="text-[9px] opacity-60" style={{ color: INK }}>يوم</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-1 pb-2">
          <div className="h-[1px] w-full mb-3" style={{ background: `linear-gradient(90deg, transparent, rgba(201,160,99,0.35), transparent)` }} />
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