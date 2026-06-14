/**
 * supabaseData.ts â€” ظ…ظˆط§ط¹ظٹط¯ظƒ Phase 12I
 *
 * Supabase Data Adapter â€” ط·ط¨ظ‚ط© ظ‚ط±ط§ط،ط© + ظƒطھط§ط¨ط© ظ…ط­ط¯ظˆط¯ط©.
 *
 * ط§ظ„ظ‚ظˆط§ط¹ط¯:
 * - ظ„ط§ طھظڈط³طھط®ط¯ظ… ظƒظ…طµط¯ط± ط§ظپطھط±ط§ط¶ظٹ â€” API/PostgreSQL ظ„ط§ ظٹط²ط§ظ„ ط§ظ„ظ…طµط¯ط±.
 * - ط¯ظˆط§ظ„ ط§ظ„ظ‚ط±ط§ط،ط© طھظڈط¹ظٹط¯ null ط¹ظ†ط¯ ط§ظ„ظپط´ظ„ ظˆظ„ط§ طھط±ظ…ظٹ exception.
 * - ط¯ظˆط§ظ„ ط§ظ„ظƒطھط§ط¨ط© طھظڈط¹ظٹط¯ { success, error } â€” ظ„ط§ fallback طµط§ظ…طھ ط¥ظ„ظ‰ API.
 * - ظ„ط§ طھط³طھط®ط¯ظ… service_role â€” anon key ظپظ‚ط·.
 * - ظ„ط§ ط£ط³ط±ط§ط± ظپظٹ ط§ظ„ظƒظˆط¯ â€” VITE_SUPABASE_ANON_KEY ظپظ‚ط·.
 * - user_id ظٹظڈط¬ظ„ط¨ ظ…ظ† session Supabase ط¹ظ†ط¯ ط§ظ„ط­ط§ط¬ط©.
 * - ط£ظٹ ط®ط·ط£ Supabase ظ„ط§ ظٹظƒط³ط± Preview.
 *
 * ط§ظ„ط¬ط¯ط§ظˆظ„ ط§ظ„ظ…ط¯ط¹ظˆظ…ط© ظ„ظ„ظ‚ط±ط§ط،ط©:
 *   Admin-managed: daily_messages, story_templates, themes, news, jobs
 *   User-owned:    appointments, financial_events, notifications
 *   Support:       complaints
 *
 * ط§ظ„ط¬ط¯ط§ظˆظ„ ط§ظ„ظ…ط¯ط¹ظˆظ…ط© ظ„ظ„ظƒطھط§ط¨ط© (Phase 12I â€” ظ†ط·ط§ظ‚ ظ…ط­ط¯ظˆط¯):
 *   notifications â€” mark-read ظپظ‚ط· (UPDATE is_read = true WHERE legacy_id = X)
 *
 * ظ‚ظٹظˆط¯ Write Cutover:
 *   - mode=api/supabase_shadow: ظ„ط§ ظƒطھط§ط¨ط© ظپظٹ Supabase (API ظپظ‚ط·)
 *   - mode=supabase: mark-read ظٹط°ظ‡ط¨ ظ„ظ€ Supabase
 *   - NotificationsPage طھط¨ظ‚ظ‰ ط¹ظ„ظ‰ Orval â€” Phase 12J (ظٹط­طھط§ط¬ read+write ظ…ط¹ط§ظ‹)
 *   - ط§ظ„ط§ط®طھط¨ط§ط±: /admin/data-layer â†’ "ط§ط®طھط¨ط§ط± ط§ظ„ظƒطھط§ط¨ط©"
 *
 * RLS ظ„ظ„ظ€ notifications:
 *   - notifications_update_own: auth.uid() = user_id
 *   - ظٹطھط·ظ„ط¨ session Supabase Auth (hrq@hotmail.com)
 *   - ط¨ط¯ظˆظ† session: ظٹظڈط¹ظٹط¯ error ظ…ظ†ط§ط³ط¨ط§ظ‹ (ظ„ط§ crash)
 */

import { supabase } from "./supabase";
import type {
  Appointment,
  FinancialEvent,
  Notification,
  DailyMessage,
  Theme,
  StoryTemplate,
  NewsItem,
  Job,
  Complaint,
} from "./api-client";
import { calculateDaysRemaining, getRiyadhTodayKey } from "./riyadhTime";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Helpers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function isConnected(): boolean {
  return supabase !== null;
}

