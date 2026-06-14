import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <AppShell title="ط´ط±ظˆط· ط§ظ„ط§ط³طھط®ط¯ط§ظ…" hideNav showBack>
      <div className="space-y-4 pb-6">

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">ط´ط±ظˆط· ط§ظ„ط§ط³طھط®ط¯ط§ظ…</h2>
            <p className="text-xs text-muted-foreground">ظ…ط³ظˆط¯ط© طھط´ط؛ظٹظ„ظٹط© â€” طھط­طھط§ط¬ ظ…ط±ط§ط¬ط¹ط© ظ‚ط§ظ†ظˆظ†ظٹط© ظ‚ط¨ظ„ ط§ظ„ط¥ط·ظ„ط§ظ‚ ط§ظ„طھط¬ط§ط±ظٹ</p>
          </div>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              ظ‡ط°ظ‡ ط§ظ„ط´ط±ظˆط· ظ…ط³ظˆط¯ط© طھط´ط؛ظٹظ„ظٹط© ط£ظˆظ„ظٹط©. ظ„ط§ طھظڈط¹طھط¨ط± ط¹ظ‚ط¯ط§ظ‹ ظ‚ط§ظ†ظˆظ†ظٹط§ظ‹ ظ†ظ‡ط§ط¦ظٹط§ظ‹. ط§ظ„ط¥ط·ظ„ط§ظ‚ ط§ظ„طھط¬ط§ط±ظٹ ط§ظ„ظƒط§ظ…ظ„ ظٹط³طھظ„ط²ظ… ظ…ط±ط§ط¬ط¹ط© ظ‚ط§ظ†ظˆظ†ظٹط© ظ…طھط®طµطµط© ظˆظ…ظˆط§ظپظ‚ط© ط°ط§طھ ط§ط®طھطµط§طµ.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-5 text-sm leading-relaxed">

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">1. ط·ط¨ظٹط¹ط© ط§ظ„طھط·ط¨ظٹظ‚</h3>
              <p className="text-muted-foreground">
                "ظ…ظˆط§ط¹ظٹط¯ظƒ" ظ…ظ†طµط© ظ…ط³ط§ط¹ط¯ ظٹظˆظ…ظٹ ط´ط®طµظٹ ط³ط¹ظˆط¯ظٹط©طŒ طھظ‚ط¯ظ… ط®ط¯ظ…ط§طھ طھظ†ط¸ظٹظ… ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ظˆط§ظ„ط­ط§ط³ط¨ط§طھ ط§ظ„ظ…ط§ظ„ظٹط© ط§ظ„طھظ‚ط¯ظٹط±ظٹط© ظˆظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ظˆط§ظ„ط£ط®ط¨ط§ط± ظˆط§ظ„ط®ط¯ظ…ط§طھ ط§ظ„ظٹظˆظ…ظٹط©. طھط³ط¹ظ‰ ط§ظ„ظ…ظ†طµط© ط¥ظ„ظ‰ طھظ‚ط¯ظٹظ… طھط¬ط±ط¨ط© ظ…ظˆط«ظˆظ‚ط© ظˆظ…ط³طھظ…ط±ط© ظ„ط¬ظ…ظٹط¹ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†.
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">2. ط­ط¯ظˆط¯ ط§ظ„ظ…ط³ط¤ظˆظ„ظٹط©</h3>
              <p className="text-muted-foreground">
                ظ„ط§ طھطھط­ظ…ظ„ ظ…ظ†طµط© "ظ…ظˆط§ط¹ظٹط¯ظƒ" ط£ظٹ ظ…ط³ط¤ظˆظ„ظٹط© ظ‚ط§ظ†ظˆظ†ظٹط© ط£ظˆ ظ…ط§ظ„ظٹط© ط¹ظ†:
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                <li>ظ‚ط±ط§ط±ط§طھ ظ…ط§ظ„ظٹط© طھظڈطھط®ط° ط¨ظ†ط§ط،ظ‹ ط¹ظ„ظ‰ ط§ظ„ط­ط§ط³ط¨ط§طھ ط§ظ„طھظ‚ط¯ظٹط±ظٹط© ظپظٹ ط§ظ„طھط·ط¨ظٹظ‚</li>
                <li>ط§ظ„ط§ط¹طھظ…ط§ط¯ ط¹ظ„ظ‰ ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ط¯ظˆظ† ظ…ط±ط§ط¬ط¹ط© ط§ظ„ظ…طµط¯ط± ط§ظ„ط±ط³ظ…ظٹ</li>
                <li>ط¯ظ‚ط© ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ط¹ظ… ط§ظ„ط­ظƒظˆظ…ظٹ ط£ظˆ ط§ظ„ط±ظˆط§طھط¨ ط§ظ„ظ…ط¹ط±ظˆط¶ط© (طھظ‚ط¯ظٹط±ظٹط© ظˆظ„ظٹط³طھ ط±ط³ظ…ظٹط©)</li>
                <li>ظ…ط­طھظˆظ‰ ط§ظ„ط£ط®ط¨ط§ط± ظˆط§ظ„ظˆط¸ط§ط¦ظپ ط§ظ„ظ…ظڈط¯ط§ط± ط¥ط¯ط§ط±ظٹط§ظ‹</li>
                <li>ظپظ‚ط¯ط§ظ† ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط­ظ„ظٹط© ظ†طھظٹط¬ط© ظ…ط³ط­ ط§ظ„ظ…طھطµظپط­ ط£ظˆ ط§ظ„ط¬ظ‡ط§ط²</li>
              </ul>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">3. ط¨ظٹط§ظ†ط§طھ ط§ظ„ط§ط³طھط®ط¯ط§ظ…</h3>
              <p className="text-muted-foreground">
                ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„طھظٹ طھظڈط¯ط®ظ„ظ‡ط§ ظپظٹ ط§ظ„طھط·ط¨ظٹظ‚ ظ‡ظٹ ظ…ظ„ظƒظٹطھظƒ ط§ظ„ط´ط®طµظٹط©. طھظڈط­ظپط¸ ظ…ط­ظ„ظٹط§ظ‹ ط¹ظ„ظ‰ ط¬ظ‡ط§ط²ظƒ ظ…ط§ ظ„ظ… طھظƒظ† ط¨ظٹط§ظ†ط§طھ طھظˆط§طµظ„ ط£ظˆ ط´ظƒط§ظˆظ‰ طھظڈط±ط³ظ„ ظ„ظ„ظ…ظ†طµط©. طھط³طھط®ط¯ظ… ط§ظ„ظ…ظ†طµط© ط¨ظٹط§ظ†ط§طھ ط¥ط¯ط§ط±ظٹط© (ط±ط³ط§ط¦ظ„ ط§ظ„ظٹظˆظ…طŒ ط§ظ„ط£ط®ط¨ط§ط±طŒ ط§ظ„ظˆط¸ط§ط¦ظپطŒ ط§ظ„ط«ظٹظ…ط§طھ) ظ…ظڈط¯ط®ظ„ط© ظ…ظ† ط§ظ„ط¥ط¯ط§ط±ط© ظپظ‚ط· ظˆظ„ط§ طھظ…ط«ظ„ ط¨ظٹط§ظ†ط§طھ ظ…ط³طھط®ط¯ظ….
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">4. ط§ظ„ط§ط³طھط®ط¯ط§ظ… ط§ظ„ظ…ط³ظ…ظˆط­</h3>
              <p className="text-muted-foreground">
                ظٹظڈط®طµطµ ظ‡ط°ط§ ط§ظ„طھط·ط¨ظٹظ‚ ظ„ظ„ط§ط³طھط®ط¯ط§ظ… ط§ظ„ط´ط®طµظٹ ظˆط؛ظٹط± ط§ظ„طھط¬ط§ط±ظٹ ظپظ‚ط·. ظٹظڈظ…ظ†ط¹ ط¥ط¹ط§ط¯ط© ظ†ط´ط± ظ…ط­طھظˆظ‰ ط§ظ„ظ…ظ†طµط© ط£ظˆ ط§ط³طھط®ط¯ط§ظ…ظ‡ط§ ط¨طµظˆط±ط© طھط¬ط§ط±ظٹط© ط¯ظˆظ† ط¥ط°ظ† طµط±ظٹط­.
              </p>
            </section>

            <div className="h-px bg-border" />

            <section>
              <h3 className="font-bold text-base text-foreground mb-2">5. ط§ظ„طھط؛ظٹظٹط±ط§طھ</h3>
              <p className="text-muted-foreground">
                ظ‚ط¯ طھطھط؛ظٹط± ظ‡ط°ظ‡ ط§ظ„ط´ط±ظˆط· ظ…ط¹ طھط·ظˆط± ط§ظ„ظ…ظ†طµط©. ط§ظ„ط§ط³طھظ…ط±ط§ط± ظپظٹ ط§ط³طھط®ط¯ط§ظ… ط§ظ„طھط·ط¨ظٹظ‚ ظٹظڈط¹ط¯ظ‘ ظ…ظˆط§ظپظ‚ط©ظ‹ ط¹ظ„ظ‰ ط§ظ„ط´ط±ظˆط· ط§ظ„ظ…ط­ط¯ظ‘ط«ط©.
              </p>
            </section>

          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}

