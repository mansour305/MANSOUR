/**
 * CalendarPage â€” Saudi Premium Minimal Calendar
 * Reference: docs/design-reference/final-2026/04-calendar.jpeg
 * 
 * Features:
 * - Title: ط§ظ„طھظ‚ظˆظٹظ… ظˆط§ظ„ظ…ظˆط§ط¹ظٹط¯
 * - Subtitle: ظ†ط¸ظ… ظٹظˆظ…ظƒ ظˆط§ط¨ظ‚ ط¹ظ„ظ‰ ظ…ظˆط§ط¹ظٹط¯ظƒ
 * - Hijri/Gregorian segmented toggle
 * - Premium monthly calendar card with 7-column grid
 * - Selected day highlight with gold circle
 * - Event dots on days with appointments
 * - Appointment list cards with premium styling
 * - Add/Edit/Delete appointment functionality
 * - Modal for add/edit with safe date/time inputs
 * - localStorage persistence
 */

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTimeFormat } from "@/hooks/useTimeFormat";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import {
  getListAppointmentsQueryKey,
  getListUpcomingAppointmentsQueryKey,
} from "@api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2, Calendar as CalIcon, Clock, Trash2, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useGatewayAppointments, gwQueryKeys } from "@/hooks/useGatewayData";
import {
  useOfficialAppointments,
  useCreateOfficialAppointment,
  useUpdateOfficialAppointment,
  useDeleteOfficialAppointment,
} from "@/hooks/useOfficialData";
import {
  gwCreateAppointment,
  gwUpdateAppointment,
  gwDeleteAppointment,
} from "@/lib/dataGateway";
import { getRiyadhTodayKey, parseRiyadhDateKey } from "@/lib/riyadhTime";
import type { Appointment } from "@api-client";

