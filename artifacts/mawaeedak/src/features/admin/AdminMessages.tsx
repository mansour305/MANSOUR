/**
 * AdminMessages â€” Phase 12M
 *
 * Read:   useGatewayDailyMessages â†’ API (mode=api/shadow) | Supabase (mode=supabase)
 * Write:  gwCreateDailyMessage / gwUpdateDailyMessage / gwDeleteDailyMessage
 *           mode=api/shadow â†’ /api/daily-messages/:id
 *           mode=supabase   â†’ Supabase INSERT/UPDATE/DELETE
 *
 * Invalidation: gwQueryKeys.dailyMessages + getListDailyMessagesQueryKey
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListDailyMessagesQueryKey } from "@api-client";
import { Plus, Edit2, Trash2, Loader2, Calendar as CalIcon } from "lucide-react";
import { useGatewayDailyMessages, gwQueryKeys } from "@/hooks/useGatewayData";
import {
  gwCreateDailyMessage,
  gwUpdateDailyMessage,
  gwDeleteDailyMessage,
} from "@/lib/dataGateway";

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Phase 12M: Gateway read
  const { data: messages, isLoading, refetch: refetchMessages } = useGatewayDailyMessages();

  const [savePending, setSavePending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const invalidateMessages = () => {
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.dailyMessages });
    queryClient.invalidateQueries({ queryKey: getListDailyMessagesQueryKey() });
    void refetchMessages();
  };

  const openAdd = () => {
    setIsEdit(false); setEditId(null);
    setMessage(""); setDisplayDate(""); setIsActive(true);
    setIsOpen(true);
  };

  const openEdit = (msg: { id: number; message: string; display_date?: string | null; is_active: boolean }) => {
    setIsEdit(true); setEditId(msg.id);
    setMessage(msg.message);
    setDisplayDate(msg.display_date ?? "");
    setIsActive(msg.is_active);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!message) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط±ط³ط§ظ„ط© ظ…ط·ظ„ظˆط¨ط©", variant: "destructive" });
      return;
    }
    const payload = { message, display_date: displayDate || undefined, is_active: isActive };
    setSavePending(true);
    try {
      const result = isEdit && editId
        ? await gwUpdateDailyMessage(editId, payload)
        : await gwCreateDailyMessage(payload);
      if (result.success) {
        toast({ title: isEdit ? "طھظ… ط§ظ„طھط¹ط¯ظٹظ„" : "طھظ…طھ ط§ظ„ط¥ط¶ط§ظپط©" });
        setIsOpen(false);
        invalidateMessages();
      } else {
        toast({ title: "ط®ط·ط£", description: result.error ?? "ظپط´ظ„طھ ط§ظ„ط¹ظ…ظ„ظٹط©", variant: "destructive" });
      }
    } finally {
      setSavePending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeletePending(true);
    try {
      const result = await gwDeleteDailyMessage(deleteId);
      if (result.success) {
        toast({ title: "طھظ… ط§ظ„ط­ط°ظپ" });
        setIsDeleteOpen(false);
        invalidateMessages();
      } else {
        toast({ title: "ظپط´ظ„ ط§ظ„ط­ط°ظپ", description: result.error ?? "ط®ط·ط£ ط؛ظٹط± ظ…ط¹ط±ظˆظپ", variant: "destructive" });
        setIsDeleteOpen(false);
      }
    } finally {
      setDeletePending(false);
    }
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
            ط§ظ„ط±ط³ط§ط¦ظ„ ط§ظ„ظٹظˆظ…ظٹط©
          </h1>
        </div>
        <Button onClick={openAdd} size="sm">
          <Plus className="w-4 h-4 ml-1" /> ط¥ط¶ط§ظپط© ط±ط³ط§ظ„ط©
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rtl max-w-[400px] rounded-xl">
          <DialogHeader>
            <DialogTitle>{isEdit ? "طھط¹ط¯ظٹظ„ ط±ط³ط§ظ„ط©" : "ط±ط³ط§ظ„ط© ط¬ط¯ظٹط¯ط©"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ظ†طµ ط§ظ„ط±ط³ط§ظ„ط©</Label>
              <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="ط§ظƒطھط¨ ط§ظ„ط­ظƒظ…ط© ط£ظˆ ط§ظ„ط±ط³ط§ظ„ط© ظ‡ظ†ط§..." />
            </div>
            <div className="space-y-2">
              <Label>طھط§ط±ظٹط® ط§ظ„ط¹ط±ط¶ (ط§ط®طھظٹط§ط±ظٹ)</Label>
              <Input type="date" value={displayDate} onChange={e => setDisplayDate(e.target.value)} />
              <p className="text-xs text-muted-foreground">ط¥ط°ط§ طھط±ظƒطھظ‡ ظپط§ط±ط؛ط§ظ‹ ط³طھط¸ظ‡ط± ط§ظ„ط±ط³ط§ظ„ط© ط¨ط´ظƒظ„ ط¹ط´ظˆط§ط¦ظٹ ظ„ظ„ط±ط³ط§ط¦ظ„ ط§ظ„ظ…ظپط¹ظ‘ظ„ط©</p>
            </div>
            <div className="flex items-center justify-between">
              <Label>طھظپط¹ظٹظ„ ط§ظ„ط±ط³ط§ظ„ط©</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={savePending}>
              {savePending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : messages && messages.length > 0 ? (
        <div className="space-y-3">
          {(Array.isArray(messages) ? messages : []).map(msg => (
            <Card key={msg.id} className={`border-border shadow-sm ${!msg.is_active ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <p className="font-medium text-sm leading-relaxed mb-3">{msg.message}</p>
                <div className="flex justify-between items-center border-t border-border pt-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {msg.display_date ? (
                      <span className="flex items-center gap-1"><CalIcon className="w-3 h-3" /> {msg.display_date}</span>
                    ) : (
                      <span className="text-accent bg-accent/10 px-2 py-0.5 rounded">ط¹ط§ظ…ط©</span>
                    )}
                    {!msg.is_active && <span className="text-destructive bg-destructive/10 px-2 py-0.5 rounded">ظ…ط¹ط·ظ„ط©</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => openEdit(msg)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => { setDeleteId(msg.id); setIsDeleteOpen(true); }}
                      disabled={deletePending}
                    >
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
          ظ„ط§ طھظˆط¬ط¯ ط±ط³ط§ط¦ظ„
        </div>
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="ط­ط°ظپ ط§ظ„ط±ط³ط§ظ„ط©"
        description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ظ‡ط°ظ‡ ط§ظ„ط±ط³ط§ظ„ط©طں"
        onConfirm={handleDelete}
      />
    </div>
  );
}

