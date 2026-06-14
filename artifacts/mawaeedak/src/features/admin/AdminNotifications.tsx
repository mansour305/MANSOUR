/**
 * AdminNotifications â€” Phase 12K
 *
 * Read:   useGatewayNotifications â†’ API (mode=api/shadow) | Supabase (mode=supabase)
 * Send:   useCreateNotification (Orval â†’ API) â€” ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ API
 *         ط§ظ„ط³ط¨ط¨: POST /api/notifications = fan-out ظ…طھط¹ط¯ط¯ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ† ط¹ظ„ظ‰ ط§ظ„ط®ط§ط¯ظ…طŒ
 *         ظ„ط§ RLS INSERT policy ظ…ظڈط¹ط±ظژظ‘ظپط©طŒ ظˆظ„ظٹط³ user-scoped INSERT.
 * Delete: gwDeleteNotification â†’ API (mode=api/shadow) | Supabase (mode=supabase)
 *
 * Invalidation ط¨ط¹ط¯ ظƒظ„ write:
 *   - gwQueryKeys.notifications â†’ ظٹظڈط¹ظٹط¯ ط¬ظ„ط¨ ط§ظ„ظ‚ط§ط¦ظ…ط©
 *   - gwQueryKeys.unreadCount â†’ ظٹظڈط¹ظٹط¯ ط¬ظ„ط¨ ط¹ط¯ط§ط¯ TopBar
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateNotification,
  getListNotificationsQueryKey,
  getGetUnreadNotificationsCountQueryKey,
} from "@api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Loader2, Trash2 } from "lucide-react";
import { useGatewayNotifications, gwQueryKeys } from "@/hooks/useGatewayData";
import { gwDeleteNotification } from "@/lib/dataGateway";

const TYPES = [
  { value: "system",      label: "طھط­ط¯ظٹط« ظ†ط¸ط§ظ…" },
  { value: "owner",       label: "ط±ط³ط§ظ„ط© ظ…ظ† ط§ظ„ظ…ط§ظ„ظƒ" },
  { value: "news",        label: "ط®ط¨ط± ط¹ط§ط¬ظ„" },
  { value: "financial",   label: "طھظ†ط¨ظٹظ‡ ظ…ط§ظ„ظٹ ط¹ط§ظ…" },
  { value: "salary",      label: "طھظ†ط¨ظٹظ‡ ط±ط§طھط¨" },
  { value: "support",     label: "طھظ†ط¨ظٹظ‡ ط¯ط¹ظ…" },
  { value: "bill",        label: "طھظ†ط¨ظٹظ‡ ظپط§طھظˆط±ط©" },
  { value: "event",       label: "ظ…ظˆط¹ط¯ ط¹ط§ظ…" },
  { value: "appointment", label: "ظ…ظˆط¹ط¯ ط´ط®طµظٹ" },
  { value: "prayer",      label: "طµظ„ط§ط©" },
  { value: "story",       label: "ط³طھظˆط±ظٹ ط§ظ„ظٹظˆظ…" },
  { value: "job",         label: "ظˆط¸ظٹظپط©" },
  { value: "reminder",    label: "طھط°ظƒظٹط±" },
];

export default function AdminNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createNotif = useCreateNotification();

  // Phase 12K: Gateway read
  const { data: notifications, isLoading } = useGatewayNotifications();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("owner");
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  // ط¨ط¹ط¯ ظƒظ„ write: invalidate Gateway cache + Orval cache (ظ„ظ„طھظˆط§ظپظ‚ ظ…ط¹ send ط§ظ„ط°ظٹ ظٹط¨ظ‚ظ‰ API)
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.notifications });
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.unreadCount });
    // Orval keys â€” ظ„ظ„طھظˆط§ظپظ‚ ظ…ط¹ send (ظٹظƒطھط¨ API) ط­طھظ‰ طھظڈط­ط¯ظژظ‘ط« Orval cache ط£ظٹط¶ط§ظ‹
    queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetUnreadNotificationsCountQueryKey() });
  };

  // Send ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ API (Orval) â€” fan-out ظ…طھط¹ط¯ط¯ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†طŒ ظ„ط§ RLS INSERT policy
  const handleSend = () => {
    if (!title.trim()) {
      toast({ title: "ط®ط·ط£", description: "ط¹ظ†ظˆط§ظ† ط§ظ„ط¥ط´ط¹ط§ط± ظ…ط·ظ„ظˆط¨", variant: "destructive" });
      return;
    }
    createNotif.mutate({ data: { title: title.trim(), body: body.trim() || undefined, type } }, {
      onSuccess: () => {
        toast({ title: "طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„ط¥ط´ط¹ط§ط±", description: `"${title}" â€” ط¸ظ‡ط± ظپظٹ ظ…ط±ظƒط² ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ` });
        setTitle("");
        setBody("");
        invalidateAll();
      },
      onError: () => toast({ title: "ط®ط·ط£", description: "ظپط´ظ„ ط¥ط±ط³ط§ظ„ ط§ظ„ط¥ط´ط¹ط§ط±", variant: "destructive" }),
    });
  };

  // Delete ط¹ط¨ط± Gateway â€” RLS notifications_delete_own ظ…ظˆط¬ظˆط¯ط©
  const handleDelete = async (id: number) => {
    setPendingDelete(id);
    try {
      const result = await gwDeleteNotification(id);
      if (result.success) {
        invalidateAll();
        toast({ title: "طھظ… ط§ظ„ط­ط°ظپ" });
      } else {
        toast({
          title: "ط®ط·ط£ ظپظٹ ط§ظ„ط­ط°ظپ",
          description: result.error ?? "ظپط´ظ„ ط§ظ„ط­ط°ظپ",
          variant: "destructive",
        });
      }
    } finally {
      setPendingDelete(null);
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
          ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ
        </h1>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>ط¹ظ†ظˆط§ظ† ط§ظ„ط¥ط´ط¹ط§ط± *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ظ…ط«ط§ظ„: طھط­ط¯ظٹط« ط¬ط¯ظٹط¯ ظ„ظ„ظ…ظ†طµط©"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label>ظ†طµ ط§ظ„ط¥ط´ط¹ط§ط± (ط§ط®طھظٹط§ط±ظٹ)</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="ط§ظ„طھظپط§طµظٹظ„..."
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label>ط§ظ„ظ†ظˆط¹ / ط§ظ„طھطµظ†ظٹظپ</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
              <SelectContent className="rtl" dir="rtl">
                {(Array.isArray(TYPES) ? TYPES : []).map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full h-12 text-base font-bold mt-4"
            onClick={handleSend}
            disabled={createNotif.isPending}
          >
            {createNotif.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <><Send className="w-5 h-5 ml-2 rtl:rotate-180" /> ط¥ط±ط³ط§ظ„ ظ„ظ„ط¬ظ…ظٹط¹</>
            )}
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        ط§ظ„ط¥ط´ط¹ط§ط± ظٹط¸ظ‡ط± ظپظˆط±ط§ظ‹ ظپظٹ ظ…ط±ظƒط² ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ. Push Notifications ظ…ط¤ط¬ظ„ ظ„ط¥طµط¯ط§ط± ظ„ط§ط­ظ‚.
      </p>

      {/* Recent notifications list for quick delete */}
      {!isLoading && notifications && notifications.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold">ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ط­ط§ظ„ظٹط© ({notifications.length})</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {(Array.isArray(notifications) ? notifications : []).map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border bg-card text-sm"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground truncate block">{n.title}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {n.type} â€” {n.is_read ? "ظ…ظ‚ط±ظˆط،" : "ط؛ظٹط± ظ…ظ‚ط±ظˆط،"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 shrink-0 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDelete(n.id)}
                  disabled={pendingDelete === n.id}
                >
                  {pendingDelete === n.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

