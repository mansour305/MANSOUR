import { Link } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import {
  Calculator, Bell, BookOpen, Briefcase, CalendarDays,
  Gift, Headphones, MessageSquare, Newspaper, Plane, Target
} from "lucide-react";

const services = [
  { title: "نظم مواعيدك", subtitle: "أضف وأدر مواعيدك بسهولة", icon: CalendarDays, path: "/calendar" },
  { title: "احسب هدفك", subtitle: "حدد هدفك وخطة التوفير", icon: Target, path: "/centers/work" },
  { title: "تكاليف هدفك", subtitle: "قائمة البنود والمصروفات", icon: Calculator, path: "/centers/work" },
  { title: "صوتك مسموع", subtitle: "شكاوى واقتراحات", icon: MessageSquare, path: "/centers/complaints" },
  { title: "الوظائف", subtitle: "فرص وظيفية جديدة", icon: Briefcase, path: "/centers/jobs" },
  { title: "ذكرني", subtitle: "تذكيرات ومواعيد", icon: Bell, path: "/centers/work" },
  { title: "الأذكار", subtitle: "أذكار الصباح والمساء", icon: BookOpen, path: "/centers/work" },
  { title: "بطاقة يومية", subtitle: "شارك يومك مع الآخرين", icon: Gift, path: "/daily-card" },
  { title: "رحلاتي القادمة", subtitle: "استعرض رحلاتك القادمة", icon: Plane, path: "/centers/travel" },
  { title: "قدم تهنئة", subtitle: "أرسل تهانيك بسهولة", icon: Gift, path: "/centers/greetings" },
  { title: "اتصل بنا", subtitle: "تواصل معنا", icon: Headphones, path: "/support" },
  { title: "الأخبار", subtitle: "آخر الأخبار والتحديثات", icon: Newspaper, path: "/centers/news" },
];

export default function CentersPage() {
  return (
    <AppShell title="خدمات مواعيدك">
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Link key={service.title} href={service.path}>
              <article
                className="flex min-h-[174px] flex-col items-center justify-center rounded-[24px] border bg-white/82 p-5 text-center transition active:scale-[0.98]"
                style={{
                  borderColor: "rgba(201,160,99,0.22)",
                  boxShadow: "0 14px 34px rgba(138,107,61,0.10)",
                }}
              >
                <div className="grid h-16 w-16 place-items-center rounded-[20px]" style={{ color: "#C9A063" }}>
                  <Icon className="h-12 w-12" strokeWidth={1.5} />
                </div>
                <h3 className="mt-3 text-[20px] font-extrabold leading-tight" style={{ color: "#2F2B25" }}>
                  {service.title}
                </h3>
                <p className="mt-2 max-w-[180px] text-[14px] font-bold leading-6" style={{ color: "#6F6557" }}>
                  {service.subtitle}
                </p>
              </article>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
