import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <AppShell title="ط³ظٹط§ط³ط© ط§ظ„ط®طµظˆطµظٹط©" hideNav showBack>
      <div className="space-y-4 pb-6">

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">ط³ظٹط§ط³ط© ط§ظ„ط®طµظˆطµظٹط©</h2>
            <p className="text-xs text-muted-foreground">ظ…ط³ظˆط¯ط© طھط´ط؛ظٹظ„ظٹط© â€” طھط­طھط§ط¬ ظ…ط±ط§ط¬ط¹ط© ظ‚ط§ظ†ظˆظ†ظٹط© ظ‚ط¨ظ„ ط§ظ„ط¥ط·ظ„ط§ظ‚ ط§ظ„طھط¬ط§ط±ظٹ</p>
          </div>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              ظ‡ط°ظ‡ ط§ظ„ط³ظٹط§ط³ط© ظ…ط³ظˆط¯ط© طھط´ط؛ظٹظ„ظٹط© ط£ظˆظ„ظٹط©. ظ„ط§ طھظڈط¹طھط¨ط± ظˆط«ظٹظ‚ط© ظ‚ط§ظ†ظˆظ†ظٹط© ظ†ظ‡ط§ط¦ظٹط©. ظٹطھط·ظ„ط¨ ط§ظ„ط¥ط·ظ„ط§ظ‚ ط§ظ„طھط¬ط§ط±ظٹ ط§ظ„ظƒط§ظ…ظ„ ظ…ط±ط§ط¬ط¹ط© ظ‚ط§ظ†ظˆظ†ظٹط© ظ…طھط®طµطµط©.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-5 text-sm leading-relaxed">

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">1. ط·ط¨ظٹط¹ط© ط§ظ„طھط·ط¨ظٹظ‚ ظˆط­ظ…ط§ظٹط© ط§ظ„ط¨ظٹط§ظ†ط§طھ</h3>
              <p className="text-muted-foreground">
                ظ…ظ†طµط© "ظ…ظˆط§ط¹ظٹط¯ظƒ" ظ…ظ†طµط© ظ…ط³ط§ط¹ط¯ ظٹظˆظ…ظٹ ط´ط®طµظٹ طھط³طھط®ط¯ظ… ظ†ط¸ط§ظ… ظ…طµط§ط¯ظ‚ط© ط¢ظ…ظ†. ط¨ظٹط§ظ†ط§طھ ط§ظ„طھظپط¶ظٹظ„ط§طھ ظˆط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط´ط®طµظٹط© طھظڈط­ظپط¸ ظ…ط­ظ„ظٹط§ظ‹ ط¹ظ„ظ‰ ط¬ظ‡ط§ط²ظƒطŒ ط¨ظٹظ†ظ…ط§ طھظڈط­ظپط¸ ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ظˆط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط§ظ„ظٹط© ظˆط§ظ„ط´ظƒط§ظˆظ‰ ظپظٹ ظ‚ط§ط¹ط¯ط© ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ظ†طµط© ط§ظ„ظ…ط­ظ…ظٹط©.
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">2. ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط¬ظ…ط¹ط©</h3>
              <p className="text-muted-foreground">
                ظٹط¬ظ…ط¹ ط§ظ„طھط·ط¨ظٹظ‚ ط§ظ„ظ…ط¹ظ„ظˆظ…ط§طھ ط§ظ„طھط§ظ„ظٹط© ط¨طµظˆط±ط© ظ…ط­ظ„ظٹط©:
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                <li>ط§ظ„ط§ط³ظ… ظˆط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„طھظٹ طھظڈط¯ط®ظ„ظ‡ط§ ط¹ظ†ط¯ ط§ظ„ط¥ط¹ط¯ط§ط¯</li>
                <li>ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ظˆط§ظ„ظ…ظ‡ط§ظ… ط§ظ„طھظٹ طھظڈط¶ظٹظپظ‡ط§ ظپظٹ ط§ظ„طھظ‚ظˆظٹظ… ظˆظ…ط±ظƒط² ط§ظ„ط£ط¹ظ…ط§ظ„</li>
                <li>ط§ظ„ط£ط­ط¯ط§ط« ط§ظ„ظ…ط§ظ„ظٹط© ط§ظ„طھظٹ طھظڈط³ط¬ظ‘ظ„ظ‡ط§ ظپظٹ ظ‚ط³ظ… ط§ظ„ظ…ط§ظ„</li>
                <li>ط¨ظٹط§ظ†ط§طھ ط§ظ„ط±ط­ظ„ط§طھ ظپظٹ ظ…ط±ظƒط² ط§ظ„ط³ظپط±</li>
                <li>طھظپط¶ظٹظ„ط§طھ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ظˆط§ظ„ط«ظٹظ…ط§طھ ظˆط§ظ„طµظ„ط§ط© ظˆط§ظ„طھظ‚ظˆظٹظ…</li>
              </ul>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">3. ط§ظ„ظ…ط­طھظˆظ‰ ط§ظ„ظ…ظڈط¯ط§ط± ظ…ظ† ط§ظ„ط¥ط¯ط§ط±ط©</h3>
              <p className="text-muted-foreground">
                ط¨ط¹ط¶ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط¹ط±ظˆط¶ط© ظپظٹ ط§ظ„طھط·ط¨ظٹظ‚ ظ‡ظٹ <strong className="text-foreground">ظ…ط­طھظˆظ‰ ظ…ظڈط¯ط§ط± ط¥ط¯ط§ط±ظٹط§ظ‹ (Admin-Managed)</strong> ظˆظ„ط§ طھظ…ط«ظ„ ط¨ظٹط§ظ†ط§طھ ط´ط®طµظٹط© ظ„ظ„ظ…ط³طھط®ط¯ظ…طŒ ظ…ط«ظ„: ط§ظ„ط£ط®ط¨ط§ط±طŒ ط§ظ„ظˆط¸ط§ط¦ظپطŒ ط±ط³ط§ط¦ظ„ ط§ظ„ظٹظˆظ…طŒ ظ‚ظˆط§ظ„ط¨ ط§ظ„ط³طھظˆط±ظٹطŒ ظˆط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط§ظ„ظٹط© ط§ظ„ط­ظƒظˆظ…ظٹط© ط§ظ„طھظ‚ط¯ظٹط±ظٹط©. ظ‡ط°ظ‡ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ…ظڈط¯ط®ظ„ط© ظ…ظ† ظ‚ظگط¨ظ„ ط¥ط¯ط§ط±ط© ط§ظ„ظ…ظ†طµط© ظپظ‚ط·.
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">4. ط§ظ„ط´ظƒط§ظˆظ‰ ظˆط§ظ„طھظˆط§طµظ„</h3>
              <p className="text-muted-foreground">
                ط¹ظ†ط¯ ط¥ط±ط³ط§ظ„ظƒ ط´ظƒظˆظ‰ ط£ظˆ ط§ظ‚طھط±ط§ط­ ط£ظˆ ط±ط³ط§ظ„ط© طھظˆط§طµظ„طŒ ظٹطھظ… ط­ظپط¸ ظ‡ط°ظ‡ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظپظٹ ظ‚ط§ط¹ط¯ط© ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ظ†طµط©. ظ„ط§ طھظڈط´ط§ط±ظƒ ظ…ط¹ ط£ط·ط±ط§ظپ ط®ط§ط±ط¬ظٹط©.
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">5. ط­ظ‚ظˆظ‚ظƒ</h3>
              <p className="text-muted-foreground">
                ظٹظ…ظƒظ†ظƒ ظپظٹ ط£ظٹ ظˆظ‚طھ ظ…ط³ط­ ط¨ظٹط§ظ†ط§طھظƒ ط§ظ„ظ…ط­ظ„ظٹط© ظ…ظ† ط®ظ„ط§ظ„ ط®ظٹط§ط± "ظ…ط³ط­ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط­ظ„ظٹط©" ظپظٹ طµظپط­ط© ط­ط³ط§ط¨ظٹ. ظ„ظ„ط§ط³طھظپط³ط§ط± ط£ظˆ ط·ظ„ط¨ ط­ط°ظپ ط¨ظٹط§ظ†ط§طھ ظ…ظ† ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھطŒ طھظˆط§طµظ„ ظ…ط¹ظ†ط§ ط¹ط¨ط± ظ†ظ…ظˆط°ط¬ "ط§طھطµظ„ ط¨ظ†ط§".
              </p>
            </section>

          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}

