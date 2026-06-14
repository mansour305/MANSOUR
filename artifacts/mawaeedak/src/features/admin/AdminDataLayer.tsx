import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Database, CheckCircle2, XCircle, AlertCircle, RefreshCw, PenLine
} from "lucide-react";
import {
  gwRunShadowComparison,
  gwMarkNotificationRead,
  gwMarkAllNotificationsRead,
  DATA_SOURCE_MODE,
} from "@/lib/dataGateway";
import type { ShadowComparisonSummary, WriteResult } from "@/lib/dataGateway";

const TABLE_LABELS: Record<string, string> = {
  daily_messages: "ط±ط³ط§ط¦ظ„ ط§ظ„ظٹظˆظ…",
  story_templates: "ظ‚ظˆط§ظ„ط¨ ط§ظ„ط³طھظˆط±ظٹ",
  themes: "ط§ظ„ط«ظٹظ…ط§طھ",
  news: "ط§ظ„ط£ط®ط¨ط§ط±",
  jobs: "ط§ظ„ظˆط¸ط§ط¦ظپ",
  appointments: "ط§ظ„ظ…ظˆط§ط¹ظٹط¯",
  financial_events: "ط§ظ„ط£ط­ط¯ط§ط« ط§ظ„ظ…ط§ظ„ظٹط©",
  notifications: "ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ",
  complaints: "ط§ظ„ط´ظƒط§ظˆظ‰",
};

const MODE_LABEL: Record<string, string> = {
  api: "API / PostgreSQL",
  supabase_shadow: "Shadow â€” API + Supabase ظ…ظ‚ط§ط±ظ†ط©",
  supabase: "Supabase",
};

// ط¬ط±ط¯ ظƒط§ظ…ظ„ ظ„ظ„ظ€ mutations â€” Phase 12I
const MUTATIONS_INVENTORY = [
  { scope: "notifications â€” mark-read", risk: "low", mode: "supabase", phase: "12I", note: "Write Gateway ط¬ط§ظ‡ط² â€” ط§ط®طھط¨ط§ط± ظ‡ظ†ط§" },
  { scope: "notifications â€” mark-all-read", risk: "low", mode: "supabase", phase: "12I", note: "Write Gateway ط¬ط§ظ‡ط² â€” ط§ط®طھط¨ط§ط± ظ‡ظ†ط§" },
  { scope: "notifications â€” delete", risk: "medium", mode: "api", phase: "12J", note: "ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval" },
  { scope: "news â€” add/edit/delete (admin)", risk: "medium", mode: "api", phase: "12J", note: "ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval" },
  { scope: "jobs â€” add/edit/delete (admin)", risk: "medium", mode: "api", phase: "12J", note: "ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval" },
  { scope: "story_templates â€” add/edit/delete (admin)", risk: "medium", mode: "api", phase: "12J", note: "ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval" },
  { scope: "daily_messages â€” add/edit/delete (admin)", risk: "medium", mode: "api", phase: "12J", note: "ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval" },
  { scope: "themes â€” update/toggle (admin)", risk: "low", mode: "api", phase: "12J", note: "ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval" },
  { scope: "appointments â€” add/edit/delete", risk: "high", mode: "api", phase: "later", note: "ظ…ظ…ظ†ظˆط¹ ظ‡ط°ظ‡ ط§ظ„ظ…ط±ط­ظ„ط© â€” ظٹط¤ط«ط± ط¹ظ„ظ‰ ط§ظ„ط±ط¦ظٹط³ظٹط©" },
  { scope: "financial_events â€” add/edit/delete", risk: "high", mode: "api", phase: "later", note: "ظ…ظ…ظ†ظˆط¹ ظ‡ط°ظ‡ ط§ظ„ظ…ط±ط­ظ„ط© â€” ظٹط¤ط«ط± ط¹ظ„ظ‰ ط§ظ„ط±ط¦ظٹط³ظٹط©" },
  { scope: "complaints â€” create", risk: "low", mode: "api", phase: "12J", note: "ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval" },
  { scope: "admin notifications â€” create/delete", risk: "medium", mode: "api", phase: "12J", note: "ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval" },
];

