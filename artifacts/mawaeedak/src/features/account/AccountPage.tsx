import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/hooks/useStore";
import { useTheme } from "@/hooks/useTheme";
import { generateInitials } from "@/lib/utils";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { useLocation, Link } from "wouter";
import {
  Bell, Moon, Sun, LogOut, ChevronLeft, Shield, Wallet,
  Calendar, Newspaper, Briefcase, Star,
  Loader2, Edit2, Trash2, MapPin, Clock, BookOpen, AlertTriangle,
  BadgeCheck, Headphones, Navigation, Navigation2, RefreshCw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
// Phase 13G: location & timezone hook
import { useLocationPrefs, detectTimezone } from "@/hooks/useLocationPrefs";
import { useTimeFormat } from "@/hooks/useTimeFormat";

const NOTIF_PREFS_KEY = "mawaeedak_notif_prefs_v1";
const PRAYER_PREFS_KEY = "mawaeedak_prayer_prefs_v1";
const CALENDAR_PREFS_KEY = "mawaeedak_calendar_prefs_v1";

const SAUDI_CITIES = [
  "ط§ظ„ط±ظٹط§ط¶", "ط¬ط¯ط©", "ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©", "ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ظ…ظ†ظˆط±ط©", "ط§ظ„ط¯ظ…ط§ظ…",
  "ط§ظ„ط®ط¨ط±", "ط§ظ„ط·ط§ط¦ظپ", "طھط¨ظˆظƒ", "ط¨ط±ظٹط¯ط©", "ط®ظ…ظٹط³ ظ…ط´ظٹط·", "ط§ظ„ط£ط­ط³ط§ط،",
  "ظ†ط¬ط±ط§ظ†", "ط¬ظٹط²ط§ظ†", "ط£ط¨ظ‡ط§", "ظٹظ†ط¨ط¹", "ط­ط§ط¦ظ„", "ط¹ط±ط¹ط±",
  "ط³ظƒط§ظƒط§", "ط§ظ„ط¨ط§ط­ط©", "ط§ظ„ط¬ط¨ظٹظ„",
];

const TIMEZONES = [
  { value: "Asia/Riyadh",  label: "طھظˆظ‚ظٹطھ ط§ظ„ط±ظٹط§ط¶ (AST +3)" },
  { value: "Asia/Dubai",   label: "طھظˆظ‚ظٹطھ ط¯ط¨ظٹ (GST +4)" },
  { value: "Asia/Kuwait",  label: "طھظˆظ‚ظٹطھ ط§ظ„ظƒظˆظٹطھ (+3)" },
  { value: "Asia/Bahrain", label: "طھظˆظ‚ظٹطھ ط§ظ„ط¨ط­ط±ظٹظ† (+3)" },
  { value: "Asia/Qatar",   label: "طھظˆظ‚ظٹطھ ظ‚ط·ط± (+3)" },
  { value: "UTC",          label: "UTC (+0)" },
];

function loadKey<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}

