import React from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  hideNav?: boolean;
  showBack?: boolean;
}

export function AppShell({ children, title, hideNav = false }: AppShellProps) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground mx-auto max-w-[480px] app-frame relative overflow-hidden flex flex-col app-paper-bg">
      <TopBar title={title} />
      <main className="flex-1 overflow-y-auto pb-[76px] pt-0 px-3 scroll-smooth">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
