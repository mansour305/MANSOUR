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
    <nav dir="rtl" className="maw-bottom-nav grid grid-cols-5 px-2 py-2 backdrop-blur-xl maw-bottom-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.match(location);
        return (
          <Link 
            key={tab.href} 
            href={tab.href} 
            aria-label={tab.label} 
            className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 transition-all duration-300 ${active ? "maw-gradient shadow-gold scale-105" : "text-[#9A8A7A] hover:text-[#8B6425] hover:bg-[rgba(201,149,58,0.08)]"}`}
          >
            <Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 2} />
            <span className="truncate text-[10px] font-bold">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