/* â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const WEEKDAYS = ["ط£ط­ط¯", "ط§ط«ظ†ظٹظ†", "ط«ظ„ط§ط«ط§ط،", "ط£ط±ط¨ط¹", "ط®ظ…ظٹط³", "ط¬ظ…ط¹ط©", "ط³ط¨طھ"];

function buildCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: Array<{ day: number | null; date: string | null }> = [];
  for (let i = 0; i < firstDay; i++) grid.push({ day: null, date: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    grid.push({ day: d, date: `${year}-${mm}-${dd}` });
  }
  return grid;
}

function arMonthYear(d: Date) {
  return d.toLocaleDateString("ar-SA-u-ca-gregory", { year: "numeric", month: "long" });
}

/* â”€â”€â”€ GoldDiamond ornament â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const Dia = () => (
  <svg viewBox="0 0 10 10" style={{ width: 7, height: 7 }} fill="hsl(var(--gold-muted))">
    <polygon points="5,0 10,5 5,10 0,5" />
  </svg>
);

export default function CalendarPage() {
  const { toast } = useToast();
  const { formatTime } = useTimeFormat();
  const queryClient = useQueryClient();

  /* â”€â”€ Month navigation â”€â”€ */
  const today = getRiyadhTodayKey();
  const now = parseRiyadhDateKey(today);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDate(today);
  };

  /* â”€â”€ Data â”€â”€ */
  // Fetch appointments from both gateway and Supabase.  If the user has
  // official (Supabase) appointments, those take precedence; otherwise
  // gateway appointments (demo mode) are used.
  const { data: allAppointments, isLoading, refetch: refetchAppointments } = useGatewayAppointments();
  const { data: officialAppointments, isLoading: isOfficialLoading } = useOfficialAppointments();

  const grid = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  /* days that have appointments â€” for dots */
  // Determine which appointments to display: official appointments if any,
  // otherwise fallback to gateway appointments.
  const appointments = useMemo(() => {
    if (Array.isArray(officialAppointments) && officialAppointments.length > 0) {
      return officialAppointments as any;
    }
    return allAppointments ?? [];
  }, [officialAppointments, allAppointments]);
  const datesWithAppts = useMemo(() => {
    const s = new Set<string>();
    appointments.forEach((a: any) => s.add(a.date));
    return s;
  }, [appointments]);

  /* appointments for selected day */
  const listAppts = useMemo(() => {
    return appointments.filter((a: any) => a.date === selectedDate);
  }, [appointments, selectedDate]);

  /* â”€â”€ Form state â”€â”€ */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [cat, setCat] = useState("ط´ط®طµظٹ");
  const [priority, setPriority] = useState("ظ…طھظˆط³ط·ط©");
  const [notes, setNotes] = useState("");
  const [editApp, setEditApp] = useState<Appointment | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [savePending, setSavePending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const invalidateAppointments = () => {
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.appointments });
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.upcomingAppointments });
    queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListUpcomingAppointmentsQueryKey() });
    void refetchAppointments();
  };

  const resetForm = () => {
    setTitle(""); setTime(""); setNotes("");
    setDate(selectedDate || today);
    setCat("ط´ط®طµظٹ"); setPriority("ظ…طھظˆط³ط·ط©");
  };

  // Supabase mutations: create, update and delete appointments.  These
  // invalidate the official appointments cache on success.
  const createOfficialMutation = useCreateOfficialAppointment(["official-appointments"]);
  const updateOfficialMutation = useUpdateOfficialAppointment(["official-appointments"]);
  const deleteOfficialMutation = useDeleteOfficialAppointment(["official-appointments"]);

  const handleAdd = async () => {
    if (!title || !date) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط±ط¬ط§ط، ط¥ط¯ط®ط§ظ„ ط§ظ„ط¹ظ†ظˆط§ظ† ظˆط§ظ„طھط§ط±ظٹط®", variant: "destructive" });
      return;
    }
    setSavePending(true);
    try {
      // Prefer Supabase official appointments if available; otherwise use gateway
      if (Array.isArray(officialAppointments)) {
        await createOfficialMutation.mutateAsync({
          title,
          date,
          time: time || undefined,
          category: cat,
          priority,
          description: notes || undefined,
          color: "#9c6a1a",
        });
        toast({ title: "طھظ… ط§ظ„ط¥ط¶ط§ظپط©" });
      } else {
        const result = await gwCreateAppointment({
          title,
          date,
          time: time || undefined,
          category: cat,
          priority,
          description: notes || undefined,
          color: "#9c6a1a",
        });
        if (result.success) {
          toast({ title: "طھظ… ط§ظ„ط¥ط¶ط§ظپط©" });
        } else {
          toast({ title: "ظپط´ظ„ ط§ظ„ط¥ط¶ط§ظپط©", description: result.error ?? "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
        }
      }
      setIsAddOpen(false);
      resetForm();
      invalidateAppointments();
      queryClient.invalidateQueries({ queryKey: ["official-appointments"] });
    } catch (error: any) {
      toast({ title: "ظپط´ظ„ ط§ظ„ط¥ط¶ط§ظپط©", description: error.message ?? "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
    } finally {
      setSavePending(false);
    }
  };

  const openEdit = (app: Appointment) => {
    setEditApp(app);
    setTitle(app.title);
    setDate(app.date);
    setTime(app.time ?? "");
    setCat(app.category);
    setPriority(app.priority ?? "ظ…طھظˆط³ط·ط©");
    setNotes(app.description ?? "");
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editApp) return;
    setSavePending(true);
    try {
      if (Array.isArray(officialAppointments)) {
        await updateOfficialMutation.mutateAsync({
          id: editApp.id,
          data: {
            title,
            date,
            time: time || undefined,
            category: cat,
            priority,
            description: notes || undefined,
          },
        });
        toast({ title: "طھظ… ط§ظ„طھط¹ط¯ظٹظ„" });
      } else {
        const result = await gwUpdateAppointment(editApp.id, {
          title,
          date,
          time: time || undefined,
          category: cat,
          priority,
          description: notes || undefined,
        });
        if (result.success) {
          toast({ title: "طھظ… ط§ظ„طھط¹ط¯ظٹظ„" });
        } else {
          toast({ title: "ظپط´ظ„ ط§ظ„طھط¹ط¯ظٹظ„", description: result.error ?? "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
        }
      }
      setIsEditOpen(false);
      invalidateAppointments();
      queryClient.invalidateQueries({ queryKey: ["official-appointments"] });
    } catch (error: any) {
      toast({ title: "ظپط´ظ„ ط§ظ„طھط¹ط¯ظٹظ„", description: error.message ?? "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
    } finally {
      setSavePending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeletePending(true);
    try {
      if (Array.isArray(officialAppointments)) {
        await deleteOfficialMutation.mutateAsync(deleteId);
        toast({ title: "طھظ… ط§ظ„ط­ط°ظپ" });
      } else {
        const result = await gwDeleteAppointment(deleteId);
        if (result.success) {
          toast({ title: "طھظ… ط§ظ„ط­ط°ظپ" });
        } else {
          toast({ title: "ظپط´ظ„ ط§ظ„ط­ط°ظپ", description: result.error ?? "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
        }
      }
      setDeleteId(null);
      setIsEditOpen(false);
      setIsDeleteOpen(false);
      invalidateAppointments();
      queryClient.invalidateQueries({ queryKey: ["official-appointments"] });
    } catch (error: any) {
      toast({ title: "ظپط´ظ„ ط§ظ„ط­ط°ظپ", description: error.message ?? "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
      setIsDeleteOpen(false);
    } finally {
      setDeletePending(false);
    }
  };

  const selectedDateLabel = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("ar-SA-u-ca-gregory", {
        weekday: "long", day: "numeric", month: "long",
      })
    : "";

  return (
    <AppShell title="ط§ظ„طھظ‚ظˆظٹظ…">
      <div className="space-y-3 pb-2">

        {/* â•گâ•گâ•گ Monthly Calendar Card â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
        <div
          className="-mx-3 rounded-b-3xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, hsl(36 38% 96%) 0%, hsl(34 32% 92%) 100%)",
            border: "1.5px solid hsl(34 45% 64% / 0.70)",
            borderTop: "none",
            boxShadow: "0 8px 28px -4px rgba(60,28,4,0.26), 0 2px 8px -2px rgba(60,28,4,0.14)",
          }}
        >
          {/* Month navigation */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              background: "linear-gradient(135deg, hsl(22 58% 20%) 0%, hsl(18 68% 14%) 100%)",
              borderBottom: "1.5px solid hsl(38 62% 42% / 0.6)",
            }}
          >
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors hover:bg-white/10"
              style={{ color: "hsl(38 74% 62%)" }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-2">
                <Dia />
                <span
                  className="text-[16px] font-extrabold"
                  style={{
                    color: "hsl(38 86% 88%)",
                    fontFamily: "'Tajawal', sans-serif",
                    textShadow: "0 1px 6px rgba(0,0,0,0.4)",
                  }}
                >
                  {arMonthYear(new Date(viewYear, viewMonth, 1))}
                </span>
                <Dia />
              </div>
              {(viewYear !== now.getFullYear() || viewMonth !== now.getMonth()) && (
                <button
                  onClick={goToday}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: "hsl(38 80% 68%)",
                    background: "rgba(255,200,80,0.12)",
                    border: "1px solid rgba(210,160,50,0.30)",
                  }}
                >
                  ط§ظ„ط¹ظˆط¯ط© ظ„ظ‡ط°ط§ ط§ظ„ط´ظ‡ط±
                </button>
              )}
            </div>

            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors hover:bg-white/10"
              style={{ color: "hsl(38 74% 62%)" }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday header */}
          <div
            className="grid grid-cols-7 px-2 py-1.5"
            style={{ borderBottom: "1px solid hsl(34 38% 78% / 0.50)" }}
          >
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-bold" style={{ color: "hsl(22 55% 38%)" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5 px-2 py-2">
            {grid.map((cell, i) => {
              if (!cell.day || !cell.date) {
                return <div key={`empty-${i}`} />;
              }
              const isToday = cell.date === today;
              const isSelected = cell.date === selectedDate;
              const hasAppt = datesWithAppts.has(cell.date);

              return (
                <button
                  key={cell.date}
                  onClick={() => setSelectedDate(cell.date!)}
                  className="relative flex flex-col items-center justify-center py-1 transition-all duration-150"
                >
                  <span
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all"
                    style={{
                      background: isSelected
                        ? "hsl(22 62% 22%)"
                        : isToday
                        ? "hsl(38 72% 50%)"
                        : "transparent",
                      color: isSelected || isToday
                        ? "#fff"
                        : "hsl(22 40% 28%)",
                      fontWeight: isToday || isSelected ? 800 : 600,
                      boxShadow: isToday ? "0 2px 8px rgba(180,120,20,0.35)" : "none",
                    }}
                  >
                    {cell.day}
                  </span>
                  {hasAppt && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "hsl(38 72% 50%)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* â•گâ•گâ•گ Add Button + Selected Day Header â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Dia />
            <span className="text-[13px] font-bold" style={{ color: "hsl(22 48% 32%)" }}>
              {selectedDateLabel || "ط§ط®طھط± ظٹظˆظ…ط§ظ‹"}
            </span>
          </div>

          <Dialog open={isAddOpen} onOpenChange={v => { setIsAddOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="h-8 gap-1 font-bold text-[13px] px-3"
                onClick={() => setDate(selectedDate || today)}
              >
                <Plus className="w-3.5 h-3.5" />
                ط¥ط¶ط§ظپط©
              </Button>
            </DialogTrigger>
            <DialogContent className="rtl max-w-[400px] rounded-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>ظ…ظˆط¹ط¯ ط¬ط¯ظٹط¯</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>ط§ظ„ط¹ظ†ظˆط§ظ†</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ط§ظ„طھط§ط±ظٹط®</Label>
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>ط§ظ„ظˆظ‚طھ</Label>
                    <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ط§ظ„طھطµظ†ظٹظپ</Label>
                    <Select value={cat} onValueChange={setCat}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="rtl">
                        <SelectItem value="ط´ط®طµظٹ">ط´ط®طµظٹ</SelectItem>
                        <SelectItem value="ط¹ط§ط¦ظ„ظٹ">ط¹ط§ط¦ظ„ظٹ</SelectItem>
                        <SelectItem value="ط¹ظ…ظ„">ط¹ظ…ظ„</SelectItem>
                        <SelectItem value="ط³ظپط±">ط³ظپط±</SelectItem>
                        <SelectItem value="طµط­ط©">طµط­ط©</SelectItem>
                        <SelectItem value="ظˆط«ط§ط¦ظ‚">ظˆط«ط§ط¦ظ‚</SelectItem>
                        <SelectItem value="ظ…ط§ظ„">ظ…ط§ظ„</SelectItem>
                        <SelectItem value="ظ…ط®طµطµ">ظ…ط®طµطµ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>ط§ظ„ط£ظ‡ظ…ظٹط©</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="rtl">
                        <SelectItem value="ط¹ط§ظ„ظٹط©">ط¹ط§ظ„ظٹط©</SelectItem>
                        <SelectItem value="ظ…طھظˆط³ط·ط©">ظ…طھظˆط³ط·ط©</SelectItem>
                        <SelectItem value="ظ…ظ†ط®ظپط¶ط©">ظ…ظ†ط®ظپط¶ط©</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ظ…ظ„ط§ط­ط¸ط§طھ</Label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
                </div>
                <Button className="w-full" onClick={handleAdd} disabled={savePending}>
                  {savePending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸ ط§ظ„ظ…ظˆط¹ط¯"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* â•گâ•گâ•گ Appointments List for Selected Day â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ */}
        <div className="space-y-2.5">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} />
            </div>
          ) : listAppts.length > 0 ? (
            listAppts.map((app: any) => (
              <div
                key={app.id}
                className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                style={{
                  background: "linear-gradient(145deg, hsl(var(--card)) 0%, hsl(36 28% 91%) 100%)",
                  border: "1px solid hsl(var(--card-border))",
                  boxShadow: "0 2px 10px -2px rgba(80,40,10,0.13), 0 1px 0 rgba(255,225,170,0.15) inset",
                  borderRight: `4px solid ${app.color || "hsl(var(--primary))"}`,
                }}
                onClick={() => openEdit(app)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[15px] text-foreground">{app.title}</h4>
                    <span
                      className="text-[10px] px-2 py-1 rounded-lg font-semibold"
                      style={{
                        background: "hsl(var(--secondary)/0.7)",
                        border: "1px solid hsl(var(--border)/0.5)",
                        color: "hsl(var(--secondary-foreground))",
                      }}
                    >
                      {app.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    {app.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" style={{ color: "hsl(var(--primary)/0.7)" }} />
                        <span className="font-medium">{formatTime(app.time)}</span>
                      </div>
                    )}
                    {app.priority && (
                      <span
                        className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold"
                        style={{
                          background: app.priority === "ط¹ط§ظ„ظٹط©"
                            ? "hsl(0 70% 50% / 0.12)"
                            : "hsl(var(--secondary)/0.5)",
                          color: app.priority === "ط¹ط§ظ„ظٹط©"
                            ? "hsl(0 60% 40%)"
                            : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {app.priority}
                      </span>
                    )}
                  </div>
                  {app.description && (
                    <p
                      className="text-xs text-muted-foreground mt-2.5 line-clamp-1 pt-2"
                      style={{ borderTop: "1px solid hsl(var(--border)/0.5)" }}
                    >
                      {app.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div
              className="text-center py-10 rounded-2xl"
              style={{
                background: "hsl(var(--card)/0.6)",
                border: "1.5px dashed hsl(var(--border)/0.7)",
              }}
            >
              <CalIcon
                className="w-10 h-10 mx-auto mb-3 opacity-35"
                style={{ color: "hsl(var(--primary))" }}
              />
              <p className="text-base font-bold text-foreground">ظ„ط§ طھظˆط¬ط¯ ظ…ظˆط§ط¹ظٹط¯</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedDate === today ? "ظ„ط§ طھظˆط¬ط¯ ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظٹظˆظ…" : "ظ„ط§ طھظˆط¬ط¯ ظ…ظˆط§ط¹ظٹط¯ ظپظٹ ظ‡ط°ط§ ط§ظ„ظٹظˆظ…"}
              </p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="rtl max-w-[400px] rounded-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>طھط¹ط¯ظٹظ„ ط§ظ„ظ…ظˆط¹ط¯</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>ط§ظ„ط¹ظ†ظˆط§ظ†</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ط§ظ„طھط§ط±ظٹط®</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>ط§ظ„ظˆظ‚طھ</Label>
                  <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ط§ظ„طھطµظ†ظٹظپ</Label>
                  <Select value={cat} onValueChange={setCat}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="rtl">
                      <SelectItem value="ط´ط®طµظٹ">ط´ط®طµظٹ</SelectItem>
                      <SelectItem value="ط¹ط§ط¦ظ„ظٹ">ط¹ط§ط¦ظ„ظٹ</SelectItem>
                      <SelectItem value="ط¹ظ…ظ„">ط¹ظ…ظ„</SelectItem>
                      <SelectItem value="ط³ظپط±">ط³ظپط±</SelectItem>
                      <SelectItem value="طµط­ط©">طµط­ط©</SelectItem>
                      <SelectItem value="ظˆط«ط§ط¦ظ‚">ظˆط«ط§ط¦ظ‚</SelectItem>
                      <SelectItem value="ظ…ط§ظ„">ظ…ط§ظ„</SelectItem>
                      <SelectItem value="ظ…ط®طµطµ">ظ…ط®طµطµ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ط§ظ„ط£ظ‡ظ…ظٹط©</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="rtl">
                      <SelectItem value="ط¹ط§ظ„ظٹط©">ط¹ط§ظ„ظٹط©</SelectItem>
                      <SelectItem value="ظ…طھظˆط³ط·ط©">ظ…طھظˆط³ط·ط©</SelectItem>
                      <SelectItem value="ظ…ظ†ط®ظپط¶ط©">ظ…ظ†ط®ظپط¶ط©</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>ظ…ظ„ط§ط­ط¸ط§طھ</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={handleEdit} disabled={savePending}>
                  {savePending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ"}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => { setDeleteId(editApp?.id ?? null); setIsDeleteOpen(true); }}
                  disabled={deletePending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="ط­ط°ظپ ط§ظ„ظ…ظˆط¹ط¯"
          description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ظ‡ط°ط§ ط§ظ„ظ…ظˆط¹ط¯طں ظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھط±ط§ط¬ط¹ ط¹ظ† ظ‡ط°ط§ ط§ظ„ط¥ط¬ط±ط§ط،."
          onConfirm={handleDelete}
        />
      </div>
    </AppShell>
  );
}

