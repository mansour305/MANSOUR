import React from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  hideNav?: boolean;
  showBack?: boolean;
}

export function AppShell({ children, title, hideNav = false, showBack = false }: AppShellProps) {
  return (
    <div dir="rtl" className="maw-app-bg relative mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden text-foreground shadow-[0_0_0_1px_rgba(15,23,42,0.06)]">
      <TopBar title={title} showBack={showBack} />
      <main className="flex-1 overflow-y-auto px-4 pb-[104px] pt-3 no-scrollbar">{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
