/**
 * CentersPage — Saudi Premium Minimal Services
 * Design: Matches reference image with gradient background and premium cards
 */

import { Link } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import {
  Calculator, Bell, Briefcase, Gift, GraduationCap, MessageSquare, Plane, Target,
} from "lucide-react";

// Services in required order
const visibleServices = [
  { title: "احسب هدفك", subtitle: "حدد هدفك وخطة التوفير", icon: Target, path: "/services/goals", status: "ready" },
  { title: "حساب التكاليف", subtitle: "قائمة البنود والمصروفات", icon: Calculator, path: "/services/costs", status: "ready" },
  { title: "ذكرني", subtitle: "تذكيرات ومواعيد", icon: Bell, path: "/services/reminders", status: "ready" },
  { title: "السفر", subtitle: "رحلاتي القادمة", icon: Plane, path: "/centers/travel", status: "ready" },
  { title: "الدراسة والإجازات", subtitle: "جدولي الدراسي والإجازات", icon: GraduationCap, path: "/centers/study", status: "ready" },
  { title: "الوظائف والأخبار", subtitle: "فرص وظيفية ومستجدات", icon: Briefcase, path: "/centers/jobs", status: "ready" },
  { title: "بطاقة اليوم", subtitle: "شارك يومك مع الآخرين", icon: Gift, path: "/daily-card", status: "ready" },
  { title: "صوتك مسموع", subtitle: "شكاوى واقتراحات", icon: MessageSquare, path: "/centers/complaints", status: "ready" },
];

// Service card component
function ServiceCard({ service }: { service: typeof visibleServices[0] }) {
  const Icon = service.icon;
  const isReady = service.status === "ready";

  return (
    <Link href={isReady ? service.path : "#"}>
      <article
        className={`relative flex flex-col items-center justify-center rounded-3xl p-5 text-center transition-all duration-200 ${
          isReady 
            ? "bg-white/95 cursor-pointer active:scale-[0.97]" 
            : "bg-white/60 opacity-70 cursor-not-allowed"
        }`}
        style={{
          boxShadow: isReady 
            ? "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)" 
            : "0 4px 16px rgba(0,0,0,0.04)",
          minHeight: "160px",
        }}
      >
        {/* Icon container */}
        <div 
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: "linear-gradient(145deg, #C9A063 0%, #A67C3D 100%)",
            boxShadow: "0 4px 12px rgba(201,160,99,0.35)",
          }}
        >
          <Icon className="h-7 w-7 text-white" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h3 
          className="mt-3 text-lg font-bold leading-tight"
          style={{ color: "#2F2B25" }}
        >
          {service.title}
        </h3>

        {/* Subtitle */}
        <p 
          className="mt-1.5 text-xs font-medium leading-relaxed"
          style={{ color: "#6F6557", maxWidth: "140px" }}
        >
          {service.subtitle}
        </p>

        {/* Bottom accent line */}
        <div 
          className="absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-300"
          style={{ 
            width: "40px",
            background: isReady 
              ? "linear-gradient(90deg, transparent, #C9A063, transparent)" 
              : "transparent"
          }}
        />
      </article>
    </Link>
  );
}

// Decorative divider
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div 
        className="h-px flex-1 rounded-full" 
        style={{ background: "linear-gradient(90deg, transparent, #C9A063)" }} 
      />
      <span style={{ color: "#C9A063", fontSize: "10px" }}>◆</span>
      <div 
        className="h-px flex-1 rounded-full" 
        style={{ background: "linear-gradient(90deg, #C9A063, transparent)" }} 
      />
    </div>
  );
}

export default function CentersPage() {
  return (
    <AppShell title="خدماتك">
      <div className="space-y-5">
        {/* Header section */}
        <div className="text-center">
          <h1 
            className="text-2xl font-black"
            style={{ color: "#2F2B25" }}
          >
            الخدمات
          </h1>
          <p 
            className="mt-1.5 text-sm font-medium"
            style={{ color: "#6F6557" }}
          >
            خدمات متميزة
          </p>
        </div>

        <GoldDivider />

        {/* Services grid */}
        <div className="grid grid-cols-2 gap-3">
          {visibleServices.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>

        <GoldDivider />

        {/* Blessing card */}
        <div 
          className="relative overflow-hidden rounded-3xl p-6 text-center"
          style={{
            background: "linear-gradient(145deg, #FAF7F2 0%, #FFFDF8 50%, #FAF7F2 100%)",
            boxShadow: "0 8px 32px rgba(201,160,99,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
            border: "1px solid rgba(201,160,99,0.2)",
          }}
        >
          {/* Inner decorative frame */}
          <div 
            className="absolute inset-2 rounded-2xl pointer-events-none"
            style={{ 
              border: "1px solid rgba(201,160,99,0.15)",
            }}
          />

          <p 
            className="relative text-lg font-bold leading-relaxed"
            style={{ 
              color: "#8A6B3D",
              fontFamily: "'Noto Kufi Arabic', 'Cairo', sans-serif",
            }}
          >
            اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد ﷺ
          </p>
        </div>
      </div>
    </AppShell>
  );
}

