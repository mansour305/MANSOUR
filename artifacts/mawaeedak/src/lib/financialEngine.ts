import { calculateDaysRemaining, getRiyadhDateParts, getRiyadhStartOfDay, getRiyadhTodayKey, parseRiyadhDateKey } from "./riyadhTime";

export type FinancialEventStatus = "confirmed" | "expected" | "changed" | "delayed" | "advanced" | "unavailable";

export type FinancialDisplayEvent = {
  id: string | number;
  name: string;
  type: string;
  next_date: string;
  days_remaining: number;
  amount: number | null;
  status: FinancialEventStatus;
  statusLabel: string;
  source: "official" | "gateway" | "fallback";
  sourceAuthority: string | null;
  sourceUrl: string | null;
  isPast: boolean;
};

type NormalizeFinancialOptions = {
  official?: unknown[] | null;
  gateway?: unknown[] | null;
  includePast?: boolean;
  limit?: number;
};

const STATUS_LABELS: Record<FinancialEventStatus, string> = {
  confirmed: "ظ…ط¤ظƒط¯",
  expected: "ظ…طھظˆظ‚ط¹",
  changed: "ظ…ط¹ط¯ظ‘ظ„",
  delayed: "ظ…ط¤ط¬ظ„",
  advanced: "ظ…ظ‚ط¯ظ…",
  unavailable: "ط؛ظٹط± ظ…طھط§ط­",
};

const FALLBACK_MONTHLY_EVENTS = [
  { type: "salary", name: "ط§ظ„ط±ط§طھط¨", day: 27, authority: "ظˆط²ط§ط±ط© ط§ظ„ظ…ط§ظ„ظٹط©" },
  { type: "citizen_account", name: "ط­ط³ط§ط¨ ط§ظ„ظ…ظˆط§ط·ظ†", day: 10, authority: "ط­ط³ط§ط¨ ط§ظ„ظ…ظˆط§ط·ظ†" },
  { type: "housing_support", name: "ط§ظ„ط¯ط¹ظ… ط§ظ„ط³ظƒظ†ظٹ", day: 24, authority: "ط³ظƒظ†ظٹ" },
  { type: "social_security", name: "ط§ظ„ط¶ظ…ط§ظ† ط§ظ„ط§ط¬طھظ…ط§ط¹ظٹ", day: 1, authority: "ظˆط²ط§ط±ط© ط§ظ„ظ…ظˆط§ط±ط¯ ط§ظ„ط¨ط´ط±ظٹط© ظˆط§ظ„طھظ†ظ…ظٹط© ط§ظ„ط§ط¬طھظ…ط§ط¹ظٹط©" },
  { type: "retirement", name: "ط§ظ„طھظ‚ط§ط¹ط¯", day: 25, authority: "ط§ظ„ظ…ط¤ط³ط³ط© ط§ظ„ط¹ط§ظ…ط© ظ„ظ„طھط£ظ…ظٹظ†ط§طھ ط§ظ„ط§ط¬طھظ…ط§ط¹ظٹط©" },
  { type: "rehabilitation", name: "ط§ظ„طھط£ظ‡ظٹظ„ ط§ظ„ط´ط§ظ…ظ„", day: 26, authority: "ظˆط²ط§ط±ط© ط§ظ„ظ…ظˆط§ط±ط¯ ط§ظ„ط¨ط´ط±ظٹط© ظˆط§ظ„طھظ†ظ…ظٹط© ط§ظ„ط§ط¬طھظ…ط§ط¹ظٹط©" },
] as const;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asDateKey(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? match[0] : null;
}

function normalizeStatus(value: unknown, isConfirmed?: unknown): FinancialEventStatus {
  if (value === "changed" || value === "delayed" || value === "advanced") return value;
  if (value === "expected" || value === "unavailable") return value;
  return isConfirmed === false ? "expected" : "confirmed";
}

