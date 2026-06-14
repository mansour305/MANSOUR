/**
 * TopBar â€” Saudi Premium Minimal Header with Drawer
 * Reference: docs/design-reference/final-2026/07-menu-drawer.jpeg
 * 
 * Features:
 * - Right-side drawer with premium styling
 * - Logo header
 * - Welcome card with date chip
 * - Menu rows: ط§ظ„ط±ط¦ظٹط³ظٹط©, ط¨ط·ط§ظ‚ط© ظٹظˆظ…ظٹط©, ط´ط§ط±ظƒ ط§ظ„طھط·ط¨ظٹظ‚, etc.
 * - Decorative lower motif
 * - Close button
 */

import { ArrowRight, Bell, FileText, Headphones, Home, LogIn, LogOut, Mail, Menu, Share2, ShieldCheck, Sparkles, X } from "lucide-react";
import type { ElementType } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGatewayUnreadCount } from "@/hooks/useGatewayData";
import { useStore } from "@/hooks/useStore";
import { formatGregorianDate, getDayName } from "@/lib/utils";
import { showTopNotification } from "@/components/layout/TopNotificationBanner";
import { authSignOut } from "@/lib/auth";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

const GOLD = "#C9A063";
const BROWN = "#8A6B3D";
const INK = "#2F2B25";

export function MawaeedakLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="ظ…ظˆط§ط¹ظٹط¯ظƒ">
      <div
        className="relative grid place-items-center rounded-full"
        style={{
          width: compact ? 42 : 58,
          height: compact ? 42 : 58,
          border: "1px solid rgba(201,160,99,0.48)",
          background: "rgba(255,255,255,0.62)",
          boxShadow: "0 12px 30px rgba(138,107,61,0.12)",
        }}
      >
        <span
          style={{
            color: GOLD,
            fontSize: compact ? 31 : 43,
            lineHeight: 1,
            fontWeight: 700,
            fontFamily: "'Cairo', 'Noto Kufi Arabic', sans-serif",
          }}
        >
          ظ…
        </span>
        <span className="absolute right-2 top-2 text-[12px]" style={{ color: GOLD }}>
          âœ¦
        </span>
      </div>
      <span
        className="font-extrabold leading-none"
        style={{
          color: "#A78042",
          fontSize: compact ? 24 : 31,
          fontFamily: "'Cairo', 'Noto Kufi Arabic', sans-serif",
        }}
      >
        ظ…ظˆط§ط¹ظٹط¯ظƒ
      </span>
    </div>
  );
}

function SideMenuItem({
  href,
  label,
  icon: Icon,
  danger = false,
  onClick,
}: {
  href?: string;
  label: string;
  icon: ElementType;
  danger?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[18px] border px-4 py-3.5 text-right transition active:scale-[0.98]"
      style={{
        background: danger ? "rgba(185,72,63,0.06)" : "rgba(255,255,255,0.72)",
        borderColor: danger ? "rgba(185,72,63,0.22)" : "rgba(201,160,99,0.24)",
        color: danger ? "#B9483F" : INK,
        boxShadow: "0 8px 22px rgba(138,107,61,0.08)",
      }}
    >
      <span className="grid h-10 w-10 place-items-center rounded-[14px] border" style={{ background: "#FFF9EF", borderColor: "rgba(201,160,99,0.3)" }}>
        <Icon className="h-5 w-5" strokeWidth={1.8} style={{ color: danger ? "#B9483F" : GOLD }} />
      </span>
      <span className="flex-1 text-[16px] font-bold">{label}</span>
    </button>
  );

  if (!href) return content;
  return (
    <SheetClose asChild>
      <Link href={href}>{content}</Link>
    </SheetClose>
  );
}

