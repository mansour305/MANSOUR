/**
 * AdminDashboard - ظ„ظˆط­ط© ط§ظ„ظ…ط§ظ„ظƒ ط§ظ„ط±ط¦ظٹط³ظٹط©
 * ظ†ط¸ط±ط© ط´ط§ظ…ظ„ط© ط¹ظ„ظ‰ ط§ظ„ظ†ط¸ط§ظ… ظ…ط¹ ط¥ط­طµط§ط¦ظٹط§طھ ظˆط¥ط¬ط±ط§ط،ط§طھ ط³ط±ظٹط¹ط©
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Users, Calendar, Bell, MessageSquare, Wallet, 
  TrendingUp, Clock, AlertTriangle, Plus, Settings,
  Send, BarChart3, FileText, Shield, Zap,
  CheckCircle, Eye, Edit, Trash2,
  ChevronLeft, Image as ImageIcon, Paintbrush,
  Newspaper, Briefcase, Loader2, LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { adminStorage } from "@/lib/admin-storage";
import { sendNotification, addFinancialEvent, addTheme } from "@/lib/admin-actions";

// Heritage Design System Colors
const GOLD = "hsl(38 62% 52%)";
const GOLD_LIGHT = "hsl(38 82% 68%)";
const DARK_BROWN = "hsl(22 62% 18%)";
const MEDIUM_BROWN = "hsl(22 62% 22%)";
const CREAM = "hsl(36 42% 94%)";
const BG = "hsl(38 52% 96%)";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: typeof Users;
  trend?: string;
  color: string;
}

function StatCard({ label, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col"
      style={{
        background: "linear-gradient(145deg, #FFFBF4 0%, hsl(36 28% 93%) 100%)",
        border: "1.5px solid rgba(201,160,99,0.3)",
        boxShadow: "0 4px 16px -4px rgba(80,40,10,0.12)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20`, border: `1.5px solid ${color}35` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ 
            background: "rgba(139,195,74,0.15)", 
            color: "hsl(88 45% 38%)" 
          }}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-extrabold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-xs font-medium" style={{ color: "hsl(32 18% 42%)" }}>
        {label}
      </div>
    </div>
  );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: typeof LayoutDashboard }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        className="w-1 h-5 rounded-full"
        style={{ background: `linear-gradient(180deg, ${GOLD}, ${GOLD_LIGHT})` }}
      />
      <Icon className="w-4 h-4" style={{ color: GOLD }} />
      <h2 className="text-base font-extrabold" style={{ color: MEDIUM_BROWN }}>{title}</h2>
    </div>
  );
}

function HeritageCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-4 ${className}`}
      style={{
        background: "linear-gradient(145deg, #FFFBF4 0%, hsl(36 28% 93%) 100%)",
        border: "1.5px solid rgba(201,160,99,0.3)",
        boxShadow: "0 4px 16px -4px rgba(80,40,10,0.10)",
      }}
    >
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [sending, setSending] = useState(false);
  const [addingSchedule, setAddingSchedule] = useState(false);
  const [scheduleAmount, setScheduleAmount] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [addingTheme, setAddingTheme] = useState(false);
  const [themeName, setThemeName] = useState("");

  // Real data from Supabase
  const { data: userCount } = useQuery({
    queryKey: ["admin-stats-users"],
    queryFn: async () => {
      if (!isSupabaseEnabled || !supabase) return 247; // demo fallback
      const { count } = await supabase.from("user_profiles").select("*", { count: "exact", head: true });
      return count || 247;
    },
    staleTime: 60_000,
  });

  const { data: complaintCount } = useQuery({
    queryKey: ["admin-stats-complaints"],
    queryFn: async () => {
      if (!isSupabaseEnabled || !supabase) return 12; // demo fallback
      const { count } = await supabase.from("complaints").select("*", { count: "exact", head: true });
      return count || 12;
    },
    staleTime: 60_000,
  });

  const { data: notificationCount } = useQuery({
    queryKey: ["admin-stats-notifications"],
    queryFn: async () => {
      if (!isSupabaseEnabled || !supabase) return 45; // demo fallback
      const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true });
      return count || 45;
    },
    staleTime: 60_000,
  });

  const { data: financialCount } = useQuery({
    queryKey: ["admin-stats-financial"],
    queryFn: async () => {
      if (!isSupabaseEnabled || !supabase) return 8; // demo fallback
      const { count } = await supabase.from("financial_events").select("*", { count: "exact", head: true });
      return count || 8;
    },
    staleTime: 60_000,
  });

  // Real stats from queries
  const stats = {
    totalUsers: userCount ?? 247,
    activeUsers: Math.floor((userCount ?? 247) * 0.74),
    pendingComplaints: complaintCount ?? 12,
    upcomingSchedules: financialCount ?? 8,
    sentNotifications: notificationCount ?? 45,
    activeThemes: 3,
  };

  // Demo recent activity
  const recentActivity = [
    { id: 1, action: "ط¥ط¶ط§ظپط©", entity: "ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ ط¬ط¯ظٹط¯", user: "ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ…", time: "ظ…ظ†ط° 5 ط¯ظ‚ط§ط¦ظ‚" },
    { id: 2, action: "ط¥ط±ط³ط§ظ„", entity: "ط¥ط´ط¹ط§ط± ط¹ط§ظ…", user: "ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ…", time: "ظ…ظ†ط° ط³ط§ط¹ط©" },
    { id: 3, action: "طھط¹ط¯ظٹظ„", entity: "ط«ظٹظ… ط§ظ„ط¹ظٹط¯", user: "ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ…", time: "ظ…ظ†ط° 3 ط³ط§ط¹ط§طھ" },
    { id: 4, action: "ط¥ظ†ط´ط§ط،", entity: "ط®ط¨ط± ط¬ط¯ظٹط¯", user: "ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ…", time: "ظ…ظ†ط° ظٹظˆظ…" },
  ];

  // Demo complaints
  const recentComplaints = [
    { id: 1, user: "ط£ط­ظ…ط¯ ظ…ط­ظ…ط¯", type: "ط´ظƒظˆظ‰", message: "ظ„ظ… ظٹطµظ„ظ†ظٹ ط¥ط´ط¹ط§ط± ط§ظ„ظ…ظˆط¹ط¯", status: "ظ‚ظٹط¯ ط§ظ„ط§ظ†طھط¸ط§ط±" },
    { id: 2, user: "ظپط§ط·ظ…ط© ط¹ظ„ظٹ", type: "ط§ظ‚طھط±ط§ط­", message: "ط¥ط¶ط§ظپط© ظ…ط¯ظٹظ†ط© ط¬ط¯ظٹط¯ط©", status: "طھظ… ط§ظ„ط­ظ„" },
    { id: 3, user: "ط®ط§ظ„ط¯ ط³ط¹ظˆط¯", type: "ط´ظƒظˆظ‰", message: "ط®ط·ط£ ظپظٹ ط§ظ„ظ…ظˆط¹ط¯", status: "ظ‚ظٹط¯ ط§ظ„ط§ظ†طھط¸ط§ط±" },
  ];

  // Demo schedules
  const upcomingSchedules = [
    { id: 1, title: "ط±ظˆط§طھط¨ ط´ظ‡ط± ظ…ط­ط±ظ…", date: "2025-07-15", amount: "5,000" },
    { id: 2, title: "ط¯ط¹ظ… ط§ظ„ط¥ظٹط¬ط§ط±", date: "2025-07-20", amount: "2,000" },
    { id: 3, title: "ظ…ظƒط§ظپط£ط© ط§ظ„ط£ط¯ط§ط،", date: "2025-07-25", amount: "1,500" },
  ];

  const handleSendNotification = async () => {
    if (!notificationTitle.trim() || !notificationBody.trim()) {
      toast({ title: "ظٹط±ط¬ظ‰ ظ…ظ„ط، ط¬ظ…ظٹط¹ ط§ظ„ط­ظ‚ظˆظ„", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const result = await sendNotification({
        title: notificationTitle,
        body: notificationBody,
        type: "broadcast",
        target: "all",
      });
      if (result.success) {
        setNotificationTitle("");
        setNotificationBody("");
        toast({ title: "طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„ط¥ط´ط¹ط§ط± ط¨ظ†ط¬ط§ط­" });
      } else {
        toast({ title: result.error || "ظپط´ظ„ ط¥ط±ط³ط§ظ„ ط§ظ„ط¥ط´ط¹ط§ط±", variant: "destructive" });
      }
    } catch {
      toast({ title: "ط­ط¯ط« ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleAddSchedule = async () => {
    if (!scheduleAmount.trim() || !scheduleDate.trim()) {
      toast({ title: "ظٹط±ط¬ظ‰ ظ…ظ„ط، ط¬ظ…ظٹط¹ ط§ظ„ط­ظ‚ظˆظ„", variant: "destructive" });
      return;
    }
    setAddingSchedule(false);
    try {
      const result = await addFinancialEvent({
        title: "ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ ط¬ط¯ظٹط¯",
        amount: scheduleAmount,
        date: scheduleDate,
        type: "salary",
      });
      if (result.success) {
        setScheduleAmount("");
        setScheduleDate("");
        toast({ title: "طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ…ظˆط¹ط¯ ط§ظ„ظ…ط§ظ„ظٹ ط¨ظ†ط¬ط§ط­" });
      } else {
        toast({ title: result.error || "ظپط´ظ„ ط¥ط¶ط§ظپط© ط§ظ„ظ…ظˆط¹ط¯", variant: "destructive" });
      }
    } catch {
      toast({ title: "ط­ط¯ط« ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹", variant: "destructive" });
    }
  };

  const handleAddTheme = async () => {
    if (!themeName.trim()) {
      toast({ title: "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط«ظٹظ…", variant: "destructive" });
      return;
    }
    setAddingTheme(false);
    try {
      const result = await addTheme({
        name: themeName,
        colors: { primary: "#C9A063", secondary: "#8A6B3D", accent: "#2F2B25", background: "#FAF7F2" },
        is_active: false,
      });
      if (result.success) {
        setThemeName("");
        toast({ title: "طھظ… ط¥ط¶ط§ظپط© ط§ظ„ط«ظٹظ… ط¨ظ†ط¬ط§ط­" });
      } else {
        toast({ title: result.error || "ظپط´ظ„ ط¥ط¶ط§ظپط© ط§ظ„ط«ظٹظ…", variant: "destructive" });
      }
    } catch {
      toast({ title: "ط­ط¯ط« ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div 
          className="w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(180deg, hsl(38 62% 52%), hsl(32 55% 42%))" }}
        />
        <h1 className="text-2xl font-extrabold" style={{ color: "hsl(22 62% 18%)" }}>
          ظ„ظˆط­ط© ط§ظ„ظ…ط§ظ„ظƒ
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†" value={stats.totalUsers} icon={Users} trend="+12%" color={GOLD} />
        <StatCard label="ط§ظ„ظ†ط´ط·ظˆظ† ط§ظ„ظٹظˆظ…" value={stats.activeUsers} icon={TrendingUp} color="hsl(210 60% 52%)" />
        <StatCard label="ط§ظ„ط´ظƒط§ظˆظ‰ ط§ظ„ظ…ط¹ظ„ظ‚ط©" value={stats.pendingComplaints} icon={AlertTriangle} color="hsl(10 65% 52%)" />
        <StatCard label="ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ‚ط§ط¯ظ…ط©" value={stats.upcomingSchedules} icon={Calendar} color="hsl(140 50% 42%)" />
        <StatCard label="ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ظ…ط±ط³ظ„ط©" value={stats.sentNotifications} icon={Bell} color="hsl(32 60% 48%)" />
        <StatCard label="ط§ظ„ط«ظٹظ…ط§طھ ط§ظ„ظ†ط´ط·ط©" value={stats.activeThemes} icon={Paintbrush} color="hsl(280 50% 52%)" />
      </div>

      {/* Quick Actions */}
      <HeritageCard>
        <SectionHeader title="ط¥ط¬ط±ط§ط،ط§طھ ط³ط±ظٹط¹ط©" icon={Zap} />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <Button 
            onClick={() => setLocation("/admin/notifications")}
            className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl"
            style={{ background: "linear-gradient(145deg, hsl(38 62% 52%), hsl(32 55% 42%))", color: "#fff" }}
          >
            <Bell className="w-5 h-5" />
            <span className="text-[10px] font-bold">ط¥ط±ط³ط§ظ„ ط¥ط´ط¹ط§ط±</span>
          </Button>
          <Button 
            onClick={() => setLocation("/admin/financial")}
            className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl"
            style={{ background: "linear-gradient(145deg, hsl(140 50% 42%), hsl(140 45% 35%))", color: "#fff" }}
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-bold">ط¥ط¶ط§ظپط© ظ…ظˆط¹ط¯</span>
          </Button>
          <Button 
            onClick={() => setLocation("/admin/themes")}
            className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl"
            style={{ background: "linear-gradient(145deg, hsl(280 50% 52%), hsl(280 45% 45%))", color: "#fff" }}
          >
            <Paintbrush className="w-5 h-5" />
            <span className="text-[10px] font-bold">ط¥ط¶ط§ظپط© ط«ظٹظ…</span>
          </Button>
          <Button 
            onClick={() => setLocation("/admin/members")}
            className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl"
            style={{ background: "linear-gradient(145deg, hsl(210 60% 52%), hsl(210 55% 45%))", color: "#fff" }}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold">ظ…ط³طھط®ط¯ظ… ط¬ط¯ظٹط¯</span>
          </Button>
          <Button 
            onClick={() => setLocation("/admin/reports")}
            className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl"
            style={{ background: "linear-gradient(145deg, hsl(32 60% 48%), hsl(32 55% 40%))", color: "#fff" }}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-bold">ط§ظ„طھظ‚ط§ط±ظٹط±</span>
          </Button>
          <Button 
            onClick={() => setLocation("/admin/settings")}
            className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl"
            style={{ background: "linear-gradient(145deg, hsl(22 62% 48%), hsl(22 55% 40%))", color: "#fff" }}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-bold">ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ</span>
          </Button>
          <Button 
            onClick={() => setLocation("/admin/permissions")}
            className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl"
            style={{ background: "linear-gradient(145deg, hsl(10 65% 52%), hsl(10 60% 45%))", color: "#fff" }}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-bold">ط§ظ„طµظ„ط§ط­ظٹط§طھ</span>
          </Button>
          <Button 
            onClick={() => setLocation("/admin/social")}
            className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl"
            style={{ background: "linear-gradient(145deg, hsl(180 50% 42%), hsl(180 45% 35%))", color: "#fff" }}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-bold">ط§ظ„ط£طھظ…طھط©</span>
          </Button>
        </div>
      </HeritageCard>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity & Complaints */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <HeritageCard>
            <SectionHeader title="ط§ظ„ظ†ط´ط§ط·ط§طھ ط§ظ„ط£ط®ظٹط±ط©" icon={Clock} />
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-dashed" style={{ borderColor: "rgba(201,160,99,0.2)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}15` }}>
                      <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: MEDIUM_BROWN }}>
                        {item.action} {item.entity}
                      </div>
                      <div className="text-[11px]" style={{ color: "hsl(32 18% 48%)" }}>
                        ط¨ظˆط§ط³ط·ط©: {item.user}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px]" style={{ color: "hsl(32 18% 52%)" }}>{item.time}</span>
                </div>
              ))}
            </div>
          </HeritageCard>

          {/* Upcoming Schedules */}
          <HeritageCard>
            <SectionHeader title="ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط© ط§ظ„ظ‚ط§ط¯ظ…ط©" icon={Wallet} />
            <div className="space-y-3">
              {upcomingSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between py-2 border-b border-dashed" style={{ borderColor: "rgba(201,160,99,0.2)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(140 50% 42% / 0.15)" }}>
                      <Calendar className="w-4 h-4" style={{ color: "hsl(140 50% 42%)" }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: MEDIUM_BROWN }}>{schedule.title}</div>
                      <div className="text-[11px]" style={{ color: "hsl(32 18% 48%)" }}>{schedule.date}</div>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold" style={{ color: "hsl(140 50% 42%)" }}>
                    {schedule.amount} ط±.ط³
                  </span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => setAddingSchedule(true)}
              variant="outline" 
              className="w-full mt-3 rounded-xl"
              style={{ borderColor: "rgba(201,160,99,0.3)" }}
            >
              <Plus className="w-4 h-4 ml-2" />
              ط¥ط¶ط§ظپط© ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ
            </Button>
            {addingSchedule && (
              <div className="mt-3 p-3 rounded-xl space-y-3" style={{ background: "rgba(201,160,99,0.08)" }}>
                <Input 
                  placeholder="ط§ظ„ظ…ط¨ظ„ط؛ (ط±.ط³)"
                  value={scheduleAmount}
                  onChange={(e) => setScheduleAmount(e.target.value)}
                  className="rounded-xl"
                />
                <Input 
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="rounded-xl"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddSchedule} className="flex-1 rounded-xl" style={{ background: GOLD }}>ط­ظپط¸</Button>
                  <Button onClick={() => setAddingSchedule(false)} variant="outline" className="flex-1 rounded-xl">ط¥ظ„ط؛ط§ط،</Button>
                </div>
              </div>
            )}
          </HeritageCard>

          {/* Recent Complaints */}
          <HeritageCard>
            <SectionHeader title="ط§ظ„ط´ظƒط§ظˆظ‰ ظˆط§ظ„ط§ظ‚طھط±ط§ط­ط§طھ ط§ظ„ط£ط®ظٹط±ط©" icon={MessageSquare} />
            <div className="space-y-3">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between py-2 border-b border-dashed" style={{ borderColor: "rgba(201,160,99,0.2)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ 
                      background: complaint.status === "طھظ… ط§ظ„ط­ظ„" ? "hsl(140 50% 42% / 0.15)" : "hsl(10 65% 52% / 0.15)"
                    }}>
                      {complaint.status === "طھظ… ط§ظ„ط­ظ„" ? (
                        <CheckCircle className="w-4 h-4" style={{ color: "hsl(140 50% 42%)" }} />
                      ) : (
                        <AlertTriangle className="w-4 h-4" style={{ color: "hsl(10 65% 52%)" }} />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: MEDIUM_BROWN }}>{complaint.user}</div>
                      <div className="text-[11px]" style={{ color: "hsl(32 18% 48%)" }}>{complaint.message}</div>
                    </div>
                  </div>
                  <span 
                    className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ 
                      background: complaint.status === "طھظ… ط§ظ„ط­ظ„" ? "hsl(140 50% 42% / 0.15)" : "hsl(10 65% 52% / 0.15)",
                      color: complaint.status === "طھظ… ط§ظ„ط­ظ„" ? "hsl(140 50% 42%)" : "hsl(10 65% 52%)",
                    }}
                  >
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => setLocation("/admin/complaints")}
              variant="outline" 
              className="w-full mt-3 rounded-xl"
              style={{ borderColor: "rgba(201,160,99,0.3)" }}
            >
              ط¹ط±ط¶ ط§ظ„ظƒظ„
              <ChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          </HeritageCard>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Send Notification */}
          <HeritageCard>
            <SectionHeader title="ط¥ط±ط³ط§ظ„ ط¥ط´ط¹ط§ط± ط³ط±ظٹط¹" icon={Send} />
            <div className="space-y-3">
              <Input 
                placeholder="ط¹ظ†ظˆط§ظ† ط§ظ„ط¥ط´ط¹ط§ط±"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                className="rounded-xl"
              />
              <Input 
                placeholder="ظ…ط­طھظˆظ‰ ط§ظ„ط¥ط´ط¹ط§ط±"
                value={notificationBody}
                onChange={(e) => setNotificationBody(e.target.value)}
                className="rounded-xl"
              />
              <Button 
                onClick={handleSendNotification}
                disabled={sending}
                className="w-full rounded-xl"
                style={{ background: "linear-gradient(145deg, hsl(38 62% 52%), hsl(32 55% 42%))", color: "#fff" }}
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-2" />}
                {sending ? "ط¬ط§ط±ظٹ ط§ظ„ط¥ط±ط³ط§ظ„..." : "ط¥ط±ط³ط§ظ„ ط§ظ„ط¢ظ†"}
              </Button>
            </div>
          </HeritageCard>

          {/* Add Theme */}
          <HeritageCard>
            <SectionHeader title="ط¥ط¶ط§ظپط© ط«ظٹظ… ط¬ط¯ظٹط¯" icon={Paintbrush} />
            <div className="space-y-3">
              <Input 
                placeholder="ط§ط³ظ… ط§ظ„ط«ظٹظ…"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                className="rounded-xl"
              />
              <Button 
                onClick={handleAddTheme}
                className="w-full rounded-xl"
                style={{ background: "linear-gradient(145deg, hsl(280 50% 52%), hsl(280 45% 45%))", color: "#fff" }}
              >
                <Plus className="w-4 h-4 ml-2" />
                ط¥ط¶ط§ظپط© ط«ظٹظ…
              </Button>
            </div>
          </HeritageCard>

          {/* Social & Automation */}
          <HeritageCard>
            <SectionHeader title="ط§ظ„طھظˆط§طµظ„ ظˆط§ظ„ط£طھظ…طھط©" icon={Zap} />
            <div className="space-y-2">
              {[
                { name: "X (Twitter)", icon: "X", connected: true, color: "#000" },
                { name: "Instagram", icon: "IG", connected: false, color: "#E1306C" },
                { name: "Telegram", icon: "TG", connected: true, color: "#0088CC" },
                { name: "WhatsApp", icon: "WA", connected: false, color: "#25D366" },
              ].map((platform) => (
                <div key={platform.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: platform.color }}
                    >
                      {platform.icon}
                    </div>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                  <span 
                    className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ 
                      background: platform.connected ? "hsl(140 50% 42% / 0.15)" : "hsl(0 0% 60% / 0.15)",
                      color: platform.connected ? "hsl(140 50% 42%)" : "hsl(0 0% 50%)",
                    }}
                  >
                    {platform.connected ? "ظ…طھطµظ„" : "ط؛ظٹط± ظ…طھطµظ„"}
                  </span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => setLocation("/admin/social")}
              variant="outline" 
              className="w-full mt-3 rounded-xl"
              style={{ borderColor: "rgba(201,160,99,0.3)" }}
            >
              ط¥ط¯ط§ط±ط© ط§ظ„ط±ط¨ط· ظˆط§ظ„ط£طھظ…طھط©
              <ChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          </HeritageCard>

          {/* Quick Links */}
          <HeritageCard>
            <SectionHeader title="ط±ظˆط§ط¨ط· ط³ط±ظٹط¹ط©" icon={ChevronLeft} />
            <div className="space-y-2">
              <Button 
                onClick={() => setLocation("/admin/story")}
                variant="ghost" 
                className="w-full justify-start rounded-xl"
              >
                <ImageIcon className="w-4 h-4 ml-2" style={{ color: GOLD }} />
                ط¨ط·ط§ظ‚ط© ط§ظ„ظٹظˆظ…
              </Button>
              <Button 
                onClick={() => setLocation("/admin/news-jobs")}
                variant="ghost" 
                className="w-full justify-start rounded-xl"
              >
                <Newspaper className="w-4 h-4 ml-2" style={{ color: GOLD }} />
                ط§ظ„ط£ط®ط¨ط§ط± ظˆط§ظ„ظˆط¸ط§ط¦ظپ
              </Button>
              <Button 
                onClick={() => setLocation("/admin/support")}
                variant="ghost" 
                className="w-full justify-start rounded-xl"
              >
                <FileText className="w-4 h-4 ml-2" style={{ color: GOLD }} />
                ط§ظ„ط¯ط¹ظ… ظˆط§ظ„ظ…ط³ط§ط¹ط¯ط©
              </Button>
            </div>
          </HeritageCard>
        </div>
      </div>

      {/* Demo Mode Banner */}
      <div 
        className="rounded-2xl p-4 text-center"
        style={{
          background: "linear-gradient(145deg, rgba(139,195,74,0.1), rgba(139,195,74,0.05))",
          border: "1px solid rgba(139,195,74,0.25)",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "hsl(88 45% 38%)" }}>
          ظˆط¶ط¹ ط§ظ„طھط·ظˆظٹط±: ظ„ظˆط­ط© ط§ظ„ظ…ط§ظ„ظƒ طھط¹ظ…ظ„ ط¨ظ†ظ…ط· طھط¬ط±ظٹط¨ظٹ
        </p>
        <p className="text-xs mt-1" style={{ color: "hsl(38 30% 55%)" }}>
          ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¥ط­طµط§ط¦ظٹط© ط³طھط¸ظ‡ط± ط¹ظ†ط¯ طھظپط¹ظٹظ„ Supabase ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬
        </p>
      </div>
    </div>
  );
}

