import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

// â”€â”€ Shared UI helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AuthPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center p-6 rtl max-w-[480px] mx-auto app-frame relative"
      style={{
        background: "radial-gradient(ellipse at top, hsl(36 28% 92%) 0%, hsl(36 22% 88%) 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(38 40% 60% / 0.12) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="w-full max-w-sm relative z-10">{children}</div>
    </div>
  );
}

function AuthHeader({ subtitle }: { subtitle: string }) {
  return (
    <div
      className="rounded-t-3xl px-6 py-6 text-center"
      style={{
        background: "linear-gradient(160deg, hsl(22 72% 16%) 0%, hsl(16 72% 12%) 60%, hsl(22 62% 14%) 100%)",
        borderTop: "1px solid hsl(38 65% 38% / 0.4)",
        borderLeft: "1px solid hsl(38 65% 38% / 0.4)",
        borderRight: "1px solid hsl(38 65% 38% / 0.4)",
      }}
    >
      <div className="flex items-center gap-2 justify-center mb-3">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(38 55% 42% / 0.5))" }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ background: "hsl(38 72% 55%)" }} />
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, hsl(38 55% 42% / 0.5), transparent)" }} />
      </div>
      <h1 className="text-2xl font-extrabold tracking-wider mb-1" style={{ color: "hsl(38 85% 82%)" }}>
        ظ…ظˆط§ط¹ظٹط¯ظƒ
      </h1>
      <p className="text-[12px] font-semibold" style={{ color: "hsl(38 55% 58%)" }}>
        {subtitle}
      </p>
    </div>
  );
}

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();

  type Phase = "loading" | "form" | "success" | "error" | "invalid";
  const [phase, setPhase] = useState<Phase>("loading");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const mountedRef = useRef(true);
  const safetyTimerRef = useRef<number>(0);

  // Listen for PASSWORD_RECOVERY event from Supabase (triggered by URL hash token)
  useEffect(() => {
    mountedRef.current = true;

    if (!isSupabaseEnabled || !supabase) {
      setPhase("invalid");
      return;
    }

    // Supabase detectSessionInUrl:true automatically exchanges the token in URL hash
    // onAuthStateChange fires PASSWORD_RECOVERY when the recovery token is present
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!mountedRef.current) return;
      if (event === "PASSWORD_RECOVERY") {
        clearTimeout(safetyTimerRef.current);
        setPhase("form");
      } else if (event === "INITIAL_SESSION") {
        // No recovery event on INITIAL_SESSION means the link may be invalid
        // Safety timeout handles this case
      }
    });

    // Safety timeout â€” if no PASSWORD_RECOVERY event fires in 5s, assume invalid link
    safetyTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) setPhase("invalid");
    }, 5000);

    return () => {
      mountedRef.current = false;
      clearTimeout(safetyTimerRef.current);
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);

    if (newPassword !== confirmPassword) {
      setSubmitError("ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظˆطھط£ظƒظٹط¯ظ‡ط§ ط؛ظٹط± ظ…طھط·ط§ط¨ظ‚طھط§ظ†");
      return;
    }
    if (newPassword.length < 8) {
      setSubmitError("ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظٹط¬ط¨ ط£ظ† طھظƒظˆظ† 8 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„");
      return;
    }

    setSubmitting(true);
    try {
      if (!supabase) {
        setSubmitError("ط§ظ„ط®ط¯ظ…ط© ط؛ظٹط± ظ…طھط§ط­ط© ط­ط§ظ„ظٹط§ظ‹");
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setSubmitError(translateUpdateError(error));
        return;
      }
      if (mountedRef.current) {
        setPhase("success");
        // Sign out after password change so user logs in fresh
        setTimeout(() => {
          void supabase!.auth.signOut();
        }, 2000);
      }
    } catch {
      if (mountedRef.current) setSubmitError("طھط¹ط°ط± طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±طŒ ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰");
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  return (
    <AuthPageWrapper>
      <AuthHeader subtitle="طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±" />
      <div
        className="rounded-b-3xl px-6 py-8 shadow-xl"
        style={{
          background: "linear-gradient(145deg, #FFFBF4 0%, hsl(36 28% 93%) 100%)",
          border: "1px solid hsl(38 55% 72% / 0.55)",
          borderTop: "none",
          boxShadow: "0 8px 30px -4px rgba(80,40,10,0.20)",
        }}
      >
        {phase === "loading" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(38 60% 48%)" }} />
            <p className="text-[12px] text-center" style={{ color: "hsl(22 30% 45%)" }}>
              ط¬ط§ط±ظچ ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ط±ط§ط¨ط·â€¦
            </p>
          </div>
        )}

        {phase === "invalid" && (
          <div className="text-center space-y-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{
                background: "hsl(10 55% 48% / 0.12)",
                border: "1.5px solid hsl(10 55% 48% / 0.3)",
              }}
            >
              <AlertTriangle className="w-6 h-6" style={{ color: "hsl(10 50% 45%)" }} />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1" style={{ color: "hsl(22 45% 28%)" }}>
                ط§ظ„ط±ط§ط¨ط· ط؛ظٹط± طµط§ظ„ط­
              </h3>
              <p className="text-[12px] leading-relaxed" style={{ color: "hsl(22 30% 45%)" }}>
                ط±ط§ط¨ط· ط§ظ„ط§ط³طھط¹ط§ط¯ط© ط؛ظٹط± طµط§ظ„ط­ ط£ظˆ ط§ظ†طھظ‡طھ طµظ„ط§ط­ظٹطھظ‡.
                <br />
                ظٹط±ط¬ظ‰ ط·ظ„ط¨ ط±ط§ط¨ط· ط¬ط¯ظٹط¯ ظ…ظ† طµظپط­ط© طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLocation("/login")}
              className="w-full h-11 rounded-xl font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, hsl(38 72% 48%) 0%, hsl(32 68% 40%) 100%)",
                color: "#fff",
                boxShadow: "0 4px 14px hsl(38 72% 52% / 0.30)",
              }}
            >
              ط§ظ„ط¹ظˆط¯ط© ظ„طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„
            </button>
          </div>
        )}

        {phase === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-[12px] text-center" style={{ color: "hsl(22 30% 45%)" }}>
              ط£ط¯ط®ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط© ظ„ط­ط³ط§ط¨ظƒ
            </p>

            <div className="space-y-2">
              <Label className="text-sm font-bold" style={{ color: "hsl(22 45% 30%)" }}>
                ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط©
              </Label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                dir="ltr"
                className="w-full h-12 rounded-xl text-sm px-3 outline-none transition-all"
                style={{ background: "#fff", border: "1.5px solid hsl(38 45% 72% / 0.7)" }}
                autoComplete="new-password"
                placeholder="8 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold" style={{ color: "hsl(22 45% 30%)" }}>
                طھط£ظƒظٹط¯ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±
              </Label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                dir="ltr"
                className="w-full h-12 rounded-xl text-sm px-3 outline-none transition-all"
                style={{ background: "#fff", border: "1.5px solid hsl(38 45% 72% / 0.7)" }}
                autoComplete="new-password"
                placeholder="ط£ط¹ط¯ ظƒطھط§ط¨ط© ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±"
                required
              />
            </div>

            {submitError && (
              <div
                className="px-4 py-3 rounded-xl text-[12px] font-semibold text-center"
                style={{
                  background: "hsl(10 55% 52% / 0.10)",
                  border: "1px solid hsl(10 55% 52% / 0.25)",
                  color: "hsl(10 50% 42%)",
                }}
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{
                background: submitting
                  ? "hsl(38 50% 52%)"
                  : "linear-gradient(135deg, hsl(38 72% 48%) 0%, hsl(32 68% 40%) 100%)",
                boxShadow: "0 4px 14px hsl(38 72% 52% / 0.35)",
                color: "#fff",
                border: "none",
              }}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±
            </button>
          </form>
        )}

        {phase === "success" && (
          <div className="text-center space-y-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{
                background: "hsl(130 45% 45% / 0.12)",
                border: "1.5px solid hsl(130 45% 45% / 0.3)",
              }}
            >
              <CheckCircle2 className="w-6 h-6" style={{ color: "hsl(130 40% 40%)" }} />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1" style={{ color: "hsl(22 45% 28%)" }}>
                طھظ… طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±
              </h3>
              <p className="text-[12px] leading-relaxed" style={{ color: "hsl(22 30% 45%)" }}>
                طھظ… طھط؛ظٹظٹط± ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط¨ظ†ط¬ط§ط­. ظٹظ…ظƒظ†ظƒ ط§ظ„ط¢ظ† طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ط¨ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط©.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLocation("/login")}
              className="w-full h-11 rounded-xl font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, hsl(38 72% 48%) 0%, hsl(32 68% 40%) 100%)",
                color: "#fff",
                boxShadow: "0 4px 14px hsl(38 72% 52% / 0.30)",
              }}
            >
              طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„
            </button>
          </div>
        )}
      </div>
    </AuthPageWrapper>
  );
}

function translateUpdateError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/weak.*password|at least/i.test(msg)) return "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط¶ط¹ظٹظپط©طŒ ط§ط³طھط®ط¯ظ… 8 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„";
  if (/same.*password/i.test(msg)) return "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط© ظٹط¬ط¨ ط£ظ† طھط®طھظ„ظپ ط¹ظ† ط§ظ„ظ‚ط¯ظٹظ…ط©";
  if (/fetch|network|ERR_/i.test(msg)) return "طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط­ط§ظ„ظٹط§ظ‹طŒ ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰";
  return "طھط¹ط°ط± طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±طŒ ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰";
}

