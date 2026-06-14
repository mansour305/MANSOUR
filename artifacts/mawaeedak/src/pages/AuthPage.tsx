import { type FormEvent, type ReactNode, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MawaeedakLogo } from "@/components/layout/TopBar";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { useStore } from "@/hooks/useStore";
import { authSignIn } from "@/lib/auth";

export type AuthMode = "login" | "signup" | "forgot";

const SUBMIT_TIMEOUT_MS = 8000;
const BROWN = "#8A6B3D";
const INK = "#2F2B25";

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`TIMEOUT:${label}`)), ms)),
  ]);
}

function translateLoginError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.startsWith("TIMEOUT:")) return "ط§ظ†طھظ‡طھ ظ…ظ‡ظ„ط© طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„طŒ طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ط§طھطµط§ظ„ ظˆط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰";
  if (/invalid.*credentials|wrong.*password|Invalid login/i.test(msg)) return "ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ط®ظˆظ„ ط؛ظٹط± طµط­ظٹط­ط©";
  if (/email.*confirm|not confirmed/i.test(msg)) return "ظٹط±ط¬ظ‰ طھط£ظƒظٹط¯ ط¨ط±ظٹط¯ظƒ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ ط£ظˆظ„ط§ظ‹";
  if (/fetch|network|Failed to fetch|ERR_/i.test(msg)) return "طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط­ط§ظ„ظٹط§ظ‹طŒ ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰";
  return "ط­ط¯ط« ط®ط·ط£ ظپظٹ طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„طŒ ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰";
}

function translateSignupError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/already registered|already exists|already in use/i.test(msg)) return "ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ ظ…ط³ط¬ظ„ ظ…ط³ط¨ظ‚ط§ظ‹";
  if (/weak.*password|Password.*short|at least/i.test(msg)) return "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط¶ط¹ظٹظپط©طŒ ط§ط³طھط®ط¯ظ… 8 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„";
  if (/invalid.*email/i.test(msg)) return "طµظٹط؛ط© ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ ط؛ظٹط± طµط­ظٹط­ط©";
  if (/fetch|network|ERR_/i.test(msg)) return "طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط­ط§ظ„ظٹط§ظ‹طŒ ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰";
  return "طھط¹ط°ط± ط¥ظ†ط´ط§ط، ط§ظ„ط­ط³ط§ط¨طŒ ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰";
}

function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main
      dir="rtl"
      className="relative mx-auto flex min-h-[100dvh] max-w-[480px] flex-col overflow-hidden px-6 py-8 font-sans"
      style={{
        color: INK,
        background:
          "radial-gradient(circle at 12% 7%, rgba(201,160,99,0.20), transparent 28%), linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 42%, #F3E8D6 100%)",
      }}
    >
      <div aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-[#FAF7F2]/85 to-[#FAF7F2]" />
      <section className="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col justify-center">{children}</section>
    </main>
  );
}

function BrandHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-8 text-center">
      <div className="mb-4 flex justify-center">
        <MawaeedakLogo compact={false} />
      </div>
      <h1 className="text-[28px] font-black leading-tight" style={{ color: INK }}>{title}</h1>
      <p className="mt-2 text-sm font-semibold" style={{ color: "#6B6258" }}>{subtitle}</p>
      <div className="mx-auto mt-5 flex w-32 items-center gap-3">
        <span className="h-px flex-1 bg-[#C9A063]/35" />
        <span className="h-2 w-2 rotate-45 bg-[#C9A063]" />
        <span className="h-px flex-1 bg-[#C9A063]/35" />
      </div>
    </header>
  );
}

