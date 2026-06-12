import { calculateDaysRemaining, getRiyadhStartOfDay, getRiyadhTodayKey, parseRiyadhDateKey } from "./riyadhTime";

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
  source: "official" | "gateway";
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
  confirmed: "مؤكد",
  expected: "متوقع",
  changed: "معدّل",
  delayed: "مؤجل",
  advanced: "مقدم",
  unavailable: "غير متاح",
};

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
        name: String(row.event_name_ar ?? row.name_ar ?? row.name ?? row.event_key ?? "موعد مالي"),
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

  return events
    .filter((event): event is FinancialDisplayEvent => Boolean(event))
    .sort(sortFinancialEvents);
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
        name: String(row.name ?? "موعد مالي"),
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

  return events
    .filter((event): event is FinancialDisplayEvent => Boolean(event))
    .sort(sortFinancialEvents);
}

export function normalizeFinancialEvents({
  official,
  gateway,
  includePast = false,
  limit,
}: NormalizeFinancialOptions): FinancialDisplayEvent[] {
  const officialEvents = Array.isArray(official) ? fromOfficial(official, includePast) : [];
  const gatewayEvents = officialEvents.length > 0 ? [] : Array.isArray(gateway) ? fromGateway(gateway, includePast) : [];
  const events = officialEvents.length > 0 ? officialEvents : gatewayEvents;
  return typeof limit === "number" ? events.slice(0, limit) : events;
}

export function getFinancialDataMode(official?: unknown[] | null): "official" | "gateway" {
  return Array.isArray(official) && official.length > 0 ? "official" : "gateway";
}

export function hasRiyadhFinancialDatePassed(dateKey: string): boolean {
  const today = getRiyadhTodayKey();
  return dateKey < today;
}
