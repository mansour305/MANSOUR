import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import {
  useCreateOfficialPrayerTime,
  useUpdateOfficialPrayerTime,
  useDeleteOfficialPrayerTime,
} from "@/hooks/useOfficialData";
import { Plus, Edit2, Trash2, Loader2, AlertTriangle } from "lucide-react";

/**
 * AdminOfficialPrayer â€” admin page to manage official prayer times. It lists
 * all records (confirmed and unconfirmed) and allows adding, editing and
 * deleting entries. Each prayer time record includes city, date and six
 * prayer times with metadata and confirmation status.
 */
export default function AdminOfficialPrayer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // Fetch all prayer times
  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-official-prayer"],
    queryFn: async () => {
      if (!isSupabaseEnabled || !supabase) throw new Error("Supabase ط؛ظٹط± ظ…ظپط¹ظ‘ظ„");
      const { data, error } = await supabase
        .from("official_prayer_times")
        .select("*")
        .order("date_gregorian", { ascending: true })
        .order("city_key", { ascending: true });
      if (error) throw error;
      return data;
    },
    retry: 1,
    staleTime: 60_000,
  });

  const createEvent = useCreateOfficialPrayerTime(["admin-official-prayer"]);
  const updateEvent = useUpdateOfficialPrayerTime(["admin-official-prayer"]);
  const deleteEvent = useDeleteOfficialPrayerTime(["admin-official-prayer"]);

  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  // Form fields
  const [cityKey, setCityKey] = useState("");
  const [cityName, setCityName] = useState("");
  const [dateGreg, setDateGreg] = useState("");
  const [dateHijri, setDateHijri] = useState("");
  const [fajr, setFajr] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [dhuhr, setDhuhr] = useState("");
  const [asr, setAsr] = useState("");
  const [maghrib, setMaghrib] = useState("");
  const [isha, setIsha] = useState("");
  const [sourceAuthority, setSourceAuthority] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(true);
  // Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setCityKey("");
    setCityName("");
    setDateGreg("");
    setDateHijri("");
    setFajr("");
    setSunrise("");
    setDhuhr("");
    setAsr("");
    setMaghrib("");
    setIsha("");
    setSourceAuthority("");
    setSourceUrl("");
    setIsConfirmed(true);
    setIsOpen(true);
  };

  const openEdit = (ev: any) => {
    setIsEdit(true);
    setEditId(ev.id);
    setCityKey(ev.city_key || "");
    setCityName(ev.city_name_ar || "");
    setDateGreg(ev.date_gregorian || "");
    setDateHijri(ev.date_hijri || "");
    setFajr(ev.fajr_time || "");
    setSunrise(ev.sunrise_time || "");
    setDhuhr(ev.dhuhr_time || "");
    setAsr(ev.asr_time || "");
    setMaghrib(ev.maghrib_time || "");
    setIsha(ev.isha_time || "");
    setSourceAuthority(ev.source_authority || "");
    setSourceUrl(ev.source_url || "");
    setIsConfirmed(ev.is_confirmed ?? true);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!cityKey || !cityName || !dateGreg || !fajr || !sunrise || !dhuhr || !asr || !maghrib || !isha) {
      toast({ title: "ط®ط·ط£", description: "ظٹط¬ط¨ طھط¹ط¨ط¦ط© ظƒط§ظپط© ط§ظ„ط­ظ‚ظˆظ„ ط§ظ„ط£ط³ط§ط³ظٹط©", variant: "destructive" });
      return;
    }
    const data = {
      city_key: cityKey,
      city_name_ar: cityName,
      date_gregorian: dateGreg,
      date_hijri: dateHijri || null,
      fajr_time: fajr,
      sunrise_time: sunrise,
      dhuhr_time: dhuhr,
      asr_time: asr,
      maghrib_time: maghrib,
      isha_time: isha,
      source_authority: sourceAuthority || null,
      source_url: sourceUrl || null,
      is_confirmed: isConfirmed,
    } as Record<string, any>;
    if (isEdit && editId) {
      updateEvent.mutate({ id: editId, data }, {
        onSuccess: () => {
          toast({ title: "طھظ… ط§ظ„طھط¹ط¯ظٹظ„" });
          setIsOpen(false);
        },
        onError: (error: any) => {
          toast({ title: "ظپط´ظ„ ط§ظ„طھط¹ط¯ظٹظ„", description: error.message || "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
        },
      });
    } else {
      createEvent.mutate(data, {
        onSuccess: () => {
          toast({ title: "طھظ…طھ ط§ظ„ط¥ط¶ط§ظپط©" });
          setIsOpen(false);
        },
        onError: (error: any) => {
          toast({ title: "ظپط´ظ„ ط§ظ„ط¥ط¶ط§ظپط©", description: error.message || "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteEvent.mutate(deleteId, {
      onSuccess: () => {
        toast({ title: "طھظ… ط§ظ„ط­ط°ظپ" });
        setIsDeleteOpen(false);
      },
      onError: (error: any) => {
        toast({ title: "ظپط´ظ„ ط§ظ„ط­ط°ظپ", description: error.message || "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-1 h-6 rounded-full"
            style={{ background: "linear-gradient(180deg, hsl(38 62% 52%), hsl(32 55% 42%))" }}
          />
          <h1 className="text-2xl font-extrabold" style={{ color: "hsl(22 62% 18%)" }}>
            ط£ظˆظ‚ط§طھ ط§ظ„طµظ„ط§ط© ط§ظ„ط±ط³ظ…ظٹط©
          </h1>
        </div>
        <Button onClick={openAdd} size="sm">
          <Plus className="w-4 h-4 ml-1" /> ط¥ط¶ط§ظپط© ظˆظ‚طھ
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rtl max-w-[550px] rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "طھط¹ط¯ظٹظ„ ظˆظ‚طھ ط§ظ„طµظ„ط§ط©" : "ظˆظ‚طھ طµظ„ط§ط© ط¬ط¯ظٹط¯"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ط§ظ„ظ…ظپطھط§ط­ (ط¨ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط©)</Label>
                <Input value={cityKey} onChange={e => setCityKey(e.target.value)} placeholder="ظ…ط«ط§ظ„: riyadh" />
              </div>
              <div className="space-y-2">
                <Label>ط§ط³ظ… ط§ظ„ظ…ط¯ظٹظ†ط© (ط¨ط§ظ„ط¹ط±ط¨ظٹط©)</Label>
                <Input value={cityName} onChange={e => setCityName(e.target.value)} placeholder="ظ…ط«ط§ظ„: ط§ظ„ط±ظٹط§ط¶" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ط§ظ„طھط§ط±ظٹط® ط§ظ„ظ…ظٹظ„ط§ط¯ظٹ</Label>
                <Input type="date" value={dateGreg} onChange={e => setDateGreg(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„طھط§ط±ظٹط® ط§ظ„ظ‡ط¬ط±ظٹ (ط§ط®طھظٹط§ط±ظٹ)</Label>
                <Input value={dateHijri} onChange={e => setDateHijri(e.target.value)} placeholder="ظ…ط«ط§ظ„: 1448-01-27" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>ط§ظ„ظپط¬ط±</Label>
                <Input type="time" value={fajr} onChange={e => setFajr(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ط´ط±ظˆظ‚</Label>
                <Input type="time" value={sunrise} onChange={e => setSunrise(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ط¸ظ‡ط±</Label>
                <Input type="time" value={dhuhr} onChange={e => setDhuhr(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>ط§ظ„ط¹طµط±</Label>
                <Input type="time" value={asr} onChange={e => setAsr(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ظ…ط؛ط±ط¨</Label>
                <Input type="time" value={maghrib} onChange={e => setMaghrib(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ط¹ط´ط§ط،</Label>
                <Input type="time" value={isha} onChange={e => setIsha(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>ط§ظ„ط¬ظ‡ط© ط§ظ„ط±ط³ظ…ظٹط© (ط§ط®طھظٹط§ط±ظٹ)</Label>
              <Input value={sourceAuthority} onChange={e => setSourceAuthority(e.target.value)} placeholder="ظ…ط«ط§ظ„: ظˆط²ط§ط±ط© ط§ظ„ط´ط¤ظˆظ† ط§ظ„ط¥ط³ظ„ط§ظ…ظٹط©" />
            </div>
            <div className="space-y-2">
              <Label>ط±ط§ط¨ط· ط§ظ„ظ…طµط¯ط± (ط§ط®طھظٹط§ط±ظٹ)</Label>
              <Input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://" />
            </div>
            <div className="flex items-center justify-between">
              <Label>ظ…ط¤ظƒط¯</Label>
              <Switch checked={isConfirmed} onCheckedChange={setIsConfirmed} />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={createEvent.isPending || updateEvent.isPending}>
              {createEvent.isPending || updateEvent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : events && events.length > 0 ? (
        <div className="space-y-3">
          {(events as any[]).map(ev => (
            <Card key={ev.id} className={`border-border shadow-sm overflow-hidden ${!ev.is_confirmed ? 'opacity-70' : ''}`}>
              <CardContent className="p-4 w-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold">{ev.city_name_ar}</span>
                    <span className="text-xs text-muted-foreground">{ev.city_key}</span>
                  </div>
                  <span className="text-xs font-bold text-primary">{ev.date_gregorian}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mb-1">
                  ط§ظ„ظپط¬ط± {ev.fajr_time} آ· ط§ظ„ط´ط±ظˆظ‚ {ev.sunrise_time} آ· ط§ظ„ط¸ظ‡ط± {ev.dhuhr_time} آ· ط§ظ„ط¹طµط± {ev.asr_time} آ· ط§ظ„ظ…ط؛ط±ط¨ {ev.maghrib_time} آ· ط§ظ„ط¹ط´ط§ط، {ev.isha_time}
                </div>
                <div className="flex justify-between items-center border-t border-border pt-3 mt-2">
                  <div className="text-xs text-muted-foreground">{ev.is_confirmed ? "ظ…ط¤ظƒط¯" : "ط؛ظٹط± ظ…ط¤ظƒط¯"}</div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => openEdit(ev)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeleteId(ev.id); setIsDeleteOpen(true); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-card rounded-xl border border-dashed border-border text-muted-foreground">
          ظ„ط§ طھظˆط¬ط¯ ط³ط¬ظ„ط§طھ ط£ظˆظ‚ط§طھ طµظ„ط§ط©
        </div>
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="ط­ط°ظپ ط§ظ„ظˆظ‚طھ ط§ظ„ط±ط³ظ…ظٹ"
        description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط§ظ„ط­ط°ظپطں"
        onConfirm={handleDelete}
      />
    </div>
  );
}
