import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, GraduationCap } from "lucide-react";

interface Vacation {
  name: string;
  date: string;
  endDate?: string;
  type: "ظˆط·ظ†ظٹ" | "ط¯ظٹظ†ظٹ" | "ط¯ط±ط§ط³ظٹ";
  emoji: string;
}

const VACATIONS: Vacation[] = [
  { name: "ط§ظ„ظٹظˆظ… ط§ظ„ظˆط·ظ†ظٹ ط§ظ„ط³ط¹ظˆط¯ظٹ", date: "2025-09-23", endDate: "2025-09-25", type: "ظˆط·ظ†ظٹ", emoji: "ًں‡¸ًں‡¦" },
  { name: "ط¥ط¬ط§ط²ط© ظ…ظ†طھطµظپ ط§ظ„ظپطµظ„ ط§ظ„ط£ظˆظ„", date: "2025-11-01", endDate: "2025-11-14", type: "ط¯ط±ط§ط³ظٹ", emoji: "ًں“ڑ" },
  { name: "ظٹظˆظ… ط§ظ„طھط£ط³ظٹط³ ط§ظ„ط³ط¹ظˆط¯ظٹ", date: "2026-02-22", endDate: "2026-02-23", type: "ظˆط·ظ†ظٹ", emoji: "ًںڈ›ï¸ڈ" },
  { name: "ط¥ط¬ط§ط²ط© ظ…ظ†طھطµظپ ط§ظ„ظپطµظ„ ط§ظ„ط«ط§ظ†ظٹ", date: "2026-02-28", endDate: "2026-03-07", type: "ط¯ط±ط§ط³ظٹ", emoji: "ًں“–" },
  { name: "ط¥ط¬ط§ط²ط© ظ†ظ‡ط§ظٹط© ط§ظ„ظپطµظ„ ط§ظ„ط«ط§ظ†ظٹ", date: "2026-04-01", endDate: "2026-05-15", type: "ط¯ط±ط§ط³ظٹ", emoji: "ًںژ“" },
  { name: "ط¹ظٹط¯ ط§ظ„ظپط·ط± ط§ظ„ظ…ط¨ط§ط±ظƒ", date: "2026-04-20", endDate: "2026-04-25", type: "ط¯ظٹظ†ظٹ", emoji: "ًںŒ™" },
  { name: "ط¹ظٹط¯ ط§ظ„ط£ط¶ط­ظ‰ ط§ظ„ظ…ط¨ط§ط±ظƒ", date: "2026-06-27", endDate: "2026-07-03", type: "ط¯ظٹظ†ظٹ", emoji: "ًںگ‘" },
];

const SCHOOL_TERMS = [
  { name: "ط§ظ„ظپطµظ„ ط§ظ„ط¯ط±ط§ط³ظٹ ط§ظ„ط£ظˆظ„", start: "2025-08-24", end: "2025-12-26" },
  { name: "ط§ظ„ظپطµظ„ ط§ظ„ط¯ط±ط§ط³ظٹ ط§ظ„ط«ط§ظ†ظٹ", start: "2026-01-04", end: "2026-05-07" },
];

