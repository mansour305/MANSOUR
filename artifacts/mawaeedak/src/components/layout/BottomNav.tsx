import { Link, useLocation } from "wouter";
import { Calendar, Grid2X2, Home, MoreHorizontal, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();
  const navItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: Wallet, label: "الرواتب", path: "/salaries", match: ["/salaries", "/finance"] },
    { icon: Grid2X2, label: "الخدمات", path: "/services", match: ["/services", "/centers"] },
    { icon: Calendar, label: "التقويم", path: "/calendar" },
    { icon: MoreHorizontal, label: "المزيد", path: "/more" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[480px] px-3 pb-3">
      <div
        className="flex h-[76px] items-center justify-around rounded-[28px] border px-2"
        style={{
          background: "rgba(255,255,255,0.86)",
          borderColor: "rgba(201,160,99,0.22)",
          boxShadow: "0 -12px 38px rgba(138,107,61,0.12), inset 0 1px 0 rgba(255,255,255,0.90)",
          backdropFilter: "blur(18px)",
        }}
      >
        {navItems.map((item) => {
          const matches = item.match ?? [item.path];
          const isActive = item.path === "/" ? location === "/" : matches.some((path) => location.startsWith(path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-[22px]"
            >
              {isActive ? (
                <span
                  className="absolute inset-x-1 bottom-2 top-2 rounded-[20px]"
                  style={{ background: "linear-gradient(180deg, #F3E8D6, #FAF7F2)" }}
                />
              ) : null}
              <Icon
                className={cn("relative z-10 transition", isActive ? "h-7 w-7" : "h-6 w-6")}
                strokeWidth={isActive ? 2.4 : 1.8}
                style={{ color: isActive ? "#C9A063" : "#70695F" }}
              />
              <span
                className="relative z-10 text-[11px] font-extrabold leading-none"
                style={{ color: isActive ? "#C9A063" : "#70695F" }}
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
