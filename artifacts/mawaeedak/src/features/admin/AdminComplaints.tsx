import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { showTopNotification } from "@/components/layout/TopNotificationBanner";
import {
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
  type Complaint,
  type ComplaintStatus,
} from "@/lib/complaintService";
import { Search, Loader2, MessageSquare, Trash2, Reply, Inbox } from "lucide-react";
import { format } from "date-fns";

const STATUS_OPTIONS = [
  { value: "pending", label: "ط¬ط¯ظٹط¯", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  { value: "in_progress", label: "ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط©", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  { value: "resolved", label: "طھظ… ط§ظ„ط­ظ„", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  { value: "rejected", label: "ظ…ط±ظپظˆط¶", color: "bg-red-500/10 text-red-600 border-red-500/30" },
];

function statusMeta(value: string) {
  return STATUS_OPTIONS.find(s => s.value === value) ?? { value, label: value, color: "bg-muted text-muted-foreground border-border" };
}

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState<Complaint | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<string>("pending");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load complaints on mount
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await getAllComplaints();
      setComplaints(data);
      setIsLoading(false);
    };
    void load();
  }, []);

  const invalidate = () => {
    const load = async () => {
      const data = await getAllComplaints();
      setComplaints(data);
    };
    load();
  };

  const types = useMemo(() => {
    const set = new Set<string>();
    complaints.forEach(c => set.add(c.type));
    return Array.from(set);
  }, [complaints]);

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${c.message} ${c.type} ${c.category ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [complaints, typeFilter, statusFilter, search]);

  const counts = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === "pending").length,
      resolved: complaints.filter(c => c.status === "resolved").length,
      awaitingReply: complaints.filter(c => !c.admin_response && c.status !== "rejected").length,
    };
  }, [complaints]);

  const openDetail = (c: Complaint) => {
    setDetail(c);
    setReplyText(c.admin_response ?? "");
    setReplyStatus(c.status);
  };

  const handleSave = async () => {
    if (!detail) return;
    setIsUpdating(true);
    const result = await updateComplaintStatus(detail.id, replyStatus as ComplaintStatus, replyText || undefined);
    setIsUpdating(false);
    
    if (result.success) {
      showTopNotification("طھظ… ط§ظ„ط­ظپط¸ ط¨ظ†ط¬ط§ط­", "success");
      invalidate();
      setDetail(null);
    } else {
      showTopNotification(result.error || "ظپط´ظ„ ط§ظ„ط­ظپط¸", "error");
    }
  };

  const handleStatusInline = async (c: Complaint, status: string) => {
    const result = await updateComplaintStatus(c.id, status as ComplaintStatus);
    if (result.success) {
      showTopNotification("طھظ… طھط­ط¯ظٹط« ط§ظ„ط­ط§ظ„ط©", "success");
      invalidate();
    } else {
      showTopNotification(result.error || "ظپط´ظ„ ط§ظ„طھط­ط¯ظٹط«", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteComplaint(deleteId);
    if (result.success) {
      showTopNotification("طھظ… ط§ظ„ط­ط°ظپ ط¨ظ†ط¬ط§ط­", "success");
      invalidate();
      setDeleteId(null);
    } else {
      showTopNotification(result.error || "ظپط´ظ„ ط§ظ„ط­ط°ظپ", "error");
    }
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
          ط§ظ„ط´ظƒط§ظˆظ‰ ظˆط§ظ„ط§ظ‚طھط±ط§ط­ط§طھ
        </h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ", value: counts.total, icon: Inbox },
          { label: "ط¬ط¯ظٹط¯ط©", value: counts.pending, icon: MessageSquare },
          { label: "ط¨ط§ظ†طھط¸ط§ط± ط±ط¯", value: counts.awaitingReply, icon: Reply },
          { label: "طھظ… ط­ظ„ظ‡ط§", value: counts.resolved, icon: MessageSquare },
        ].map(s => (
          <Card key={s.label} className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-extrabold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ط¨ط­ط« ظپظٹ ط§ظ„ط±ط³ط§ط¦ظ„..." value={search} onChange={e => setSearch(e.target.value)} className="pr-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="md:w-44"><SelectValue placeholder="ط§ظ„ظ†ظˆط¹" /></SelectTrigger>
          <SelectContent className="rtl">
            <SelectItem value="all">ظƒظ„ ط§ظ„ط£ظ†ظˆط§ط¹</SelectItem>
            {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-44"><SelectValue placeholder="ط§ظ„ط­ط§ظ„ط©" /></SelectTrigger>
          <SelectContent className="rtl">
            <SelectItem value="all">ظƒظ„ ط§ظ„ط­ط§ظ„ط§طھ</SelectItem>
            {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-10 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">ظ„ط§ طھظˆط¬ط¯ ط±ط³ط§ط¦ظ„ ظ…ط·ط§ط¨ظ‚ط©</div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(c => {
                const sm = statusMeta(c.status);
                return (
                  <div key={c.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openDetail(c)}>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{c.type}</span>
                          {c.category && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c.category}</span>}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${sm.color}`}>{sm.label}</span>
                          {!c.admin_response && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold">ط¨ط§ظ†طھط¸ط§ط± ط±ط¯</span>}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{c.message}</div>
                        <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                          <span>{format(new Date(c.created_at), "yyyy-MM-dd HH:mm")}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Select value={c.status} onValueChange={v => handleStatusInline(c, v)}>
                          <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rtl">
                            {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => openDetail(c)}>
                            <Reply className="w-3.5 h-3.5 ml-1" /> ط±ط¯
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(c.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {c.admin_response && (
                      <div className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/15 text-xs text-foreground">
                        <span className="font-bold text-primary">ط§ظ„ط±ط¯: </span>{c.admin_response}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail / Reply dialog */}
      <Dialog open={!!detail} onOpenChange={open => { if (!open) setDetail(null); }}>
        <DialogContent className="rtl max-w-lg">
          <DialogHeader>
            <DialogTitle>طھظپط§طµظٹظ„ ط§ظ„ط±ط³ط§ظ„ط©</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{detail.type}</span>
                {detail.category && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{detail.category}</span>}
              </div>
              <div className="p-3 rounded-lg bg-muted/40 text-sm text-foreground whitespace-pre-wrap">{detail.message}</div>
              <div className="space-y-2">
                <Label>ط§ظ„ط­ط§ظ„ط©</Label>
                <Select value={replyStatus} onValueChange={setReplyStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="rtl">
                    {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ط±ط¯</Label>
                <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} placeholder="ط§ظƒطھط¨ ط±ط¯ط§ظ‹ ط¹ظ„ظ‰ ط§ظ„ط±ط³ط§ظ„ط©..." />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDetail(null)}>ط¥ظ„ط؛ط§ط،</Button>
                <Button onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={open => { if (!open) setDeleteId(null); }}
        title="ط­ط°ظپ ط§ظ„ط±ط³ط§ظ„ط©"
        description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ظ‡ط°ظ‡ ط§ظ„ط±ط³ط§ظ„ط©طں ظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھط±ط§ط¬ط¹."
        confirmText="ط­ط°ظپ"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}

