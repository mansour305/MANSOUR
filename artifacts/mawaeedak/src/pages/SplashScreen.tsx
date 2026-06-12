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
      // Check if user has completed onboarding
      const hasOnboarded = localStorage.getItem("mawaeedak_onboarded");
      
      // Call onComplete if provided (for FirstEntryWrapper)
      if (onComplete) {
        onComplete();
        return;
      }

      try {
        sessionStorage.setItem("mawaeedak_splash_shown", "true");
      } catch {
        // Session storage is best effort.
      }
      
      // Default behavior: navigate based on onboarding status
      if (hasOnboarded || user?.onboardingComplete) {
        setLocation("/");
      } else {
        setLocation("/welcome");
      }
    }, 3500); // 3.5 seconds for splash duration (3-4 second range)

    return () => clearTimeout(timer);
  }, [setLocation, user, onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center max-w-[480px] mx-auto app-frame"
      style={{ background: "linear-gradient(180deg, hsl(36 45% 92%) 0%, hsl(36 35% 88%) 100%)" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(38 55% 60% / 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Decorative pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, hsl(38 45% 50%) 20px, hsl(38 45% 50%) 21px)`,
      }} />

      <div className="text-center animate-in fade-in zoom-in duration-700 relative z-10">
        {/* Geometric ornament */}
        <div className="mb-6">
          <div className="text-6xl" style={{ color: "#C9A063" }}>✦</div>
        </div>

        <h1
          className="text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md"
          style={{ color: "#2F2B25" }}
        >
          مواعيدك
        </h1>

        {/* Gold divider */}
        <div className="h-[2px] w-32 mx-auto my-4" style={{
          background: "linear-gradient(90deg, transparent, #C9A063, transparent)",
        }} />

        <p
          className="text-lg font-medium tracking-wide"
          style={{ color: "#6F6557" }}
        >
          كل يوم منظم.. لحياة أفضل
        </p>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                background: "#C9A063",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