function FieldShell({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-14 items-center gap-3 rounded-2xl border border-[#E4D4BB] bg-white/85 px-4 shadow-[0_12px_34px_rgba(138,107,61,0.08)]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3E8D6] text-[#8A6B3D]">{icon}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

const inputClass =
  "h-10 border-0 bg-transparent p-0 text-right text-[13px] font-semibold text-[#2F2B25] placeholder:text-[#8A8177] focus-visible:ring-0 focus-visible:ring-offset-0";

function PrimaryButton({ children, loading }: { children: ReactNode; loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-extrabold text-white shadow-[0_18px_34px_rgba(201,160,99,0.28)] transition active:scale-[0.99] disabled:opacity-60"
      style={{ background: "linear-gradient(135deg, #C9A063 0%, #B78536 100%)" }}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-14 w-full rounded-2xl border border-[#C9A063]/65 bg-white/70 text-base font-extrabold transition active:scale-[0.99]"
      style={{ color: INK }}
    >
      {children}
    </button>
  );
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const [, setLocation] = useLocation();
  const { setUser } = useStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPwd, setSignupPwd] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupTerms, setSignupTerms] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setLoginError(null);
    setSubmitting(true);

    try {
      const result = await authSignIn(identifier.trim(), password);
      
      if (!result.success) {
        setLoginError(result.error || "ط®ط·ط£ ظپظٹ طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„");
        setSubmitting(false);
        return;
      }

      // Auth succeeded â€” update useStore immediately
      setUser({
        id: "demo-admin",
        name: "ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ…",
        email: "demo@mawaeedak.local",
        city: "ط§ظ„ط±ظٹط§ط¶",
        cityKey: "riyadh",
        timezone: "Asia/Riyadh",
        role: "admin",
        onboardingComplete: true,
        interests: [],
      });
      
      setLocation("/");
    } catch (err) {
      setLoginError(translateLoginError(err));
    } finally {
      setSubmitting(false);
      setPassword("");
    }
  };

  const handleSignupSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (signupLoading) return;
    setSignupError(null);

    if (!signupName.trim()) {
      setSignupError("ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ظ„ط§ط³ظ…");
      return;
    }
    if (signupPwd !== signupConfirm) {
      setSignupError("ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظˆطھط£ظƒظٹط¯ظ‡ط§ ط؛ظٹط± ظ…طھط·ط§ط¨ظ‚طھظٹظ†");
      return;
    }
    if (signupPwd.length < 8) {
      setSignupError("ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظٹط¬ط¨ ط£ظ† طھظƒظˆظ† 8 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„");
      return;
    }
    if (!signupTerms) {
      setSignupError("ظٹط¬ط¨ ط§ظ„ظ…ظˆط§ظپظ‚ط© ط¹ظ„ظ‰ ط§ظ„ط´ط±ظˆط· ظˆط³ظٹط§ط³ط© ط§ظ„ط®طµظˆطµظٹط©");
      return;
    }

    if (!isSupabaseEnabled) {
      setSignupError("ط¥ظ†ط´ط§ط، ط§ظ„ط­ط³ط§ط¨ ظٹطھط·ظ„ط¨ ط¥ط¹ط¯ط§ط¯ Supabase ظپظٹ ط¨ظٹط¦ط© ط§ظ„ط¥ظ†طھط§ط¬.\nظٹظڈط±ط¬ظ‰ ط§ظ„طھظˆط§طµظ„ ظ…ط¹ ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ….");
      setSignupLoading(false);
      return;
    }

    setSignupLoading(true);
    try {
      const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "/auth/callback";
      const { error } = await supabase!.auth.signUp({
        email: signupEmail.trim(),
        password: signupPwd,
        options: {
          emailRedirectTo,
          data: { role: "user", name: signupName.trim() },
        },
      });

      if (error) {
        setSignupError(translateSignupError(error));
        return;
      }
      setSignupSuccess(true);
    } catch (err) {
      setSignupError(translateSignupError(err));
    } finally {
      setSignupLoading(false);
    }
  };

  const handleForgotSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (forgotLoading) return;
    setForgotLoading(true);
    try {
      if (supabase) {
        const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : "/reset-password";
        await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), { redirectTo });
      }
      setForgotSent(true);
    } finally {
      setForgotLoading(false);
    }
  };

  if (mode === "signup") {
    return (
      <AuthFrame>
        <BrandHeader title="ط¥ظ†ط´ط§ط، ط­ط³ط§ط¨ ط¬ط¯ظٹط¯" subtitle="ط§ط¨ط¯ط£ طھظ†ط¸ظٹظ… ظ…ظˆط§ط¹ظٹط¯ظƒ ط¨ظ‡ظˆظٹط© ظˆط§ط­ط¯ط©" />
        <div className="rounded-[28px] border border-[#E4D4BB] bg-white/70 p-5 shadow-[0_24px_60px_rgba(138,107,61,0.14)] backdrop-blur">
          {signupSuccess ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F3E8D6] text-[#8A6B3D]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-sm font-semibold leading-7 text-[#5F574E]">
                طھظ… ط¥ظ†ط´ط§ط، ط­ط³ط§ط¨ظƒ. ظپط¹ظ‘ظ„ ط¨ط±ظٹط¯ظƒ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ ط«ظ… ط³ط¬ظ„ ط§ظ„ط¯ط®ظˆظ„ ظ„ظ„ظ…طھط§ط¨ط¹ط©.
              </p>
              <SecondaryButton onClick={() => setLocation("/login")}>ط§ظ„ط¹ظˆط¯ط© ظ„طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„</SecondaryButton>
            </div>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <FieldShell icon={<User className="h-5 w-5" />}>
                <Input className={inputClass} value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="ط§ظ„ط§ط³ظ… ط§ظ„ظƒط§ظ…ظ„" required />
              </FieldShell>
              <FieldShell icon={<Mail className="h-5 w-5" />}>
                <Input className={inputClass} dir="ltr" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="name@example.com" required />
              </FieldShell>
              <FieldShell icon={<Lock className="h-5 w-5" />}>
                <Input className={inputClass} dir="ltr" type="password" value={signupPwd} onChange={(e) => setSignupPwd(e.target.value)} placeholder="ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±" required />
              </FieldShell>
              <FieldShell icon={<Lock className="h-5 w-5" />}>
                <Input className={inputClass} dir="ltr" type="password" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} placeholder="طھط£ظƒظٹط¯ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±" required />
              </FieldShell>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-[#FAF7F2] p-3 text-xs font-semibold leading-6 text-[#6B6258]">
                <input type="checkbox" checked={signupTerms} onChange={(e) => setSignupTerms(e.target.checked)} className="mt-1" />
                <span>ط£ظˆط§ظپظ‚ ط¹ظ„ظ‰ ط§ظ„ط´ط±ظˆط· ظˆط§ظ„ط£ط­ظƒط§ظ… ظˆط³ظٹط§ط³ط© ط§ظ„ط®طµظˆطµظٹط©</span>
              </label>
              {signupError ? <p className="text-center text-xs font-bold text-red-600">{signupError}</p> : null}
              <PrimaryButton loading={signupLoading}>ط¥ظ†ط´ط§ط، ط§ظ„ط­ط³ط§ط¨</PrimaryButton>
              <SecondaryButton onClick={() => setLocation("/login")}>ظ„ط¯ظٹ ط­ط³ط§ط¨ ط¨ط§ظ„ظپط¹ظ„</SecondaryButton>
            </form>
          )}
        </div>
      </AuthFrame>
    );
  }

  if (mode === "forgot") {
    return (
      <AuthFrame>
        <BrandHeader title="ط§ط³طھط¹ط§ط¯ط© ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±" subtitle="ط³ظ†ط±ط³ظ„ ظ„ظƒ ط±ط§ط¨ط·ط§ظ‹ ط¢ظ…ظ†ط§ظ‹ ظ„ط¥ط¹ط§ط¯ط© ط§ظ„طھط¹ظٹظٹظ†" />
        <div className="rounded-[28px] border border-[#E4D4BB] bg-white/70 p-5 shadow-[0_24px_60px_rgba(138,107,61,0.14)] backdrop-blur">
          {forgotSent ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F3E8D6] text-[#8A6B3D]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-sm font-semibold leading-7 text-[#5F574E]">
                ط¥ط°ط§ ظƒط§ظ† ط§ظ„ط¨ط±ظٹط¯ ظ…ط³ط¬ظ„ط§ظ‹ ظ„ط¯ظٹظ†ط§ ظپط³طھطµظ„ظƒ ط±ط³ط§ظ„ط© ط¨ط®ط·ظˆط§طھ ط¥ط¹ط§ط¯ط© طھط¹ظٹظٹظ† ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±.
              </p>
              <SecondaryButton onClick={() => setLocation("/login")}>ط§ظ„ط¹ظˆط¯ط© ظ„طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„</SecondaryButton>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <FieldShell icon={<Mail className="h-5 w-5" />}>
                <Input className={inputClass} dir="ltr" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="name@example.com" required />
              </FieldShell>
              <PrimaryButton loading={forgotLoading}>ط¥ط±ط³ط§ظ„ ط±ط§ط¨ط· ط§ظ„ط§ط³طھط¹ط§ط¯ط©</PrimaryButton>
              <SecondaryButton onClick={() => setLocation("/login")}>ط§ظ„ط¹ظˆط¯ط© ظ„طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„</SecondaryButton>
            </form>
          )}
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame>
      <BrandHeader title="ظ…ط±ط­ط¨ط§ظ‹ ط¨ظƒ ظپظٹ ظ…ظˆط§ط¹ظٹط¯ظƒ" subtitle="ط³ط¬ظ„ ط¯ط®ظˆظ„ظƒ ظ„ظ„ظ…طھط§ط¨ط¹ط©" />
      <form onSubmit={handleLoginSubmit} className="rounded-[28px] border border-[#E4D4BB] bg-white/70 p-5 shadow-[0_24px_60px_rgba(138,107,61,0.14)] backdrop-blur">
        <div className="space-y-4">
          <FieldShell icon={<User className="h-5 w-5" />}>
            <Input
              className={inputClass}
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ط£ظˆ ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ / ط±ظ‚ظ… ط§ظ„ط¬ظˆط§ظ„ ط£ظˆ ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ"
              required
            />
          </FieldShell>

          <FieldShell icon={<Lock className="h-5 w-5" />}>
            <div className="flex items-center gap-2">
              <Input
                className={inputClass}
                dir="ltr"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8A8177]"
                aria-label={showPassword ? "ط¥ط®ظپط§ط، ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±" : "ط¥ط¸ظ‡ط§ط± ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </FieldShell>

          <div className="flex items-center justify-between text-xs font-bold">
            <button type="button" onClick={() => setLocation("/forgot-password")} style={{ color: BROWN }}>
              ظ†ط³ظٹطھ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±طں
            </button>
            <label className="flex cursor-pointer items-center gap-2 text-[#5F574E]">
              <span>طھط°ظƒط±ظ†ظٹ</span>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            </label>
          </div>

          {loginError ? <p className="text-center text-xs font-bold text-red-600">{loginError}</p> : null}

          <PrimaryButton loading={submitting}>طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„</PrimaryButton>
          <SecondaryButton onClick={() => setLocation("/register")}>ط¥ظ†ط´ط§ط، ط­ط³ط§ط¨ ط¬ط¯ظٹط¯</SecondaryButton>
        </div>
      </form>

      <footer className="relative mt-8 rounded-[28px] border border-[#E4D4BB] bg-[#FAF7F2]/80 p-4 text-center shadow-[0_14px_36px_rgba(138,107,61,0.08)]">
        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#8A6B3D]">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <p className="text-[11px] font-semibold leading-6 text-[#6B6258]">
          ط¨ظٹط§ظ†ط§طھظƒ ظ…ط­ظ…ظٹط© ط¨ط§ظ„ظƒط§ظ…ظ„ ظˆظپظ‚ ط£ط¹ظ„ظ‰ ظ…ط¹ط§ظٹظٹط± ط§ظ„ط£ظ…ط§ظ†
        </p>
      </footer>
    </AuthFrame>
  );
}

