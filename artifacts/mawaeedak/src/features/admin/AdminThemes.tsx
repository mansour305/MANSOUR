/**
 * AdminThemes â€” Phase 12M
 *
 * Read:   useGatewayThemes â†’ API (mode=api/shadow) | Supabase (mode=supabase)
 * Write:  gwUpdateTheme (edit + toggle)
 *           mode=api/shadow â†’ PATCH /api/themes/:id
 *           mode=supabase   â†’ Supabase UPDATE
 *
 * Default theme:
 * - mode=supabase   â†’ public.app_settings upsert (no api-server dependency)
 * - mode=api/shadow â†’ legacy API endpoint when a deployed API exists
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme, setCachedGlobalDefault } from "@/hooks/useTheme";
import { authedFetch } from "@/lib/apiAuth";
import { DATA_SOURCE_MODE } from "@/lib/dataSourceMode";
import { supabase } from "@/lib/supabase";
import { getListThemesQueryKey } from "@api-client";
import { Edit2, Loader2, Paintbrush, Check } from "lucide-react";
import { useGatewayThemes, gwQueryKeys } from "@/hooks/useGatewayData";
import { gwUpdateTheme } from "@/lib/dataGateway";

const TIER_LABELS: Record<string, string> = {
  free: "ظ…ط¬ط§ظ†ظٹ",
  premium: "ظ…ظ…ظٹط² ط¯ط§ط®ظ„ظٹ",
  unavailable: "ط؛ظٹط± ظ…طھط§ط­ ط­ط§ظ„ظٹط§ظ‹",
  owner: "ظ„ظ„ظ…ط§ظ„ظƒ ظپظ‚ط·",
};

function getSwatchColors(colors: unknown): [string, string, string] {
  if (!colors || typeof colors !== "object") return ["#8B6914", "#FFF8E7", "#3D2B1F"];
  const c = colors as Record<string, string>;
  return [c.primary || "#8B6914", c.background || "#FFF8E7", c.card || c.background || "#F5EDD8"];
}

export default function AdminThemes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { globalDefault } = useTheme();
  const [defaultPending, setDefaultPending] = useState<string | null>(null);

  const { data: themes, isLoading, refetch: refetchThemes } = useGatewayThemes();

  const [savePending, setSavePending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [tier, setTier] = useState("free");

  const invalidateThemes = () => {
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.themes });
    queryClient.invalidateQueries({ queryKey: getListThemesQueryKey() });
    void refetchThemes();
  };

  const openEdit = (theme: { id: number; name: string; description?: string | null; is_active: boolean; tier?: string }) => {
    setEditId(theme.id);
    setName(theme.name);
    setDescription(theme.description ?? "");
    setIsActive(theme.is_active);
    setTier(theme.tier ?? "free");
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!name || !editId) return;
    setSavePending(true);
    try {
      const result = await gwUpdateTheme(editId, { name, description: description || undefined, is_active: isActive, tier });
      if (result.success) {
        toast({ title: "طھظ… ط§ظ„طھط¹ط¯ظٹظ„" });
        setIsOpen(false);
        invalidateThemes();
      } else {
        toast({ title: "ظپط´ظ„ ط§ظ„طھط¹ط¯ظٹظ„", description: result.error ?? "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
      }
    } finally {
      setSavePending(false);
    }
  };

  const handleSetDefault = async (theme: { slug: string; name: string }) => {
    setDefaultPending(theme.slug);
    try {
      if (DATA_SOURCE_MODE === "supabase") {
        if (!supabase) {
          toast({ title: "Supabase ط؛ظٹط± ظ…طھطµظ„", description: "طھط­ظ‚ظ‚ ظ…ظ† VITE_SUPABASE_URL ظˆ VITE_SUPABASE_ANON_KEY", variant: "destructive" });
          return;
        }

        const { error } = await supabase.from("app_settings").upsert(
          {
            key: "default_theme",
            value: theme.slug,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );

        if (error) {
          toast({ title: "ظپط´ظ„ ط§ظ„طھط¹ظٹظٹظ†", description: error.message, variant: "destructive" });
          return;
        }

        setCachedGlobalDefault(theme.slug);
        toast({ title: `طھظ… طھط¹ظٹظٹظ† "${theme.name}" ظƒط«ظٹظ… ط§ظپطھط±ط§ط¶ظٹ ط¹ط§ظ…`, description: "طھظ… ط§ظ„ط­ظپط¸ ظپظٹ Supabase ط¨ط¯ظˆظ† ط§ظ„ط§ط¹طھظ…ط§ط¯ ط¹ظ„ظ‰ api-server" });
        return;
      }

      const resp = await authedFetch("/api/settings/default-theme", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: theme.slug }),
      });
      if (resp.ok) {
        setCachedGlobalDefault(theme.slug);
        toast({ title: `طھظ… طھط¹ظٹظٹظ† "${theme.name}" ظƒط«ظٹظ… ط§ظپطھط±ط§ط¶ظٹ ط¹ط§ظ…`, description: "ظٹظڈط·ط¨ظژظ‘ظ‚ ط¹ظ„ظ‰ ط¬ظ…ظٹط¹ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ† ط§ظ„ط°ظٹظ† ظ„ظ… ظٹط®طھط§ط±ظˆط§ ط«ظٹظ…ط§ظ‹ ط®ط§طµط§ظ‹" });
      } else if (resp.status === 401 || resp.status === 403) {
        toast({ title: "طµظ„ط§ط­ظٹط§طھ ط؛ظٹط± ظƒط§ظپظٹط©", description: "طھط¹ظٹظٹظ† ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ط§ظ„ط¹ط§ظ… ظ…طھط§ط­ ظ„ظ„ظ…ط§ظ„ظƒ ظپظ‚ط·", variant: "destructive" });
      } else {
        const err = await resp.json().catch(() => null);
        toast({ title: "ظپط´ظ„ ط§ظ„طھط¹ظٹظٹظ†", description: (err && (err.error?.message || err.error)) || "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
      }
    } catch {
      toast({ title: "ظپط´ظ„ ط§ظ„طھط¹ظٹظٹظ†", description: DATA_SOURCE_MODE === "supabase" ? "طھط¹ط°ط± ط§ظ„ط­ظپط¸ ظپظٹ Supabase" : "طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ط§ظ„ط®ط§ط¯ظ…", variant: "destructive" });
    } finally {
      setDefaultPending(null);
    }
  };

  const handleToggleActive = async (theme: { id: number; name: string; is_active: boolean }) => {
    const result = await gwUpdateTheme(theme.id, { is_active: !theme.is_active });
    if (result.success) {
      toast({ title: theme.is_active ? "طھظ… طھط¹ط·ظٹظ„ ط§ظ„ط«ظٹظ…" : "طھظ… طھظپط¹ظٹظ„ ط§ظ„ط«ظٹظ…" });
      invalidateThemes();
    } else {
      toast({ title: "ظپط´ظ„ ط§ظ„طھط­ط¯ظٹط«", description: result.error ?? "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(180deg, hsl(38 62% 52%), hsl(32 55% 42%))" }}
        />
        <h1 className="text-2xl font-extrabold" style={{ color: "hsl(22 62% 18%)" }}>
          ط¥ط¯ط§ط±ط© ط§ظ„ط«ظٹظ…ط§طھ
        </h1>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rtl max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle>طھط¹ط¯ظٹظ„ ط§ظ„ط«ظٹظ…</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ط§ط³ظ… ط§ظ„ط«ظٹظ…</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>ط§ظ„ظˆطµظپ</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>ط§ظ„ظپط¦ط©</Label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {Object.entries(TIER_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <Label>ظ…ظپط¹ظ‘ظ„ ظˆظ…طھط§ط­ ظ„ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={savePending}>
              {savePending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : themes && themes.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {(Array.isArray(themes) ? themes : []).map(theme => {
            const [primary, bg] = getSwatchColors(theme.colors);
            const isCurrentDefault = globalDefault === theme.slug;
            return (
              <Card key={theme.id} className={`border-border shadow-sm overflow-hidden ${!theme.is_active ? "opacity-60" : ""}`}>
                <div className="h-1.5 w-full" style={{ backgroundColor: primary }} />
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border border-border"
                      style={{ backgroundColor: bg }}
                    >
                      <Paintbrush className="w-5 h-5" style={{ color: primary }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm">{theme.name}</h4>
                        {isCurrentDefault && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            ط§ظ„ط­ط§ظ„ظٹ
                          </span>
                        )}
                        {!theme.is_active && (
                          <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">ظ…ط¹ط·ظ„</span>
                        )}
                        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                          {TIER_LABELS[theme.tier ?? "free"] ?? "ظ…ط¬ط§ظ†ظٹ"}
                        </span>
                      </div>
                      {theme.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{theme.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Switch
                        checked={theme.is_active ?? false}
                        onCheckedChange={() => void handleToggleActive(theme)}
                        className="scale-75"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-8 h-8 ${isCurrentDefault ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                        title="طھط¹ظٹظٹظ† ظƒط§ظپطھط±ط§ط¶ظٹ ط¹ط§ظ…"
                        disabled={defaultPending === theme.slug || !theme.is_active}
                        onClick={() => void handleSetDefault(theme)}
                      >
                        {defaultPending === theme.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-primary w-8 h-8" onClick={() => openEdit(theme)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-8 bg-card rounded-xl border border-dashed border-border text-muted-foreground">
          ظ„ط§ طھظˆط¬ط¯ ط«ظٹظ…ط§طھ
        </div>
      )}

      <p className="text-xs text-muted-foreground px-1">
        ظ…ظ„ط§ط­ط¸ط©: طھط¹ظٹظٹظ† ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ط§ظ„ط¹ط§ظ… ظٹظڈط­ظپظژط¸ ظ…ط±ظƒط²ظٹط§ظ‹ ظپظٹ Supabase ط¹ظ†ط¯ ظˆط¶ط¹ ط§ظ„ط¥ظ†طھط§ط¬ ط§ظ„ط­ط§ظ„ظٹطŒ ظˆظ„ط§ ظٹط¹طھظ…ط¯ ط¹ظ„ظ‰ api-server ط؛ظٹط± ط§ظ„ظ…ظ†ط´ظˆط±.
      </p>
    </div>
  );
}

