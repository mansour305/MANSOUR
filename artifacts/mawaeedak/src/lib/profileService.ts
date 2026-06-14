/**
 * Profile Service â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
 * 
 * ظˆط§ط¬ظ‡ط© ظ…ظˆط­ط¯ط© ظ„ط¥ط¯ط§ط±ط© ظ…ظ„ظپط§طھ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†
 * ط§ظ„ظ‚ط±ط§ط،ط©: user_profiles ط£ظˆظ„ط§ظ‹طŒ ط«ظ… app_metadata ظƒظ€ fallback
 */

import { supabase, isSupabaseEnabled } from "./supabase";

export type UserProfile = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  city_key: string | null;
  city_name_ar: string | null;
  timezone: string;
  role: "user" | "admin" | "super_admin" | "owner";
  onboarding_complete: boolean;
  location_consent: boolean;
  notification_consent: boolean;
  time_format_preference: "12h" | "24h";
  created_at: string;
  updated_at: string;
};

export type UserRole = "user" | "admin" | "super_admin" | "owner";

const ADMIN_ROLES: UserRole[] = ["admin", "super_admin", "owner"];

/**
 * getUserProfile â€” ط¬ظ„ط¨ ظ…ظ„ظپ ط§ظ„ظ…ط³طھط®ط¯ظ… ظ…ظ† user_profiles
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseEnabled || !supabase) return null;
  
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  
  if (error) return null;
  return data as UserProfile;
}

/**
 * getRoleFromProfile â€” ظ‚ط±ط§ط،ط© ط§ظ„ط¯ظˆط± ظ…ظ† user_profiles.role
 * ظ‡ط°ط§ ظ‡ظˆ ط§ظ„ظ…طµط¯ط± ط§ظ„ط£ظˆظ„ ظ„ظ„ط¯ظˆط±
 */
export async function getRoleFromProfile(userId: string): Promise<UserRole> {
  const profile = await getUserProfile(userId);
  if (profile?.role) return profile.role;
  return "user";
}

/**
 * getRoleWithFallback â€” ظ‚ط±ط§ط،ط© ط§ظ„ط¯ظˆط± ظ…ط¹ fallback ظ„ظ€ app_metadata
 * ط§ظ„طھط±طھظٹط¨:
 * 1. user_profiles.role (ط§ظ„ظ…طµط¯ط± ط§ظ„ط£ظˆظ„)
 * 2. auth.user.app_metadata.role (fallback)
 */
export async function getRoleWithFallback(supabaseUser: any): Promise<UserRole> {
  // ط§ظ„ظ…طµط¯ط± ط§ظ„ط£ظˆظ„: user_profiles
  if (supabaseUser?.id) {
    const profileRole = await getRoleFromProfile(supabaseUser.id);
    if (profileRole !== "user" && ADMIN_ROLES.includes(profileRole)) {
      return profileRole;
    }
  }
  
  // ط§ظ„ظ…طµط¯ط± ط§ظ„ط«ط§ظ†ظٹ: app_metadata.role
  const metaRole = supabaseUser?.app_metadata?.role as UserRole | undefined;
  if (metaRole && ADMIN_ROLES.includes(metaRole)) {
    return metaRole;
  }
  
  return "user";
}

/**
 * updateUserProfile â€” طھط­ط¯ظٹط« ظ…ظ„ظپ ط§ظ„ظ…ط³طھط®ط¯ظ…
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, "id" | "user_id" | "created_at">>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseEnabled || !supabase) {
    return { success: false, error: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£" };
  }
  
  const { error } = await supabase
    .from("user_profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * updateUserRole â€” طھط­ط¯ظٹط« ط¯ظˆط± ط§ظ„ظ…ط³طھط®ط¯ظ… (ظ„ظ„ط£ط¯ظ…ظ† ظپظ‚ط·)
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  return updateUserProfile(userId, { role: newRole });
}

/**
 * isAdmin â€” ظ‡ظ„ ط§ظ„ظ…ط³طھط®ط¯ظ… ط£ط¯ظ…ظ†طں
 * ظٹط³طھط®ط¯ظ… getRoleWithFallback ظ„ظ„طھظˆط­ظٹط¯
 */
export async function isAdmin(supabaseUser: any): Promise<boolean> {
  const role = await getRoleWithFallback(supabaseUser);
  return ADMIN_ROLES.includes(role);
}

/**
 * getAllProfiles â€” ط¬ظ„ط¨ ظƒظ„ ط§ظ„ظ…ظ„ظپط§طھ (ظ„ظ„ط£ط¯ظ…ظ†)
 */
export async function getAllProfiles(): Promise<UserProfile[]> {
  if (!isSupabaseEnabled || !supabase) return [];
  
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) return [];
  return (data || []) as UserProfile[];
}

/**
 * updateCityKey â€” طھط­ط¯ظٹط« ط§ظ„ظ…ط¯ظٹظ†ط© ظ„ظ„ظ…ط³طھط®ط¯ظ…
 */
export async function updateCityKey(
  userId: string,
  cityKey: string,
  cityNameAr: string
): Promise<{ success: boolean; error?: string }> {
  return updateUserProfile(userId, { 
    city_key: cityKey, 
    city_name_ar: cityNameAr,
    location_consent: true 
  });
}

/**
 * setOnboardingComplete â€” طھط­ط¯ظٹط¯ ط§ظƒطھظ…ط§ظ„ ط§ظ„طھط³ط¬ظٹظ„
 */
export async function setOnboardingComplete(userId: string): Promise<{ success: boolean; error?: string }> {
  return updateUserProfile(userId, { onboarding_complete: true });
}

/**
 * setLocationConsent â€” ط­ظپط¸ ظ…ظˆط§ظپظ‚ط© ط§ظ„ظ…ظˆظ‚ط¹
 */
export async function setLocationConsent(userId: string, consent: boolean): Promise<{ success: boolean; error?: string }> {
  return updateUserProfile(userId, { location_consent: consent });
}

/**
 * setNotificationConsent â€” ط­ظپط¸ ظ…ظˆط§ظپظ‚ط© ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ
 */
export async function setNotificationConsent(userId: string, consent: boolean): Promise<{ success: boolean; error?: string }> {
  return updateUserProfile(userId, { notification_consent: consent });
}
