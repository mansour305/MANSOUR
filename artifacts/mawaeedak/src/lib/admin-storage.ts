/**
 * Admin Storage — LocalStorage Fallback for Admin Panel
 * 
 * This module provides localStorage persistence for admin operations
 * when Supabase is not available. All admin data is stored locally
 * with proper typing and validation.
 */

import { isSupabaseEnabled, supabase } from "@/lib/supabase";

// Storage keys
export const ADMIN_STORAGE_KEYS = {
  USERS: "admin_users",
  FINANCIAL_EVENTS: "admin_financial_events",
  OFFICIAL_FINANCIAL: "admin_official_financial",
  OFFICIAL_PRAYER: "admin_official_prayer",
  MESSAGES: "admin_messages",
  STORY: "admin_story",
  THEMES: "admin_themes",
  NOTIFICATIONS: "admin_notifications",
  NOTIFICATION_LOG: "admin_notification_log",
  COMPLAINTS: "admin_complaints",
  NEWS: "admin_news",
  JOBS: "admin_jobs",
  REPORTS_LOG: "admin_reports_log",
  SETTINGS: "admin_settings",
  SOCIAL: "admin_social",
  SUPPORT: "admin_support",
  SESSION: "admin_session",
} as const;

// Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "super_admin" | "owner";
  status: "active" | "banned";
  created_at: string;
  updated_at: string;
}

export interface FinancialEvent {
  id: string;
  title: string;
  amount: string;
  date: string;
  type: "salary" | "support" | "housing" | "pension" | "other";
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

export interface OfficialPrayerTime {
  id: string;
  city_key: string;
  city_name_ar: string;
  date_gregorian: string;
  date_hijri: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  is_confirmed: boolean;
  source_name: string;
  source_url: string;
  created_at: string;
  updated_at: string;
}

export interface OfficialFinancialDate {
  id: string;
  event_key: string;
  event_name_ar: string;
  occurrence_date_gregorian: string;
  occurrence_date_hijri: string;
  owning_authority_name: string;
  source_name: string;
  source_url: string;
  approval_status: "pending" | "approved" | "rejected";
  adjustment_type?: "advance" | "delay" | null;
  adjustment_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyMessage {
  id: string;
  content: string;
  scheduled_date: string;
  is_today: boolean;
  status: "scheduled" | "sent" | "draft";
  created_at: string;
  updated_at: string;
}

export interface StoryTemplate {
  id: string;
  title: string;
  content: string;
  date: string;
  linked_prayer: boolean;
  linked_financial: boolean;
  status: "active" | "draft";
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  type: "system" | "broadcast" | "personal";
  target: "all" | string[];
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  user_name?: string;
  type: "complaint" | "suggestion" | "inquiry";
  message: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  admin_reply?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  status: "published" | "draft" | "hidden";
  created_at: string;
  updated_at: string;
}

export interface JobItem {
  id: string;
  title: string;
  content: string;
  company: string;
  apply_url?: string;
  status: "published" | "draft" | "hidden";
  created_at: string;
  updated_at: string;
}

export interface ReportLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  details: string;
  created_at: string;
}

export interface AdminSettings {
  app_name: string;
  maintenance_mode: boolean;
  time_format: "12h" | "24h";
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  platform: "twitter" | "instagram" | "telegram" | "whatsapp";
  username: string;
  is_connected: boolean;
  access_token?: string;
  auto_post_enabled: boolean;
  auto_post_time: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name?: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  replies: TicketReply[];
  created_at: string;
  updated_at: string;
}

export interface TicketReply {
  id: string;
  sender: "user" | "admin";
  message: string;
  created_at: string;
}

// Helper functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch {
    // Ignore parse errors
  }
  return fallback;
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}

