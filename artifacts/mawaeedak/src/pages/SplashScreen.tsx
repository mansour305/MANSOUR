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
      className="fixed inset-0 flex flex-col items-center justify-center max-w-[480px] mx-auto overflow-hidden"
      style={{ 
        background: "linear-gradient(180deg, #FAF7F2 0%, #F5F0E6 40%, #F3E8D6 100%)",
      }}
    >
      {/* Decorative radial glow at top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(201,160,99,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Desert dune SVG at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(201,160,99,0.08) 100%)",
        }}
      >
        <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0 80 L0 50 Q50 30 100 45 T200 35 T300 50 T400 40 L400 80 Z"
            fill="rgba(201,160,99,0.12)"
          />
          <path
            d="M0 80 L0 60 Q80 40 160 55 T320 45 T400 55 L400 80 Z"
            fill="rgba(201,160,99,0.08)"
          />
        </svg>
      </div>

      {/* Palm tree SVG decoration */}
      <div className="absolute top-20 left-4 opacity-20 pointer-events-none">
        <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
          <path d="M30 100 L30 50" stroke="#A78042" strokeWidth="3" strokeLinecap="round"/>
          <path d="M30 55 Q15 40 5 45 Q20 35 30 50" fill="#A78042"/>
          <path d="M30 55 Q45 40 55 45 Q40 35 30 50" fill="#A78042"/>
          <path d="M30 50 Q10 30 0 35 Q15 25 30 45" fill="#A78042"/>
          <path d="M30 50 Q50 30 60 35 Q45 25 30 45" fill="#A78042"/>
        </svg>
      </div>

      <div className="text-center animate-in fade-in zoom-in duration-700 relative z-10">
        {/* Circular icon area */}
        <div 
          className="w-28 h-28 rounded-full mx-auto mb-8 flex items-center justify-center border-2"
          style={{ 
            background: "linear-gradient(145deg, #FFFCF7, #F3E8D6)",
            borderColor: "rgba(201,160,99,0.4)",
            boxShadow: "0 12px 40px rgba(138,107,61,0.18), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <span 
            className="text-5xl font-bold" 
            style={{ 
              color: "#A78042",
              fontFamily: "'Noto Kufi Arabic', Cairo, sans-serif",
            }}
          >
            م
          </span>
        </div>

        <h1
          className="text-5xl font-extrabold tracking-tight mb-1 drop-shadow-sm"
          style={{ 
            color: "#2F2B25",
            fontFamily: "'Noto Kufi Arabic', Cairo, sans-serif",
          }}
        >
          مواعيدك
        </h1>

        {/* Gold ornamental divider */}
        <div className="flex items-center justify-center gap-3 my-5">
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #C9A063)" }} />
          <span style={{ color: "#C9A063" }}>✦</span>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #C9A063, transparent)" }} />
        </div>

        <p
          className="text-lg font-semibold tracking-wide mb-1"
          style={{ color: "#A78042", fontFamily: "'Noto Kufi Arabic', Cairo, sans-serif" }}
        >
          رفيق يومك في كل موعد
        </p>

        <p
          className="text-base font-medium tracking-wide"
          style={{ color: "#6F6557", fontFamily: "'Noto Kufi Arabic', Cairo, sans-serif" }}
        >
          راتبك، تقويمك، ومواعيدك
        </p>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
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