const typeColor: Record<string, string> = {
  ظˆط·ظ†ظٹ: "bg-green-500/10 text-green-600 border-green-500/20",
  ط¯ظٹظ†ظٹ: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  ط¯ط±ط§ط³ظٹ: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const borderColor: Record<string, string> = {
  ظˆط·ظ†ظٹ: "border-r-green-500",
  ط¯ظٹظ†ظٹ: "border-r-emerald-500",
  ط¯ط±ط§ط³ظٹ: "border-r-blue-500",
};

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ar-SA-u-ca-gregory", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function durationDays(start: string, end?: string): number {
  if (!end) return 1;
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export default function CentersStudyPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = VACATIONS
    .map(v => ({ ...v, days: daysUntil(v.date) }))
    .filter(v => v.days >= 0)
    .sort((a, b) => a.days - b.days);

  const past = VACATIONS
    .map(v => ({ ...v, days: daysUntil(v.date) }))
    .filter(v => v.days < 0)
    .sort((a, b) => b.days - a.days)
    .slice(0, 2);

  const currentTerm = SCHOOL_TERMS.find(t => {
    const start = new Date(t.start);
    const end = new Date(t.end);
    return today >= start && today <= end;
  });

  return (
    <AppShell title="ط§ظ„ط¯ط±ط§ط³ط© ظˆط§ظ„ط¥ط¬ط§ط²ط§طھ" showBack>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">ط§ظ„طھظ‚ظˆظٹظ… ط§ظ„ط¯ط±ط§ط³ظٹ</h2>
            <p className="text-sm text-muted-foreground">ط§ظ„ط¥ط¬ط§ط²ط§طھ ط§ظ„ط±ط³ظ…ظٹط© ظˆط§ظ„ظپطµظˆظ„ ط§ظ„ط¯ط±ط§ط³ظٹط©</p>
          </div>
        </div>

        {currentTerm && (
          <Card className="border-border shadow-sm bg-card overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base">ط§ظ„ظپطµظ„ ط§ظ„ط­ط§ظ„ظٹ</h3>
              </div>
              <div className="font-bold text-lg text-foreground mb-1">{currentTerm.name}</div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(currentTerm.start)}</span>
                <span>â†گ</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(currentTerm.end)}</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>ط§ظ„طھظ‚ط¯ظ…</span>
                  <span>
                    {(() => {
                      const total = durationDays(currentTerm.start, currentTerm.end);
                      const passed = Math.min(durationDays(currentTerm.start) - 1, total);
                      const pct = Math.round((passed / total) * 100);
                      return `${pct}%`;
                    })()}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: (() => {
                        const total = durationDays(currentTerm.start, currentTerm.end);
                        const passed = Math.min(Math.max(0, -daysUntil(currentTerm.start)), total);
                        return `${Math.round((passed / total) * 100)}%`;
                      })(),
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <h3 className="font-bold text-lg text-foreground px-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            ط§ظ„ط¥ط¬ط§ط²ط§طھ ط§ظ„ظ‚ط§ط¯ظ…ط©
          </h3>
          {upcoming.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">ظ„ط§ طھظˆط¬ط¯ ط¥ط¬ط§ط²ط§طھ ظ‚ط§ط¯ظ…ط© ظ…ط³ط¬ظ„ط©</p>
          ) : (
            upcoming.map((vac) => (
              <Card
                key={vac.name}
                className={`border-border shadow-sm overflow-hidden border-r-4 ${borderColor[vac.type]}`}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none mt-0.5">{vac.emoji}</span>
                    <div>
                      <h4 className="font-bold text-base">{vac.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(vac.date)}</span>
                        {vac.endDate && <span className="text-xs">â†گ {formatDate(vac.endDate)}</span>}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeColor[vac.type]}`}>
                          {vac.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {durationDays(vac.date, vac.endDate)} ط£ظٹط§ظ…
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center bg-muted/60 px-3 py-2 rounded-xl shrink-0">
                    {vac.days === 0 ? (
                      <div className="text-sm font-extrabold text-primary">ط§ظ„ظٹظˆظ…</div>
                    ) : (
                      <>
                        <div className="text-xl font-extrabold text-foreground">{vac.days}</div>
                        <div className="text-[10px] font-bold text-muted-foreground">ظٹظˆظ…</div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {past.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-muted-foreground px-1">ط¥ط¬ط§ط²ط§طھ ظ…ط¶طھ</h3>
            {past.map(vac => (
              <Card key={vac.name} className="border-border shadow-sm opacity-60">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{vac.emoji}</span>
                    <span className="font-medium text-sm line-through text-muted-foreground">{vac.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(vac.date)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-2 pb-1">
          ط¨ظٹط§ظ†ط§طھ طھط¬ط±ظٹط¨ظٹط© ظ‚ط§ط¨ظ„ط© ظ„ظ„طھط¹ط¯ظٹظ„ â€” ط§ظ„طھظ‚ظˆظٹظ… ط§ظ„ط¯ط±ط§ط³ظٹ 1446/1447
        </div>
      </div>
    </AppShell>
  );
}

