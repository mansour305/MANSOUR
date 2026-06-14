/**
 * Complaint Service â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
 * 
 * ط®ط¯ظ…ط© ط§ظ„ط´ظƒط§ظˆظ‰ ظˆط§ظ„ط§ظ‚طھط±ط§ط­ط§طھ
 */

import { supabase, isSupabaseEnabled } from "./supabase";

export type ComplaintType = "complaint" | "suggestion" | "inquiry";
export type ComplaintStatus = "pending" | "in_progress" | "resolved" | "rejected";

export type Complaint = {
  id: string;
  user_id: string | null;
  type: ComplaintType;
  category: string;
  message: string;
  status: ComplaintStatus;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateComplaintInput = {
  type: ComplaintType;
  category?: string;
  message: string;
};

/**
 * createComplaint â€” ط¥ط±ط³ط§ظ„ ط´ظƒظˆظ‰ ط£ظˆ ط§ظ‚طھط±ط§ط­
 */
export async function createComplaint(
  input: CreateComplaintInput,
  userId?: string
): Promise<{ success: boolean; error?: string; data?: Complaint }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  if (!input.message.trim()) {
    return { success: false, error: "ط§ظ„ط±ط³ط§ظ„ط© ظ…ط·ظ„ظˆط¨ط©" };
  }
  
  if (input.message.length < 10) {
    return { success: false, error: "ط§ظ„ط±ط³ط§ظ„ط© ظ‚طµظٹط±ط© ط¬ط¯ط§ظ‹ (10 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„)" };
  }
  
  const { data, error } = await supabase
    .from("complaints")
    .insert({
      user_id: userId || null,
      type: input.type,
      category: input.category || "general",
      message: input.message.trim(),
      status: "pending",
    })
    .select()
    .single();
  
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as Complaint };
}

/**
 * getUserComplaints â€” ط¬ظ„ط¨ ط´ظƒط§ظˆظ‰ ط§ظ„ظ…ط³طھط®ط¯ظ…
 */
export async function getUserComplaints(userId: string): Promise<Complaint[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  
  if (error) return [];
  return (data || []) as Complaint[];
}

/**
 * getAllComplaints â€” ط¬ظ„ط¨ ظƒظ„ ط§ظ„ط´ظƒط§ظˆظ‰ (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function getAllComplaints(): Promise<Complaint[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) return [];
  return (data || []) as Complaint[];
}

/**
 * getComplaintsByStatus â€” ط¬ظ„ط¨ ط§ظ„ط´ظƒط§ظˆظ‰ ط­ط³ط¨ ط§ظ„ط­ط§ظ„ط©
 */
export async function getComplaintsByStatus(status: ComplaintStatus): Promise<Complaint[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });
  
  if (error) return [];
  return (data || []) as Complaint[];
}

/**
 * updateComplaintStatus â€” طھط­ط¯ظٹط« ط­ط§ظ„ط© ط§ظ„ط´ظƒظˆظ‰ (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function updateComplaintStatus(
  complaintId: string,
  status: ComplaintStatus,
  adminResponse?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const updates: Partial<Complaint> = {
    status,
    updated_at: new Date().toISOString(),
  };
  
  if (adminResponse) {
    updates.admin_response = adminResponse;
  }
  
  const { error } = await supabase
    .from("complaints")
    .update(updates)
    .eq("id", complaintId);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * getComplaintStats â€” ط¥ط­طµط§ط¦ظٹط§طھ ط§ظ„ط´ظƒط§ظˆظ‰ (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function getComplaintStats(): Promise<{
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}> {
  const all = await getAllComplaints();
  
  return {
    total: all.length,
    pending: all.filter(c => c.status === "pending").length,
    in_progress: all.filter(c => c.status === "in_progress").length,
    resolved: all.filter(c => c.status === "resolved").length,
    rejected: all.filter(c => c.status === "rejected").length,
  };
}

/**
 * deleteComplaint â€” ط­ط°ظپ ط§ظ„ط´ظƒظˆظ‰
 */
export async function deleteComplaint(complaintId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("complaints")
    .delete()
    .eq("id", complaintId);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}
