import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createComplaint, type ComplaintType } from "@/lib/complaintService";
import { useStore } from "@/hooks/useStore";
import { showTopNotification } from "@/components/layout/TopNotificationBanner";
import { MessageSquare, Loader2, CheckCircle2 } from "lucide-react";

export default function CentersComplaintsPage() {
  const { user } = useStore();
  const [type, setType] = useState<"complaint" | "suggestion" | "inquiry">("suggestion");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message || message.length < 10) { 
      showTopNotification("ط§ظ„ط±ط³ط§ظ„ط© ظٹط¬ط¨ ط£ظ† طھظƒظˆظ† 10 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„", "error");
      return; 
    }

    setIsSubmitting(true);
    try {
      const result = await createComplaint({
        type,
        category: type,
        message: message + (contact ? `\n\nط§ظ„طھظˆط§طµظ„: ${contact}` : ""),
      }, user.id || undefined);
      
      if (result.success) {
        setIsSuccess(true);
        showTopNotification("طھظ… ط¥ط±ط³ط§ظ„ ط±ط³ط§ظ„طھظƒ ط¨ظ†ط¬ط§ط­", "success");
      } else {
        showTopNotification(result.error || "ظپط´ظ„ ط¥ط±ط³ط§ظ„ ط§ظ„ط±ط³ط§ظ„ط©", "error");
      }
    } catch (err) {
      showTopNotification("ط­ط¯ط« ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell title="ط§ظ„ط´ظƒط§ظˆظ‰ ظˆط§ظ„ط§ظ‚طھط±ط§ط­ط§طھ" showBack>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">طµظˆطھظƒ ظ…ط³ظ…ظˆط¹</h2>
            <p className="text-sm text-muted-foreground">ط£ط±ط³ظ„ ط§ظ‚طھط±ط§ط­ط§طھظƒ ط£ظˆ ط£ظٹ ظ…ط´ظƒظ„ط© طھظˆط§ط¬ظ‡ظƒ</p>
          </div>
        </div>

        {isSuccess ? (
          <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-sm text-center py-12">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              <div>
                <h3 className="text-xl font-bold text-emerald-700 mb-2">طھظ… ط§ظ„ط¥ط±ط³ط§ظ„ ط¨ظ†ط¬ط§ط­</h3>
                <p className="text-emerald-600/80">ط´ظƒط±ط§ظ‹ ظ„طھظˆط§طµظ„ظƒ ظ…ط¹ظ†ط§طŒ ظ†ظ‡طھظ… ط¨ظƒظ„ ط±ط³ط§ظ„ط© طھطµظ„ظ†ط§ ظ„طھط­ط³ظٹظ† ط§ظ„ظ…ظ†طµط©.</p>
              </div>
              <Button variant="outline" className="mt-4" onClick={() => { setIsSuccess(false); setMessage(""); setContact(""); }}>
                ط¥ط±ط³ط§ظ„ ط±ط³ط§ظ„ط© ط£ط®ط±ظ‰
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <Label>ظ†ظˆط¹ ط§ظ„ط±ط³ط§ظ„ط©</Label>
                <Select value={type} onValueChange={(v: "complaint" | "suggestion" | "inquiry") => setType(v)}>
                  <SelectTrigger className="h-12 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent className="rtl">
                    <SelectItem value="suggestion">ط§ظ‚طھط±ط§ط­ طھط·ظˆظٹط±</SelectItem>
                    <SelectItem value="complaint">ط´ظƒظˆظ‰ / ظ…ط´ظƒظ„ط© ظپظ†ظٹط©</SelectItem>
                    <SelectItem value="inquiry">ط§ط³طھظپط³ط§ط± ط¹ط§ظ…</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>ط§ظ„ط±ط³ط§ظ„ط©</Label>
                <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="ط§ظƒطھط¨ طھظپط§طµظٹظ„ ط±ط³ط§ظ„طھظƒ ظ‡ظ†ط§..." className="bg-background resize-none" />
              </div>

              <div className="space-y-2">
                <Label>ط±ظ‚ظ… ط§ظ„ط¬ظˆط§ظ„ ط£ظˆ ط§ظ„ط¨ط±ظٹط¯ (ط§ط®طھظٹط§ط±ظٹ)</Label>
                <Input value={contact} onChange={e => setContact(e.target.value)} placeholder="ظ„ظ„طھظˆط§طµظ„ ظ…ط¹ظƒ ط¥ظ† ظ„ط²ظ… ط§ظ„ط£ظ…ط±" className="h-12 bg-background" dir="ltr" />
              </div>

              <Button className="w-full h-12 font-bold text-base mt-2" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "ط¥ط±ط³ط§ظ„"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

