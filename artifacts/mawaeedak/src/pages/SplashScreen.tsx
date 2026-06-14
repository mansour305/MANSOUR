import { useEffect } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/hooks/useStore";

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps = {}) {
  const [, setLocation] = useLocation();
  const { user } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasOnboarded = localStorage.getItem("mawaeedak_onboarded");
      if (onComplete) {
        onComplete();
        return;
      }
      try {
        sessionStorage.setItem("mawaeedak_splash_shown", "true");
      } catch {
        // best effort
      }
      setLocation(hasOnboarded || user?.onboardingComplete ? "/" : "/welcome");
    }, 1200);

    return () => clearTimeout(timer);
  }, [setLocation, user, onComplete]);

  return (
    <div className="maw-app-bg fixed inset-0 mx-auto flex max-w-[480px] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="maw-card relative z-10 w-full max-w-[340px] rounded-[32px] px-8 py-10">
        <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-[28px] bg-gradient-to-br from-[#087f8c] to-[#16b8a6] text-white shadow-[0_18px_44px_rgba(8,127,140,0.24)]">
          <span className="text-[52px] font-black leading-none">م</span>
        </div>
        <h1 className="maw-text-gradient mb-3 text-[44px] font-black leading-none">مواعيدك</h1>
        <p className="mb-2 text-lg font-extrabold text-slate-800">تنظيم يومك براحة ووضوح</p>
        <p className="text-sm font-semibold leading-7 text-slate-500">مواقيتك، تقويمك، ورواتبك في تجربة واحدة حديثة.</p>
        <div className="mt-7 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#087f8c]" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
