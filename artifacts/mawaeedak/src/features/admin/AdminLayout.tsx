import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Bell,
  BookOpen,
  Calendar,
  Database,
  FileText,
  Headphones,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Paintbrush,
  Settings,
  Shield,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import desertHeroImg from "@assets/desert-hero.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type AuthSession } from "@/lib/auth";
import { isSupabaseEnabled, supabase } from "@/lib/supabase";

const ALLOWED_ROLES = ["admin", "super_admin"] as const;
const LOGIN_SUBMIT_TIMEOUT_MS = 8000;

type AdminRole = (typeof ALLOWED_ROLES)[number];
type AdminAuthPhase = "checking" | "login" | "ready" | "access_denied";

type SupabaseUserLike = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(`TIMEOUT:${label}`)), ms);
    }),
  ]);
}

function normalizeRole(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "user";
}

function isAllowedRole(role: string): role is AdminRole {
  return ALLOWED_ROLES.includes(role as AdminRole);
}

function hasAdminAccess(session: AuthSession | null): boolean {
  if (!session) return false;
  return isAllowedRole(normalizeRole(session.user.role));
}

function buildAuthSession(user: SupabaseUserLike): AuthSession {
  const role = normalizeRole(user.app_metadata?.role) as AuthSession["user"]["role"];
  const displayName =
    (typeof user.user_metadata?.display_name === "string" && user.user_metadata.display_name) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    user.email?.split("@")[0] ||
    "مدير";

  return {
    user: {
      id: user.id,
      email: user.email,
      role,
      displayName,
    },
    isDemo: false,
  };
}

function translateLoginError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.startsWith("TIMEOUT:")) return "انتهت مهلة تسجيل الدخول، تحقق من الاتصال وحاول مرة أخرى";
  if (/invalid.*credentials|wrong.*password|Invalid login/i.test(msg)) return "بيانات الدخول غير صحيحة";
  if (/email.*confirm|not confirmed/i.test(msg)) return "يرجى تأكيد بريدك الإلكتروني أولاً";
  if (/fetch|network|Failed to fetch|ERR_/i.test(msg)) return "تعذر الاتصال حالياً، حاول مرة أخرى";
  return "حدث خطأ في تسجيل الدخول، حاول مرة أخرى";
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center p-4 rtl relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FDF9F3 0%, #F3E8D6 50%, #EDE3D0 100%)" }}
    >
      {/* Saudi architecture pattern - left background */}
      <div 
        className="absolute left-0 top-0 w-3/5 h-full opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url(${desertHeroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center left",
        }}
      />
      
      {/* Palm decorations - right edge */}
      <div className="absolute top-0 right-0 w-32 h-40 opacity-[0.06] pointer-events-none" style={{
        background: "radial-gradient(ellipse at 90% 10%, #C9A063 0%, transparent 60%)",
      }} />
      <div className="absolute bottom-0 right-0 w-40 h-48 opacity-[0.05] pointer-events-none" style={{
        background: "radial-gradient(ellipse at 85% 90%, #C9A063 0%, transparent 55%)",
      }} />
      
      {/* Palm decorations - left edge */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-[0.05] pointer-events-none" style={{
        background: "radial-gradient(ellipse at 10% 5%, #C9A063 0%, transparent 60%)",
      }} />
      
      {/* Golden lantern - bottom left */}
      <div className="absolute bottom-8 left-8 text-4xl opacity-30 pointer-events-none" style={{ color: "#C9A063" }}>
        <svg width="48" height="64" viewBox="0 0 48 64" fill="currentColor">
          <path d="M24 0L28 8H20L24 0Z" fill="currentColor"/>
          <rect x="18" y="8" width="12" height="4" rx="1" fill="currentColor"/>
          <path d="M16 12H32V48C32 52 28 56 24 56C20 56 16 52 16 48V12Z" fill="currentColor" opacity="0.9"/>
          <rect x="20" y="16" width="8" height="28" rx="2" fill="#FDF9F3" opacity="0.3"/>
          <rect x="14" y="48" width="20" height="4" rx="1" fill="currentColor"/>
          <rect x="12" y="52" width="24" height="6" rx="2" fill="currentColor"/>
          <rect x="20" y="58" width="8" height="4" rx="1" fill="currentColor"/>
        </svg>
      </div>

      {/* Central card */}
      <div 
        className="w-full max-w-[380px] relative z-10 rounded-[28px] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFFBF4 100%)",
          boxShadow: "0 25px 80px rgba(138,107,61,0.18), 0 8px 30px rgba(138,107,61,0.08)",
          border: "1px solid rgba(201,160,99,0.3)",
        }}
      >
        {/* Card header with logo */}
        <div className="px-8 py-10 text-center" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FAF5EE 100%)" }}>
          <div className="text-5xl mb-3" style={{ color: "#C9A063" }}>✦</div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: "#2F2B25" }}>
            مواعيدك
          </h1>
          <p className="text-sm font-medium mb-1" style={{ color: "#8A6B3D" }}>
            لوحة المالك والإدارة
          </p>
          <div className="h-[1px] w-32 mx-auto mt-4" style={{ background: "linear-gradient(90deg, transparent, #C9A063, transparent)" }} />
        </div>
        
        {/* Card content */}
        <div className="px-8 py-8" style={{ background: "#FFFBF4" }}>
          {children}
        </div>
        
        {/* Card footer */}
        <div className="px-8 py-4 text-center" style={{ background: "#F3E8D6" }}>
          <p className="text-xs opacity-60" style={{ color: "#6F6557" }}>
            © 2025 مواعيدك جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-xl text-[12px] font-semibold text-center"
      style={{
        background: "hsl(10 55% 52% / 0.10)",
        border: "1px solid hsl(10 55% 52% / 0.25)",
        color: "hsl(10 50% 42%)",
      }}
    >
      {message}
    </div>
  );
}

