/**
 * AdminSettings â€” ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„طھط·ط¨ظٹظ‚ ط§ظ„ط¹ط§ظ…ط©
 * 
 * Contains: App name, logo, default theme, language, time format (12/24h),
 * timezone (Asia/Riyadh), location settings, notification settings, maintenance mode.
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings, Globe, Bell, Moon, Sun, Save, Loader2, Shield, Clock, MapPin } from "lucide-react";

const APP_NAME_KEY = "mawaeedak_app_name";
const DEFAULT_THEME_KEY = "mawaeedak_default_theme";
const TIME_FORMAT_KEY = "mawaeedak_time_format";
const TIMEZONE_KEY = "mawaeedak_timezone";
const MAINTENANCE_KEY = "mawaeedak_maintenance";

export default function AdminSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [appName, setAppName] = useState(() => localStorage.getItem(APP_NAME_KEY) || "ظ…ظˆط§ط¹ظٹط¯ظƒ");
  const [defaultTheme, setDefaultTheme] = useState(() => localStorage.getItem(DEFAULT_THEME_KEY) || "official");
  const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem(TIME_FORMAT_KEY) || "12h");
  const [timezone, setTimezone] = useState(() => localStorage.getItem(TIMEZONE_KEY) || "Asia/Riyadh");
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const stored = localStorage.getItem("mawaeedak_notif_enabled");
    return stored !== "false";
  });
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    return localStorage.getItem(MAINTENANCE_KEY) === "true";
  });
  const [defaultCity, setDefaultCity] = useState(() => localStorage.getItem("mawaeedak_default_city") || "ط§ظ„ط±ظٹط§ط¶");

  const SAUDI_CITIES = [
    "ط§ظ„ط±ظٹط§ط¶", "ط¬ط¯ط©", "ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©", "ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ظ…ظ†ظˆط±ط©", "ط§ظ„ط¯ظ…ط§ظ…",
    "ط§ظ„ط®ط¨ط±", "ط§ظ„ط·ط§ط¦ظپ", "طھط¨ظˆظƒ", "ط¨ط±ظٹط¯ط©", "ط®ظ…ظٹط³ ظ…ط´ظٹط·", "ط§ظ„ط£ط­ط³ط§ط،",
    "ظ†ط¬ط±ط§ظ†", "ط¬ظٹط²ط§ظ†", "ط£ط¨ظ‡ط§", "ظٹظ†ط¨ط¹", "ط­ط§ط¦ظ„", "ط¹ط±ط¹ط±",
    "ط³ظƒط§ظƒط§", "ط§ظ„ط¨ط§ط­ط©", "ط§ظ„ط¬ط¨ظٹظ„",
  ];

  const THEMES = [
    { value: "official", label: "ط§ظ„ط±ط³ظ…ظٹط©" },
    { value: "dark", label: "ط¯ط§ظƒظ†" },
    { value: "light", label: "ظپط§طھط­" },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem(APP_NAME_KEY, appName);
      localStorage.setItem(DEFAULT_THEME_KEY, defaultTheme);
      localStorage.setItem(TIME_FORMAT_KEY, timeFormat);
      localStorage.setItem(TIMEZONE_KEY, timezone);
      localStorage.setItem("mawaeedak_notif_enabled", String(notificationsEnabled));
      localStorage.setItem("mawaeedak_default_city", defaultCity);
      localStorage.setItem(MAINTENANCE_KEY, String(maintenanceMode));
      toast({ title: "طھظ… ط­ظپط¸ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ" });
      setSaving(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div 
          className="w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(180deg, hsl(38 62% 52%), hsl(32 55% 42%))" }}
        />
        <h1 className="text-2xl font-extrabold" style={{ color: "hsl(22 62% 18%)" }}>
          ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ
        </h1>
      </div>

      {/* App Identity */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            ظ‡ظˆظٹط© ط§ظ„طھط·ط¨ظٹظ‚
          </h3>
          <div className="space-y-2">
            <Label>ط§ط³ظ… ط§ظ„طھط·ط¨ظٹظ‚</Label>
            <Input value={appName} onChange={e => setAppName(e.target.value)} dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label>ط§ظ„ط«ظٹظ… ط§ظ„ط§ظپطھط±ط§ط¶ظٹ</Label>
            <Select value={defaultTheme} onValueChange={setDefaultTheme}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="rtl">
                {THEMES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Time & Location */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            ط§ظ„ظˆظ‚طھ ظˆط§ظ„ظ…ظˆظ‚ط¹
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>طµظٹط؛ط© ط§ظ„ظˆظ‚طھ</Label>
              <Select value={timeFormat} onValueChange={setTimeFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="rtl">
                  <SelectItem value="12h">12 ط³ط§ط¹ط© (طµط¨ط§ط­ط§ظ‹/ظ…ط³ط§ط،ظ‹)</SelectItem>
                  <SelectItem value="24h">24 ط³ط§ط¹ط©</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ط§ظ„ظ…ظ†ط·ظ‚ط© ط§ظ„ط²ظ…ظ†ظٹط©</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="rtl">
                  <SelectItem value="Asia/Riyadh">طھظˆظ‚ظٹطھ ط§ظ„ط±ظٹط§ط¶ (AST +3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ط§ظپطھط±ط§ط¶ظٹط©</Label>
            <Select value={defaultCity} onValueChange={setDefaultCity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="rtl">
                {SAUDI_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط§ظپطھط±ط§ط¶ظٹط© ظ„ظ„ط¥ط´ط¹ط§ط±ط§طھ
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">طھظپط¹ظٹظ„ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظپطھط±ط§ط¶ظٹط§ظ‹</div>
              <div className="text-xs text-muted-foreground">طھظپط¹ظٹظ„ طھظ„ظ‚ط§ط¦ظٹ ظ„ظ„ط¥ط´ط¹ط§ط±ط§طھ ظ„ظ„ظ…ط³طھط®ط¯ظ…ظٹظ† ط§ظ„ط¬ط¯ط¯</div>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Moon className="w-4 h-4 text-primary" />
            ظˆط¶ط¹ ط§ظ„طµظٹط§ظ†ط©
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">طھظپط¹ظٹظ„ ظˆط¶ط¹ ط§ظ„طµظٹط§ظ†ط©</div>
              <div className="text-xs text-muted-foreground">ط­ط¸ط± ظˆطµظˆظ„ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ† ط£ط«ظ†ط§ط، ط§ظ„طµظٹط§ظ†ط©</div>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
          {maintenanceMode && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700">
              ظˆط¶ط¹ ط§ظ„طµظٹط§ظ†ط© ظ…ظپط¹ظ‘ظ„. ط³ظٹطھظ… ط­ط¬ط¨ ط§ظ„طھط·ط¨ظٹظ‚ ط¹ظ† ط¬ظ…ظٹط¹ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <Button className="w-full h-12" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 ml-1" /> ط­ظپط¸ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ</>}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        ظ…ظ„ط§ط­ط¸ط©: ظ‡ط°ظ‡ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط¹ط§ظ…ط© ظˆطھط¤ط«ط± ط¹ظ„ظ‰ ط¬ظ…ظٹط¹ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†. ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط´ط®طµظٹط© ظ„ظ„ظ…ط³طھط®ط¯ظ…ظٹظ† ظ„ط§ طھطھط؛ظٹط±.
      </p>
    </div>
  );
}