function isPastDate(dateKey: string): boolean {
  return parseRiyadhDateKey(dateKey).getTime() < getRiyadhStartOfDay().getTime();
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addOneMonth(year: number, month: number): { year: number; month: number } {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

function adjustWeekend(dateKey: string): string {
  const date = parseRiyadhDateKey(dateKey);
  const weekday = date.getUTCDay();

  if (weekday === 5) {
    date.setUTCDate(date.getUTCDate() - 1);
  } else if (weekday === 6) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return formatDateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

function nextMonthlyDate(day: number): string {
  const today = getRiyadhTodayKey();
  const parts = getRiyadhDateParts();
  let target = adjustWeekend(formatDateKey(parts.year, parts.month, day));

  if (target < today) {
    const next = addOneMonth(parts.year, parts.month);
    target = adjustWeekend(formatDateKey(next.year, next.month, day));
  }

  return target;
}

function sortFinancialEvents(a: FinancialDisplayEvent, b: FinancialDisplayEvent): number {
  if (a.next_date !== b.next_date) return a.next_date < b.next_date ? -1 : 1;
  if (a.type === "salary" && b.type !== "salary") return -1;
  if (b.type === "salary" && a.type !== "salary") return 1;
  return String(a.name).localeCompare(String(b.name), "ar");
}

function fromOfficial(records: unknown[], includePast: boolean): FinancialDisplayEvent[] {
  const events: Array<FinancialDisplayEvent | null> = records.map((record) => {
    const row = asRecord(record);
    const dateKey = asDateKey(row.occurrence_date_gregorian);
    if (!dateKey) return null;

    const status = normalizeStatus(row.status ?? row.adjustment_status ?? row.change_status, row.is_confirmed);
    const isPast = isPastDate(dateKey);
    if (!includePast && isPast) return null;

    return {
      id: (row.id as string | number | undefined) ?? String(row.event_key ?? dateKey),
      name: String(row.event_name_ar ?? row.name_ar ?? row.name ?? row.event_key ?? "ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ"),
      type: String(row.event_key ?? row.type ?? "financial"),
      next_date: dateKey,
      days_remaining: calculateDaysRemaining(dateKey),
      amount: typeof row.amount === "number" ? row.amount : null,
      status,
      statusLabel: STATUS_LABELS[status],
      source: "official" as const,
      sourceAuthority: typeof row.source_authority === "string" ? row.source_authority : null,
      sourceUrl: typeof row.source_url === "string" ? row.source_url : null,
      isPast,
    };
  });

  return events.filter((event): event is FinancialDisplayEvent => Boolean(event)).sort(sortFinancialEvents);
}

function fromGateway(records: unknown[], includePast: boolean): FinancialDisplayEvent[] {
  const events: Array<FinancialDisplayEvent | null> = records.map((record) => {
    const row = asRecord(record);
    const dateKey = asDateKey(row.next_date);
    if (!dateKey) return null;

    const isPast = isPastDate(dateKey);
    if (!includePast && isPast) return null;

    const amount = Number(row.amount);
    return {
      id: (row.id as string | number | undefined) ?? `${String(row.type ?? "financial")}-${dateKey}`,
      name: String(row.name ?? "ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ"),
      type: String(row.type ?? "financial"),
      next_date: dateKey,
      days_remaining: calculateDaysRemaining(dateKey),
      amount: Number.isFinite(amount) ? amount : null,
      status: "expected" as const,
      statusLabel: STATUS_LABELS.expected,
      source: "gateway" as const,
      sourceAuthority: null,
      sourceUrl: null,
      isPast,
    };
  });

  return events.filter((event): event is FinancialDisplayEvent => Boolean(event)).sort(sortFinancialEvents);
}

function fromFallback(includePast: boolean): FinancialDisplayEvent[] {
  const events: Array<FinancialDisplayEvent | null> = FALLBACK_MONTHLY_EVENTS.map((event) => {
    const dateKey = nextMonthlyDate(event.day);
    const isPast = isPastDate(dateKey);

    if (!includePast && isPast) return null;

    return {
      id: `fallback-${event.type}-${dateKey}`,
      name: event.name,
      type: event.type,
      next_date: dateKey,
      days_remaining: calculateDaysRemaining(dateKey),
      amount: null,
      status: "expected" as const,
      statusLabel: "ظ…طھظˆظ‚ط¹ â€” ط¨ط§ظ†طھط¸ط§ط± ط§ط¹طھظ…ط§ط¯ ط±ط³ظ…ظٹ",
      source: "fallback" as const,
      sourceAuthority: event.authority,
      sourceUrl: null,
      isPast,
    };
  });

  return events.filter((event): event is FinancialDisplayEvent => event !== null).sort(sortFinancialEvents);
}

export function normalizeFinancialEvents({
  official,
  gateway,
  includePast = false,
  limit,
}: NormalizeFinancialOptions): FinancialDisplayEvent[] {
  const officialEvents = Array.isArray(official) ? fromOfficial(official, includePast) : [];
  const gatewayEvents = officialEvents.length > 0 ? [] : Array.isArray(gateway) ? fromGateway(gateway, includePast) : [];
  const fallbackEvents = officialEvents.length === 0 && gatewayEvents.length === 0 ? fromFallback(includePast) : [];
  const events = officialEvents.length > 0 ? officialEvents : gatewayEvents.length > 0 ? gatewayEvents : fallbackEvents;
  return typeof limit === "number" ? events.slice(0, limit) : events;
}

export function getFinancialDataMode(official?: unknown[] | null): "official" | "gateway" | "fallback" {
  return Array.isArray(official) && official.length > 0 ? "official" : "gateway";
}

export function hasRiyadhFinancialDatePassed(dateKey: string): boolean {
  const today = getRiyadhTodayKey();
  return dateKey < today;
}

