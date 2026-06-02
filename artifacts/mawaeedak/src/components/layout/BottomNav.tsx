import { Link, useLocation } from "wouter";
import { Home, Calendar, Wallet, Grid3X3, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home,          label: "الرئيسية", path: "/" },
    { icon: Wallet,        label: "الرواتب",  path: "/finance" },
    { icon: Grid3X3,       label: "الخدمات",  path: "/centers" },
    { icon: Calendar,      label: "التقويم",  path: "/calendar" },
    { icon: MoreHorizontal,label: "المزيد",   path: "/more" },
  ];

  return (
    <nav
      className="app-nav fixed bottom-0 left-0 right-0 z-50 max-w-[480px] mx-auto"
      style={{ height: "68px" }}
    >
      <div className="flex justify-around items-center h-full px-1.5">
        {navItems.map((item) => {
          const isActive =
            location === item.path ||
            (item.path !== "/" && location.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-[3px] transition-all duration-200 relative"
            >
              {isActive && <span className="nav-active-pill" />}

              <Icon
                className={cn(
                  "relative z-10 transition-all duration-200",
                  isActive
                    ? "w-[22px] h-[22px] text-[hsl(var(--nav-active))]"
                    : "w-[20px] h-[20px] text-[hsl(var(--nav-fg))]"
                )}
                strokeWidth={isActive ? 2.5 : 1.75}
                style={
                  isActive
                    ? { filter: "drop-shadow(0 3px 8px hsl(var(--nav-active)/0.28))" }
                    : {}
                }
              />
              <span
                className={cn(
                  "text-[10px] font-bold leading-none relative z-10 transition-colors duration-200",
                  isActive
                    ? "text-[hsl(var(--nav-active))]"
                    : "text-[hsl(var(--nav-fg))]"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
