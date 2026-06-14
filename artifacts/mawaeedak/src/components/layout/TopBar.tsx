import { Bell, CalendarDays, Grid2X2, Home, Menu, Wallet } from "lucide-react";
import MawaeedakLogoSvg from "@/assets/brand/mawaeedak-logo.svg";
import { Link } from "wouter";
import { useGatewayUnreadCount } from "@/hooks/useGatewayData";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

interface MawaeedakLogoProps {
  compact?: boolean;
}

const links = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/calendar", label: "التقويم", icon: CalendarDays },
  { href: "/salaries", label: "الرواتب", icon: Wallet },
  { href: "/services", label: "الخدمات", icon: Grid2X2 },
];

function Mark({ compact = false }: MawaeedakLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <img 
        src={MawaeedakLogoSvg} 
        alt="مواعيدك" 
        className={compact ? "h-16 w-auto" : "h-11 w-auto"}
      />
    </div>
  );
}

export function MawaeedakLogo({ compact = false }: MawaeedakLogoProps) {
  return <Mark compact={compact} />;
}

export function TopBar({ title }: TopBarProps) {
  const { data: unreadCount } = useGatewayUnreadCount();
  const count = unreadCount ?? 0;

  return (
    <header dir="rtl" className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="flex min-h-[88px] items-center justify-between gap-3 px-5">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700">
          <Menu className="h-6 w-6" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Mark />
          {title && title !== "الرئيسية" ? <h1 className="mt-1 text-[18px] font-extrabold text-slate-900">{title}</h1> : null}
        </div>
        <Link href="/notifications" className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700">
          <Bell className="h-6 w-6" />
          {count > 0 ? <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#f59e0b] px-1 text-[10px] font-bold text-white">{count > 9 ? "9+" : count}</span> : null}
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-2 px-5 pb-3">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="maw-pill flex items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-extrabold">
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
