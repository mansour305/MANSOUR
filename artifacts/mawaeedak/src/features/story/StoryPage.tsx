import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useOfficialPrayerTimes, useOfficialFinancialDates } from "@/hooks/useOfficialData";
import { useGetPrayerTimes } from "@api-client";
import { useGatewayFinancialCountdown } from "@/hooks/useGatewayData";
import { useStore } from "@/hooks/useStore";
import { formatHijriDate, formatGregorianDate, getDayName } from "@/lib/utils";
import { Copy, Share2, Save, CheckCircle2, Loader2, Landmark } from "lucide-react";
import { useTimeFormat } from "@/hooks/useTimeFormat";
import { getRiyadhTodayKey } from "@/lib/riyadhTime";
import { getCityName, normalizeCityKey } from "@/lib/prayerTimesService";

const BG_CREAM = "hsl(36 38% 96%)";
const BG_CARD = "#FAF7F2";
const BROWN = "#8A6B3D";
const GOLD = "#C9A063";
const INK = "#2F2B25";
const WARM_BG = "#F3E8D6";

const PRAYER_KEYS: [string, string][] = [
  ["ط§ظ„ظپط¬ط±", "fajr"],
  ["ط§ظ„ط´ط±ظˆظ‚", "sunrise"],
  ["ط§ظ„ط¸ظ‡ط±", "dhuhr"],
  ["ط§ظ„ط¹طµط±", "asr"],
  ["ط§ظ„ظ…ط؛ط±ط¨", "maghrib"],
  ["ط§ظ„ط¹ط´ط§ط،", "isha"],
];

const EVENT_ICONS: Record<string, string> = {
  salary: "ًں’°",
  support: "ًں‘¨â€چًں‘©â€چًں‘§",
  bill: "ًں“„",
  housing: "ًںڈ ",
  other: "ًں“…",
};

const STORAGE_KEY_STORY = "mawaeedak_story_v1";

