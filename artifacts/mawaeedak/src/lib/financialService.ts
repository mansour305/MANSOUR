/**
 * Financial Schedules Service â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
 * 
 * ط®ط¯ظ…ط© ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط© (ط§ظ„ط±ظˆط§طھط¨ ظˆط§ظ„ط¯ط¹ظ…)
 */

import { supabase, isSupabaseEnabled } from "./supabase";
import { calculateDaysRemaining, getRiyadhTodayKey } from "./riyadhTime";

export type FinancialProgram = 
  | "salary" 
  | "citizen_account" 
  | "housing_support" 
  | "social_security"
  | "retirement" 
  | "insurance" 
  | "saned" 
  | "hafiz" 
  | "rehabilitation"
  | "agricultural_support" 
  | "other";

export const PROGRAM_NAMES: Record<FinancialProgram, string> = {
  salary: "ط§ظ„ط±ط§طھط¨",
  citizen_account: "ط­ط³ط§ط¨ ط§ظ„ظ…ظˆط§ط·ظ†",
  housing_support: "ط§ظ„ط¯ط¹ظ… ط§ظ„ط³ظƒظ†ظٹ",
  social_security: "ط§ظ„ط¶ظ…ط§ظ† ط§ظ„ط§ط¬طھظ…ط§ط¹ظٹ",
  retirement: "ط§ظ„طھظ‚ط§ط¹ط¯",
  insurance: "ط§ظ„طھط£ظ…ظٹظ†ط§طھ",
  saned: "ط³ط§ظ†ط¯",
  hafiz: "ط­ط§ظپط²",
  rehabilitation: "ط§ظ„طھط£ظ‡ظٹظ„ ط§ظ„ط´ط§ظ…ظ„",
  agricultural_support: "ط§ظ„ط¯ط¹ظ… ط§ظ„ط²ط±ط§ط¹ظٹ",
  other: "ط¯ط¹ظ… ط¢ط®ط±",
};