async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin-managed tables (ظ„ط§ طھط­طھط§ط¬ user_id)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getDailyMessagesFromSupabase(): Promise<DailyMessage[] | null> {
  if (!isConnected()) return null;
  try {
    const { data, error } = await supabase!
      .from("daily_messages")
      .select("id, message, display_date, is_active, created_at")
      .order("id", { ascending: true });
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: row.id as number,
      message: row.message as string,
      display_date: (row.display_date ?? null) as string | null,
      is_active: row.is_active as boolean,
      created_at: row.created_at as string,
    }));
  } catch {
    return null;
  }
}

export async function getStoryTemplatesFromSupabase(): Promise<StoryTemplate[] | null> {
  if (!isConnected()) return null;
  try {
    const { data, error } = await supabase!
      .from("story_templates")
      .select("id, name, description, template_text, background_color, text_color, is_active, created_at")
      .order("id", { ascending: true });
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: row.id as number,
      name: row.name as string,
      description: (row.description ?? null) as string | null,
      template_text: (row.template_text ?? "") as string,
      background_color: (row.background_color ?? null) as string | null,
      text_color: (row.text_color ?? null) as string | null,
      is_active: row.is_active as boolean,
      created_at: row.created_at as string,
    }));
  } catch {
    return null;
  }
}

export async function getThemesFromSupabase(): Promise<Theme[] | null> {
  if (!isConnected()) return null;
  try {
    const { data, error } = await supabase!
      .from("themes")
      .select("id, name, slug, description, colors, is_active, is_available, tier, created_at")
      .order("id", { ascending: true });
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: row.id as number,
      name: row.name as string,
      slug: row.slug as string,
      description: (row.description ?? null) as string | null,
      colors: (row.colors ?? {}) as Record<string, unknown>,
      is_active: row.is_active as boolean,
      is_available: row.is_available as boolean,
      tier: (row.tier ?? undefined) as string | undefined,
      created_at: row.created_at as string,
    }));
  } catch {
    return null;
  }
}

export async function getNewsFromSupabase(): Promise<NewsItem[] | null> {
  if (!isConnected()) return null;
  try {
    const { data, error } = await supabase!
      .from("news")
      .select("id, title, body, category, source, image_url, is_published, published_at, created_at")
      .order("id", { ascending: true });
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: row.id as number,
      title: row.title as string,
      body: (row.body ?? null) as string | null,
      category: row.category as string,
      source: (row.source ?? null) as string | null,
      image_url: (row.image_url ?? null) as string | null,
      is_published: row.is_published as boolean,
      published_at: (row.published_at ?? null) as string | null,
      created_at: row.created_at as string,
    }));
  } catch {
    return null;
  }
}

