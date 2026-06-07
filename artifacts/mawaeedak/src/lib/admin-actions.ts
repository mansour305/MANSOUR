/**
 * Admin Actions — Centralized Admin Panel Action Handlers
 * 
 * This module contains all action handlers for the admin panel.
 * All handlers use Supabase when available, falling back to localStorage.
 */

import { adminStorage, type AdminUser, type FinancialEvent, type OfficialPrayerTime, type OfficialFinancialDate, type DailyMessage, type StoryTemplate, type Theme, type AdminNotification, type Complaint, type NewsItem, type JobItem, type AdminSettings, type SocialLink, type SupportTicket } from "./admin-storage";
import { showTopNotification } from "@/components/layout/TopNotificationBanner";

// Generic result type
export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Helper to create async wrapper with loading state
export function withLoadingState<T>(
  action: () => Promise<ActionResult<T>>,
  onLoading: (loading: boolean) => void,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): () => Promise<void> {
  return async () => {
    onLoading(true);
    try {
      const result = await action();
      if (result.success) {
        onSuccess?.(result.data as T);
        showTopNotification(result.success ? "تم بنجاح" : "حدث خطأ", result.success ? "success" : "error");
      } else {
        onError?.(result.error || "حدث خطأ غير معروف");
        showTopNotification(result.error || "حدث خطأ", "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      onError?.(errorMsg);
      showTopNotification(errorMsg, "error");
    } finally {
      onLoading(false);
    }
  };
}

// ============================================
// USERS ACTIONS
// ============================================

export async function fetchUsers(): Promise<ActionResult<AdminUser[]>> {
  try {
    const users = adminStorage.getUsers();
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateUserRole(userId: string, role: AdminUser["role"]): Promise<ActionResult<AdminUser>> {
  try {
    const user = adminStorage.updateUser(userId, { role });
    if (!user) return { success: false, error: "المستخدم غير موجود" };
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function toggleUserBan(userId: string, banned: boolean): Promise<ActionResult<AdminUser>> {
  try {
    const user = adminStorage.updateUser(userId, { status: banned ? "banned" : "active" });
    if (!user) return { success: false, error: "المستخدم غير موجود" };
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteUser(userId);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// FINANCIAL EVENTS ACTIONS
// ============================================

export async function fetchFinancialEvents(): Promise<ActionResult<FinancialEvent[]>> {
  try {
    const events = adminStorage.getFinancialEvents();
    return { success: true, data: events };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addFinancialEvent(data: { title: string; amount: string; date: string; type: FinancialEvent["type"] }): Promise<ActionResult<FinancialEvent>> {
  try {
    const event = adminStorage.addFinancialEvent({ ...data, status: "draft" });
    return { success: true, data: event };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateFinancialEvent(id: string, data: Partial<FinancialEvent>): Promise<ActionResult<FinancialEvent>> {
  try {
    const event = adminStorage.updateFinancialEvent(id, data);
    if (!event) return { success: false, error: "الموعد غير موجود" };
    return { success: true, data: event };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteFinancialEvent(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteFinancialEvent(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function toggleFinancialEventStatus(id: string, published: boolean): Promise<ActionResult<FinancialEvent>> {
  try {
    const event = adminStorage.updateFinancialEvent(id, { status: published ? "published" : "draft" });
    if (!event) return { success: false, error: "الموعد غير موجود" };
    return { success: true, data: event };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// OFFICIAL PRAYER TIMES ACTIONS
// ============================================

export async function fetchOfficialPrayerTimes(): Promise<ActionResult<OfficialPrayerTime[]>> {
  try {
    const records = adminStorage.getOfficialPrayerTimes();
    return { success: true, data: records };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addOfficialPrayerTime(data: Omit<OfficialPrayerTime, "id" | "created_at" | "updated_at">): Promise<ActionResult<OfficialPrayerTime>> {
  try {
    const record = adminStorage.addOfficialPrayerTime(data);
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateOfficialPrayerTime(id: string, data: Partial<OfficialPrayerTime>): Promise<ActionResult<OfficialPrayerTime>> {
  try {
    const record = adminStorage.updateOfficialPrayerTime(id, data);
    if (!record) return { success: false, error: "السجل غير موجود" };
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteOfficialPrayerTime(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteOfficialPrayerTime(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function confirmPrayerTime(id: string): Promise<ActionResult<OfficialPrayerTime>> {
  try {
    const record = adminStorage.updateOfficialPrayerTime(id, { is_confirmed: true });
    if (!record) return { success: false, error: "السجل غير موجود" };
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// OFFICIAL FINANCIAL DATES ACTIONS
// ============================================

export async function fetchOfficialFinancialDates(): Promise<ActionResult<OfficialFinancialDate[]>> {
  try {
    const dates = adminStorage.getOfficialFinancialDates();
    return { success: true, data: dates };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addOfficialFinancialDate(data: Omit<OfficialFinancialDate, "id" | "created_at" | "updated_at">): Promise<ActionResult<OfficialFinancialDate>> {
  try {
    const date = adminStorage.addOfficialFinancialDate(data);
    return { success: true, data: date };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateOfficialFinancialDate(id: string, data: Partial<OfficialFinancialDate>): Promise<ActionResult<OfficialFinancialDate>> {
  try {
    const date = adminStorage.updateOfficialFinancialDate(id, data);
    if (!date) return { success: false, error: "التاريخ غير موجود" };
    return { success: true, data: date };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteOfficialFinancialDate(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteOfficialFinancialDate(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function adjustFinancialDate(id: string, newDate: string, reason: string, type: "advance" | "delay"): Promise<ActionResult<OfficialFinancialDate>> {
  try {
    const date = adminStorage.updateOfficialFinancialDate(id, {
      occurrence_date_gregorian: newDate,
      adjustment_reason: reason,
      adjustment_type: type,
    });
    if (!date) return { success: false, error: "التاريخ غير موجود" };
    return { success: true, data: date };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// DAILY MESSAGES ACTIONS
// ============================================

export async function fetchDailyMessages(): Promise<ActionResult<DailyMessage[]>> {
  try {
    const messages = adminStorage.getDailyMessages();
    return { success: true, data: messages };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addDailyMessage(data: Omit<DailyMessage, "id" | "created_at" | "updated_at">): Promise<ActionResult<DailyMessage>> {
  try {
    const message = adminStorage.addDailyMessage(data);
    return { success: true, data: message };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateDailyMessage(id: string, data: Partial<DailyMessage>): Promise<ActionResult<DailyMessage>> {
  try {
    const message = adminStorage.updateDailyMessage(id, data);
    if (!message) return { success: false, error: "الرسالة غير موجودة" };
    return { success: true, data: message };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteDailyMessage(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteDailyMessage(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function setTodayMessage(id: string): Promise<ActionResult<DailyMessage>> {
  try {
    // First, unset all other today flags
    const messages = adminStorage.getDailyMessages();
    messages.forEach(m => {
      if (m.is_today && m.id !== id) {
        adminStorage.updateDailyMessage(m.id, { is_today: false });
      }
    });
    // Then set this one as today
    const message = adminStorage.updateDailyMessage(id, { is_today: true });
    if (!message) return { success: false, error: "الرسالة غير موجودة" };
    return { success: true, data: message };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// STORY TEMPLATES ACTIONS
// ============================================

export async function fetchStoryTemplates(): Promise<ActionResult<StoryTemplate[]>> {
  try {
    const templates = adminStorage.getStoryTemplates();
    return { success: true, data: templates };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addStoryTemplate(data: Omit<StoryTemplate, "id" | "created_at" | "updated_at">): Promise<ActionResult<StoryTemplate>> {
  try {
    const template = adminStorage.addStoryTemplate(data);
    return { success: true, data: template };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateStoryTemplate(id: string, data: Partial<StoryTemplate>): Promise<ActionResult<StoryTemplate>> {
  try {
    const template = adminStorage.updateStoryTemplate(id, data);
    if (!template) return { success: false, error: "القالب غير موجود" };
    return { success: true, data: template };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteStoryTemplate(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteStoryTemplate(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// THEMES ACTIONS
// ============================================

export async function fetchThemes(): Promise<ActionResult<Theme[]>> {
  try {
    const themes = adminStorage.getThemes();
    return { success: true, data: themes };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addTheme(data: Omit<Theme, "id" | "created_at" | "updated_at">): Promise<ActionResult<Theme>> {
  try {
    const theme = adminStorage.addTheme(data);
    return { success: true, data: theme };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateTheme(id: string, data: Partial<Theme>): Promise<ActionResult<Theme>> {
  try {
    const theme = adminStorage.updateTheme(id, data);
    if (!theme) return { success: false, error: "الثيم غير موجود" };
    return { success: true, data: theme };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteTheme(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteTheme(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function activateTheme(id: string): Promise<ActionResult<Theme>> {
  try {
    adminStorage.activateTheme(id);
    const themes = adminStorage.getThemes();
    const activated = themes.find(t => t.id === id);
    if (!activated) return { success: false, error: "الثيم غير موجود" };
    return { success: true, data: activated };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// NOTIFICATIONS ACTIONS
// ============================================

export async function fetchNotifications(): Promise<ActionResult<AdminNotification[]>> {
  try {
    const notifications = adminStorage.getNotifications();
    return { success: true, data: notifications };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function sendNotification(data: { title: string; body: string; target: "all" | string[] }): Promise<ActionResult<AdminNotification>> {
  try {
    const notification = adminStorage.addNotification({
      ...data,
      type: "broadcast",
      sent_at: new Date().toISOString(),
    });
    return { success: true, data: notification };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function scheduleNotification(data: { title: string; body: string; target: "all" | string[]; scheduled_for: string }): Promise<ActionResult<AdminNotification>> {
  try {
    const notification = adminStorage.addNotification({
      ...data,
      type: "broadcast",
    });
    return { success: true, data: notification };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteNotification(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteNotification(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getNotificationLog(): Promise<ActionResult<any[]>> {
  try {
    const log = adminStorage.getNotificationLog();
    return { success: true, data: log };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// COMPLAINTS ACTIONS
// ============================================

export async function fetchComplaints(): Promise<ActionResult<Complaint[]>> {
  try {
    const complaints = adminStorage.getComplaints();
    return { success: true, data: complaints };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function replyToComplaint(id: string, reply: string): Promise<ActionResult<Complaint>> {
  try {
    const complaint = adminStorage.updateComplaint(id, { admin_reply: reply, status: "in_progress" });
    if (!complaint) return { success: false, error: "الشكوى غير موجودة" };
    return { success: true, data: complaint };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateComplaintStatus(id: string, status: Complaint["status"]): Promise<ActionResult<Complaint>> {
  try {
    const complaint = adminStorage.updateComplaint(id, { status });
    if (!complaint) return { success: false, error: "الشكوى غير موجودة" };
    return { success: true, data: complaint };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteComplaint(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteComplaint(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// NEWS ACTIONS
// ============================================

export async function fetchNews(): Promise<ActionResult<NewsItem[]>> {
  try {
    const news = adminStorage.getNews();
    return { success: true, data: news };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addNews(data: Omit<NewsItem, "id" | "created_at" | "updated_at">): Promise<ActionResult<NewsItem>> {
  try {
    const newsItem = adminStorage.addNews(data);
    return { success: true, data: newsItem };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateNews(id: string, data: Partial<NewsItem>): Promise<ActionResult<NewsItem>> {
  try {
    const newsItem = adminStorage.updateNews(id, data);
    if (!newsItem) return { success: false, error: "الخبر غير موجود" };
    return { success: true, data: newsItem };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteNews(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteNews(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function toggleNewsStatus(id: string, published: boolean): Promise<ActionResult<NewsItem>> {
  try {
    const newsItem = adminStorage.updateNews(id, { status: published ? "published" : "draft" });
    if (!newsItem) return { success: false, error: "الخبر غير موجود" };
    return { success: true, data: newsItem };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// JOBS ACTIONS
// ============================================

export async function fetchJobs(): Promise<ActionResult<JobItem[]>> {
  try {
    const jobs = adminStorage.getJobs();
    return { success: true, data: jobs };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addJob(data: Omit<JobItem, "id" | "created_at" | "updated_at">): Promise<ActionResult<JobItem>> {
  try {
    const job = adminStorage.addJob(data);
    return { success: true, data: job };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateJob(id: string, data: Partial<JobItem>): Promise<ActionResult<JobItem>> {
  try {
    const job = adminStorage.updateJob(id, data);
    if (!job) return { success: false, error: "الوظيفة غير موجودة" };
    return { success: true, data: job };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteJob(id: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteJob(id);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function toggleJobStatus(id: string, published: boolean): Promise<ActionResult<JobItem>> {
  try {
    const job = adminStorage.updateJob(id, { status: published ? "published" : "draft" });
    if (!job) return { success: false, error: "الوظيفة غير موجودة" };
    return { success: true, data: job };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// REPORTS ACTIONS
// ============================================

export async function fetchReportsLog(): Promise<ActionResult<any[]>> {
  try {
    const log = adminStorage.getReportsLog();
    return { success: true, data: log };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function addReportLog(action: string, entityType: string, entityId: string, details: string): Promise<ActionResult> {
  try {
    adminStorage.addReportLog({
      action,
      entity_type: entityType,
      entity_id: entityId,
      user_id: "admin",
      details,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export function exportReportsToCSV(logs: any[]): void {
  const headers = ["التاريخ", "الإجراء", "الكيان", "التفاصيل"];
  const rows = logs.map(log => [
    new Date(log.created_at).toLocaleDateString("ar-SA"),
    log.action,
    log.entity_type,
    log.details,
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `reports_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

// ============================================
// SETTINGS ACTIONS
// ============================================

export async function fetchSettings(): Promise<ActionResult<AdminSettings>> {
  try {
    const settings = adminStorage.getSettings();
    return { success: true, data: settings };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateSettings(updates: Partial<AdminSettings>): Promise<ActionResult<AdminSettings>> {
  try {
    const settings = adminStorage.updateSettings(updates);
    return { success: true, data: settings };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// SOCIAL LINKS ACTIONS
// ============================================

export async function fetchSocialLinks(): Promise<ActionResult<SocialLink[]>> {
  try {
    const links = adminStorage.getSocialLinks();
    return { success: true, data: links };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateSocialLink(platform: SocialLink["platform"], data: Partial<SocialLink>): Promise<ActionResult<SocialLink>> {
  try {
    const link = adminStorage.updateSocialLink(platform, data);
    if (!link) return { success: false, error: "المنصة غير موجودة" };
    return { success: true, data: link };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function connectSocialPlatform(platform: SocialLink["platform"], username: string): Promise<ActionResult<SocialLink>> {
  try {
    const link = adminStorage.updateSocialLink(platform, { is_connected: true, username });
    if (!link) return { success: false, error: "المنصة غير موجودة" };
    return { success: true, data: link };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function disconnectSocialPlatform(platform: SocialLink["platform"]): Promise<ActionResult<SocialLink>> {
  try {
    const link = adminStorage.updateSocialLink(platform, { is_connected: false, username: "", access_token: undefined });
    if (!link) return { success: false, error: "المنصة غير موجودة" };
    return { success: true, data: link };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================
// SUPPORT TICKETS ACTIONS
// ============================================

export async function fetchSupportTickets(): Promise<ActionResult<SupportTicket[]>> {
  try {
    const tickets = adminStorage.getSupportTickets();
    return { success: true, data: tickets };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function replyToTicket(ticketId: string, message: string): Promise<ActionResult<SupportTicket>> {
  try {
    const success = adminStorage.addTicketReply(ticketId, { sender: "admin", message });
    if (!success) return { success: false, error: "التذكرة غير موجودة" };
    adminStorage.updateSupportTicket(ticketId, { status: "in_progress" });
    const ticket = adminStorage.getSupportTickets().find(t => t.id === ticketId);
    if (!ticket) return { success: false, error: "التذكرة غير موجودة" };
    return { success: true, data: ticket };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateTicketStatus(ticketId: string, status: SupportTicket["status"]): Promise<ActionResult<SupportTicket>> {
  try {
    const ticket = adminStorage.updateSupportTicket(ticketId, { status });
    if (!ticket) return { success: false, error: "التذكرة غير موجودة" };
    return { success: true, data: ticket };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function closeTicket(ticketId: string): Promise<ActionResult<SupportTicket>> {
  try {
    const ticket = adminStorage.updateSupportTicket(ticketId, { status: "closed" });
    if (!ticket) return { success: false, error: "التذكرة غير موجودة" };
    return { success: true, data: ticket };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteTicket(ticketId: string): Promise<ActionResult> {
  try {
    const success = adminStorage.deleteSupportTicket(ticketId);
    return { success };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export default {
  fetchUsers,
  updateUserRole,
  toggleUserBan,
  deleteUser,
  fetchFinancialEvents,
  addFinancialEvent,
  updateFinancialEvent,
  deleteFinancialEvent,
  toggleFinancialEventStatus,
  fetchOfficialPrayerTimes,
  addOfficialPrayerTime,
  updateOfficialPrayerTime,
  deleteOfficialPrayerTime,
  confirmPrayerTime,
  fetchOfficialFinancialDates,
  addOfficialFinancialDate,
  updateOfficialFinancialDate,
  deleteOfficialFinancialDate,
  adjustFinancialDate,
  fetchDailyMessages,
  addDailyMessage,
  updateDailyMessage,
  deleteDailyMessage,
  setTodayMessage,
  fetchStoryTemplates,
  addStoryTemplate,
  updateStoryTemplate,
  deleteStoryTemplate,
  fetchThemes,
  addTheme,
  updateTheme,
  deleteTheme,
  activateTheme,
  fetchNotifications,
  sendNotification,
  scheduleNotification,
  deleteNotification,
  getNotificationLog,
  fetchComplaints,
  replyToComplaint,
  updateComplaintStatus,
  deleteComplaint,
  fetchNews,
  addNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
  fetchJobs,
  addJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
  fetchReportsLog,
  addReportLog,
  exportReportsToCSV,
  fetchSettings,
  updateSettings,
  fetchSocialLinks,
  updateSocialLink,
  connectSocialPlatform,
  disconnectSocialPlatform,
  fetchSupportTickets,
  replyToTicket,
  updateTicketStatus,
  closeTicket,
  deleteTicket,
};