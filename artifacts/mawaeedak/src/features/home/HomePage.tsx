import { CalendarDays, Clock3, Home, Landmark, Moon, Sun, Sunrise, Wallet, Users } from "lucide-react";
import { Link } from "wouter";
import desertHeroImg from "@assets/desert-hero.png";
import { AppShell } from "@/components/layout/AppShell";
import { useGetPrayerTimes } from "@workspace/api-client-react";
import { useGatewayFinancialCountdown } from "@/hooks/useGatewayData";
import { useStore } from "@/hooks/useStore";
import { formatGregorianDate, formatHijriDate, getDayName } from "@/lib/utils";

const GOLD = "#C9A063";
const BROWN = "#8A6B3D";
const INK = "#2F2B25";

function currentGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "صباح الخير" : "مساء الخير";
}

function PrayerIcon({ keyName }: { keyName: string }) {
  if (keyName === "fajr" || keyName === "isha") return <Moon className="h-6 w-6" />;
  if (keyName === "sunrise" || keyName === "maghrib") return <Sunrise className="h-6 w-6" />;
  return <Sun className="h-6 w-6" />;
}

export default function HomePage() {
  const { user } = useStore();
  const city = user.city && !user.city.includes("ط·") ? user.city : "الرياض";
  const { data: prayerData } = useGetPrayerTimes({ city });
  const { data: financialItems } = useGatewayFinancialCountdown();
  const name = user.name && !user.name.includes("ط·") ? user.name.split(" ")[0] : "أحمد";

  const prayers = [
    { key: "fajr", label: "الفجر", time: prayerData?.fajr ?? "04:03" },
    { key: "sunrise", label: "الشروق", time: prayerData?.sunrise ?? "05:29" },
    { key: "dhuhr", label: "الظهر", time: prayerData?.dhuhr ?? "12:18" },
    { key: "asr", label: "العصر", time: prayerData?.asr ?? "03:48" },
    { key: "maghrib", label: "المغرب", time: prayerData?.maghrib ?? "06:49" },
    { key: "isha", label: "العشاء", time: prayerData?.isha ?? "08:19" },
  ];

  const finance = financialItems?.length
    ? financialItems.slice(0, 4)
    : [
        { id: 1, name: "الراتب", days_remaining: 21, next_date: "2025-06-10", type: "salary" },
        { id: 2, name: "حساب المواطن", days_remaining: 21, next_date: "2025-06-10", type: "support" },
        { id: 3, name: "الدعم السكني", days_remaining: 35, next_date: "2025-06-24", type: "housing" },
        { id: 4, name: "ضمان اجتماعي", days_remaining: 42, next_date: "2025-07-01", type: "support" },
      ];

  return (
    <AppShell>
      <section className="space-y-5">
        <div className="text-center">
          <h2 className="text-[30px] font-extrabold leading-tight" style={{ color: INK }}>
            {getDayName()}
          </h2>
          <div className="mx-auto mt-3 grid grid-cols-2 gap-3">
            <div className="flex items-center justify-center gap-2 rounded-full border bg-white/70 px-3 py-2 text-sm font-bold" style={{ borderColor: "rgba(201,160,99,0.22)" }}>
              <CalendarDays className="h-5 w-5" style={{ color: GOLD }} />
              {formatGregorianDate()}
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full border bg-white/70 px-3 py-2 text-sm font-bold" style={{ borderColor: "rgba(201,160,99,0.22)" }}>
              <Landmark className="h-5 w-5" style={{ color: GOLD }} />
              {formatHijriDate()}
            </div>
          </div>
        </div>

        <div className="relative h-[250px] overflow-hidden rounded-[28px] border" style={{ borderColor: "rgba(201,160,99,0.28)", boxShadow: "0 18px 45px rgba(138,107,61,0.18)" }}>
          <img src={desertHeroImg} alt="هوية مواعيدك المعمارية" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#FAF7F2]/95 via-[#FAF7F2]/72 to-transparent" />
          <div className="absolute inset-y-0 right-0 flex w-[62%] flex-col justify-center px-5 text-right">
            <h3 className="text-[30px] font-extrabold leading-tight" style={{ color: INK }}>
              {currentGreeting()} يا {name}
            </h3>
            <p className="mt-4 text-[16px] font-semibold leading-8" style={{ color: "#5D554A" }}>
              ابدأ يومك بنية طيبة، وتوكل على الله في كل خطوة.
            </p>
            <span className="mt-4 text-2xl" style={{ color: GOLD }}>♥</span>
          </div>
        </div>

        <section className="rounded-[26px] border bg-white/72 p-3" style={{ borderColor: "rgba(201,160,99,0.24)", boxShadow: "0 12px 30px rgba(138,107,61,0.10)" }}>
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C9A063] to-transparent" />
            <h3 className="text-[22px] font-extrabold" style={{ color: BROWN }}>مواقيت الصلاة</h3>
            <Landmark className="h-6 w-6" style={{ color: GOLD }} />
          </div>
          <div className="grid grid-cols-6 overflow-hidden rounded-[18px] border" style={{ borderColor: "rgba(201,160,99,0.18)" }}>
            {prayers.map((prayer) => {
              const active = prayer.key === "asr";
              return (
                <div
                  key={prayer.key}
                  className="flex min-h-[92px] flex-col items-center justify-center gap-2 border-l px-1 text-center last:border-l-0"
                  style={{
                    borderColor: "rgba(201,160,99,0.16)",
                    background: active ? "#F3E8D6" : "rgba(255,255,255,0.62)",
                    color: active ? BROWN : INK,
                  }}
                >
                  <span style={{ color: GOLD }}><PrayerIcon keyName={prayer.key} /></span>
                  <span className="text-[13px] font-extrabold">{prayer.label}</span>
                  <span className="text-[14px] font-bold" dir="ltr">{prayer.time}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-[20px] border bg-[#FAF7F2] px-4 py-3" style={{ borderColor: "rgba(201,160,99,0.18)" }}>
            <Landmark className="h-10 w-10 shrink-0" style={{ color: GOLD }} />
            <p className="flex-1 text-center text-[18px] font-bold leading-8" style={{ color: BROWN }}>
              الصلاة نور وراحة للقلب، فحافظ عليها في وقتها
            </p>
          </div>
          <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold" style={{ borderColor: "rgba(201,160,99,0.20)", color: INK }}>
            <Clock3 className="h-4 w-4" style={{ color: GOLD }} />
            الصلاة القادمة: العصر · متبقي 01:29:45
          </div>
        </section>

        <section className="rounded-[26px] border bg-white/72 p-4" style={{ borderColor: "rgba(201,160,99,0.24)", boxShadow: "0 12px 30px rgba(138,107,61,0.10)" }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-[20px] font-extrabold" style={{ color: INK }}>
              <CalendarDays className="h-6 w-6" style={{ color: GOLD }} />
              مواعيد مهمة قريبة
            </h3>
            <Link href="/salaries" className="text-sm font-bold" style={{ color: BROWN }}>عرض الكل</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {finance.map((item) => {
              const isHousing = item.name.includes("سكن");
              const Icon = item.type === "salary" ? Wallet : isHousing ? Home : Users;
              return (
                <Link key={item.id} href="/salaries">
                  <article className="min-h-[148px] rounded-[22px] border bg-[#FFFCF7] p-4 text-center" style={{ borderColor: "rgba(201,160,99,0.24)" }}>
                    <Icon className="mx-auto h-6 w-6" style={{ color: GOLD }} />
                    <h4 className="mt-2 text-[15px] font-extrabold" style={{ color: INK }}>{item.name}</h4>
                    <p className="mt-1 text-xs font-semibold" style={{ color: "#6F6557" }}>{item.next_date}</p>
                    <p className="mt-2 text-[38px] font-extrabold leading-none" style={{ color: BROWN }}>{item.days_remaining}</p>
                    <p className="mt-1 text-sm font-bold" style={{ color: "#6F6557" }}>يوماً متبقياً</p>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </AppShell>
  );
}
