/**
 * useGatewayData.ts â€” ظ…ظˆط§ط¹ظٹط¯ظƒ Phase 12H
 *
 * React Query hooks طھظڈط؛ظ„ظ‘ظپ Data Gateway ظ„ظ„ظ‚ط±ط§ط،ط© ظپظ‚ط·.
 *
 * ظ‡ط°ظ‡ ط§ظ„ظ€ hooks:
 * - طھط¹ظ…ظ„ ظ„ط£ظˆط¶ط§ط¹ api / supabase_shadow / supabase ط­ط³ط¨ DATA_SOURCE_MODE.
 * - طھظڈط¹ظٹط¯ ظ†ظپط³ shape ط§ظ„ظ€ useQuery ط§ظ„ظ‚ظٹط§ط³ظٹط© (data, isLoading, isError).
 * - طھط³طھط®ط¯ظ… query keys ظ…ط³طھظ‚ظ„ط© ط¨ظ€ prefix "gw:" ظ„طھط¬ظ†ط¨ طھط¹ط§ط±ط¶ ظ…ط¹ Orval cache.
 * - طھظڈط³طھط®ط¯ظ… ظپظ‚ط· ظپظٹ طµظپط­ط§طھ ط§ظ„ظ‚ط±ط§ط،ط© ط§ظ„ط®ط§ظ„طµط© (ط¨ط¯ظˆظ† mutations).
 *
 * ط§ظ„طµظپط­ط§طھ ط§ظ„ظ…ظڈط±طھط¨ط·ط© (ط¨ط¹ط¯ Phase 12O):
 *
 * Gateway Complete (ظ‚ط±ط§ط،ط© + ظƒطھط§ط¨ط©):
 *   - CalendarPage        (appointments â€” 12N)
 *   - HomePage            (upcoming appointments + financial countdown â€” 12N/12O)
 *   - FinancePage         (financial_events â€” 12O)
 *   - NotificationsPage   (notifications read/mark/delete â€” 12J/12K)
 *   - AdminNotifications  (notifications read/delete â€” 12Kط› send ظٹط¨ظ‚ظ‰ API)
 *   - AdminNewsJobs       (news + jobs â€” 12L)
 *   - AdminThemes         (themes â€” 12M)
 *   - AdminStory          (story_templates â€” 12M)
 *   - AdminMessages       (daily_messages â€” 12M)
 *
 * Gateway Read Only:
 *   - CentersNewsPage, CentersJobsPage, AccountPage, StoryPage (12H)
 *   - TopBar unread count (12K)
 *
 * API Intentionally (ظ„ط§ طھط­ظˆظٹظ„ ظ…ط®ط·ط·):
 *   - prayer times, today message â€” server-computed endpoints
 *   - AdminDashboard stats + audit logs â€” server-computed
 *   - AdminEvents (public_events) â€” ظ„ظٹط³ ظپظٹ Supabase schema
 *   - AdminFinancial â€” admin view ظƒظ„ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ† (ظ„ط§ RLS)
 *   - AdminReports (audit_logs) â€” server-only
 *   - CentersComplaintsPage write â€” Orval form submission
 *   - AdminNotifications send â€” fan-out server-side
 */

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  gwGetNews,
  gwGetJobs,
  gwGetThemes,
  gwGetStoryTemplates,
  gwGetDailyMessages,
  gwGetAppointments,
  gwGetUpcomingAppointments,
  gwGetFinancialEvents,
  gwGetFinancialCountdown,
  gwGetNotifications,
  gwGetUnreadNotificationsCount,
  gwGetComplaints,
} from "@/lib/dataGateway";
import type {
  NewsItem,
  Job,
  Theme,
  StoryTemplate,
  DailyMessage,
  Appointment,
  FinancialEvent,
  Notification,
  Complaint,
} from "@api-client";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Query Keys
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const gwQueryKeys = {
  news: ["gw", "news"] as const,
  jobs: ["gw", "jobs"] as const,
  themes: ["gw", "themes"] as const,
  storyTemplates: ["gw", "story-templates"] as const,
  dailyMessages: ["gw", "daily-messages"] as const,
  appointments: ["gw", "appointments"] as const,
  upcomingAppointments: ["gw", "upcoming-appointments"] as const,
  financialEvents: ["gw", "financial-events"] as const,
  financialCountdown: ["gw", "financial-countdown"] as const,
  notifications: ["gw", "notifications"] as const,
  unreadCount: ["gw", "unread-count"] as const,
  complaints: ["gw", "complaints"] as const,
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin-managed: ط§ظ„ط£ط®ط¨ط§ط±
// CentersNewsPage
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayNews(): UseQueryResult<NewsItem[] | null> {
  return useQuery({
    queryKey: gwQueryKeys.news,
    queryFn: () => gwGetNews(),
    staleTime: 60_000,
    retry: 1,
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin-managed: ط§ظ„ظˆط¸ط§ط¦ظپ
// CentersJobsPage
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayJobs(): UseQueryResult<Job[] | null> {
  return useQuery({
    queryKey: gwQueryKeys.jobs,
    queryFn: () => gwGetJobs(),
    staleTime: 60_000,
    retry: 1,
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin-managed: ط§ظ„ط«ظٹظ…ط§طھ
// AccountPage â€” theme picker
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayThemes(): UseQueryResult<Theme[] | null> {
  return useQuery({
    queryKey: gwQueryKeys.themes,
    queryFn: () => gwGetThemes(),
    staleTime: 300_000,
    retry: 1,
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin-managed: ظ‚ظˆط§ظ„ط¨ ط§ظ„ط³طھظˆط±ظٹ
// StoryPage â€” read-only display
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayStoryTemplates(): UseQueryResult<StoryTemplate[] | null> {
  return useQuery({
    queryKey: gwQueryKeys.storyTemplates,
    queryFn: () => gwGetStoryTemplates(),
    staleTime: 120_000,
    retry: 1,
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin-managed: ط±ط³ط§ط¦ظ„ ط§ظ„ظٹظˆظ… (ظ‚ط§ط¦ظ…ط© ظƒط§ظ…ظ„ط©)
// ظ…ظ„ط§ط­ط¸ط©: StoryPage / HomePage ظٹط³طھط®ط¯ظ…ط§ظ† useGetTodayMessage ظ…ظ† Orval
//   ظ„ط£ظ†ظ‡ endpoint ط®ط§طµ (/api/daily-messages/today) â€” ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayDailyMessages(): UseQueryResult<DailyMessage[] | null> {
  return useQuery({
    queryKey: gwQueryKeys.dailyMessages,
    queryFn: () => gwGetDailyMessages(),
    staleTime: 60_000,
    retry: 1,
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Phase 12N: ط§ظ„ظ…ظˆط§ط¹ظٹط¯ â€” ظ‚ط±ط§ط،ط© + upcoming
// CalendarPage + HomePage ظٹط³طھط®ط¯ظ…ط§ظ† ظ‡ط°ظ‡ ط§ظ„ظ€ hooks
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayAppointments(): UseQueryResult<Appointment[] | null> {
  return useQuery({
    queryKey: gwQueryKeys.appointments,
    queryFn: () => gwGetAppointments(),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useGatewayUpcomingAppointments(limit = 5): UseQueryResult<Appointment[] | null> {
  return useQuery({
    queryKey: [...gwQueryKeys.upcomingAppointments, limit] as const,
    queryFn: () => gwGetUpcomingAppointments(limit),
    staleTime: 30_000,
    retry: 1,
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// User-owned: ط§ظ„ط£ط­ط¯ط§ط« ط§ظ„ظ…ط§ظ„ظٹط© â€” Phase 12O (ظ‚ط±ط§ط،ط© + ظƒطھط§ط¨ط© Gateway)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayFinancialEvents(): UseQueryResult<FinancialEvent[] | null> {
  return useQuery({
    queryKey: gwQueryKeys.financialEvents,
    queryFn: () => gwGetFinancialEvents(),
    staleTime: 30_000,
    retry: 1,
  });
}

export function useGatewayFinancialCountdown(): UseQueryResult<Array<{
  id: number; name: string; type: string; next_date: string; days_remaining: number; amount: number | null;
}> | null> {
  return useQuery({
    queryKey: gwQueryKeys.financialCountdown,
    queryFn: () => gwGetFinancialCountdown(),
    staleTime: 60_000,
    retry: 1,
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// User-owned: ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ (ظ‚ط±ط§ط،ط© ظپظ‚ط·)
// ظ…ظ„ط§ط­ط¸ط©: NotificationsPage ظٹط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval â€” mark-read + delete ظ…ط®طھظ„ط·ط©
//   ظ‡ط°ط§ hook ظ…طھط§ط­ ظ„ظ„ط§ط³طھط®ط¯ط§ظ… ط§ظ„ظ…ط³طھظ‚ط¨ظ„ظٹ ظپظٹ Phase 12I
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayNotifications(): UseQueryResult<Notification[] | null> {
  return useQuery({
    queryKey: gwQueryKeys.notifications,
    queryFn: () => gwGetNotifications(),
    staleTime: 20_000,
    retry: 1,
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// User-owned: ط¹ط¯ط¯ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط؛ظٹط± ط§ظ„ظ…ظ‚ط±ظˆط،ط©
// TopBar â€” ظٹطھط­ط¯ط« ط¨ط¹ط¯ ظƒظ„ mark-read / mark-all-read / delete / send
//
// mode=api/shadow: GET /api/notifications/unread-count â†’ { count }
// mode=supabase: Supabase COUNT WHERE is_read=false AND user_id=current
//               fallback ط¥ظ„ظ‰ API ط¹ظ†ط¯ ظپط´ظ„ Supabase
// staleTime ظ…ظ†ط®ظپط¶ (10s) ظ„ط¶ظ…ط§ظ† طھط­ط¯ظٹط« ظپظˆط±ظٹ ط¨ط¹ط¯ ط§ظ„ط¹ظ…ظ„ظٹط§طھ
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayUnreadCount(): UseQueryResult<number | null> {
  return useQuery({
    queryKey: gwQueryKeys.unreadCount,
    queryFn: () => gwGetUnreadNotificationsCount(),
    staleTime: 10_000,
    retry: 1,
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Support: ط§ظ„ط´ظƒط§ظˆظ‰ (admin read ظپظ‚ط·)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function useGatewayComplaints(): UseQueryResult<Complaint[] | null> {
  return useQuery({
    queryKey: gwQueryKeys.complaints,
    queryFn: () => gwGetComplaints(),
    staleTime: 30_000,
    retry: 1,
  });
}

