import { useState, useMemo } from "react";
import { ChevronLeft, Home, ShieldCheck, Users, Wallet, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useGatewayFinancialCountdown } from "@/hooks/useGatewayData";
import { useOfficialFinancialDates } from "@/hooks/useOfficialData";
import { normalizeFinancialEvents } from "@/lib/financialEngine";
import { parseRiyadhDateKey } from "@/lib/riyadhTime";

const GOLD = "#C9A063";
const BROWN = "#8A6B3D";
const INK = "#2F2B25";

function iconFor(type: string, name: string) {
  if (type === "salary") return Wallet;
  if (type === "housing" || name.includes("ط³ظƒظ†")) return Home;
  if (type === "bill" || name.includes("ظƒظ‡ط±ط¨ط§ط،")) return Zap;
  if (type === "eligibility" || name.includes("ط£ظ‡ظ„ظٹط©")) return ShieldCheck;
  return Users;
}

function dateLabel(date: string) {
  const parsed = parseRiyadhDateKey(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("ar-SA", { month: "long", day: "numeric", year: "numeric" });
}

/**
 * FinancePage uses either official, confirmed financial dates (from Supabase)
 * or falls back to the gateway countdown service. This ensures the UI always
 * displays up-to-date events, while preferring vetted official data when
 * available. The page supports tabs for upcoming and previous events; only
 * upcoming events are currently rendered.
 */
export default function FinancePage() {
  const [tab, setTab] = useState<"upcoming" | "previous">("upcoming");
  // Fetch official confirmed dates
  const {
    data: officialData,
    isLoading: isOfficialLoading,
  } = useOfficialFinancialDates();
  // Fallback: fetch gateway countdown
  const {
    data: gatewayData,
    isLoading: isGatewayLoading,
  } = useGatewayFinancialCountdown();

  // Compute items by selecting official data if present, else gateway data
  const computedItems = useMemo(() => {
    return normalizeFinancialEvents({
      official: officialData,
      gateway: gatewayData,
      includePast: true,
    });
  }, [officialData, gatewayData]);

  // Determine loading state: loading if official still loading,
  // or if no official records and gateway is loading
  const isLoading = isOfficialLoading || (Array.isArray(officialData) && officialData.length === 0 && isGatewayLoading);

  const items = (tab === "upcoming"
    ? computedItems.filter((item) => !item.isPast)
    : computedItems.filter((item) => item.isPast).reverse()
  ).slice(0, 6);

  return (
    <AppShell title="ط§ظ„ط±ظˆط§طھط¨ ظˆط§ظ„ط¯ط¹ظ…" showBack>
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
              ط§ظ„ظ‚ط§ط¯ظ…ط©
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
              ط§ظ„ط³ط§ط¨ظ‚ط©
            </button>
          </div>
        </div>

        <p className="text-center text-[16px] font-bold" style={{ color: "#6F6557" }}>
          {tab === "upcoming" ? "ط¬ظ…ظٹط¹ ط§ظ„ط±ظˆط§طھط¨ ظˆط§ظ„ظ…ط³ط§ط¹ط¯ط§طھ ط§ظ„ظ‚ط§ط¯ظ…ط©" : "ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط© ط§ظ„ط³ط§ط¨ظ‚ط© ظ…ط­ظپظˆط¸ط© ظ„ظ„ط±ط¬ظˆط¹ ط¥ظ„ظٹظ‡ط§"}
        </p>

        {isLoading ? (
          <div
            className="rounded-[24px] border bg-white/86 p-6 text-center"
            style={{
              borderColor: "rgba(201,160,99,0.22)",
              boxShadow: "0 14px 34px rgba(138,107,61,0.12)",
            }}
          >
            <h3 className="text-xl font-extrabold" style={{ color: INK }}>ط¬ط§ط±ظٹ طھط­ظ…ظٹظ„ ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط©...</h3>
          </div>
        ) : items.length === 0 ? (
          <div
            className="rounded-[24px] border bg-white/86 p-6 text-center"
            style={{
              borderColor: "rgba(201,160,99,0.22)",
              boxShadow: "0 14px 34px rgba(138,107,61,0.12)",
            }}
          >
            <Wallet className="mx-auto h-9 w-9" style={{ color: GOLD }} />
            <h3 className="mt-3 text-xl font-extrabold" style={{ color: INK }}>ظ„ط§ طھظˆط¬ط¯ ظ…ظˆط§ط¹ظٹط¯ ظ…ط§ظ„ظٹط© ظ…طھط§ط­ط©</h3>
            <p className="mt-2 text-sm font-semibold leading-7" style={{ color: "#6F6557" }}>
              ط£ط¶ظپ ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ظ…ظ† ظ„ظˆط­ط© ط§ظ„ظ…ط§ظ„ظƒ.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: any) => {
              const itemName = String(item.name);
              const itemType = String(item.type ?? "");
              const days = Number(item.days_remaining ?? 0);
              const Icon = iconFor(itemType, itemName);
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
                    <span className="mt-1 text-sm font-bold" style={{ color: INK }}>ظٹظˆظ…ط§ظ‹ ظ…طھط¨ظ‚ظٹط§ظ‹</span>
                  </div>

                  <div className="min-w-0 text-right">
                    <h2 className="text-[25px] font-extrabold leading-tight" style={{ color: INK }}>{itemName}</h2>
                    <p className="mt-2 text-[17px] font-semibold" style={{ color: "#6F6557" }}>{dateLabel(String(item.next_date))}</p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F3E8D6]">
                      <span className="block h-full rounded-full" style={{ width: progress, background: "linear-gradient(90deg, #C9A063, #E3C383)" }} />
                    </div>
                    <p className="mt-2 text-sm font-bold" style={{ color: BROWN }}>{item.statusLabel}</p>
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
        )}
      </div>
    </AppShell>
  );
}