const navItems: NavItem[] = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/members", label: "المستخدمون", icon: Users },
  { href: "/admin/events", label: "المواعيد", icon: Calendar },
  { href: "/admin/financial", label: "الرواتب والدعم", icon: Wallet },
  { href: "/admin/official-financial", label: "الدعم الرسمي", icon: Wallet },
  { href: "/admin/official-prayer", label: "الصلاة الرسمية", icon: Calendar },
  { href: "/admin/messages", label: "رسائل اليوم", icon: MessageSquare },
  { href: "/admin/story", label: "ستوري اليوم", icon: ImageIcon },
  { href: "/admin/themes", label: "الثيمات", icon: Paintbrush },
  { href: "/admin/notifications", label: "الإشعارات", icon: Bell },
  { href: "/admin/news-jobs", label: "الأخبار والوظائف", icon: Newspaper },
  { href: "/admin/complaints", label: "الشكاوى", icon: MessageSquare },
  { href: "/admin/social", label: "التواصل والأتمتة", icon: Zap },
  { href: "/admin/reports", label: "التقارير", icon: FileText },
  { href: "/admin/permissions", label: "الصلاحيات", icon: Shield },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
  { href: "/admin/support", label: "الدعم والمساعدة", icon: Headphones },
  { href: "/admin/data-layer", label: "طبقة البيانات", icon: Database },
  { href: "/admin/automation", label: "الأتمتة", icon: Zap },
];