function saveKey(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

const NOTIF_TYPES = [
  { key: "salary",       label: "ط§ظ„ط±ظˆط§طھط¨ ظˆط§ظ„ط¯ط¹ظ…",         icon: Wallet,    color: "text-amber-600" },
  { key: "bills",        label: "ط§ظ„ظپظˆط§طھظٹط± ظˆط§ظ„ط§ظ„طھط²ط§ظ…ط§طھ",    icon: Wallet,    color: "text-red-500" },
  { key: "prayer",       label: "ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©",           icon: Star,      color: "text-emerald-600" },
  { key: "appointments", label: "ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ط´ط®طµظٹط©",       icon: Calendar,  color: "text-blue-500" },
  { key: "news",         label: "ط§ظ„ط£ط®ط¨ط§ط± ط§ظ„ظ…ظ‡ظ…ط©",          icon: Newspaper, color: "text-indigo-500" },
  { key: "jobs",         label: "ط§ظ„ظˆط¸ط§ط¦ظپ ط§ظ„ط¬ط¯ظٹط¯ط©",         icon: Briefcase, color: "text-violet-500" },
  { key: "story",        label: "ط³طھظˆط±ظٹ ط§ظ„ظٹظˆظ…",             icon: Bell,      color: "text-pink-500" },
];


export default function AccountPage() {
  const { user, setUser } = useStore();
  const { theme, toggleMode } = useTheme();
  const [, setLocation] = useLocation();

  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Phase 13G: location & timezone
  const { prefs: locPrefs, gpsLoading, gpsError, requestGPS, setManual } = useLocationPrefs();
  const [manualCity, setManualCity]     = useState(locPrefs.city);
  const [manualTz,   setManualTz]       = useState(locPrefs.timezone || detectTimezone());

  const [editName, setEditName] = useState(user.name);
  const [editCity, setEditCity] = useState(user.city);

  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => {
    const saved = loadKey<Record<string, boolean>>(NOTIF_PREFS_KEY, {});
    const defaults: Record<string, boolean> = {};
    NOTIF_TYPES.forEach(t => { defaults[t.key] = saved[t.key] !== false; });
    return defaults;
  });

  const [prayerPrefs, setPrayerPrefs] = useState(() =>
    loadKey(PRAYER_PREFS_KEY, { city: user.city || "ط§ظ„ط±ظٹط§ط¶", showPrayer: true })
  );

  const [calendarPrefs, setCalendarPrefs] = useState(() =>
    loadKey(CALENDAR_PREFS_KEY, { showHijri: true, defaultView: "list" })
  );

  const { format: timeFormat, setFormat: setTimeFormat } = useTimeFormat();
  const enabledCount = NOTIF_TYPES.filter(t => prefs[t.key]).length;

  // Phase 13G: GPS handler
  const handleGPS = async () => {
    try {
      const city = await requestGPS();
      // Sync city to store and prayer prefs
      setUser({ city, timezone: detectTimezone() });
      updatePrayerPref({ city });
      toast({ title: "طھظ… طھط­ط¯ظٹط¯ ظ…ظˆظ‚ط¹ظƒ", description: `ط£ظ‚ط±ط¨ ظ…ط¯ظٹظ†ط©: ${city}`, duration: 6000 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ظپط´ظ„ طھط­ط¯ظٹط¯ ط§ظ„ظ…ظˆظ‚ط¹";
      toast({ title: "طھط¹ط°ظ‘ط± طھط­ط¯ظٹط¯ ط§ظ„ظ…ظˆظ‚ط¹", description: msg, variant: "destructive", duration: 6000 });
    }
  };

  const handleSaveManualLocation = () => {
    setManual(manualCity, manualTz);
    setUser({ city: manualCity, timezone: manualTz });
    updatePrayerPref({ city: manualCity });
    toast({ title: "طھظ… ط­ظپط¸ ط§ظ„ظ…ظˆظ‚ط¹ ط§ظ„ظٹط¯ظˆظٹ", description: `${manualCity} آ· ${manualTz}`, duration: 6000 });
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط§ط³ظ… ظ…ط·ظ„ظˆط¨", variant: "destructive" });
      return;
    }
    setUser({ name: editName.trim(), city: editCity });
    setIsEditOpen(false);
    toast({ title: "طھظ… ط­ظپط¸ ط§ظ„ظ…ظ„ظپ ط§ظ„ط´ط®طµظٹ" });
  };

  const openEdit = () => {
    setEditName(user.name);
    setEditCity(user.city);
    setIsEditOpen(true);
  };

  const togglePref = (key: string) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      saveKey(NOTIF_PREFS_KEY, next);
      toast({
        title: next[key] ? "طھظ… طھظپط¹ظٹظ„ ط§ظ„ط¥ط´ط¹ط§ط±" : "طھظ… ط¥ظٹظ‚ط§ظپ ط§ظ„ط¥ط´ط¹ط§ط±",
        description: NOTIF_TYPES.find(t => t.key === key)?.label,
      });
      return next;
    });
  };

  const updatePrayerPref = (update: Partial<typeof prayerPrefs>) => {
    setPrayerPrefs(prev => {
      const next = { ...prev, ...update };
      saveKey(PRAYER_PREFS_KEY, next);
      toast({ title: "طھظ… ط­ظپط¸ ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„طµظ„ط§ط©" });
      return next;
    });
  };

  const updateCalendarPref = (update: Partial<typeof calendarPrefs>) => {
    setCalendarPrefs(prev => {
      const next = { ...prev, ...update };
      saveKey(CALENDAR_PREFS_KEY, next);
      toast({ title: "طھظ… ط­ظپط¸ ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„طھظ‚ظˆظٹظ…" });
      return next;
    });
  };


  const handleLogout = async () => {
    const { authSignOut } = await import("@/lib/auth");
    await authSignOut().catch(() => {});
    localStorage.removeItem("app-user");
    setLocation("/");
  };

  const handleDeleteAccount = () => {
    const keys = [
      "app-user", NOTIF_PREFS_KEY, PRAYER_PREFS_KEY,
      CALENDAR_PREFS_KEY, "mawaeedak_work_tasks_v1", "mawaeedak_travel_v1",
      "mawaeedak_travel_checklist_v1", "mawaeedak_theme", "hide-ads",
    ];
    keys.forEach(k => localStorage.removeItem(k));
    toast({ title: "طھظ… ظ…ط³ط­ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط­ظ„ظٹط©" });
    setTimeout(() => setLocation("/"), 800);
  };

  return (
    <AppShell title="ط­ط³ط§ط¨ظٹ">
      <div className="space-y-5 pb-6">

        {/* Profile Card â€” Heritage hero */}
        <div
          className="-mx-3 overflow-hidden"
          style={{
            background: "linear-gradient(155deg, hsl(22 62% 18%) 0%, hsl(18 68% 14%) 100%)",
            borderBottom: "1.5px solid hsl(38 60% 40% / 0.55)",
          }}
        >
          {/* Gold top strip */}
          <div style={{ height: "2px", background: "linear-gradient(to right, transparent, hsl(38 72% 52% / 0.70), transparent)" }} />

          <div className="px-5 py-5 flex items-center gap-4">
            {/* Circular avatar */}
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[26px] font-extrabold shrink-0"
              style={{
                background: "linear-gradient(145deg, hsl(38 60% 36%), hsl(30 55% 28%))",
                border: "2.5px solid hsl(38 70% 52% / 0.70)",
                color: "hsl(38 88% 88%)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.45), 0 1px 0 rgba(255,220,120,0.20) inset",
                fontFamily: "'Tajawal', sans-serif",
              }}
            >
              {generateInitials(user.name || "ظ…")}
            </div>

            <div className="flex-1 min-w-0">
              <h2
                className="text-[20px] font-extrabold truncate"
                style={{ color: "hsl(38 82% 88%)", fontFamily: "'Tajawal', sans-serif" }}
              >
                {user.name || "ظ…ط³طھط®ط¯ظ…"}
              </h2>
              <p
                className="text-[13px] flex items-center gap-1 mt-0.5"
                style={{ color: "hsl(38 55% 65%)" }}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {user.city || "ط§ظ„ط±ظٹط§ط¶"}
              </p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                ط¨ظٹط§ظ†ط§طھ ظ…ط­ظ„ظٹط©
              </p>
            </div>

            <Button
              size="sm"
              className="shrink-0 h-9 rounded-xl font-bold"
              style={{
                background: "rgba(255,200,80,0.12)",
                border: "1px solid hsl(38 65% 52% / 0.45)",
                color: "hsl(38 80% 72%)",
              }}
              onClick={openEdit}
            >
              <Edit2 className="w-3.5 h-3.5 ml-1" />
              طھط¹ط¯ظٹظ„
            </Button>
          </div>

          {/* Gold bottom strip */}
          <div style={{ height: "2px", background: "linear-gradient(to right, transparent, hsl(38 68% 50% / 0.55), transparent)" }} />
        </div>

        {/* Display Settings */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-muted-foreground px-1 uppercase tracking-wide">ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط¹ط±ط¶</h3>
          <Card className="border-border shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <Label htmlFor="dark-mode" className="text-sm font-medium cursor-pointer">ط§ظ„ظˆط¶ط¹ ط§ظ„ظ„ظٹظ„ظٹ</Label>
              </div>
              <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={toggleMode} />
            </div>
          </Card>
        </div>

        {/* â•گâ•گ Location & Timezone â€” Phase 13G â•گâ•گ */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Navigation className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ط§ظ„ظ…ظˆظ‚ط¹ ظˆط§ظ„ظ…ظ†ط·ظ‚ط© ط§ظ„ط²ظ…ظ†ظٹط©</h3>
          </div>
          <Card className="border-border shadow-sm">
            <div className="divide-y divide-border">
              {/* Status row */}
              <div className="p-4 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  locPrefs.source === "gps" ? "bg-emerald-500/10" :
                  locPrefs.source === "manual" ? "bg-blue-500/10" : "bg-muted"
                }`}>
                  {locPrefs.source === "gps"
                    ? <Navigation2 className="w-4 h-4 text-emerald-600" />
                    : <MapPin className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{locPrefs.city}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {locPrefs.source === "gps" ? "ط­ط³ط¨ ظ…ظˆظ‚ط¹ظƒ" :
                     locPrefs.source === "manual" ? "ط§ط®طھظٹط§ط± ظٹط¯ظˆظٹ" : "ط§ظ„ط§ظپطھط±ط§ط¶ظٹ"}
                    {" آ· "}{locPrefs.timezone}
                  </p>
                  {locPrefs.lastUpdated && (
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      ط¢ط®ط± طھط­ط¯ظٹط«: {new Date(locPrefs.lastUpdated).toLocaleString("ar-SA", { timeZone: locPrefs.timezone || "Asia/Riyadh", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
                {locPrefs.source === "gps" && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-md font-medium shrink-0">GPS</span>
                )}
              </div>

              {/* GPS button */}
              <div className="p-4">
                <Button
                  variant="outline"
                  className="w-full h-10 text-sm font-bold rounded-xl"
                  onClick={handleGPS}
                  disabled={gpsLoading}
                >
                  {gpsLoading
                    ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />ط¬ط§ط±ظچ ط§ظ„طھط­ط¯ظٹط¯...</>
                    : <><Navigation2 className="w-4 h-4 ml-2 text-emerald-600" />ط§ط³طھط®ط¯ط§ظ… ظ…ظˆظ‚ط¹ظٹ طھظ„ظ‚ط§ط¦ظٹط§ظ‹</>}
                </Button>
                {gpsError && (
                  <p className="text-[11px] text-destructive mt-2 text-center">{gpsError}</p>
                )}
              </div>

              {/* Manual selection */}
              <div className="p-4 space-y-3">
                <p className="text-xs font-bold text-muted-foreground">ط§ط®طھظٹط§ط± ظٹط¯ظˆظٹ</p>
                <div className="space-y-2">
                  <Label className="text-sm">ط§ظ„ظ…ط¯ظٹظ†ط©</Label>
                  <Select value={manualCity} onValueChange={setManualCity}>
                    <SelectTrigger className="h-10 bg-background text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rtl">
                      {SAUDI_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">ط§ظ„ظ…ظ†ط·ظ‚ط© ط§ظ„ط²ظ…ظ†ظٹط©</Label>
                  <Select value={manualTz} onValueChange={setManualTz}>
                    <SelectTrigger className="h-10 bg-background text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rtl">
                      {TIMEZONES.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full h-10 font-bold rounded-xl"
                  variant="outline"
                  onClick={handleSaveManualLocation}
                >
                  <RefreshCw className="w-3.5 h-3.5 ml-2" />
                  ط­ظپط¸ ط§ظ„ظ…ظˆظ‚ط¹ ط§ظ„ظٹط¯ظˆظٹ
                </Button>
              </div>
            </div>
          </Card>
          <p className="text-xs text-muted-foreground px-1">
            ظٹظڈط³طھط®ط¯ظ… ظ„ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ظˆط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ظ…ط¬ط¯ظˆظ„ط© آ· ط§ظ„ط§ظپطھط±ط§ط¶ظٹ: ط§ظ„ط±ظٹط§ط¶ / Asia/Riyadh
          </p>
        </div>

        {/* Prayer Settings */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Star className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„طµظ„ط§ط©</h3>
          </div>
          <Card className="border-border shadow-sm">
            <div className="divide-y divide-border">
              <div className="p-4 space-y-2">
                <Label className="text-sm font-medium">ظ…ط¯ظٹظ†ط© ط§ظ„طµظ„ط§ط©</Label>
                <Select
                  value={prayerPrefs.city}
                  onValueChange={v => updatePrayerPref({ city: v })}
                >
                  <SelectTrigger className="h-11 bg-background text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rtl">
                    {SAUDI_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <Label htmlFor="show-prayer" className="text-sm font-medium cursor-pointer">ط¹ط±ط¶ ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ظپظٹ ط§ظ„ط±ط¦ظٹط³ظٹط©</Label>
                </div>
                <Switch id="show-prayer" checked={prayerPrefs.showPrayer} onCheckedChange={v => updatePrayerPref({ showPrayer: v })} />
              </div>
              {/* طµظٹط؛ط© ط§ظ„ظˆظ‚طھ */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">طµظٹط؛ط© ط§ظ„ظˆظ‚طھ</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeFormat === "12h" ? "ظ…ط«ط§ظ„: 03:45 طµ" : "ظ…ط«ط§ظ„: 03:45"}
                    </p>
                  </div>
                </div>
                <div className="flex rounded-xl overflow-hidden border border-border">
                  <button
                    onClick={() => setTimeFormat("12h")}
                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                      timeFormat === "12h"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    12 ط³ط§ط¹ط©
                  </button>
                  <button
                    onClick={() => setTimeFormat("24h")}
                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                      timeFormat === "24h"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    24 ط³ط§ط¹ط©
                  </button>
                </div>
              </div>
            </div>
          </Card>
          <p className="text-xs text-muted-foreground px-1">ط§ظ„ظ…ظˆط§ظ‚ظٹطھ طھظ‚ط¯ظٹط±ظٹط© â€” ظٹظڈظ†طµط­ ط¨ظ…ط±ط§ط¬ط¹ط© ط§ظ„طھظ‚ظˆظٹظ… ط§ظ„ط±ط³ظ…ظٹ</p>
        </div>

        {/* Calendar Settings */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„طھظ‚ظˆظٹظ…</h3>
          </div>
          <Card className="border-border shadow-sm">
            <div className="divide-y divide-border">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <Label htmlFor="show-hijri" className="text-sm font-medium cursor-pointer">ط¥ط¸ظ‡ط§ط± ط§ظ„طھط§ط±ظٹط® ط§ظ„ظ‡ط¬ط±ظٹ</Label>
                </div>
                <Switch id="show-hijri" checked={calendarPrefs.showHijri} onCheckedChange={v => updateCalendarPref({ showHijri: v })} />
              </div>
              <div className="p-4 space-y-2">
                <Label className="text-sm font-medium">ط·ط±ظٹظ‚ط© ط§ظ„ط¹ط±ط¶ ط§ظ„ط§ظپطھط±ط§ط¶ظٹط©</Label>
                <Select value={calendarPrefs.defaultView} onValueChange={v => updateCalendarPref({ defaultView: v })}>
                  <SelectTrigger className="h-11 bg-background text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rtl">
                    <SelectItem value="list">ظ‚ط§ط¦ظ…ط©</SelectItem>
                    <SelectItem value="month">ط´ظ‡ط±ظٹ</SelectItem>
                    <SelectItem value="week">ط£ط³ط¨ظˆط¹ظٹ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ</h3>
            </div>
            <span className="text-xs text-primary font-medium">{enabledCount}/{NOTIF_TYPES.length} ظ…ظپط¹ظ‘ظ„</span>
          </div>
          <Card className="border-border shadow-sm">
            <div className="divide-y divide-border">
              {NOTIF_TYPES.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <Label htmlFor={`notif-${key}`} className="text-sm font-medium cursor-pointer">{label}</Label>
                  </div>
                  <Switch id={`notif-${key}`} checked={!!prefs[key]} onCheckedChange={() => togglePref(key)} />
                </div>
              ))}
            </div>
          </Card>
          <p className="text-xs text-muted-foreground px-1">ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط¯ط§ط®ظ„ظٹط© ظپظ‚ط· ظپظٹ ط§ظ„ظˆظ‚طھ ط§ظ„ط­ط§ظ„ظٹ</p>
        </div>

        {/* Membership */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <BadgeCheck className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ط§ظ„ط¹ط¶ظˆظٹط©</h3>
          </div>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground text-sm">ط§ظ„ط®ط·ط© ط§ظ„ط­ط§ظ„ظٹط©</p>
                <p className="text-xs text-muted-foreground mt-0.5">ط¬ظ…ظٹط¹ ط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ط£ط³ط§ط³ظٹط© ظ…طھط§ط­ط© ظ…ط¬ط§ظ†ط§ظ‹</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                ظ…ط¬ط§ظ†ظٹ
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Legal Links */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ط§ظ„ط®طµظˆطµظٹط© ظˆط§ظ„ظ‚ط§ظ†ظˆظ†</h3>
          </div>
          <Card className="border-border shadow-sm">
            <div className="divide-y divide-border">
              {[
                { href: "/privacy", label: "ط³ظٹط§ط³ط© ط§ظ„ط®طµظˆطµظٹط©" },
                { href: "/terms", label: "ط´ط±ظˆط· ط§ظ„ط§ط³طھط®ط¯ط§ظ…" },
                { href: "/disclaimer", label: "ط¥ط®ظ„ط§ط، ط§ظ„ظ…ط³ط¤ظˆظ„ظٹط©" },
                { href: "/support", label: "ط§ظ„ظ…ط³ط§ط¹ط¯ط© ظˆط§ظ„ط¯ط¹ظ…", icon: Headphones },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {Icon ? <Icon className="w-4 h-4 text-muted-foreground" /> : <Shield className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Account Actions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ط§ظ„ط­ط³ط§ط¨</h3>
          </div>
          <div className="space-y-2 pb-2">
            <Button
              variant="destructive"
              className="w-full h-12 text-base font-bold rounded-xl"
              onClick={() => setIsLogoutOpen(true)}
            >
              <LogOut className="w-5 h-5 ml-2 rtl:rotate-180" />
              طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬
            </Button>
            <p className="text-[11px] text-muted-foreground text-center pt-1">
              ط³ظٹطھظ… طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬ ظˆط§ظ„ط¹ظˆط¯ط© ظ„ظ„طµظپط­ط© ط§ظ„ط±ط¦ظٹط³ظٹط©
            </p>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="rtl max-w-[400px] rounded-xl">
            <DialogHeader><DialogTitle>طھط¹ط¯ظٹظ„ ط§ظ„ظ…ظ„ظپ ط§ظ„ط´ط®طµظٹ</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>ط§ظ„ط§ط³ظ… <span className="text-destructive">*</span></Label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="ط§ط³ظ…ظƒ ط§ظ„ظƒط§ظ…ظ„" />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ظ…ط¯ظٹظ†ط©</Label>
                <Select value={editCity} onValueChange={setEditCity}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rtl">
                    {SAUDI_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full h-11 font-bold" onClick={handleSaveProfile}>ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Logout Confirm */}
        <ConfirmDialog
          open={isLogoutOpen}
          onOpenChange={setIsLogoutOpen}
          title="طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬"
          description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯طں ط³طھط¹ظˆط¯ ط¥ظ„ظ‰ ط´ط§ط´ط© ط§ظ„ط¨ط¯ط§ظٹط© ظˆطھظڈظ…ط³ط­ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¬ظ„ط³ط© ط§ظ„ظ…ط­ظ„ظٹط©."
          confirmText="طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬"
          onConfirm={handleLogout}
        />

        {/* Delete Account Confirm */}
        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="ظ…ط³ط­ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط­ظ„ظٹط©"
          description="ط³ظٹطھظ… ط­ط°ظپ ط¬ظ…ظٹط¹ ط¨ظٹط§ظ†ط§طھظƒ ط§ظ„ظ…ط­ظپظˆط¸ط© ظ…ط­ظ„ظٹط§ظ‹ (ط§ظ„ظ…ظ‡ط§ظ…طŒ ط§ظ„ط±ط­ظ„ط§طھطŒ ط§ظ„طھظپط¶ظٹظ„ط§طھ). ظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھط±ط§ط¬ط¹."
          confirmText="ظ…ط³ط­ ط§ظ„ط¨ظٹط§ظ†ط§طھ"
          cancelText="ط¥ظ„ط؛ط§ط،"
          onConfirm={handleDeleteAccount}
          destructive
        />
      </div>
    </AppShell>
  );
}