export async function getJobsFromSupabase(): Promise<Job[] | null> {
  if (!isConnected()) return null;
  try {
    const { data, error } = await supabase!
      .from("jobs")
      .select("id, title, employer, sector, city, description, apply_url, deadline, is_active, created_at")
      .order("id", { ascending: true });
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: row.id as number,
      title: row.title as string,
      employer: row.employer as string,
      sector: row.sector as string,
      city: row.city as string,
      description: (row.description ?? null) as string | null,
      apply_url: (row.apply_url ?? null) as string | null,
      deadline: (row.deadline ?? null) as string | null,
      is_active: (row.is_active ?? true) as boolean,
      created_at: row.created_at as string,
    }));
  } catch {
    return null;
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// User-owned tables (طھط­طھط§ط¬ user_id ظ…ظ† session)
// RLS طھظڈط±ط¬ط¹ 0 طµظپظˆظپ ط¥ط°ط§ ظ„ط§ ظٹظˆط¬ط¯ session â€” ط¢ظ…ظ†
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getAppointmentsFromSupabase(): Promise<Appointment[] | null> {
  if (!isConnected()) return null;
  try {
    const userId = await getCurrentUserId();
    let query = supabase!
      .from("appointments")
      .select("id, legacy_id, title, description, date, time, category, color, priority, reminder_enabled, created_at")
      .order("date", { ascending: true });
    if (userId) {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query;
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: (row.legacy_id ?? row.id) as number,
      title: row.title as string,
      description: (row.description ?? null) as string | null,
      date: row.date as string,
      time: (row.time ?? null) as string | null,
      category: row.category as string,
      color: (row.color ?? null) as string | null,
      priority: (row.priority ?? null) as string | null,
      reminder_enabled: (row.reminder_enabled ?? false) as boolean,
      created_at: row.created_at as string,
    }));
  } catch {
    return null;
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Phase 12N â€” Appointments Write + Upcoming
// ط§ط³طھط±ط§طھظٹط¬ظٹط© id: (row.legacy_id ?? row.id) as number
//   - طµظپظˆظپ ظ…ظڈظ‡ط§ط¬ظژط±ط©: legacy_id = integer ظ‚ط¯ظٹظ…طŒ id = Supabase bigint
//   - طµظپظˆظپ ط¬ط¯ظٹط¯ط©: legacy_id = nullطŒ id = Supabase bigint â†’ cast number
// ط§ط³طھط±ط§طھظٹط¬ظٹط© update/delete: .or('legacy_id.eq.X,id.eq.X')
// RLS: appointments_select/update/delete_own â†’ auth.uid() = user_id
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface AppointmentPayload {
  title: string;
  description?: string;
  date: string;
  time?: string;
  category?: string;
  color?: string;
  priority?: string;
  reminder_enabled?: boolean;
}

function mapAppointmentRow(row: Record<string, unknown>): Appointment {
  return {
    id: ((row.legacy_id ?? row.id) as number),
    title: row.title as string,
    description: (row.description ?? null) as string | null,
    date: row.date as string,
    time: (row.time ?? null) as string | null,
    category: (row.category ?? "ط´ط®طµظٹ") as string,
    color: (row.color ?? null) as string | null,
    priority: (row.priority ?? null) as string | null,
    reminder_enabled: (row.reminder_enabled ?? false) as boolean,
    created_at: row.created_at as string,
  };
}

export async function getUpcomingAppointmentsFromSupabase(limit = 5): Promise<Appointment[] | null> {
  if (!isConnected()) return null;
  try {
    const userId = await getCurrentUserId();
    const today = getRiyadhTodayKey();
    let query = supabase!
      .from("appointments")
      .select("id, legacy_id, title, description, date, time, category, color, priority, reminder_enabled, created_at")
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(limit);
    if (userId) {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query;
    if (error) return null;
    return (data ?? []).map(row => mapAppointmentRow(row as Record<string, unknown>));
  } catch {
    return null;
  }
}

export async function createAppointmentInSupabase(payload: AppointmentPayload): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "ط§ظ„ظ…ط³طھط®ط¯ظ… ط؛ظٹط± ظ…ظڈط³ط¬ظژظ‘ظ„ ظپظٹ Supabase" };
    const { error } = await supabase!.from("appointments").insert({
      user_id: userId,
      title: payload.title,
      description: payload.description ?? null,
      date: payload.date,
      time: payload.time ?? null,
      category: payload.category ?? "ط´ط®طµظٹ",
      color: payload.color ?? null,
      priority: payload.priority ?? null,
      reminder_enabled: payload.reminder_enabled ?? false,
    });
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function updateAppointmentInSupabase(id: number, payload: Partial<AppointmentPayload>): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const patch: Record<string, unknown> = {};
    if (payload.title !== undefined) patch.title = payload.title;
    if (payload.description !== undefined) patch.description = payload.description ?? null;
    if (payload.date !== undefined) patch.date = payload.date;
    if (payload.time !== undefined) patch.time = payload.time ?? null;
    if (payload.category !== undefined) patch.category = payload.category;
    if (payload.color !== undefined) patch.color = payload.color ?? null;
    if (payload.priority !== undefined) patch.priority = payload.priority ?? null;
    if (payload.reminder_enabled !== undefined) patch.reminder_enabled = payload.reminder_enabled;
    const { error } = await supabase!
      .from("appointments")
      .update(patch)
      .or(`legacy_id.eq.${id},id.eq.${id}`);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function deleteAppointmentInSupabase(id: number): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!
      .from("appointments")
      .delete()
      .or(`legacy_id.eq.${id},id.eq.${id}`);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function getFinancialEventsFromSupabase(): Promise<FinancialEvent[] | null> {
  if (!isConnected()) return null;
  try {
    const userId = await getCurrentUserId();
    let query = supabase!
      .from("financial_events")
      .select("id, legacy_id, name, type, next_date, amount, notes, is_active, reminder_days_before, created_at")
      .order("next_date", { ascending: true });
    if (userId) {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query;
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: (row.legacy_id ?? row.id) as number,
      name: row.name as string,
      type: row.type as string,
      next_date: row.next_date as string,
      amount: row.amount != null ? Number(row.amount) : null,
      notes: (row.notes ?? null) as string | null,
      is_active: (row.is_active ?? true) as boolean,
      reminder_days_before: (row.reminder_days_before ?? 3) as number,
      created_at: row.created_at as string,
    }));
  } catch {
    return null;
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Phase 12O: Financial Events Write + Countdown Gateway
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface FinancialEventPayload {
  name: string;
  type: string;
  next_date: string;
  amount?: number | null;
  notes?: string | null;
  is_active?: boolean;
  reminder_days_before?: number;
}

export async function getFinancialCountdownFromSupabase(): Promise<Array<{
  id: number; name: string; type: string; next_date: string; days_remaining: number; amount: number | null;
}> | null> {
  if (!isConnected()) return null;
  try {
    const userId = await getCurrentUserId();
    let query = supabase!
      .from("financial_events")
      .select("id, legacy_id, name, type, next_date, amount, is_active")
      .eq("is_active", true)
      .gte("next_date", getRiyadhTodayKey())
      .order("next_date", { ascending: true });
    if (userId) {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query;
    if (error) return null;
    const items = (data ?? []).map((row) => {
      const nextDate = String(row.next_date).slice(0, 10);
      const daysRemaining = calculateDaysRemaining(nextDate);
      return {
        id: (row.legacy_id ?? row.id) as number,
        name: row.name as string,
        type: row.type as string,
        next_date: nextDate,
        days_remaining: daysRemaining,
        amount: row.amount != null ? Number(row.amount) : null,
      };
    });
    items.sort((a, b) =>
      a.next_date < b.next_date ? -1 :
      a.next_date > b.next_date ? 1 :
      (a.type === "salary" ? -1 : b.type === "salary" ? 1 : 0)
    );
    return items;
  } catch {
    return null;
  }
}

export async function createFinancialEventInSupabase(payload: FinancialEventPayload): Promise<WriteResult> {
  if (!isConnected()) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "ط§ظ„ظ…ط³طھط®ط¯ظ… ط؛ظٹط± ظ…ظڈط³ط¬ظژظ‘ظ„" };
    const { error } = await supabase!
      .from("financial_events")
      .insert({
        user_id: userId,
        name: payload.name,
        type: payload.type,
        next_date: payload.next_date,
        amount: payload.amount != null ? String(payload.amount) : null,
        notes: payload.notes ?? null,
        is_active: payload.is_active ?? true,
        reminder_days_before: payload.reminder_days_before ?? 3,
      });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function updateFinancialEventInSupabase(id: number, payload: Partial<FinancialEventPayload>): Promise<WriteResult> {
  if (!isConnected()) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const updates: Record<string, unknown> = {};
    if (payload.name !== undefined) updates.name = payload.name;
    if (payload.type !== undefined) updates.type = payload.type;
    if (payload.next_date !== undefined) updates.next_date = payload.next_date;
    if (payload.amount !== undefined) updates.amount = payload.amount != null ? String(payload.amount) : null;
    if (payload.notes !== undefined) updates.notes = payload.notes ?? null;
    if (payload.is_active !== undefined) updates.is_active = payload.is_active;
    if (payload.reminder_days_before !== undefined) updates.reminder_days_before = payload.reminder_days_before;
    const { error } = await supabase!
      .from("financial_events")
      .update(updates)
      .or(`legacy_id.eq.${id},id.eq.${id}`);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function deleteFinancialEventInSupabase(id: number): Promise<WriteResult> {
  if (!isConnected()) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!
      .from("financial_events")
      .delete()
      .or(`legacy_id.eq.${id},id.eq.${id}`);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function getNotificationsFromSupabase(): Promise<Notification[] | null> {
  if (!isConnected()) return null;
  try {
    const userId = await getCurrentUserId();
    let query = supabase!
      .from("notifications")
      .select("id, legacy_id, title, body, type, is_read, created_at")
      .order("created_at", { ascending: false });
    if (userId) {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query;
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: (row.legacy_id ?? row.id) as number,
      title: row.title as string,
      body: (row.body ?? null) as string | null,
      type: row.type as string,
      is_read: row.is_read as boolean,
      created_at: row.created_at as string,
    }));
  } catch {
    return null;
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Support table â€” complaints (user_id = NULL)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getComplaintsFromSupabase(): Promise<Complaint[] | null> {
  if (!isConnected()) return null;
  try {
    const { data, error } = await supabase!
      .from("complaints")
      .select("id, legacy_id, type, message, contact, status, created_at")
      .order("id", { ascending: true });
    if (error) return null;
    return (data ?? []).map((row) => ({
      id: (row.legacy_id ?? row.id) as number,
      type: row.type as string,
      message: row.message as string,
      contact: (row.contact ?? null) as string | null,
      status: row.status as string,
      created_at: row.created_at as string,
    }));
  } catch {
    return null;
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Write Functions â€” Phase 12I (ظ†ط·ط§ظ‚ ظ…ط­ط¯ظˆط¯: notifications mark-read ظپظ‚ط·)
//
// ط§ظ„ظ‚ظˆط§ط¹ط¯:
// - ظ„ط§ fallback طµط§ظ…طھ ط¥ظ„ظ‰ API ط¹ظ†ط¯ ظپط´ظ„ Supabase write.
// - ظٹظڈط¹ظٹط¯ { success: boolean; error?: string } ط¯ط§ط¦ظ…ط§ظ‹.
// - ظٹطھط·ظ„ط¨ session Supabase Auth â€” ط¨ط¯ظˆظ†ظ‡ ظٹظڈط¹ظٹط¯ error ظ…ظ†ط§ط³ط¨.
// - ظٹط³طھط®ط¯ظ… legacy_id (ط§ظ„ظ…ط¹ط±ظ‘ظپ ط§ظ„ظ‚ط¯ظٹظ… ظ…ظ† PostgreSQL) ظ„ظ„طھطµظپظٹط©.
// - ظ„ط§ service_role.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface WriteResult {
  success: boolean;
  error?: string;
}

/**
 * markNotificationReadInSupabase
 * ظٹظڈط­ط¯ظ‘ط« is_read = true ظ„ظ„ط¥ط´ط¹ط§ط± ط°ظٹ legacy_id ط§ظ„ظ…ظڈط­ط¯ظژظ‘ط¯.
 *
 * RLS: notifications_update_own â€” ظٹطھط·ظ„ط¨ auth.uid() = user_id.
 * ط¥ط°ط§ ظƒط§ظ† ط§ظ„ظ…ط³طھط®ط¯ظ… ط؛ظٹط± ظ…ظڈظˆط«ظژظ‘ظ‚ â†’ ظٹظڈط¹ظٹط¯ error "ط¬ظ„ط³ط© Supabase ظ…ظپظ‚ظˆط¯ط©".
 * ط¥ط°ط§ ظƒط§ظ† RLS ظٹط±ظپط¶ â†’ ظٹظڈط¹ظٹط¯ error "ظ„ط§ طµظ„ط§ط­ظٹط©".
 *
 * @param legacyId - ط§ظ„ظ…ط¹ط±ظ‘ظپ ظƒظ…ط§ ظٹطµظ„ظ‡ ظ…ظ† ظˆط§ط¬ظ‡ط© API (= legacy_id ظپظٹ Supabase)
 */
export async function markNotificationReadInSupabase(legacyId: number): Promise<WriteResult> {
  if (!supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„ â€” طھط­ظ‚ظ‚ ظ…ظ† VITE_SUPABASE_URL ظˆ VITE_SUPABASE_ANON_KEY" };
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "ط¬ظ„ط³ط© Supabase Auth ظ…ظپظ‚ظˆط¯ط© â€” ظٹطھط·ظ„ط¨ طھط³ط¬ظٹظ„ ط¯ط®ظˆظ„ ط¹ط¨ط± Supabase" };
  }

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("legacy_id", legacyId)
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: `Supabase error: ${error.message}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

/**
 * markAllNotificationsReadInSupabase
 * ظٹظڈط­ط¯ظ‘ط« is_read = true ظ„ط¬ظ…ظٹط¹ ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ط­ط§ظ„ظٹ.
 *
 * RLS: notifications_update_own
 */
export async function markAllNotificationsReadInSupabase(): Promise<WriteResult> {
  if (!supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "ط¬ظ„ط³ط© Supabase Auth ظ…ظپظ‚ظˆط¯ط©" };
  }

  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      return { success: false, error: `Supabase error: ${error.message}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

/**
 * deleteNotificationInSupabase
 * ظٹط­ط°ظپ ط¥ط´ط¹ط§ط±ط§ظ‹ ط¨ظ€ legacy_id ط§ظ„ظ…ظڈط­ط¯ظژظ‘ط¯.
 *
 * RLS: notifications_delete_own â€” auth.uid() = user_id.
 * ظٹطھط·ظ„ط¨ session Supabase Auth.
 * ط¨ط¯ظˆظ† session â†’ error "ط¬ظ„ط³ط© Supabase Auth ظ…ظپظ‚ظˆط¯ط©".
 *
 * @param legacyId - ظ…ط¹ط±ظ‘ظپ ط§ظ„ط¥ط´ط¹ط§ط± ظƒظ…ط§ ظٹط¸ظ‡ط± ظپظٹ ط§ظ„ظˆط§ط¬ظ‡ط© (= legacy_id ظپظٹ Supabase)
 */
export async function deleteNotificationInSupabase(legacyId: number): Promise<WriteResult> {
  if (!supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "ط¬ظ„ط³ط© Supabase Auth ظ…ظپظ‚ظˆط¯ط© â€” ظٹطھط·ظ„ط¨ طھط³ط¬ظٹظ„ ط¯ط®ظˆظ„ ط¹ط¨ط± Supabase" };
  }

  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("legacy_id", legacyId)
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: `Supabase error: ${error.message}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin CRUD: ط§ظ„ط£ط®ط¨ط§ط± (news)
// ط¬ط¯ظˆظ„ admin-managed â€” ظ„ط§ user_id â€” id ط¹ط¯ط¯ طµط­ظٹط­ ظ…ط¨ط§ط´ط±
// RLS: SELECT ط¹ط§ظ… / INSERT-UPDATE-DELETE ظٹطھط·ظ„ط¨ session auth
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface NewsPayload {
  title: string;
  body?: string;
  category: string;
  source?: string;
  is_published?: boolean;
}

export async function createNewsInSupabase(payload: NewsPayload): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!.from("news").insert({
      title: payload.title,
      body: payload.body ?? null,
      category: payload.category,
      source: payload.source ?? null,
      is_published: payload.is_published ?? true,
      published_at: payload.is_published ? new Date().toISOString() : null,
    });
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function updateNewsInSupabase(id: number, payload: Partial<NewsPayload>): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const patch: Record<string, unknown> = {};
    if (payload.title !== undefined) patch.title = payload.title;
    if (payload.body !== undefined) patch.body = payload.body ?? null;
    if (payload.category !== undefined) patch.category = payload.category;
    if (payload.source !== undefined) patch.source = payload.source ?? null;
    if (payload.is_published !== undefined) {
      patch.is_published = payload.is_published;
      if (payload.is_published) patch.published_at = new Date().toISOString();
    }
    const { error } = await supabase!.from("news").update(patch).eq("id", id);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function deleteNewsInSupabase(id: number): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!.from("news").delete().eq("id", id);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin CRUD: ط§ظ„ظˆط¸ط§ط¦ظپ (jobs)
// ط¬ط¯ظˆظ„ admin-managed â€” ظ„ط§ user_id â€” id ط¹ط¯ط¯ طµط­ظٹط­ ظ…ط¨ط§ط´ط±
// RLS: SELECT ط¹ط§ظ… / INSERT-UPDATE-DELETE ظٹطھط·ظ„ط¨ session auth
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface JobPayload {
  title: string;
  employer: string;
  sector: string;
  city: string;
  description?: string;
  apply_url?: string;
  deadline?: string;
  is_active?: boolean;
}

export async function createJobInSupabase(payload: JobPayload): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!.from("jobs").insert({
      title: payload.title,
      employer: payload.employer,
      sector: payload.sector,
      city: payload.city,
      description: payload.description ?? null,
      apply_url: payload.apply_url ?? null,
      deadline: payload.deadline ?? null,
      is_active: payload.is_active ?? true,
    });
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function updateJobInSupabase(id: number, payload: Partial<JobPayload>): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const patch: Record<string, unknown> = {};
    if (payload.title !== undefined) patch.title = payload.title;
    if (payload.employer !== undefined) patch.employer = payload.employer;
    if (payload.sector !== undefined) patch.sector = payload.sector;
    if (payload.city !== undefined) patch.city = payload.city;
    if (payload.description !== undefined) patch.description = payload.description ?? null;
    if (payload.apply_url !== undefined) patch.apply_url = payload.apply_url ?? null;
    if (payload.deadline !== undefined) patch.deadline = payload.deadline ?? null;
    if (payload.is_active !== undefined) patch.is_active = payload.is_active;
    const { error } = await supabase!.from("jobs").update(patch).eq("id", id);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function deleteJobInSupabase(id: number): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!.from("jobs").delete().eq("id", id);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin CRUD: ط§ظ„ط«ظٹظ…ط§طھ (themes)
// edit-only â€” ظ„ط§ create/delete â€” id ط¹ط¯ط¯ طµط­ظٹط­ ظ…ط¨ط§ط´ط±
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ThemeUpdatePayload {
  name?: string;
  description?: string;
  is_active?: boolean;
  is_available?: boolean;
  tier?: string;
}

export async function updateThemeInSupabase(id: number, payload: ThemeUpdatePayload): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const patch: Record<string, unknown> = {};
    if (payload.name !== undefined) patch.name = payload.name;
    if (payload.description !== undefined) patch.description = payload.description ?? null;
    if (payload.is_active !== undefined) patch.is_active = payload.is_active;
    if (payload.is_available !== undefined) patch.is_available = payload.is_available;
    if (payload.tier !== undefined) patch.tier = payload.tier;
    const { error } = await supabase!.from("themes").update(patch).eq("id", id);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin CRUD: ظ‚ظˆط§ظ„ط¨ ط§ظ„ط³طھظˆط±ظٹ (story_templates)
// full CRUD â€” id ط¹ط¯ط¯ طµط­ظٹط­ ظ…ط¨ط§ط´ط±
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface StoryTemplatePayload {
  name: string;
  description?: string;
  template_text?: string;
  background_color?: string;
  text_color?: string;
  is_active?: boolean;
}

export async function createStoryTemplateInSupabase(payload: StoryTemplatePayload): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!.from("story_templates").insert({
      name: payload.name,
      description: payload.description ?? null,
      template_text: payload.template_text ?? null,
      background_color: payload.background_color ?? null,
      text_color: payload.text_color ?? null,
      is_active: payload.is_active ?? true,
    });
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function updateStoryTemplateInSupabase(id: number, payload: Partial<StoryTemplatePayload>): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const patch: Record<string, unknown> = {};
    if (payload.name !== undefined) patch.name = payload.name;
    if (payload.description !== undefined) patch.description = payload.description ?? null;
    if (payload.template_text !== undefined) patch.template_text = payload.template_text ?? null;
    if (payload.background_color !== undefined) patch.background_color = payload.background_color ?? null;
    if (payload.text_color !== undefined) patch.text_color = payload.text_color ?? null;
    if (payload.is_active !== undefined) patch.is_active = payload.is_active;
    const { error } = await supabase!.from("story_templates").update(patch).eq("id", id);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function deleteStoryTemplateInSupabase(id: number): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!.from("story_templates").delete().eq("id", id);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin CRUD: ط±ط³ط§ط¦ظ„ ط§ظ„ظٹظˆظ… (daily_messages)
// full CRUD â€” id ط¹ط¯ط¯ طµط­ظٹط­ ظ…ط¨ط§ط´ط±
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface DailyMessagePayload {
  message: string;
  display_date?: string;
  is_active?: boolean;
}

export async function createDailyMessageInSupabase(payload: DailyMessagePayload): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!.from("daily_messages").insert({
      message: payload.message,
      display_date: payload.display_date ?? null,
      is_active: payload.is_active ?? true,
    });
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function updateDailyMessageInSupabase(id: number, payload: Partial<DailyMessagePayload>): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const patch: Record<string, unknown> = {};
    if (payload.message !== undefined) patch.message = payload.message;
    if (payload.display_date !== undefined) patch.display_date = payload.display_date ?? null;
    if (payload.is_active !== undefined) patch.is_active = payload.is_active;
    const { error } = await supabase!.from("daily_messages").update(patch).eq("id", id);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

export async function deleteDailyMessageInSupabase(id: number): Promise<WriteResult> {
  if (!supabase) return { success: false, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" };
  try {
    const { error } = await supabase!.from("daily_messages").delete().eq("id", id);
    if (error) return { success: false, error: `Supabase error: ${error.message}` };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹" };
  }
}

/**
 * getUnreadNotificationsCountFromSupabase
 * ظٹظڈط¹ظٹط¯ ط¹ط¯ط¯ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط؛ظٹط± ط§ظ„ظ…ظ‚ط±ظˆط،ط© ظ„ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ط­ط§ظ„ظٹ.
 *
 * RLS: notifications_select_own â€” auth.uid() = user_id.
 * ط¨ط¯ظˆظ† session â†’ ظٹظڈط¹ظٹط¯ null.
 */
export async function getUnreadNotificationsCountFromSupabase(): Promise<number | null> {
  if (!isConnected()) return null;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { count, error } = await supabase!
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Shadow Comparison Utility
// ظٹظ‚ط§ط±ظ† Counts ط¨ظٹظ† API ظˆSupabase â€” ظ„ط§ ظٹط؛ظٹظ‘ط± ط§ظ„ط¨ظٹط§ظ†ط§طھ
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ShadowComparisonResult {
  table: string;
  apiCount: number;
  supabaseCount: number | null;
  match: boolean | null;
  error?: string;
}

export interface ShadowComparisonSummary {
  results: ShadowComparisonResult[];
  apiTotal: number;
  supabaseTotal: number | null;
  allMatch: boolean | null;
  supabaseConnected: boolean;
  runAt: string;
}

const TABLE_EXPECTED_API_COUNTS: Record<string, number> = {
  daily_messages: 8,
  story_templates: 2,
  themes: 10,
  news: 2,
  jobs: 2,
  appointments: 2,
  financial_events: 8,
  notifications: 3,
  complaints: 3,
};

async function getSupabaseCount(table: string, userId: string | null): Promise<number | null> {
  if (!supabase) return null;
  try {
    const userOwnedTables = ["appointments", "financial_events", "notifications"];
    let query = supabase.from(table).select("id", { count: "exact", head: true });
    if (userOwnedTables.includes(table) && userId) {
      query = query.eq("user_id", userId);
    }
    const { count, error } = await query;
    if (error) return null;
    return count;
  } catch {
    return null;
  }
}

export async function runShadowComparison(
  apiCounts?: Partial<Record<string, number>>
): Promise<ShadowComparisonSummary> {
  const connected = isConnected();
  const userId = connected ? await getCurrentUserId() : null;
  const tables = Object.keys(TABLE_EXPECTED_API_COUNTS);
  const effectiveCounts = { ...TABLE_EXPECTED_API_COUNTS, ...apiCounts };

  const results: ShadowComparisonResult[] = [];

  for (const table of tables) {
    const apiCount = effectiveCounts[table] ?? 0;
    if (!connected) {
      results.push({ table, apiCount, supabaseCount: null, match: null, error: "Supabase ط؛ظٹط± ظ…طھطµظ„" });
      continue;
    }
    const supabaseCount = await getSupabaseCount(table, userId);
    const match = supabaseCount !== null ? supabaseCount === apiCount : null;
    results.push({ table, apiCount, supabaseCount, match });
  }

  const apiTotal = results.reduce((s, r) => s + r.apiCount, 0);
  const supabaseCounts = results.map((r) => r.supabaseCount);
  const supabaseTotal = supabaseCounts.every((c) => c !== null)
    ? supabaseCounts.reduce((s, c) => (s ?? 0) + (c ?? 0), 0)
    : null;
  const allMatch = results.every((r) => r.match === true) ? true : results.some((r) => r.match === false) ? false : null;

  return {
    results,
    apiTotal,
    supabaseTotal,
    allMatch,
    supabaseConnected: connected,
    runAt: new Date().toISOString(),
  };
}

