/**
 * Notification Service â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
 * 
 * ط®ط¯ظ…ط© ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ط¯ط§ط®ظ„ظٹط©
 */

import { supabase, isSupabaseEnabled } from "./supabase";

export type NotificationType = 
  | "prayer_reminder" 
  | "financial_reminder" 
  | "appointment_reminder" 
  | "trip_reminder" 
  | "system" 
  | "admin_message";

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  is_read: boolean;
  data: Record<string, any>;
  created_at: string;
};

export type NotificationPreferences = {
  id: string;
  user_id: string;
  prayer_reminders: boolean;
  financial_reminders: boolean;
  appointment_reminders: boolean;
  system_notifications: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * createNotification â€” ط¥ظ†ط´ط§ط، ط¥ط´ط¹ط§ط±
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body?: string,
  extraData?: Record<string, any>
): Promise<{ success: boolean; error?: string; data?: Notification }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { data: notificationData, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      title,
      body: body || null,
      is_read: false,
      data: extraData || {},
    })
    .select()
    .single();
  
  if (error) return { success: false, error: error.message };
  return { success: true, data: notificationData as Notification };
}

/**
 * getUserNotifications â€” ط¬ظ„ط¨ ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ظ…ط³طھط®ط¯ظ…
 */
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  
  if (error) return [];
  return (data || []) as Notification[];
}

/**
 * getUnreadNotifications â€” ط¬ظ„ط¨ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط؛ظٹط± ط§ظ„ظ…ظ‚ط±ظˆط،ط©
 */
export async function getUnreadNotifications(userId: string): Promise<Notification[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false });
  
  if (error) return [];
  return (data || []) as Notification[];
}

/**
 * markAsRead â€”و ‡è®° ط¥ط´ط¹ط§ط± ظƒظ…ظ‚ط±ظˆط،
 */
export async function markAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * markAllAsRead â€”و ‡è®° ظƒظ„ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ظƒظ…ظ‚ط±ظˆط،ط©
 */
export async function markAllAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * deleteNotification â€” ط­ط°ظپ ط¥ط´ط¹ط§ط±
 */
export async function deleteNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * getNotificationPreferences â€” ط¬ظ„ط¨ طھظپط¶ظٹظ„ط§طھ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ
 */
export async function getNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
  if (!isSupabaseEnabled || !supabase) return null;
  
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();
  
  if (error) return null;
  return data as NotificationPreferences;
}

/**
 * updateNotificationPreferences â€” طھط­ط¯ظٹط« طھظپط¶ظٹظ„ط§طھ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<Omit<NotificationPreferences, "id" | "user_id" | "created_at">>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("notification_preferences")
    .upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString(),
    });
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * createDefaultPreferences â€” ط¥ظ†ط´ط§ط، طھظپط¶ظٹظ„ط§طھ ط§ظپطھط±ط§ط¶ظٹط©
 */
export async function createDefaultPreferences(userId: string): Promise<{ success: boolean; error?: string }> {
  return updateNotificationPreferences(userId, {
    prayer_reminders: true,
    financial_reminders: true,
    appointment_reminders: true,
    system_notifications: true,
    email_notifications: false,
  });
}

/**
 * getUnreadCount â€” ط¹ط¯ط¯ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط؛ظٹط± ط§ظ„ظ…ظ‚ط±ظˆط،ط©
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const unread = await getUnreadNotifications(userId);
  return unread.length;
}