const RISK_COLORS: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function AdminDataLayer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShadowComparisonSummary | null>(null);

  // Write test state
  const [writeLoading, setWriteLoading] = useState(false);
  const [writeResult, setWriteResult] = useState<WriteResult & { action?: string } | null>(null);

  const runComparison = async () => {
    setLoading(true);
    try {
      const summary = await gwRunShadowComparison();
      setResult(summary);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const testMarkRead = async () => {
    setWriteLoading(true);
    setWriteResult(null);
    try {
      // ظ†ط®طھط¨ط± ط¹ظ„ظ‰ ط§ظ„ط¥ط´ط¹ط§ط± id=1 (legacy_id=1 ظپظٹ Supabase)
      const r = await gwMarkNotificationRead(1);
      setWriteResult({ ...r, action: "mark-read (id=1)" });
    } finally {
      setWriteLoading(false);
    }
  };

  const testMarkAllRead = async () => {
    setWriteLoading(true);
    setWriteResult(null);
    try {
      const r = await gwMarkAllNotificationsRead();
      setWriteResult({ ...r, action: "mark-all-read" });
    } finally {
      setWriteLoading(false);
    }
  };

  const currentMode = DATA_SOURCE_MODE;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">ط·ط¨ظ‚ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ â€” Data Layer</h2>

      {/* ط­ط§ظ„ط© ط§ظ„ظ…طµط¯ط± */}
      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            ط­ط§ظ„ط© ط§ظ„ظ…طµط¯ط± ط§ظ„ط­ط§ظ„ظٹ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">ظˆط¶ط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ</span>
            <Badge variant={currentMode === "supabase" ? "default" : "secondary"}>
              {MODE_LABEL[currentMode] ?? currentMode}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">ظ…طµط¯ط± ط§ظ„ظ‚ط±ط§ط،ط©</span>
            <span className="font-medium">
              {currentMode === "supabase"
                ? "Supabase (ظ…ط¹ fallback ط¥ظ„ظ‰ API)"
                : currentMode === "supabase_shadow"
                  ? "API + Supabase (ظ…ظ‚ط§ط±ظ†ط©)"
                  : "API / PostgreSQL"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">ظ…طµط¯ط± ط§ظ„ظƒطھط§ط¨ط©</span>
            <span className="font-medium">
              {currentMode === "supabase"
                ? "Supabase (notifications mark-read) + API (ط¨ظ‚ظٹط© mutations)"
                : "API / PostgreSQL (ظƒظ„ ط§ظ„ظƒطھط§ط¨ط©)"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Supabase Auth</span>
            <Badge variant="outline" className="text-emerald-600 border-emerald-300">ظپط¹ظ‘ط§ظ„</Badge>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-blue-800 text-xs leading-relaxed">
            <strong>Phase 12I:</strong> Partial Write Cutover â€” notifications mark-read ط¬ط§ظ‡ط² ظ„ظ€ Supabase (mode=supabase ظپظ‚ط·).
            ط¨ظ‚ظٹط© ط§ظ„ظƒطھط§ط¨ط©: API. NotificationsPage طھط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval â€” Phase 12J.
          </div>
        </CardContent>
      </Card>

      {/* ط§ط®طھط¨ط§ط± ط§ظ„ظƒطھط§ط¨ط© â€” Write Gateway Test */}
      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" />
            ط§ط®طھط¨ط§ط± Write Gateway â€” Phase 12I
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground leading-relaxed">
            <strong>ط§ظ„ظ†ط·ط§ظ‚ ط§ظ„ظ…ط®طھط§ط±:</strong> notifications mark-read<br />
            <strong>ط§ظ„ظˆط¶ط¹ ط§ظ„ط­ط§ظ„ظٹ:</strong> {MODE_LABEL[currentMode] ?? currentMode}<br />
            <strong>ظ…ط§ط°ط§ ط³ظٹط­ط¯ط«:</strong>{" "}
            {currentMode === "supabase"
              ? "ط³ظٹظƒطھط¨ ط¥ظ„ظ‰ Supabase ظ…ط¨ط§ط´ط±ط© (UPDATE is_read=true WHERE legacy_id=1)"
              : "ط³ظٹظƒطھط¨ ط¹ط¨ط± API (PATCH /api/notifications/1) â€” Supabase ط؛ظٹط± ظ…طھط£ط«ط±"}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={testMarkRead}
              disabled={writeLoading}
            >
              {writeLoading
                ? <Loader2 className="w-4 h-4 animate-spin ml-1" />
                : <CheckCircle2 className="w-4 h-4 ml-1 text-emerald-600" />}
              mark-read (id=1)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={testMarkAllRead}
              disabled={writeLoading}
            >
              {writeLoading
                ? <Loader2 className="w-4 h-4 animate-spin ml-1" />
                : <CheckCircle2 className="w-4 h-4 ml-1 text-emerald-600" />}
              mark-all-read
            </Button>
          </div>

          {writeResult && (
            <div className={`rounded-lg p-3 text-sm border ${
              writeResult.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {writeResult.success
                  ? <CheckCircle2 className="w-4 h-4" />
                  : <XCircle className="w-4 h-4" />}
                {writeResult.success ? "ظ†ط¬ط­ ط§ظ„ط§ط®طھط¨ط§ط±" : "ظپط´ظ„ ط§ظ„ط§ط®طھط¨ط§ط±"}
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">ط§ظ„ط¹ظ…ظ„ظٹط©: </span>
                {writeResult.action}
              </div>
              {writeResult.error && (
                <div className="text-xs mt-1 font-mono opacity-80">{writeResult.error}</div>
              )}
              {writeResult.success && currentMode === "supabase" && (
                <div className="text-xs mt-1 opacity-70">
                  طھط­ظ‚ظ‚: Supabase Dashboard â†’ notifications â†’ is_read = true ظ„ظ„طµظپ legacy_id=1
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ط¬ط±ط¯ ط§ظ„ظ€ mutations */}
      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">ط¬ط±ط¯ Mutations â€” طھطµظ†ظٹظپ ط§ظ„ط®ط·ظˆط±ط©</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border rounded-lg border border-border overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-muted/50 px-3 py-2 font-semibold text-muted-foreground">
              <span className="col-span-5">ط§ظ„ظ†ط·ط§ظ‚</span>
              <span className="col-span-2 text-center">ط®ط·ظˆط±ط©</span>
              <span className="col-span-2 text-center">ط§ظ„ظ…ط±ط­ظ„ط©</span>
              <span className="col-span-3">ط§ظ„ظ…ظ„ط§ط­ط¸ط©</span>
            </div>
            {(Array.isArray(MUTATIONS_INVENTORY) ? MUTATIONS_INVENTORY : []).map((m) => (
              <div key={m.scope} className="grid grid-cols-12 px-3 py-2 items-center gap-1">
                <span className="col-span-5 text-foreground font-medium leading-tight">{m.scope}</span>
                <span className="col-span-2 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${RISK_COLORS[m.risk]}`}>
                    {m.risk === "low" ? "ظ…ظ†ط®ظپط¶" : m.risk === "medium" ? "ظ…طھظˆط³ط·" : "ط¹ط§ظ„ظٹ"}
                  </span>
                </span>
                <span className="col-span-2 text-center text-muted-foreground font-mono">{m.phase}</span>
                <span className="col-span-3 text-muted-foreground leading-tight">{m.note}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ظ…ظ‚ط§ط±ظ†ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ */}
      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            ظ…ظ‚ط§ط±ظ†ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ â€” API vs Supabase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={runComparison} disabled={loading} size="sm" className="w-full">
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin ml-2" />ط¬ط§ط±ظچ ط§ظ„ظ…ظ‚ط§ط±ظ†ط©â€¦</>
              : "طھط´ط؛ظٹظ„ ط§ظ„ظ…ظ‚ط§ط±ظ†ط©"}
          </Button>

          {result && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Supabase ظ…طھطµظ„طں</span>
                {result.supabaseConnected
                  ? <Badge variant="default" className="bg-emerald-600">ظ…طھطµظ„</Badge>
                  : <Badge variant="destructive">ط؛ظٹط± ظ…طھطµظ„</Badge>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ</span>
                <span className="font-bold">{result.apiTotal}</span>
              </div>
              {result.supabaseTotal !== null && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Supabase ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ</span>
                  <span className="font-bold">{result.supabaseTotal}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ط§ظ„ظ†طھظٹط¬ط© ط§ظ„ظƒظ„ظٹط©</span>
                {result.allMatch === true
                  ? <Badge className="bg-emerald-600"><CheckCircle2 className="w-3 h-3 ml-1" />ظ…ط·ط§ط¨ظ‚ طھط§ظ…</Badge>
                  : result.allMatch === false
                    ? <Badge variant="destructive"><XCircle className="w-3 h-3 ml-1" />ظٹظˆط¬ط¯ ط§ط®طھظ„ط§ظپ</Badge>
                    : <Badge variant="secondary"><AlertCircle className="w-3 h-3 ml-1" />ط؛ظٹط± ظ…ط­ط¯ط¯</Badge>}
              </div>

              <div className="divide-y divide-border rounded-lg border border-border overflow-hidden text-sm">
                <div className="grid grid-cols-4 bg-muted/50 px-3 py-2 font-semibold text-xs text-muted-foreground">
                  <span className="col-span-2">ط§ظ„ط¬ط¯ظˆظ„</span>
                  <span className="text-center">API</span>
                  <span className="text-center">Supabase</span>
                </div>
                {(Array.isArray(result.results) ? result.results : []).map((row) => (
                  <div key={row.table} className="grid grid-cols-4 px-3 py-2 items-center">
                    <span className="col-span-2 text-foreground">{TABLE_LABELS[row.table] ?? row.table}</span>
                    <span className="text-center font-mono">{row.apiCount}</span>
                    <span className="text-center font-mono flex items-center justify-center gap-1">
                      {row.supabaseCount ?? "â€”"}
                      {row.match === true && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                      {row.match === false && <XCircle className="w-3 h-3 text-destructive" />}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                ط¢ط®ط± طھط´ط؛ظٹظ„: {new Date(result.runAt).toLocaleString("ar-SA-u-ca-gregory")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* طھط؛ظٹظٹط± ط§ظ„ظˆط¶ط¹ */}
      <Card className="border-border shadow-sm bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">طھط؛ظٹظٹط± ط§ظ„ظˆط¶ط¹ (dev ظپظ‚ط·)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>ط£ط¶ظپ ظ…طھط؛ظٹط± ط§ظ„ط¨ظٹط¦ط© ط§ظ„طھط§ظ„ظٹ ظ„طھط؛ظٹظٹط± ظ…طµط¯ط± ط§ظ„ط¨ظٹط§ظ†ط§طھ:</p>
          <div className="rounded-md bg-muted p-3 font-mono text-xs text-foreground space-y-1">
            <p>VITE_DATA_SOURCE_MODE=api              # PostgreSQL/Express (ط§ظ„ط§ظپطھط±ط§ط¶ظٹ)</p>
            <p>VITE_DATA_SOURCE_MODE=supabase_shadow  # API + ظ…ظ‚ط§ط±ظ†ط© Supabase</p>
            <p>VITE_DATA_SOURCE_MODE=supabase         # Supabase ظ‚ط±ط§ط،ط© + mark-read ظƒطھط§ط¨ط©</p>
          </div>
          <p className="text-xs">
            ط§ظ„ط§ظپطھط±ط§ط¶ظٹ = api. ظپظٹ mode=supabase: mark-read ظٹظƒطھط¨ ط¥ظ„ظ‰ Supabase ظ…ط¨ط§ط´ط±ط©.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