// Admin Storage Operations
export const adminStorage = {
  // Users
  getUsers(): AdminUser[] {
    return getStorage<AdminUser[]>(ADMIN_STORAGE_KEYS.USERS, getDefaultUsers());
  },
  
  setUsers(users: AdminUser[]): void {
    setStorage(ADMIN_STORAGE_KEYS.USERS, users);
  },
  
  addUser(user: Omit<AdminUser, "id" | "created_at" | "updated_at">): AdminUser {
    const users = this.getUsers();
    const newUser: AdminUser = {
      ...user,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    users.push(newUser);
    this.setUsers(users);
    return newUser;
  },
  
  updateUser(id: string, updates: Partial<AdminUser>): AdminUser | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() };
    this.setUsers(users);
    return users[index];
  },
  
  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    this.setUsers(filtered);
    return true;
  },
  
  // Financial Events
  getFinancialEvents(): FinancialEvent[] {
    return getStorage<FinancialEvent[]>(ADMIN_STORAGE_KEYS.FINANCIAL_EVENTS, getDefaultFinancialEvents());
  },
  
  setFinancialEvents(events: FinancialEvent[]): void {
    setStorage(ADMIN_STORAGE_KEYS.FINANCIAL_EVENTS, events);
  },
  
  addFinancialEvent(event: Omit<FinancialEvent, "id" | "created_at" | "updated_at">): FinancialEvent {
    const events = this.getFinancialEvents();
    const newEvent: FinancialEvent = {
      ...event,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    events.push(newEvent);
    this.setFinancialEvents(events);
    return newEvent;
  },
  
  updateFinancialEvent(id: string, updates: Partial<FinancialEvent>): FinancialEvent | null {
    const events = this.getFinancialEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;
    events[index] = { ...events[index], ...updates, updated_at: new Date().toISOString() };
    this.setFinancialEvents(events);
    return events[index];
  },
  
  deleteFinancialEvent(id: string): boolean {
    const events = this.getFinancialEvents();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length === events.length) return false;
    this.setFinancialEvents(filtered);
    return true;
  },
  
  // Official Prayer Times
  getOfficialPrayerTimes(): OfficialPrayerTime[] {
    return getStorage<OfficialPrayerTime[]>(ADMIN_STORAGE_KEYS.OFFICIAL_PRAYER, []);
  },
  
  setOfficialPrayerTimes(records: OfficialPrayerTime[]): void {
    setStorage(ADMIN_STORAGE_KEYS.OFFICIAL_PRAYER, records);
  },
  
  addOfficialPrayerTime(record: Omit<OfficialPrayerTime, "id" | "created_at" | "updated_at">): OfficialPrayerTime {
    const records = this.getOfficialPrayerTimes();
    const newRecord: OfficialPrayerTime = {
      ...record,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    records.push(newRecord);
    this.setOfficialPrayerTimes(records);
    return newRecord;
  },
  
  updateOfficialPrayerTime(id: string, updates: Partial<OfficialPrayerTime>): OfficialPrayerTime | null {
    const records = this.getOfficialPrayerTimes();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;
    records[index] = { ...records[index], ...updates, updated_at: new Date().toISOString() };
    this.setOfficialPrayerTimes(records);
    return records[index];
  },
  
  deleteOfficialPrayerTime(id: string): boolean {
    const records = this.getOfficialPrayerTimes();
    const filtered = records.filter(r => r.id !== id);
    if (filtered.length === records.length) return false;
    this.setOfficialPrayerTimes(filtered);
    return true;
  },
  
  // Official Financial Dates
  getOfficialFinancialDates(): OfficialFinancialDate[] {
    return getStorage<OfficialFinancialDate[]>(ADMIN_STORAGE_KEYS.OFFICIAL_FINANCIAL, getDefaultOfficialFinancialDates());
  },
  
  setOfficialFinancialDates(dates: OfficialFinancialDate[]): void {
    setStorage(ADMIN_STORAGE_KEYS.OFFICIAL_FINANCIAL, dates);
  },
  
  addOfficialFinancialDate(date: Omit<OfficialFinancialDate, "id" | "created_at" | "updated_at">): OfficialFinancialDate {
    const dates = this.getOfficialFinancialDates();
    const newDate: OfficialFinancialDate = {
      ...date,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dates.push(newDate);
    this.setOfficialFinancialDates(dates);
    return newDate;
  },
  
  updateOfficialFinancialDate(id: string, updates: Partial<OfficialFinancialDate>): OfficialFinancialDate | null {
    const dates = this.getOfficialFinancialDates();
    const index = dates.findIndex(d => d.id === id);
    if (index === -1) return null;
    dates[index] = { ...dates[index], ...updates, updated_at: new Date().toISOString() };
    this.setOfficialFinancialDates(dates);
    return dates[index];
  },
  
  deleteOfficialFinancialDate(id: string): boolean {
    const dates = this.getOfficialFinancialDates();
    const filtered = dates.filter(d => d.id !== id);
    if (filtered.length === dates.length) return false;
    this.setOfficialFinancialDates(filtered);
    return true;
  },
  
  // Daily Messages
  getDailyMessages(): DailyMessage[] {
    return getStorage<DailyMessage[]>(ADMIN_STORAGE_KEYS.MESSAGES, []);
  },
  
  setDailyMessages(messages: DailyMessage[]): void {
    setStorage(ADMIN_STORAGE_KEYS.MESSAGES, messages);
  },
  
  addDailyMessage(message: Omit<DailyMessage, "id" | "created_at" | "updated_at">): DailyMessage {
    const messages = this.getDailyMessages();
    const newMessage: DailyMessage = {
      ...message,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    messages.push(newMessage);
    this.setDailyMessages(messages);
    return newMessage;
  },
  
  updateDailyMessage(id: string, updates: Partial<DailyMessage>): DailyMessage | null {
    const messages = this.getDailyMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return null;
    messages[index] = { ...messages[index], ...updates, updated_at: new Date().toISOString() };
    this.setDailyMessages(messages);
    return messages[index];
  },
  
  deleteDailyMessage(id: string): boolean {
    const messages = this.getDailyMessages();
    const filtered = messages.filter(m => m.id !== id);
    if (filtered.length === messages.length) return false;
    this.setDailyMessages(filtered);
    return true;
  },
  
  // Story Templates
  getStoryTemplates(): StoryTemplate[] {
    return getStorage<StoryTemplate[]>(ADMIN_STORAGE_KEYS.STORY, []);
  },
  
  setStoryTemplates(templates: StoryTemplate[]): void {
    setStorage(ADMIN_STORAGE_KEYS.STORY, templates);
  },
  
  addStoryTemplate(template: Omit<StoryTemplate, "id" | "created_at" | "updated_at">): StoryTemplate {
    const templates = this.getStoryTemplates();
    const newTemplate: StoryTemplate = {
      ...template,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    templates.push(newTemplate);
    this.setStoryTemplates(templates);
    return newTemplate;
  },
  
  updateStoryTemplate(id: string, updates: Partial<StoryTemplate>): StoryTemplate | null {
    const templates = this.getStoryTemplates();
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) return null;
    templates[index] = { ...templates[index], ...updates, updated_at: new Date().toISOString() };
    this.setStoryTemplates(templates);
    return templates[index];
  },
  
  deleteStoryTemplate(id: string): boolean {
    const templates = this.getStoryTemplates();
    const filtered = templates.filter(t => t.id !== id);
    if (filtered.length === templates.length) return false;
    this.setStoryTemplates(filtered);
    return true;
  },
  
  // Themes
  getThemes(): Theme[] {
    return getStorage<Theme[]>(ADMIN_STORAGE_KEYS.THEMES, getDefaultThemes());
  },
  
  setThemes(themes: Theme[]): void {
    setStorage(ADMIN_STORAGE_KEYS.THEMES, themes);
  },
  
  addTheme(theme: Omit<Theme, "id" | "created_at" | "updated_at">): Theme {
    const themes = this.getThemes();
    const newTheme: Theme = {
      ...theme,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    themes.push(newTheme);
    this.setThemes(themes);
    return newTheme;
  },
  
  updateTheme(id: string, updates: Partial<Theme>): Theme | null {
    const themes = this.getThemes();
    const index = themes.findIndex(t => t.id === id);
    if (index === -1) return null;
    themes[index] = { ...themes[index], ...updates, updated_at: new Date().toISOString() };
    this.setThemes(themes);
    return themes[index];
  },
  
  deleteTheme(id: string): boolean {
    const themes = this.getThemes();
    const filtered = themes.filter(t => t.id !== id);
    if (filtered.length === themes.length) return false;
    this.setThemes(filtered);
    return true;
  },
  
  activateTheme(id: string): void {
    const themes = this.getThemes();
    themes.forEach(t => {
      t.is_active = t.id === id;
    });
    this.setThemes(themes);
  },
  
  // Notifications
  getNotifications(): AdminNotification[] {
    return getStorage<AdminNotification[]>(ADMIN_STORAGE_KEYS.NOTIFICATIONS, []);
  },
  
  setNotifications(notifications: AdminNotification[]): void {
    setStorage(ADMIN_STORAGE_KEYS.NOTIFICATIONS, notifications);
  },
  
  addNotification(notification: Omit<AdminNotification, "id" | "created_at">): AdminNotification {
    const notifications = this.getNotifications();
    const newNotification: AdminNotification = {
      ...notification,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    notifications.push(newNotification);
    this.setNotifications(notifications);
    
    // Also add to log
    const log = this.getNotificationLog();
    log.push({
      id: generateId(),
      notification_id: newNotification.id,
      action: "created",
      sent_at: notification.sent_at || new Date().toISOString(),
    });
    this.setNotificationLog(log);
    
    return newNotification;
  },
  
  deleteNotification(id: string): boolean {
    const notifications = this.getNotifications();
    const filtered = notifications.filter(n => n.id !== id);
    if (filtered.length === notifications.length) return false;
    this.setNotifications(filtered);
    return true;
  },
  
  getNotificationLog(): any[] {
    return getStorage<any[]>(ADMIN_STORAGE_KEYS.NOTIFICATION_LOG, []);
  },
  
  setNotificationLog(log: any[]): void {
    setStorage(ADMIN_STORAGE_KEYS.NOTIFICATION_LOG, log);
  },
  
  // Complaints
  getComplaints(): Complaint[] {
    return getStorage<Complaint[]>(ADMIN_STORAGE_KEYS.COMPLAINTS, []);
  },
  
  setComplaints(complaints: Complaint[]): void {
    setStorage(ADMIN_STORAGE_KEYS.COMPLAINTS, complaints);
  },
  
  addComplaint(complaint: Omit<Complaint, "id" | "created_at" | "updated_at">): Complaint {
    const complaints = this.getComplaints();
    const newComplaint: Complaint = {
      ...complaint,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    complaints.push(newComplaint);
    this.setComplaints(complaints);
    return newComplaint;
  },
  
  updateComplaint(id: string, updates: Partial<Complaint>): Complaint | null {
    const complaints = this.getComplaints();
    const index = complaints.findIndex(c => c.id === id);
    if (index === -1) return null;
    complaints[index] = { ...complaints[index], ...updates, updated_at: new Date().toISOString() };
    this.setComplaints(complaints);
    return complaints[index];
  },
  
  deleteComplaint(id: string): boolean {
    const complaints = this.getComplaints();
    const filtered = complaints.filter(c => c.id !== id);
    if (filtered.length === complaints.length) return false;
    this.setComplaints(filtered);
    return true;
  },
  
  // News
  getNews(): NewsItem[] {
    return getStorage<NewsItem[]>(ADMIN_STORAGE_KEYS.NEWS, []);
  },
  
  setNews(news: NewsItem[]): void {
    setStorage(ADMIN_STORAGE_KEYS.NEWS, news);
  },
  
  addNews(newsItem: Omit<NewsItem, "id" | "created_at" | "updated_at">): NewsItem {
    const news = this.getNews();
    const newNewsItem: NewsItem = {
      ...newsItem,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    news.push(newNewsItem);
    this.setNews(news);
    return newNewsItem;
  },
  
  updateNews(id: string, updates: Partial<NewsItem>): NewsItem | null {
    const news = this.getNews();
    const index = news.findIndex(n => n.id === id);
    if (index === -1) return null;
    news[index] = { ...news[index], ...updates, updated_at: new Date().toISOString() };
    this.setNews(news);
    return news[index];
  },
  
  deleteNews(id: string): boolean {
    const news = this.getNews();
    const filtered = news.filter(n => n.id !== id);
    if (filtered.length === news.length) return false;
    this.setNews(filtered);
    return true;
  },
  
  // Jobs
  getJobs(): JobItem[] {
    return getStorage<JobItem[]>(ADMIN_STORAGE_KEYS.JOBS, []);
  },
  
  setJobs(jobs: JobItem[]): void {
    setStorage(ADMIN_STORAGE_KEYS.JOBS, jobs);
  },
  
  addJob(job: Omit<JobItem, "id" | "created_at" | "updated_at">): JobItem {
    const jobs = this.getJobs();
    const newJob: JobItem = {
      ...job,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    jobs.push(newJob);
    this.setJobs(jobs);
    return newJob;
  },
  
  updateJob(id: string, updates: Partial<JobItem>): JobItem | null {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) return null;
    jobs[index] = { ...jobs[index], ...updates, updated_at: new Date().toISOString() };
    this.setJobs(jobs);
    return jobs[index];
  },
  
  deleteJob(id: string): boolean {
    const jobs = this.getJobs();
    const filtered = jobs.filter(j => j.id !== id);
    if (filtered.length === jobs.length) return false;
    this.setJobs(filtered);
    return true;
  },
  
  // Reports Log
  getReportsLog(): ReportLog[] {
    return getStorage<ReportLog[]>(ADMIN_STORAGE_KEYS.REPORTS_LOG, []);
  },
  
  addReportLog(log: Omit<ReportLog, "id" | "created_at">): ReportLog {
    const logs = this.getReportsLog();
    const newLog: ReportLog = {
      ...log,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    this.setReportsLog(logs);
    return newLog;
  },
  
  setReportsLog(logs: ReportLog[]): void {
    setStorage(ADMIN_STORAGE_KEYS.REPORTS_LOG, logs);
  },
  
  // Settings
  getSettings(): AdminSettings {
    return getStorage<AdminSettings>(ADMIN_STORAGE_KEYS.SETTINGS, getDefaultSettings());
  },
  
  setSettings(settings: AdminSettings): void {
    setStorage(ADMIN_STORAGE_KEYS.SETTINGS, settings);
  },
  
  updateSettings(updates: Partial<AdminSettings>): AdminSettings {
    const settings = this.getSettings();
    const updated = { ...settings, ...updates, updated_at: new Date().toISOString() };
    this.setSettings(updated);
    return updated;
  },
  
  // Social Links
  getSocialLinks(): SocialLink[] {
    return getStorage<SocialLink[]>(ADMIN_STORAGE_KEYS.SOCIAL, getDefaultSocialLinks());
  },
  
  setSocialLinks(links: SocialLink[]): void {
    setStorage(ADMIN_STORAGE_KEYS.SOCIAL, links);
  },
  
  updateSocialLink(platform: SocialLink["platform"], updates: Partial<SocialLink>): SocialLink | null {
    const links = this.getSocialLinks();
    const index = links.findIndex(l => l.platform === platform);
    if (index === -1) return null;
    links[index] = { ...links[index], ...updates, updated_at: new Date().toISOString() };
    this.setSocialLinks(links);
    return links[index];
  },
  
  // Support Tickets
  getSupportTickets(): SupportTicket[] {
    return getStorage<SupportTicket[]>(ADMIN_STORAGE_KEYS.SUPPORT, []);
  },
  
  setSupportTickets(tickets: SupportTicket[]): void {
    setStorage(ADMIN_STORAGE_KEYS.SUPPORT, tickets);
  },
  
  addSupportTicket(ticket: Omit<SupportTicket, "id" | "created_at" | "updated_at">): SupportTicket {
    const tickets = this.getSupportTickets();
    const newTicket: SupportTicket = {
      ...ticket,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tickets.push(newTicket);
    this.setSupportTickets(tickets);
    return newTicket;
  },
  
  updateSupportTicket(id: string, updates: Partial<SupportTicket>): SupportTicket | null {
    const tickets = this.getSupportTickets();
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return null;
    tickets[index] = { ...tickets[index], ...updates, updated_at: new Date().toISOString() };
    this.setSupportTickets(tickets);
    return tickets[index];
  },
  
  addTicketReply(ticketId: string, reply: Omit<TicketReply, "id" | "created_at">): boolean {
    const tickets = this.getSupportTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) return false;
    tickets[index].replies.push({
      ...reply,
      id: generateId(),
      created_at: new Date().toISOString(),
    });
    tickets[index].updated_at = new Date().toISOString();
    this.setSupportTickets(tickets);
    return true;
  },
  
  deleteSupportTicket(id: string): boolean {
    const tickets = this.getSupportTickets();
    const filtered = tickets.filter(t => t.id !== id);
    if (filtered.length === tickets.length) return false;
    this.setSupportTickets(filtered);
    return true;
  },
};

// Default data generators
function getDefaultUsers(): AdminUser[] {
  return [
    { id: "1", email: "admin@mawaeedak.local", name: "مدير النظام", role: "admin", status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "2", email: "user@mawaeedak.local", name: "مستخدم تجريبي", role: "user", status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];
}

function getDefaultFinancialEvents(): FinancialEvent[] {
  return [
    { id: "1", title: "رواتب الشهر", amount: "5,000", date: "2026-07-25", type: "salary", status: "published", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "2", title: "دعم الإيجار", amount: "2,000", date: "2026-07-20", type: "housing", status: "published", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "3", title: "حساب المواطن", amount: "1,000", date: "2026-07-10", type: "support", status: "draft", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];
}

function getDefaultOfficialFinancialDates(): OfficialFinancialDate[] {
  return [
    {
      id: "1",
      event_key: "salary",
      event_name_ar: "صرف الراتب",
      occurrence_date_gregorian: "2026-07-25",
      occurrence_date_hijri: "1448-01-20",
      owning_authority_name: "وزارة المالية",
      source_name: "تقويم أم القرى",
      source_url: "https://www.ummulqura.org.sa",
      approval_status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      event_key: "citizen_account",
      event_name_ar: "حساب المواطن",
      occurrence_date_gregorian: "2026-07-10",
      occurrence_date_hijri: "1448-01-05",
      owning_authority_name: "برنامج حساب المواطن",
      source_name: "حساب المواطن",
      source_url: "https://c.gov.sa",
      approval_status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getDefaultThemes(): Theme[] {
  return [
    {
      id: "1",
      name: "الافتراضي",
      colors: { primary: "#C9A063", secondary: "#8A6B3D", accent: "#2F2B25", background: "#FAF7F2" },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "العيد",
      colors: { primary: "#22C55E", secondary: "#15803D", accent: "#1F2937", background: "#F0FDF4" },
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getDefaultSettings(): AdminSettings {
  return {
    app_name: "مواعيدك",
    maintenance_mode: false,
    time_format: "24h",
    notifications_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function getDefaultSocialLinks(): SocialLink[] {
  return [
    { platform: "twitter", username: "", is_connected: false, auto_post_enabled: false, auto_post_time: "09:00", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { platform: "instagram", username: "", is_connected: false, auto_post_enabled: false, auto_post_time: "09:00", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { platform: "telegram", username: "", is_connected: false, auto_post_enabled: false, auto_post_time: "09:00", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { platform: "whatsapp", username: "", is_connected: false, auto_post_enabled: false, auto_post_time: "09:00", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];
}

export default adminStorage;