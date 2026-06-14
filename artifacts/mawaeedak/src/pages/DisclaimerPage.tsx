import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <AppShell title="ط¥ط®ظ„ط§ط، ط§ظ„ظ…ط³ط¤ظˆظ„ظٹط©" hideNav showBack>
      <div className="space-y-4 pb-6">

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">ط¥ط®ظ„ط§ط، ط§ظ„ظ…ط³ط¤ظˆظ„ظٹط©</h2>
            <p className="text-xs text-muted-foreground">ظٹظڈط±ط¬ظ‰ ظ‚ط±ط§ط،ط© ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ط¨ط¹ظ†ط§ظٹط© ظ‚ط¨ظ„ ط§ظ„ط§ط¹طھظ…ط§ط¯ ط¹ظ„ظ‰ ط£ظٹ ط¨ظٹط§ظ†ط§طھ</p>
          </div>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              ط¬ظ…ظٹط¹ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظˆط§ظ„ط­ط§ط³ط¨ط§طھ ظˆط§ظ„ظ…ظˆط§ط¹ظٹط¯ ظپظٹ ظ‡ط°ط§ ط§ظ„طھط·ط¨ظٹظ‚ ظ‡ظٹ ظ„ط£ط؛ط±ط§ط¶ ط§ظ„ظ…ط³ط§ط¹ط¯ط© ظˆط§ظ„ط¥ط±ط´ط§ط¯ ظپظ‚ط·. ظ„ط§ طھظڈط¹طھظ…ط¯ ظ‚ط±ط§ط±ط§ظ‹ ظ…ط§ظ„ظٹط§ظ‹ ط£ظˆ ظ‚ط§ظ†ظˆظ†ظٹط§ظ‹ ط£ظˆ ط¯ظٹظ†ظٹط§ظ‹ ط±ط³ظ…ظٹط§ظ‹.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-5 text-sm leading-relaxed">

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">1. ط§ظ„ط­ط§ط³ط¨ط§طھ ط§ظ„ظ…ط§ظ„ظٹط©</h3>
              <p className="text-muted-foreground">
                ط¬ظ…ظٹط¹ ط§ظ„ط­ط§ط³ط¨ط§طھ ظپظٹ ظ‚ط³ظ… "ط§ظ„ظ…ط§ظ„" â€” ط¨ظ…ط§ ظپظٹظ‡ط§ ط­ط§ط³ط¨ط© ط§ظ„ط±ط§طھط¨طŒ ظ…ظƒط§ظپط£ط© ظ†ظ‡ط§ظٹط© ط§ظ„ط®ط¯ظ…ط©طŒ ط¶ط±ظٹط¨ط© ط§ظ„ظ‚ظٹظ…ط© ط§ظ„ظ…ط¶ط§ظپط©طŒ ط³ظ„ظ… ط§ظ„ط±ظˆط§طھط¨ â€” طھظڈظ‚ط¯ظ‘ظ… ظ†طھط§ط¦ط¬ <strong className="text-foreground">طھظ‚ط¯ظٹط±ظٹط© ظˆظ…ط¨ط¯ط¦ظٹط© ظپظ‚ط·</strong>. ظ„ط§ طھظ…ط«ظ„ ط¥ظ‚ط±ط§ط±ط§ظ‹ ط¶ط±ظٹط¨ظٹط§ظ‹ ط£ظˆ ظ…ط§ظ„ظٹط§ظ‹ ط±ط³ظ…ظٹط§ظ‹. ظٹط¬ط¨ ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ط£ط±ظ‚ط§ظ… ظ…ط¹ ط§ظ„ط¬ظ‡ط© ط§ظ„ط±ط³ظ…ظٹط© ط£ظˆ ظ…ط³طھط´ط§ط± ظ…ط§ظ„ظٹ ظ…ط±ط®ظ‘طµ ظ‚ط¨ظ„ ط§طھط®ط§ط° ط£ظٹ ظ‚ط±ط§ط±.
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">2. ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©</h3>
              <p className="text-muted-foreground">
                ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ط§ظ„ظ…ط¹ط±ظˆط¶ط© طھط¹طھظ…ط¯ ط¹ظ„ظ‰ <strong className="text-foreground">ط­ط³ط§ط¨ط§طھ طھظ‚ط¯ظٹط±ظٹط©</strong> ط¨ظ†ط§ط،ظ‹ ط¹ظ„ظ‰ ظ…ظˆظ‚ط¹ ط§ظ„ظ…ط¯ظٹظ†ط©. ظ‚ط¯ طھط®طھظ„ظپ ط¨ط¯ظ‚ط§ط¦ظ‚ ط¹ظ† ط§ظ„طھظˆظ‚ظٹطھ ط§ظ„ط±ط³ظ…ظٹ ط­ط³ط¨ ط§ظ„ظ…ظ†ط·ظ‚ط© ظˆط§ظ„ظ…ظˆط³ظ…. ظٹظڈظ†طµط­ ط¯ط§ط¦ظ…ط§ظ‹ ط¨ظ…ط±ط§ط¬ط¹ط© <strong className="text-foreground">ط§ظ„طھظ‚ظˆظٹظ… ط§ظ„ط±ط³ظ…ظٹ ظ„ط£ظ… ط§ظ„ظ‚ط±ظ‰ ط£ظˆ ظˆط²ط§ط±ط© ط§ظ„ط´ط¤ظˆظ† ط§ظ„ط¥ط³ظ„ط§ظ…ظٹط©</strong> ظ„ظ„طھط­ظ‚ظ‚.
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">3. ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ط¹ظ… ط§ظ„ط­ظƒظˆظ…ظٹ</h3>
              <p className="text-muted-foreground">
                ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ط¹ظ… ط§ظ„ط­ظƒظˆظ…ظٹ (ط§ظ„ط¶ظ…ط§ظ† ط§ظ„ط§ط¬طھظ…ط§ط¹ظٹطŒ ط­ط³ط§ط¨ ط§ظ„ظ…ظˆط§ط·ظ†طŒ ط¯ط¹ظ… ط³ظƒظ†ظٹ ظˆط؛ظٹط±ظ‡) ط§ظ„ظ…ط¹ط±ظˆط¶ط© ظپظٹ ط§ظ„طھط·ط¨ظٹظ‚ ظ‡ظٹ <strong className="text-foreground">ط¨ظٹط§ظ†ط§طھ طھظ‚ط¯ظٹط±ظٹط© ظ…ظڈط¯ط§ط±ط© ط¥ط¯ط§ط±ظٹط§ظ‹</strong> ظ„ط£ط؛ط±ط§ط¶ ط§ظ„طھط°ظƒظٹط± ط¨ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ظپظ‚ط·. ط§ظ„ظ…ط¨ط§ظ„ط؛ ظˆط§ظ„طھظˆط§ط±ظٹط® ط§ظ„ظپط¹ظ„ظٹط© ظ‚ط¯ طھط®طھظ„ظپ. ظٹط¬ط¨ ط§ظ„ط±ط¬ظˆط¹ ط¥ظ„ظ‰ ط§ظ„ط¨ظˆط§ط¨ط§طھ ط§ظ„ط±ط³ظ…ظٹط© ظ„ظ„ط¬ظ‡ط§طھ ط§ظ„ط­ظƒظˆظ…ظٹط© ظ„ظ„طھط­ظ‚ظ‚.
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">4. ط§ظ„ط£ط®ط¨ط§ط± ظˆط§ظ„ظˆط¸ط§ط¦ظپ</h3>
              <p className="text-muted-foreground">
                ط§ظ„ط£ط®ط¨ط§ط± ظˆط§ظ„ظˆط¸ط§ط¦ظپ ط§ظ„ظ…ط¹ط±ظˆط¶ط© <strong className="text-foreground">ظ…ط­طھظˆظ‰ ظ…ظڈط¯ط§ط± ط¥ط¯ط§ط±ظٹط§ظ‹</strong> ظˆظ„ط§ طھظ…ط«ظ„ ظ…طµط§ط¯ظ‚ط© ط§ظ„ظ…ظ†طµط© ط¹ظ„ظٹظ‡ط§. طھظˆط§ط±ظٹط® ط§ظ†طھظ‡ط§ط، ط§ظ„طھظ‚ط¯ظٹظ… ظˆط§ظ„ط´ط±ظˆط· ظٹط¬ط¨ ط§ظ„طھط­ظ‚ظ‚ ظ…ظ†ظ‡ط§ ظ…ط¨ط§ط´ط±ط© ظ…ط¹ ط§ظ„ط¬ظ‡ط© ط§ظ„ظ…ظڈط¹ظ„ظ†ط©.
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">5. ط­ط¯ظˆط¯ ط§ظ„ط§ط³طھط®ط¯ط§ظ…</h3>
              <p className="text-muted-foreground">
                ظ„ط§ طھط³طھط®ط¯ظ… ط§ظ„طھط·ط¨ظٹظ‚ ظƒظ…طµط¯ط± ظˆط­ظٹط¯ ظ„ظ…ظˆط§ط¹ظٹط¯ظƒ ط£ظˆ ط§ظ„طھط²ط§ظ…ط§طھظƒ ط§ظ„ظ…ط§ظ„ظٹط© ط§ظ„ط­ط³ط§ط³ط©. طھط­ظ‚ظ‚ ط¯ط§ط¦ظ…ط§ظ‹ ظ…ظ† ط§ظ„ظ…طµط§ط¯ط± ط§ظ„ط±ط³ظ…ظٹط© ظ„ظ„ط¬ظ‡ط§طھ ط§ظ„ط­ظƒظˆظ…ظٹط© ظˆط§ظ„ظ…ط§ظ„ظٹط© ظ„ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ظ‚ظٹظ‚ط© ظˆط§ظ„ظ…ظڈط­ط¯ظژظ‘ط«ط©.
              </p>
            </section>

          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}