export function TopBar({ title, showBack = false }: TopBarProps) {
  const [, setLocation] = useLocation();
  const { data: unreadCount } = useGatewayUnreadCount();
  const { user } = useStore();
  const isLoggedIn = Boolean(user?.email);
  const count = unreadCount ?? 0;

  const handleShare = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      await navigator.share({ title: "ظ…ظˆط§ط¹ظٹط¯ظƒ", text: "ظƒظ„ ظ…ظˆط§ط¹ظٹط¯ظƒ ظپظٹ ظ…ظƒط§ظ† ظˆط§ط­ط¯", url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      showTopNotification("طھظ… ظ†ط³ط® ط±ط§ط¨ط· ط§ظ„طھط·ط¨ظٹظ‚", "success");
    }
  };

  const handleLogout = async () => {
    // Clear auth/session only, keep theme/location/preferences
    await authSignOut().catch(() => {});
    localStorage.removeItem("app-user");
    sessionStorage.removeItem("mawaeedak_demo_session");
    sessionStorage.setItem("mawaeedak_splash_shown", "true");
    
    showTopNotification("طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬ ظˆط§ظ„ط¹ظˆط¯ط© ظ„ظ„ط±ط¦ظٹط³ظٹط©", "success");
    setLocation("/");
    window.history.replaceState(null, "", "/");
  };

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-40 w-full"
      style={{
        background: "linear-gradient(180deg, rgba(250,247,242,0.98), rgba(250,247,242,0.90))",
        borderBottom: "1px solid rgba(201,160,99,0.18)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="relative flex h-[92px] items-center justify-between px-5">
        {showBack ? (
          <Button variant="ghost" size="icon" aria-label="ط±ط¬ظˆط¹" className="h-11 w-11 rounded-full" onClick={() => window.history.back()}>
            <ArrowRight className="h-7 w-7" style={{ color: BROWN }} />
          </Button>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="ط§ظ„ظ‚ط§ط¦ظ…ط©" className="h-11 w-11 rounded-full">
                <Menu className="h-7 w-7" style={{ color: BROWN }} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[86vw] max-w-[390px] overflow-y-auto border-l-0 p-0"
              style={{
                direction: "rtl",
                background: "linear-gradient(180deg, #FAF7F2 0%, #FFFDF9 58%, #F3E8D6 100%)",
              }}
            >
              <div className="min-h-full px-5 pb-6 pt-5">
                <div className="mb-5 flex items-center justify-between">
                  <SheetClose asChild>
                    <button type="button" className="grid h-10 w-10 place-items-center rounded-full border" style={{ background: "rgba(255,255,255,0.6)", borderColor: "rgba(201,160,99,0.3)" }} aria-label="ط¥ط؛ظ„ط§ظ‚">
                      <X className="h-5 w-5" style={{ color: BROWN }} />
                    </button>
                  </SheetClose>
                  <MawaeedakLogo compact />
                </div>

                {/* Welcome card */}
                <div 
                  className="mb-5 rounded-[22px] border p-4" 
                  style={{ 
                    borderColor: "rgba(201,160,99,0.22)",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,252,245,0.6))",
                    boxShadow: "0 8px 24px rgba(138,107,61,0.08)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[20px] font-extrabold flex items-center gap-2" style={{ color: BROWN }}>
                        ظ…ط±ط­ط¨ط§ظ‹ ط¨ظƒ <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
                      </p>
                      <p className="text-sm font-semibold" style={{ color: INK }}>
                        {isLoggedIn ? user.name || "ظ…ط³طھط®ط¯ظ… ظ…ظˆط§ط¹ظٹط¯ظƒ" : "ظ†ط³ط¹ط¯ ط¨ظˆط¬ظˆط¯ظƒ ظ…ط¹ظ†ط§"}
                      </p>
                      <p 
                        className="mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold" 
                        style={{ borderColor: "rgba(201,160,99,0.24)", color: BROWN }}
                      >
                        {getDayName()}طŒ {formatGregorianDate()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <SideMenuItem href="/" icon={Home} label="ط§ظ„ط±ط¦ظٹط³ظٹط©" />
                  <SideMenuItem href="/story" icon={Mail} label="ط¨ط·ط§ظ‚ط© ظٹظˆظ…ظٹط© ط£ط±ط³ظ„ظ‡ط§" />
                  <SideMenuItem icon={Share2} label="ط´ط§ط±ظƒ ط§ظ„طھط·ط¨ظٹظ‚" onClick={handleShare} />
                  <SideMenuItem href="/privacy" icon={ShieldCheck} label="ط³ظٹط§ط³ط© ط§ظ„ط®طµظˆطµظٹط©" />
                  <SideMenuItem href="/terms" icon={FileText} label="ط§ظ„ط´ط±ظˆط· ظˆط§ظ„ط£ط­ظƒط§ظ…" />
                  <SideMenuItem href="/support" icon={Headphones} label="ط§ظ„ظ…ط³ط§ط¹ط¯ط© ظˆط§ظ„ط¯ط¹ظ…" />
                  {isLoggedIn ? (
                    <SideMenuItem icon={LogOut} label="طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬" danger onClick={handleLogout} />
                  ) : (
                    <SideMenuItem href="/login" icon={LogIn} label="طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„" />
                  )}
                </div>

                {/* Decorative motif */}
                <div 
                  className="relative mt-6 h-32 overflow-hidden rounded-[24px] border" 
                  style={{ borderColor: "rgba(201,160,99,0.20)" }}
                >
                  <div aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent" />
                  <p className="absolute bottom-4 right-4 text-lg font-extrabold" style={{ color: BROWN }}>
                    ظƒظ„ ظ…ظˆط§ط¹ظٹط¯ظƒ ظپظٹ ظ…ظƒط§ظ† ظˆط§ط­ط¯
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        <div className="absolute inset-x-16 top-3 flex flex-col items-center gap-1 text-center">
          <MawaeedakLogo compact />
          {title && title !== "ط§ظ„ط±ط¦ظٹط³ظٹط©" ? (
            <h1 className="text-[22px] font-extrabold leading-tight" style={{ color: INK }}>
              {title}
            </h1>
          ) : null}
        </div>

        <Link href="/notifications">
          <Button variant="ghost" size="icon" aria-label="ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ" className="relative h-11 w-11 rounded-full">
            <Bell className="h-6 w-6" style={{ color: BROWN }} />
            {count > 0 ? (
              <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold text-white" style={{ background: GOLD }}>
                {count > 9 ? "9+" : count}
              </span>
            ) : null}
          </Button>
        </Link>
      </div>
    </header>
  );
}

