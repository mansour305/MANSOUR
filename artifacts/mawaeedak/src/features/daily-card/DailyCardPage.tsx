import { useState, useEffect, useMemo, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import DailyCardPreview from "./DailyCardPreview";
import { useStore } from "@/hooks/useStore";
import { formatHijriDate, formatGregorianDate, getDayName } from "@/lib/utils";
import { useOfficialPrayerTimes, useOfficialFinancialDates } from "@/hooks/useOfficialData";
import { useGetPrayerTimes } from "@workspace/api-client-react";
import { useGatewayFinancialCountdown } from "@/hooks/useGatewayData";
import { useTimeFormat } from "@/hooks/useTimeFormat";
import { Copy, Share2, Download, CheckCircle2, Loader2 } from "lucide-react";

const STORAGE_KEY_DAILY = "mawaeedak_daily_card_v1";

// Daily messages pool
const DAILY_MESSAGES = [
  "يبدأ يومك بنية طيبة، وتوكّل على الله في كل خطوة.",
  "حافظ على صلاتك في وقتها، فهي نور لك في الدنيا والآخرة.",
  "ابدأ يومك بالصلاة ثم الذهاب إلى عملك بنشاط.",
  "الورد والصباح الجميل يبدأان من القلب.",
  "لا تؤجل عمل اليوم إلى الغد، فكل يوم有其 فرصته.",
  "أحسن الظن بالله، وافعل ما بوسعك، وتوكّل على الله.",
  "مهما كانت التحديات، ثق أن الفرج قريب.",
  "اجعل لك هدفاً كل يوم، وحققه قبل منتصف النهار.",
  "التفاؤل يغير الحياة، فابدأ يومك بابتسامة.",
  "ذكر الله نعمة، فاحمده على نعمائه.",
  "كن كالنخيل، altos raíces pero alto valor.",
  "العمل عبادة، فأتقن ما بيدك.",
  "راحة بالك，在你工作的同时.",
  "لا تستعجل النتائج، فالأجور تأتي.",
  "كن باراً بوالديك، فالدعاء مستجاب.",
  "التوازن بين العمل والعبادة مفتاح السعادة.",
  "كل يوم جديد هو فرصة جديدة للتغيير.",
  "اجعل لنفسك روتيناً صباحياً مفيداً.",
  "الصلاة على النبي حياة للقلب.",
  "العمل الصالح لا يضيع أبداً.",
];

// Get today's message based on date
function getTodayMessage(): string {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const weekOfYear = Math.floor(dayOfYear / 7);
  const index = (weekOfYear + dayOfYear) % DAILY_MESSAGES.length;
  return DAILY_MESSAGES[index];
}

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

export default function DailyCardPage() {
  const { toast } = useToast();
  const { user } = useStore();
  const { formatTime } = useTimeFormat();
  const todayIso = new Date().toISOString().split("T")[0];
  const cityName = user.city || "الرياض";
  const cityKey = cityName.trim().toLowerCase().replace(/\s+/g, "_");

  const { data: officialPrayer } = useOfficialPrayerTimes(cityKey, todayIso);
  const { data: officialFinancial } = useOfficialFinancialDates();
  const { data: fallbackPrayer } = useGetPrayerTimes({ city: cityName });
  const { data: fallbackCountdowns } = useGatewayFinancialCountdown();

  const [message, setMessage] = useState(getTodayMessage());
  const [showPrayer, setShowPrayer] = useState(true);
  const [showCountdowns, setShowCountdowns] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAILY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.showPrayer !== undefined) setShowPrayer(data.showPrayer);
        if (data.showCountdowns !== undefined) setShowCountdowns(data.showCountdowns);
        if (data.message) setMessage(data.message);
      }
    } catch {}
  }, []);

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

  // Countdowns
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

    return result;
  }, [officialFinancial, fallbackCountdowns]);

  // Generate text for copy
  const generateText = useCallback((): string => {
    const displayName = (user?.name && user.name.length > 0) ? user.name.split(" ")[0] : null;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "صباح الخير" : "مساء الخير";
    const fullGreeting = displayName ? `${greeting} يا ${displayName}` : greeting;

    const lines = [
      "📌 تاريخ اليوم",
      `📅 ${getDayName()}`,
      `🌙 هجري: ${formatHijriDate()}`,
      `🗓️ ميلادي: ${formatGregorianDate()}`,
      "━━━━━━━━━━━━━━",
      `💡 ${message}`,
      "━━━━━━━━━━━━━━",
    ];

    if (showPrayer) {
      lines.push("🕌 مواقيت الصلاة");
      lines.push(`الفجر: ${formatTime(prayers.fajr)}`);
      lines.push(`الشروق: ${formatTime(prayers.sunrise)}`);
      lines.push(`الظهر: ${formatTime(prayers.dhuhr)}`);
      lines.push(`العصر: ${formatTime(prayers.asr)}`);
      lines.push(`المغرب: ${formatTime(prayers.maghrib)}`);
      lines.push(`العشاء: ${formatTime(prayers.isha)}`);
      lines.push("━━━━━━━━━━━━━━");
    }

    if (showCountdowns && countdowns.length > 0) {
      lines.push("⏳ كم باقي على:");
      countdowns.forEach((c) => {
        lines.push(`${c.name}: ${c.days} يوم`);
      });
      lines.push("━━━━━━━━━━━━━━");
    }

    lines.push("مواعيدك — منصة تجمع وقتك، راتبك، دعمك، وأهم مواعيدك");

    return lines.join("\n");
  }, [user, message, showPrayer, showCountdowns, prayers, countdowns, formatTime]);

  const handleCopy = async () => {
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(generateText());
      toast({ title: "تم نسخ البطاقة بنجاح" });
    } catch {
      toast({ title: "فشل نسخ البطاقة", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    setIsLoading(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "بطاقة يومية - مواعيدك",
          text: generateText(),
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(generateText());
        toast({ title: "تم نسخ البطاقة للمشاركة" });
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        toast({ title: "فشل المشاركة", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveImage = async () => {
    toast({ 
      title: "حفظ الصورة", 
      description: "تحتاج تفعيل مكتبة التصدير - استخدم نسخ النص للمشاركة حالياً"
    });
  };

  const handleSave = () => {
    const data = { showPrayer, showCountdowns, message };
    localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(data));
    toast({ title: "تم حفظ الإعدادات" });
  };

  return (
    <AppShell title="بطاقة يومية">
      <div className="space-y-5">
        {/* Card preview */}
        <DailyCardPreview 
          message={message}
          showPrayer={showPrayer}
          showCountdowns={showCountdowns}
        />

        {/* Message editor */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">رسالة اليوم</Label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full rounded-xl border bg-white/80 px-3 py-2 text-sm font-medium resize-none"
            dir="rtl"
          />
        </div>

        {/* Toggle options */}
        <div 
          className="rounded-xl border p-4 space-y-3"
          style={{ background: "linear-gradient(145deg, #FFFBF4, #F3E8D6)", borderColor: "rgba(201,160,99,0.22)" }}
        >
          <p className="text-sm font-bold">عناصر البطاقة</p>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-prayer" className="cursor-pointer text-sm">مواقيت الصلاة</Label>
            <Switch id="sw-prayer" checked={showPrayer} onCheckedChange={setShowPrayer} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sw-count" className="cursor-pointer text-sm">العدادات المالية</Label>
            <Switch id="sw-count" checked={showCountdowns} onCheckedChange={setShowCountdowns} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button 
            className="h-12 rounded-xl text-xs font-bold"
            onClick={handleSave}
          >
            <CheckCircle2 className="w-4 h-4 ml-1" />
            حفظ
          </Button>
          <Button 
            className="h-12 rounded-xl text-xs font-bold"
            onClick={handleCopy}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4 ml-1" />}
            نسخ
          </Button>
          <Button 
            variant="outline"
            className="h-12 rounded-xl text-xs font-bold"
            onClick={handleShare}
            disabled={isLoading}
          >
            <Share2 className="w-4 h-4 ml-1" />
            مشاركة
          </Button>
          <Button 
            variant="outline"
            className="h-12 rounded-xl text-xs font-bold"
            onClick={handleSaveImage}
          >
            <Download className="w-4 h-4 ml-1" />
            صورة
          </Button>
        </div>
      </div>
    </AppShell>
  );
}