export default function StoryPage() {
  const { toast } = useToast();
  const { user } = useStore();
  const { formatTime } = useTimeFormat();
  const todayIso = getRiyadhTodayKey();
  const cityKey = normalizeCityKey(user.city) ?? "riyadh";
  const cityName = getCityName(cityKey);

  const { data: officialPrayer } = useOfficialPrayerTimes(cityKey, todayIso);
  const { data: officialFinancial } = useOfficialFinancialDates();
  const { data: fallbackPrayer } = useGetPrayerTimes({ city: cityName });
  const { data: fallbackCountdowns } = useGatewayFinancialCountdown();

  const [customMessage, setCustomMessage] = useState("");
  const [showDate, setShowDate] = useState(true);
  const [showMessage, setShowMessage] = useState(true);
  const [showCountdowns, setShowCountdowns] = useState(true);
  const [showPrayer, setShowPrayer] = useState(true);
  const [savedOk, setSavedOk] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Prayer times - prefer official
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

  // Financial countdown - prefer official
  const countdowns = useMemo(() => {
    const computeDays = (dateStr: string): number => {
      const today = new Date();
      const target = new Date(`${dateStr}T12:00:00`);
      return Math.max(0, Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    };
    if (Array.isArray(officialFinancial) && officialFinancial.length > 0) {
      return officialFinancial.map((r: any) => ({
        name: r.event_name_ar ?? r.event_key,
        days: computeDays(r.occurrence_date_gregorian),
        type: r.event_key ?? "other",
      })).slice(0, 5);
    }
    return Array.isArray(fallbackCountdowns) ? fallbackCountdowns.slice(0, 5) : [];
  }, [officialFinancial, fallbackCountdowns]);

  // Load saved preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.showDate !== undefined) setShowDate(data.showDate);
        if (data.showMessage !== undefined) setShowMessage(data.showMessage);
        if (data.showCountdowns !== undefined) setShowCountdowns(data.showCountdowns);
        if (data.showPrayer !== undefined) setShowPrayer(data.showPrayer);
        if (data.customMessage) setCustomMessage(data.customMessage);
      }
    } catch {}
  }, []);

  const handleSave = () => {
    const data = { showDate, showMessage, showCountdowns, showPrayer, customMessage };
    localStorage.setItem(STORAGE_KEY_STORY, JSON.stringify(data));
    setSavedOk(true);
    toast({ title: "طھظ… ط­ظپط¸ ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط³طھظˆط±ظٹ" });
    setTimeout(() => setSavedOk(false), 2000);
  };

  const handleCopy = async () => {
    setIsLoading(true);
    try {
      const lines = [
        "âœ¨ ظ…ظˆط§ط¹ظٹط¯ظƒ âœ¨",
        getDayName(),
        `ًں“… ظ‡ط¬ط±ظٹ: ${formatHijriDate()}`,
        `ًں“† ظ…ظٹظ„ط§ط¯ظٹ: ${formatGregorianDate()}`,
      ];
      if (showMessage && customMessage.trim()) {
        lines.push(`ًں’، ${customMessage.trim()}`);
      }
      if (showCountdowns && countdowns.length > 0) {
        lines.push("");
        lines.push("âڈ³ ظƒظ… ط¨ط§ظ‚ظٹ ط¹ظ„ظ‰:");
        countdowns.forEach((c: any) => {
          lines.push(`${EVENT_ICONS[c.type] ?? "ًں“…"} ${c.name} ًں”» ${c.days} ظٹظˆظ…`);
        });
      }
      if (showPrayer) {
        lines.push("");
        lines.push("ًں•Œ ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©:");
        PRAYER_KEYS.forEach(([label, key]) => {
          lines.push(`${label}: ${formatTime(prayers[key as keyof typeof prayers])}`);
        });
      }
      lines.push("");
      lines.push("ظ…ظˆط§ط¹ظٹط¯ظƒ - ط¬ظ…ظٹط¹ ط§ظ„ط­ظ‚ظˆظ‚ ظ…ط­ظپظˆط¸ط© آ©");
      await navigator.clipboard.writeText(lines.join("\n"));
      toast({ title: "طھظ… ظ†ط³ط® ط§ظ„ط³طھظˆط±ظٹ" });
    } catch {
      toast({ title: "ظپط´ظ„ ط§ظ„ظ†ط³ط®", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    setIsLoading(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "ط³طھظˆط±ظٹ ظ…ظˆط§ط¹ظٹط¯ظƒ",
          text: `âœ¨ ظ…ظˆط§ط¹ظٹط¯ظƒ - ${getDayName()}`,
          url: window.location.origin,
        });
      } else {
        await handleCopy();
      }
    } catch {}
    setIsLoading(false);
  };

  return (
    <AppShell title="ط³طھظˆط±ظٹ ط§ظ„ظٹظˆظ…">
      <div className="space-y-5">
        {/* ط¨ط·ط§ظ‚ط© ط§ظ„ط³طھظˆط±ظٹ - ظ†ظپط³ ظ‡ظˆظٹط© ط§ظ„طھط·ط¨ظٹظ‚ */}
        <div 
          className="relative overflow-hidden rounded-[28px] border"
          style={{ 
            borderColor: "rgba(201,160,99,0.28)", 
            boxShadow: "0 18px 45px rgba(138,107,61,0.18)",
            height: "480px"
          }}
        >
          {/* ط®ظ„ظپظٹط© ط§ظ„طµظˆط±ط© */}
          <div aria-hidden="true" />
          
          {/* طھط¯ط±ط¬ ظƒط±ظٹظ…ظٹ ظ…ظ† ط§ظ„ظٹظ…ظٹظ† */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#FAF7F2]/95 via-[#FAF7F2]/75 to-transparent" />
          
          {/* ظ…ط­طھظˆظ‰ ط§ظ„ط¨ط·ط§ظ‚ط© */}
          <div className="relative z-10 flex h-full flex-col p-5">
            {/* ط§ظ„ط´ط¹ط§ط± */}
            <div className="text-center mb-3">
              <div className="text-2xl mb-1" style={{ color: GOLD }}>âœ¦</div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: INK }}>
                ظ…ظˆط§ط¹ظٹط¯ظƒ
              </h1>
              <div className="h-[2px] w-24 mx-auto mt-2" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            </div>

            {/* ط§ظ„طھط§ط±ظٹط® */}
            {showDate && (
              <div className="text-center space-y-1 mb-3">
                <div className="text-xl font-extrabold" style={{ color: BROWN }}>
                  {getDayName()}
                </div>
                <div className="flex justify-center gap-4 text-sm font-bold" style={{ color: INK }}>
                  <span>ًں“… {formatHijriDate()}</span>
                  <span>ًں“† {formatGregorianDate()}</span>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-[1px] w-full my-2" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

            {/* ط±ط³ط§ظ„ط© ط§ظ„ظٹظˆظ… */}
            {showMessage && customMessage.trim() && (
              <div 
                className="rounded-xl border p-3 text-center mb-2"
                style={{ 
                  background: "rgba(255,255,255,0.85)",
                  borderColor: "rgba(201,160,99,0.25)",
                }}
              >
                <p className="text-sm font-medium leading-relaxed" style={{ color: INK }}>
                  {customMessage}
                </p>
              </div>
            )}

            {/* ط§ظ„ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…ط§ظ„ظٹط© */}
            {showCountdowns && countdowns.length > 0 && (
              <div 
                className="rounded-xl border p-3 mb-2"
                style={{ 
                  background: "rgba(255,255,255,0.75)",
                  borderColor: "rgba(201,160,99,0.20)",
                }}
              >
                <div className="text-center text-xs font-bold mb-2" style={{ color: BROWN }}>
                  âڈ³ ظƒظ… ط¨ط§ظ‚ظٹ ط¹ظ„ظ‰:
                </div>
                <div className="space-y-1.5">
                  {countdowns.map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: INK }}>
                        {EVENT_ICONS[c.type] ?? "ًں“…"} {c.name}
                      </span>
                      <span className="shrink-0 text-xs font-extrabold" style={{ color: GOLD }}>
                        {c.days} ظٹظˆظ…
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showCountdowns && countdowns.length === 0 && (
              <div 
                className="rounded-xl border p-3 text-center mb-2"
                style={{ borderColor: "rgba(201,160,99,0.15)" }}
              >
                <p className="text-xs opacity-60" style={{ color: INK }}>ظ„ط§ طھظˆط¬ط¯ ظ…ظˆط§ط¹ظٹط¯ ظ…ط§ظ„ظٹط© ط­ط§ظ„ظٹط§ظ‹</p>
              </div>
            )}

            {/* ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© */}
            {showPrayer && (
              <div 
                className="rounded-xl border p-3 mt-auto"
                style={{ 
                  background: WARM_BG,
                  borderColor: "rgba(201,160,99,0.20)",
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Landmark className="h-4 w-4" style={{ color: GOLD }} />
                  <span className="text-xs font-bold" style={{ color: BROWN }}>ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©</span>
                </div>
                <div className="grid grid-cols-3 gap-x-2 gap-y-1">
                  {PRAYER_KEYS.map(([label, key]) => (
                    <div key={key} className="flex flex-col items-center">
                      <span className="text-[10px] opacity-60" style={{ color: INK }}>{label}</span>
                      <span className="text-[11px] font-bold" style={{ color: BROWN }}>
                        {formatTime(prayers[key as keyof typeof prayers])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ط§ظ„ظپظˆطھط± */}
            <div className="mt-auto pt-2">
              <div className="text-center text-[10px] font-extrabold tracking-wider" style={{ color: GOLD }}>
                ظ…ظˆط§ط¹ظٹط¯ظƒ
              </div>
              <div className="text-center text-[8px] opacity-50" style={{ color: INK }}>
                ط¬ظ…ظٹط¹ ط§ظ„ط­ظ‚ظˆظ‚ ظ…ط­ظپظˆط¸ط© آ© {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>

        {/* ط±ط³ط§ظ„ط© ط§ظ„ظٹظˆظ… */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground">ط±ط³ط§ظ„ط© ط§ظ„ظٹظˆظ…</Label>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={2}
            className="resize-none rounded-xl text-sm font-medium"
            placeholder="ط§ظƒطھط¨ ط±ط³ط§ظ„ط© ط§ظ„ط³طھظˆط±ظٹ..."
            dir="rtl"
          />
        </div>

        {/* ط¹ظ†ط§طµط± ط§ظ„ط³طھظˆط±ظٹ */}
        <div 
          className="rounded-2xl border p-4 space-y-3"
          style={{ 
            background: "linear-gradient(145deg, #FFFBF4, #F3E8D6)",
            borderColor: "rgba(201,160,99,0.22)",
          }}
        >
          <p className="text-sm font-bold text-foreground">ط¹ظ†ط§طµط± ط§ظ„ط³طھظˆط±ظٹ</p>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-date" className="cursor-pointer text-sm">ط§ظ„طھط§ط±ظٹط®</Label>
            <Switch id="sw-date" checked={showDate} onCheckedChange={setShowDate} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-msg" className="cursor-pointer text-sm">ط§ظ„ط±ط³ط§ظ„ط©</Label>
            <Switch id="sw-msg" checked={showMessage} onCheckedChange={setShowMessage} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-cd" className="cursor-pointer text-sm">ط§ظ„ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…ط§ظ„ظٹط©</Label>
            <Switch id="sw-cd" checked={showCountdowns} onCheckedChange={setShowCountdowns} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-pr" className="cursor-pointer text-sm">ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©</Label>
            <Switch id="sw-pr" checked={showPrayer} onCheckedChange={setShowPrayer} />
          </div>
        </div>

        {/* ط£ط²ط±ط§ط± ط§ظ„طھط­ظƒظ… */}
        <div className="grid grid-cols-3 gap-2">
          <Button className="h-12 rounded-xl text-sm font-bold" onClick={handleCopy} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4 ml-1" />}
            ظ†ط³ط®
          </Button>
          <Button variant="outline" className="h-12 rounded-xl text-sm font-bold" onClick={handleShare} disabled={isLoading}>
            <Share2 className="w-4 h-4 ml-1" />
            ظ…ط´ط§ط±ظƒط©
          </Button>
          <Button
            variant="outline"
            className={`h-12 rounded-xl text-sm font-bold ${savedOk ? "border-emerald-500 bg-emerald-50 text-emerald-600" : ""}`}
            onClick={handleSave}
          >
            {savedOk ? <CheckCircle2 className="w-4 h-4 ml-1" /> : <Save className="w-4 h-4 ml-1" />}
            {savedOk ? "ظ…ط­ظپظˆط¸" : "ط­ظپط¸"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}