function AdminSidebar({ currentPath, onNavigate }: { currentPath: string; onNavigate?: () => void }) {
  return (
    <aside className="h-full flex flex-col gap-4 p-4" style={{ background: "hsl(36 35% 96%)" }}>
      <div className="px-3 py-4 rounded-2xl border" style={{ background: "#fff", borderColor: "hsl(38 45% 78%)" }}>
        <div className="font-extrabold text-xl" style={{ color: "hsl(35 45% 38%)" }}>مواعيدك</div>
        <div className="text-xs mt-1" style={{ color: "hsl(32 22% 42%)" }}>لوحة المالك</div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.href || (item.href !== "/admin" && currentPath.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <div
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors cursor-pointer"
                style={{
                  background: active ? "linear-gradient(135deg, hsl(38 62% 52%), hsl(32 55% 42%))" : "transparent",
                  color: active ? "#fff" : "hsl(24 22% 24%)",
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [phase, setPhase] = useState<AdminAuthPhase>("checking");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const mountedRef = useRef(true);
  const [location] = useLocation();

  const userLabel = useMemo(() => {
    return session?.user.displayName || session?.user.email || "مدير النظام";
  }, [session]);

  useEffect(() => {
    mountedRef.current = true;

    if (!isSupabaseEnabled || !supabase) {
      setSession(null);
      setPhase("login");
      return () => {
        mountedRef.current = false;
      };
    }

    const timeoutId = window.setTimeout(() => {
      if (mountedRef.current && phase === "checking") setPhase("login");
    }, 10000);

    void supabase.auth.getUser().then(({ data, error }) => {
      if (!mountedRef.current) return;
      window.clearTimeout(timeoutId);

      if (error || !data.user) {
        setSession(null);
        setPhase("login");
        return;
      }

      const nextSession = buildAuthSession(data.user);
      if (hasAdminAccess(nextSession)) {
        setSession(nextSession);
        setPhase("ready");
      } else {
        setSession(null);
        setPhase("access_denied");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sbSession) => {
      if (!mountedRef.current) return;

      const user = sbSession?.user;
      if (!user) {
        setSession(null);
        setPhase("login");
        return;
      }

      const nextSession = buildAuthSession(user);
      if (hasAdminAccess(nextSession)) {
        setSession(nextSession);
        setPhase("ready");
      } else {
        setSession(null);
        setPhase("access_denied");
      }
    });

    return () => {
      mountedRef.current = false;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [phase]);

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setLoginError(null);

    try {
      if (!isSupabaseEnabled || !supabase) {
        setLoginError("لوحة المالك تتطلب تفعيل Supabase Auth في بيئة الإنتاج");
        return;
      }

      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({ email: identifier.trim(), password }),
        LOGIN_SUBMIT_TIMEOUT_MS,
        "signIn"
      );

      if (error) {
        setLoginError(translateLoginError(error));
        return;
      }

      const { data, error: userError } = await withTimeout(supabase.auth.getUser(), 5000, "getUser");
      if (userError || !data.user) {
        setLoginError("تعذر قراءة بيانات الحساب، حاول مرة أخرى");
        await supabase.auth.signOut({ scope: "local" });
        return;
      }

      const nextSession = buildAuthSession(data.user);
      if (!hasAdminAccess(nextSession)) {
        await supabase.auth.signOut({ scope: "local" });
        setSession(null);
        setPhase("access_denied");
        return;
      }

      setSession(nextSession);
      setPhase("ready");
      setPassword("");
    } catch (err) {
      setLoginError(translateLoginError(err));
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  }

  async function handleLogout() {
    if (supabase) await supabase.auth.signOut({ scope: "local" });
    setSession(null);
    setPassword("");
    setPhase("login");
  }

  if (phase === "checking") {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Loader2 className="h-7 w-7 animate-spin" style={{ color: "hsl(38 62% 46%)" }} />
          <p className="text-sm font-bold" style={{ color: "hsl(24 22% 24%)" }}>يتم التحقق من صلاحيات لوحة المالك...</p>
        </div>
      </AuthShell>
    );
  }

  if (phase === "access_denied") {
    return (
      <AuthShell>
        <div className="space-y-4 text-center">
          <Shield className="h-10 w-10 mx-auto" style={{ color: "hsl(10 55% 48%)" }} />
          <h2 className="text-xl font-extrabold" style={{ color: "hsl(24 22% 24%)" }}>غير مصرح</h2>
          <p className="text-sm leading-7" style={{ color: "hsl(32 18% 38%)" }}>
            هذا الحساب لا يملك صلاحيات الدخول إلى لوحة المالك.
          </p>
          <Button type="button" onClick={handleLogout} className="w-full">
            العودة لتسجيل الدخول
          </Button>
        </div>
      </AuthShell>
    );
  }

  if (phase !== "ready") {
    return (
      <AuthShell>
        <form className="space-y-5" onSubmit={handleLoginSubmit}>
          <div className="text-center space-y-1 mb-2">
            <h2 className="text-lg font-extrabold" style={{ color: "#2F2B25" }}>تسجيل دخول المالك</h2>
            <p className="text-xs" style={{ color: "#8A6B3D" }}>
              الدخول مخصص لإدارة لوحة مواعيدك فقط
            </p>
          </div>

          {!isSupabaseEnabled && (
            <div 
              className="px-4 py-3 rounded-xl text-xs font-semibold text-center"
              style={{
                background: "rgba(201,160,99,0.15)",
                border: "1px solid rgba(201,160,99,0.3)",
                color: "#8A6B3D",
              }}
            >
              لوحة المالك تتطلب تفعيل Supabase Auth في بيئة الإنتاج
            </div>
          )}

          {loginError && <ErrorBox message={loginError} />}

          <div className="space-y-2">
            <Input
              id="admin-email"
              dir="ltr"
              type="email"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              autoComplete="email"
              placeholder="أدخل البريد الإلكتروني"
              required
              className="h-12 rounded-xl bg-white/80 border-0"
              style={{ border: "1px solid rgba(201,160,99,0.25)" }}
            />
          </div>

          <div className="space-y-2">
            <Input
              id="admin-password"
              dir="ltr"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="أدخل كلمة المرور"
              required
              className="h-12 rounded-xl bg-white/80 border-0"
              style={{ border: "1px solid rgba(201,160,99,0.25)" }}
            />
          </div>

          <Button 
            type="submit" 
            disabled={submitting || !isSupabaseEnabled} 
            className="w-full h-12 font-bold rounded-xl"
            style={{ background: "#C9A063", color: "#FFFFFF" }}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "تسجيل الدخول"}
          </Button>
        </form>
      </AuthShell>
    );
  }

  return (
    <div className="min-h-screen rtl" style={{ background: "hsl(36 34% 95%)", color: "hsl(24 22% 20%)" }}>
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:z-40 lg:block lg:w-72 lg:border-l" style={{ borderColor: "hsl(38 32% 82%)" }}>
        <AdminSidebar currentPath={location} />
      </div>

      <header
        className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 lg:pr-80"
        style={{ background: "rgba(255, 251, 244, 0.92)", borderColor: "hsl(38 32% 82%)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="فتح القائمة">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-72">
              <AdminSidebar currentPath={location} />
            </SheetContent>
          </Sheet>
        </div>

        <div>
          <div className="font-extrabold" style={{ color: "hsl(35 45% 34%)" }}>لوحة المالك</div>
          <div className="text-xs" style={{ color: "hsl(32 18% 38%)" }}>مرحباً، {userLabel}</div>
        </div>

        <Button type="button" variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </header>

      <main className="lg:pr-72">
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