export type FinancialDateRecord = {
  id: string;
  program_key: FinancialProgram;
  program_name_ar: string;
  owning_authority_name: string | null;
  official_source_url: string | null;
  source_type: string;
  is_official: boolean;
  occurrence_date_gregorian: string;
  occurrence_date_hijri: string | null;
  adjustment_status: "none" | "advance" | "delay" | "correction";
  adjustment_reason: string | null;
  approval_status: "pending" | "approved" | "rejected";
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FinancialEvent = {
  id: string;
  user_id: string;
  type: FinancialProgram;
  program_name_ar: string;
  next_date: string;
  hijri_date: string | null;
  reminder_enabled: boolean;
  reminder_days_before: number;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type FinancialDateAdjustment = {
  id: string;
  program_key: FinancialProgram;
  event_id: string | null;
  old_date: string | null;
  new_date: string;
  adjustment_type: "advance" | "delay" | "correction";
  reason: string | null;
  official_source_name: string | null;
  official_source_url: string | null;
  approval_status: "pending" | "approved" | "rejected";
  applied_at: string;
  updated_by: string | null;
  created_at: string;
};

export type FinancialCountdown = {
  program: FinancialProgram;
  name: string;
  days: number;
  date: string;
  adjustment_status: string;
  adjustment_reason: string | null;
};

/**
 * getOfficialFinancialDates â€” ط¬ظ„ط¨ ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط© ط§ظ„ط±ط³ظ…ظٹط©
 */
export async function getOfficialFinancialDates(): Promise<FinancialDateRecord[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  const { data, error } = await supabase
    .from("official_financial_dates")
    .select("*")
    .eq("approval_status", "approved")
    .order("occurrence_date_gregorian", { ascending: true });
  
  if (error) return [];
  return (data || []) as FinancialDateRecord[];
}

/**
 * getUpcomingFinancialDates â€” ط¬ظ„ط¨ ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ‚ط§ط¯ظ…ط©
 */
export async function getUpcomingFinancialDates(limit = 5): Promise<FinancialDateRecord[]> {
  const all = await getOfficialFinancialDates();
  const today = getRiyadhTodayKey();
  return all.filter(d => d.occurrence_date_gregorian >= today).slice(0, limit);
}

/**
 * getFinancialCountdowns â€” ط­ط³ط§ط¨ ط§ظ„ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…ط§ظ„ظٹط©
 */
export async function getFinancialCountdowns(): Promise<FinancialCountdown[]> {
  const dates = await getUpcomingFinancialDates(10);
  
  return dates.map(d => ({
    program: d.program_key,
    name: d.program_name_ar || PROGRAM_NAMES[d.program_key],
    days: calculateDaysRemaining(d.occurrence_date_gregorian),
    date: d.occurrence_date_gregorian,
    adjustment_status: d.adjustment_status,
    adjustment_reason: d.adjustment_reason,
  }));
}

/**
 * createFinancialDateRecord â€” ط¥ظ†ط´ط§ط، ط³ط¬ظ„ ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function createFinancialDateRecord(
  record: Omit<FinancialDateRecord, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("official_financial_dates")
    .insert({
      ...record,
      approval_status: "pending",
    });
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * updateFinancialDate â€” طھط­ط¯ظٹط« ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function updateFinancialDate(
  id: string,
  updates: Partial<FinancialDateRecord>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("official_financial_dates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * adjustFinancialDate â€” طھط¹ط¯ظٹظ„ ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ ظ…ط¹ ط³ط¬ظ„ ط§ظ„طھط¹ط¯ظٹظ„
 */
export async function adjustFinancialDate(
  id: string,
  newDate: string,
  adjustmentType: "advance" | "delay" | "correction",
  reason: string,
  updatedBy: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  // Get current record
  const { data: current, error: fetchError } = await supabase
    .from("official_financial_dates")
    .select("*")
    .eq("id", id)
    .single();
  
  if (fetchError || !current) {
    return { success: false, error: "ط§ظ„ط³ط¬ظ„ ط؛ظٹط± ظ…ظˆط¬ظˆط¯" };
  }
  
  // Record adjustment
  const { error: adjustmentError } = await supabase
    .from("financial_date_adjustments")
    .insert({
      program_key: current.program_key,
      event_id: id,
      old_date: current.occurrence_date_gregorian,
      new_date: newDate,
      adjustment_type: adjustmentType,
      reason,
      approval_status: "approved",
      applied_at: new Date().toISOString(),
      updated_by: updatedBy,
    });
  
  if (adjustmentError) {
    return { success: false, error: adjustmentError.message };
  }
  
  // Update the financial date
  const { error: updateError } = await supabase
    .from("official_financial_dates")
    .update({
      occurrence_date_gregorian: newDate,
      adjustment_status: adjustmentType,
      adjustment_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  
  if (updateError) return { success: false, error: updateError.message };
  return { success: true };
}

/**
 * getAdjustmentHistory â€” ط¬ظ„ط¨ ط³ط¬ظ„ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ
 */
export async function getAdjustmentHistory(programKey?: string): Promise<FinancialDateAdjustment[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  let query = supabase
    .from("financial_date_adjustments")
    .select("*")
    .order("applied_at", { ascending: false });
  
  if (programKey) {
    query = query.eq("program_key", programKey);
  }
  
  const { data, error } = await query;
  if (error) return [];
  return (data || []) as FinancialDateAdjustment[];
}

/**
 * getUserFinancialEvents â€” ط¬ظ„ط¨ ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ظ…ط§ظ„ظٹط©
 */
export async function getUserFinancialEvents(userId: string): Promise<FinancialEvent[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  const { data, error } = await supabase
    .from("financial_events")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("next_date", { ascending: true });
  
  if (error) return [];
  return (data || []) as FinancialEvent[];
}

/**
 * createUserFinancialEvent â€” ط¥ظ†ط´ط§ط، ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ ظ„ظ„ظ…ط³طھط®ط¯ظ…
 */
export async function createUserFinancialEvent(
  userId: string,
  type: FinancialProgram,
  nextDate: string,
  programNameAr?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("financial_events")
    .insert({
      user_id: userId,
      type,
      program_name_ar: programNameAr || PROGRAM_NAMES[type],
      next_date: nextDate,
      is_active: true,
    });
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * deleteUserFinancialEvent â€” ط­ط°ظپ ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ ظ„ظ„ظ…ط³طھط®ط¯ظ…
 */
export async function deleteUserFinancialEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("financial_events")
    .delete()
    .eq("id", eventId);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * approveFinancialDate â€” ط§ط¹طھظ…ط§ط¯ ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function approveFinancialDate(id: string): Promise<{ success: boolean; error?: string }> {
  return updateFinancialDate(id, {
    approval_status: "approved",
    last_verified_at: new Date().toISOString(),
  });
}

/**
 * getAllFinancialDatesAdmin â€” ط¬ظ„ط¨ ظƒظ„ ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط© (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function getAllFinancialDatesAdmin(): Promise<FinancialDateRecord[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  const { data, error } = await supabase
    .from("official_financial_dates")
    .select("*")
    .order("occurrence_date_gregorian", { ascending: true });
  
  if (error) return [];
  return (data || []) as FinancialDateRecord[];
}

