import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComplaint } from "@api-client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Clock, Headphones, CheckCircle2, Loader2 } from "lucide-react";

export default function SupportPage() {
  const { toast } = useToast();
  const createComplaint = useCreateComplaint();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ظ…ظˆط¶ظˆط¹ ظˆط§ظ„ط±ط³ط§ظ„ط© ظ…ط·ظ„ظˆط¨ط§ظ†", variant: "destructive" });
      return;
    }
    createComplaint.mutate(
      { data: { type: "ط§ط³طھظپط³ط§ط±", message: `[${subject.trim()}]\n\n${message.trim()}`, contact: contact || undefined } },
      { onSuccess: () => setIsSuccess(true) }
    );
  };

  return (
    <AppShell title="ط§طھطµظ„ ط¨ظ†ط§" showBack>
      <div className="space-y-6 pb-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">ظƒظٹظپ ظٹظ…ظƒظ†ظ†ط§ ظ…ط³ط§ط¹ط¯طھظƒطں</h2>
            <p className="text-sm text-muted-foreground">ظ†ظ‡طھظ… ط¨ظƒظ„ ط±ط³ط§ظ„ط© طھطµظ„ظ†ط§</p>
          </div>
        </div>

        {/* Contact Info */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ</div>
                <a href="mailto:support@mawaeedak.sa" className="text-xs text-primary hover:underline" dir="ltr">
                  support@mawaeedak.sa
                </a>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">ط³ط§ط¹ط§طھ ط§ظ„ط¹ظ…ظ„</div>
                <div className="text-xs text-muted-foreground">ط§ظ„ط£ط­ط¯ â€“ ط§ظ„ط®ظ…ظٹط³طŒ 9:00 طµ â€“ 5:00 ظ…</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        {isSuccess ? (
          <Card className="border-emerald-500/30 bg-emerald-500/5 text-center py-12">
            <CardContent className="flex flex-col items-center gap-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              <div>
                <h3 className="text-xl font-bold text-emerald-700 mb-2">طھظ… ط§ظ„ط¥ط±ط³ط§ظ„ ط¨ظ†ط¬ط§ط­</h3>
                <p className="text-emerald-600/80 text-sm">ط³ظ†طھظˆط§طµظ„ ظ…ط¹ظƒ ظپظٹ ط£ظ‚ط±ط¨ ظˆظ‚طھ ظ…ظ…ظƒظ†.</p>
              </div>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => { setIsSuccess(false); setSubject(""); setMessage(""); setContact(""); }}
              >
                ط¥ط±ط³ط§ظ„ ط±ط³ط§ظ„ط© ط£ط®ط±ظ‰
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-base text-foreground">ظ†ظ…ظˆط°ط¬ ط§ظ„طھظˆط§طµظ„</h3>

              <div className="space-y-2">
                <Label>ط§ظ„ظ…ظˆط¶ظˆط¹ <span className="text-destructive">*</span></Label>
                <Input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="ظ…ظˆط¶ظˆط¹ ط±ط³ط§ظ„طھظƒ"
                  className="h-12 bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label>ط§ظ„ط±ط³ط§ظ„ط© <span className="text-destructive">*</span></Label>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  placeholder="ط§ظƒطھط¨ ط±ط³ط§ظ„طھظƒ ظ‡ظ†ط§..."
                  className="bg-background resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>ظˆط³ظٹظ„ط© ط§ظ„طھظˆط§طµظ„ (ط§ط®طھظٹط§ط±ظٹ)</Label>
                <Input
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  placeholder="ط¨ط±ظٹط¯ ط¥ظ„ظƒطھط±ظˆظ†ظٹ ط£ظˆ ط±ظ‚ظ… ط¬ظˆط§ظ„"
                  className="h-12 bg-background"
                  dir="ltr"
                />
              </div>

              <Button
                className="w-full h-12 font-bold text-base"
                onClick={handleSubmit}
                disabled={createComplaint.isPending}
              >
                {createComplaint.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "ط¥ط±ط³ط§ظ„ ط§ظ„ط±ط³ط§ظ„ط©"}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center">
                ط±ط³ط§ط¦ظ„ظƒ طھظڈط­ظپط¸ ط¯ط§ط®ظ„ظٹط§ظ‹ ظ„ظ…ط±ط§ط¬ط¹طھظ‡ط§ ظ…ظ† ظپط±ظٹظ‚ ط§ظ„ظ…ظ†طµط©
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

