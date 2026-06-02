import { useState } from "react";
import { ChevronLeft, Home, ShieldCheck, Users, Wallet, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useGatewayFinancialCountdown } from "@/hooks/useGatewayData";

const GOLD = "#C9A063";
const BROWN = "#8A6B3D";
const INK = "#2F2B25";

const fallbackItems = [
  { id: 1, name: "الراتب", next_date: "2025-06-10", days_remaining: 21, type: "salary", note: "أقرب موعد الراتب" },
  { id: 2, name: "حساب المواطن", next_date: "2025-06-10", days_remaining: 21, type: "support", note: "أقرب نزول الدعم" },
  { id: 3, name: "الدعم السكني", next_date: "2025-06-24", days_remaining: 35, type: "housing", note: "دعمك يساهم في استقرارك" },
  { id: 4, name: "الضمان الاجتماعي", next_date: "2025-07-01", days_remaining: 42, type: "support", note: "نحو مستقبل أفضل" },
  { id: 5, name: "أهلية الضمان", next_date: "2025-07-15", days_remaining: 56, type: "eligibility", note: "تنتظر نتائج أهليتك" },
  { id: 6, name: "كهرباء", next_date: "2025-08-04", days_remaining: 76, type: "bill", note: "موعد فاتورة الكهرباء" },
];

function iconFor(type: string, name: string) {
  if (type === "salary") return Wallet;
  if (type === "housing" || name.includes("سكن")) return Home;
  if (type === "bill" || name.includes("كهرباء")) return Zap;
  if (type === "eligibility" || name.includes("أهلية")) return ShieldCheck;
  return Users;
}

function dateLabel(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("ar-SA", { month: "long", day: "numeric", year: "numeric" });
}

export default function FinancePage() {
  const [tab, setTab] = useState<"upcoming" | "previous">("upcoming");
  const { data } = useGatewayFinancialCountdown();
  const items = tab === "upcoming" && data?.length ? data.slice(0, 6) : fallbackItems;

  return (
    <AppShell title="الرواتب والدعم" showBack>
      <div className="space-y-5">
        <div className="rounded-[22px] bg-[#F3E8D6]/70 p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setTab("upcoming")}
              className="h-14 rounded-[18px] text-[18px] font-extrabold transition"
              style={{
                background: tab === "upcoming" ? "linear-gradient(135deg, #C9A063, #B98534)" : "transparent",
                color: tab === "upcoming" ? "#FFFFFF" : INK,
              }}
            >
              القادمة
            </button>
            <button
              type="button"
              onClick={() => setTab("previous")}
              className="h-14 rounded-[18px] text-[18px] font-extrabold transition"
              style={{
                background: tab === "previous" ? "linear-gradient(135deg, #C9A063, #B98534)" : "transparent",
                color: tab === "previous" ? "#FFFFFF" : INK,
              }}
            >
              السابقة
            </button>
          </div>
        </div>

        <p className="text-center text-[16px] font-bold" style={{ color: "#6F6557" }}>
          {tab === "upcoming" ? "جميع الرواتب والمساعدات القادمة" : "المواعيد المالية السابقة محفوظة للرجوع إليها"}
        </p>

        <div className="space-y-4">
          {items.map((item) => {
            const itemName = String(item.name);
            const itemType = String(item.type ?? "");
            const days = Number(item.days_remaining ?? 0);
            const Icon = iconFor(itemType, itemName);
            const note = "note" in item && item.note ? String(item.note) : "موعد مالي مهم";
            const progress = `${Math.max(8, Math.min(92, 100 - days))}%`;

            return (
              <article
                key={item.id}
                className="grid grid-cols-[92px_1fr_70px] items-center gap-3 rounded-[24px] border bg-white/86 p-4"
                style={{
                  borderColor: "rgba(201,160,99,0.22)",
                  boxShadow: "0 14px 34px rgba(138,107,61,0.12)",
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="relative grid h-20 w-20 place-items-center rounded-full">
                    <span className="absolute inset-0 rounded-full border-4 border-[#F3E8D6]" />
                    <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C9A063] border-r-[#C9A063]" />
                    <span className="text-[34px] font-extrabold leading-none" style={{ color: INK }}>{days}</span>
                  </div>
                  <span className="mt-1 text-sm font-bold" style={{ color: INK }}>يوماً متبقياً</span>
                </div>

                <div className="min-w-0 text-right">
                  <h2 className="text-[25px] font-extrabold leading-tight" style={{ color: INK }}>{itemName}</h2>
                  <p className="mt-2 text-[17px] font-semibold" style={{ color: "#6F6557" }}>{dateLabel(String(item.next_date))}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F3E8D6]">
                    <span className="block h-full rounded-full" style={{ width: progress, background: "linear-gradient(90deg, #C9A063, #E3C383)" }} />
                  </div>
                  <p className="mt-2 text-sm font-bold" style={{ color: BROWN }}>{note}</p>
                </div>

                <div className="flex flex-col items-center gap-5">
                  <div className="grid h-16 w-16 place-items-center rounded-[20px] border bg-[#FFFCF7]" style={{ borderColor: "rgba(201,160,99,0.20)" }}>
                    <Icon className="h-9 w-9" strokeWidth={1.6} style={{ color: GOLD }} />
                  </div>
                  <ChevronLeft className="h-5 w-5" style={{ color: INK }} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
