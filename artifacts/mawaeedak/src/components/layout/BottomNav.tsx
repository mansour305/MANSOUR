import { CalendarDays, Grid2X2, Home, MoreHorizontal, Wallet } from "lucide-react";
import { Link, useLocation } from "wouter";

// Order for RTL: التقويم - الرواتب - الرئيسية - خدماتك - المزيد (right to left)
const tabs = [
  { href: "/calendar", label: "التقويم", icon: CalendarDays, match: (path: string) => path.startsWith("/calendar") },
  { href: "/salaries", label: "الرواتب", icon: Wallet, match: (path: string) => path.startsWith("/salaries") || path.startsWith("/finance") },
  { href: "/", label: "الرئيسية", icon: Home, match: (path: string) => path === "/" },
  { href: "/services", label: "خدماتك", icon: Grid2X2, match: (path: string) => path.startsWith("/services") || path.startsWith("/centers") },
  { href: "/more", label: "المزيد", icon: MoreHorizontal, match: (path: string) => path.startsWith("/more") || path.startsWith("/account") },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav dir="rtl" className="maw-bottom-nav grid grid-cols-5 rounded-[28px] border border-[rgba(201,160,99,0.22)] bg-[rgba(255,250,241,0.96)] px-2 py-2 shadow-[0_18px_55px_rgba(112,78,36,0.16)] backdrop-blur-xl maw-bottom-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.match(location);
        return (
          <Link key={tab.href} href={tab.href} aria-label={tab.label} className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[22px] px-1 transition active:scale-[0.98] ${active ? "maw-gradient shadow-[0_10px_24px_rgba(181,123,36,0.30)]" : "text-[#7b6a57]"}`}>
            <Icon className="h-6 w-6" strokeWidth={active ? 2.35 : 1.9} />
            <span className="truncate text-[11px] font-extrabold">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
