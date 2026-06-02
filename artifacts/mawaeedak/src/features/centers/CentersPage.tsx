import { Briefcase, CalendarDays, Gift, Headphones, MessageSquare, Newspaper, Plane } from "lucide-react";
import { Link } from "wouter";
import { AppShell } from "@/components/layout/AppShell";

const services = [
  { title: "نظم مواعيدك", subtitle: "أضف وأدر مواعيدك بسهولة", icon: CalendarDays, path: "/calendar" },
  { title: "رحلاتي القادمة", subtitle: "استعرض تفاصيل رحلاتك القادمة", icon: Plane, path: "/centers/travel" },
  { title: "الشكاوى والاقتراحات", subtitle: "نستمع لك لتطوير تجربتك", icon: MessageSquare, path: "/centers/complaints" },
  { title: "قدم تهنئة لمن تريد", subtitle: "أرسل تهانيك بسهولة وجمال", icon: Gift, path: "/centers/greetings" },
  { title: "اتصل بنا", subtitle: "تواصل معنا في أي وقت", icon: Headphones, path: "/support" },
  { title: "الأخبار", subtitle: "تصفح آخر الأخبار والتحديثات", icon: Newspaper, path: "/centers/news" },
  { title: "وظائف", subtitle: "اكتشف الفرص الوظيفية المناسبة لك", icon: Briefcase, path: "/centers/jobs", wide: true },
];

export default function CentersPage() {
  return (
    <AppShell title="خدمات مواعيدك">
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Link key={service.title} href={service.path} className={service.wide ? "col-span-2" : undefined}>
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
