/**
 * Feature Registry â€” Phase 14
 * 
 * Tracks feature status for paywall and health monitoring.
 */

export type FeatureStatus = "active" | "beta" | "coming_soon" | "disabled";
export type PlanRequired = "free" | "premium";

export type Feature = {
  feature_key: string;
  title: string;
  description: string;
  plan_required: PlanRequired;
  status: FeatureStatus;
  is_visible_in_paywall: boolean;
  is_coming_soon: boolean;
  route: string | null;
  health_check_key: string;
  created_at: string;
  updated_at: string;
};

// Feature Registry
export const FEATURE_REGISTRY: Feature[] = [
  // Core features
  {
    feature_key: "home",
    title: "ط§ظ„ط±ط¦ظٹط³ظٹط©",
    description: "ط§ظ„طµظپط­ط© ط§ظ„ط±ط¦ظٹط³ظٹط© ظ…ط¹ ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ظˆط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط©",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/",
    health_check_key: "home",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "prayer_times",
    title: "ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©",
    description: "ط¹ط±ط¶ ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ظ…ط¹ ط§ظ„ط¹ط¯ ط§ظ„طھظ†ط§ط²ظ„ظٹ",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/",
    health_check_key: "prayer_times",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "financial_dates",
    title: "ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط©",
    description: "ط§ظ„ط±ظˆط§طھط¨ ظˆط§ظ„ظ…ط³ط§ط¹ط¯ط§طھ ظˆظ…ظˆط§ط¹ظٹط¯ ط§ظ„ط¯ظپط¹",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/salaries",
    health_check_key: "financial",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "calendar",
    title: "ط§ظ„طھظ‚ظˆظٹظ…",
    description: "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ط´ط®طµظٹط©",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/calendar",
    health_check_key: "calendar",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "goals",
    title: "ط§ظ„ط£ظ‡ط¯ط§ظپ",
    description: "طھطھط¨ط¹ ط§ظ„ط£ظ‡ط¯ط§ظپ ط§ظ„ظ…ط§ظ„ظٹط© ظˆط؛ظٹط± ط§ظ„ظ…ط§ظ„ظٹط©",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/services/goals",
    health_check_key: "goals",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "costs",
    title: "ط­ط³ط§ط¨ ط§ظ„طھظƒط§ظ„ظٹظپ",
    description: "ط¥ط¯ط§ط±ط© ظ…ط´ط§ط±ظٹط¹ ط§ظ„طھظƒط§ظ„ظٹظپ ظˆط§ظ„ط¨ظ†ظˆط¯",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/services/costs",
    health_check_key: "costs",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "reminders",
    title: "ط§ظ„طھط°ظƒظٹط±ط§طھ",
    description: "طھط°ظƒظٹط±ط§طھ ظ…ط®طµطµط© ط¨ظ…ظˆط§ط¹ظٹط¯ ط«ط§ط¨طھط©",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/services/reminders",
    health_check_key: "reminders",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "notifications",
    title: "ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ",
    description: "ظ‚ط§ط¦ظ…ط© ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ط¯ط§ط®ظ„ظٹط©",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/notifications",
    health_check_key: "notifications",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "daily_content",
    title: "ظ…ط­طھظˆظ‰ ط§ظ„ظٹظˆظ…",
    description: "ط±ط³ط§ط¦ظ„ ط§ظ„ظٹظˆظ… ط§ظ„ظٹظˆظ…ظٹط©",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/daily-card",
    health_check_key: "daily_content",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "complaints",
    title: "طµظˆطھظƒ ظ…ط³ظ…ظˆط¹",
    description: "ط§ظ„ط´ظƒط§ظˆظ‰ ظˆط§ظ„ط§ظ‚طھط±ط§ط­ط§طھ",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/centers/complaints",
    health_check_key: "complaints",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "account",
    title: "ط­ط³ط§ط¨ظٹ",
    description: "ط¥ط¯ط§ط±ط© ط§ظ„ط­ط³ط§ط¨ ظˆط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/account",
    health_check_key: "account",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "themes",
    title: "ط§ظ„ط«ظٹظ…ط§طھ",
    description: "طھط؛ظٹظٹط± ظ…ط¸ظ‡ط± ط§ظ„طھط·ط¨ظٹظ‚",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: "/account",
    health_check_key: "themes",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "pwa",
    title: "PWA",
    description: "ط§ظ„طھط·ط¨ظٹظ‚ ط§ظ„ظ‚ط§ط¨ظ„ ظ„ظ„طھط«ط¨ظٹطھ",
    plan_required: "free",
    status: "active",
    is_visible_in_paywall: false,
    is_coming_soon: false,
    route: null,
    health_check_key: "pwa",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Coming soon
  {
    feature_key: "adkkar",
    title: "ط§ظ„ط£ط°ظƒط§ط±",
    description: "ط£ط°ظƒط§ط± ط§ظ„طµط¨ط§ط­ ظˆط§ظ„ظ…ط³ط§ط،",
    plan_required: "free",
    status: "coming_soon",
    is_visible_in_paywall: false,
    is_coming_soon: true,
    route: null,
    health_check_key: "adkkar",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "greetings",
    title: "ط§ظ„طھظ‡ط§ظ†ظٹ",
    description: "ط¥ط±ط³ط§ظ„ ط§ظ„طھظ‡ط§ظ†ظٹ ظˆط§ظ„ظ…ظ†ط§ط³ط¨ط§طھ",
    plan_required: "free",
    status: "coming_soon",
    is_visible_in_paywall: false,
    is_coming_soon: true,
    route: null,
    health_check_key: "greetings",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "smartwatch",
    title: "ط³ط§ط¹ط© ط°ظƒظٹط©",
    description: "Apple Watch ظˆ Wear OS",
    plan_required: "premium",
    status: "coming_soon",
    is_visible_in_paywall: true,
    is_coming_soon: true,
    route: null,
    health_check_key: "smartwatch",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "push_notifications",
    title: "ط¥ط´ط¹ط§ط±ط§طھ Push",
    description: "ط¥ط´ط¹ط§ط±ط§طھ ظپظˆط±ظٹط©",
    plan_required: "premium",
    status: "coming_soon",
    is_visible_in_paywall: true,
    is_coming_soon: true,
    route: null,
    health_check_key: "push_notifications",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "export",
    title: "طھطµط¯ظٹط± ط§ظ„ط¨ظٹط§ظ†ط§طھ",
    description: "طھطµط¯ظٹط± ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ظˆط§ظ„طھظ‚ط§ط±ظٹط±",
    plan_required: "premium",
    status: "coming_soon",
    is_visible_in_paywall: true,
    is_coming_soon: true,
    route: null,
    health_check_key: "export",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "advanced_sharing",
    title: "ظ…ط´ط§ط±ظƒط© ظ…طھظ‚ط¯ظ…ط©",
    description: "ظ…ط´ط§ط±ظƒط© ط§ظ„طھظ‚ظˆظٹظ… ظˆط§ظ„ظ…ظ„ظپط§طھ",
    plan_required: "premium",
    status: "coming_soon",
    is_visible_in_paywall: true,
    is_coming_soon: true,
    route: null,
    health_check_key: "advanced_sharing",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "personal_reports",
    title: "طھظ‚ط§ط±ظٹط± ط´ط®طµظٹط©",
    description: "طھظ‚ط§ط±ظٹط± ظˆط¥ط­طµط§ط¦ظٹط§طھ ظ…طھظ‚ط¯ظ…ط©",
    plan_required: "premium",
    status: "coming_soon",
    is_visible_in_paywall: true,
    is_coming_soon: true,
    route: null,
    health_check_key: "personal_reports",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    feature_key: "smart_alerts",
    title: "طھظ†ط¨ظٹظ‡ط§طھ ط°ظƒظٹط©",
    description: "طھظ†ط¨ظٹظ‡ط§طھ ط°ظƒظٹط© ط¨ظ†ط§ط،ظ‹ ط¹ظ„ظ‰ ط§ظ„ط³ظ„ظˆظƒ",
    plan_required: "premium",
    status: "coming_soon",
    is_visible_in_paywall: true,
    is_coming_soon: true,
    route: null,
    health_check_key: "smart_alerts",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Free tier limits
export const FREE_LIMITS = {
  goals: 3,
  costProjects: 2,
  costItemsPerProject: 10,
  reminders: 5,
  calendarEvents: 20,
};

// Premium limits
export const PREMIUM_LIMITS = {
  goals: Infinity,
  costProjects: Infinity,
  costItemsPerProject: Infinity,
  reminders: Infinity,
  calendarEvents: Infinity,
};

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    name: "ظ…ط¬ط§ظ†ظٹ",
    price: 0,
    priceMonthly: 0,
    priceAnnual: 0,
    equivalentMonthly: 0,
    features: [
      "ط§ظ„ط£ظ‡ط¯ط§ظپ (3 ط£ظ‡ط¯ط§ظپ)",
      "ظ…ط´ط§ط±ظٹط¹ ط§ظ„طھظƒط§ظ„ظٹظپ (2 ظ…ط´ط±ظˆط¹)",
      "ط§ظ„طھط°ظƒظٹط±ط§طھ (5)",
      "ط§ظ„طھظ‚ظˆظٹظ… (20 ظ…ظˆط¹ط¯)",
      "ط§ظ„ط«ظٹظ… ط§ظ„ط§ظپطھط±ط§ط¶ظٹ",
    ],
    isTrialAvailable: false,
  },
  premiumMonthly: {
    name: "ط§ط´طھط±ط§ظƒ ط´ظ‡ط±ظٹ",
    price: 10,
    priceMonthly: 10,
    priceAnnual: 0,
    equivalentMonthly: 10,
    currency: "USD",
    trialDays: 7,
    features: [
      "ط£ظ‡ط¯ط§ظپ ط؛ظٹط± ظ…ط­ط¯ظˆط¯ط©",
      "ظ…ط´ط§ط±ظٹط¹ طھظƒط§ظ„ظٹظپ ط؛ظٹط± ظ…ط­ط¯ظˆط¯ط©",
      "طھط°ظƒظٹط±ط§طھ ط؛ظٹط± ظ…ط­ط¯ظˆط¯ط©",
      "طھظ‚ظˆظٹظ… ط؛ظٹط± ظ…ط­ط¯ظˆط¯",
      "ط«ظٹظ…ط§طھ ظ…طھظ‚ط¯ظ…ط©",
      "طھظ‚ط§ط±ظٹط± ط´ط®طµظٹط©",
      "طھظ†ط¨ظٹظ‡ط§طھ ط°ظƒظٹط©",
    ],
    isTrialAvailable: true,
  },
  premiumAnnual: {
    name: "ط§ط´طھط±ط§ظƒ ط³ظ†ظˆظٹ",
    price: 48,
    priceMonthly: 0,
    priceAnnual: 48,
    equivalentMonthly: 4,
    currency: "USD",
    trialDays: 7,
    features: [
      "ط£ظ‡ط¯ط§ظپ ط؛ظٹط± ظ…ط­ط¯ظˆط¯ط©",
      "ظ…ط´ط§ط±ظٹط¹ طھظƒط§ظ„ظٹظپ ط؛ظٹط± ظ…ط­ط¯ظˆط¯ط©",
      "طھط°ظƒظٹط±ط§طھ ط؛ظٹط± ظ…ط­ط¯ظˆط¯ط©",
      "طھظ‚ظˆظٹظ… ط؛ظٹط± ظ…ط­ط¯ظˆط¯",
      "ط«ظٹظ…ط§طھ ظ…طھظ‚ط¯ظ…ط©",
      "طھظ‚ط§ط±ظٹط± ط´ط®طµظٹط©",
      "طھظ†ط¨ظٹظ‡ط§طھ ط°ظƒظٹط©",
      "طھطµط¯ظٹط± ظˆط¥ط­طµط§ط¦ظٹط§طھ",
    ],
    isTrialAvailable: true,
  },
};

/**
 * Get feature by key
 */
export function getFeature(featureKey: string): Feature | undefined {
  return FEATURE_REGISTRY.find(f => f.feature_key === featureKey);
}

/**
 * Get all active features
 */
export function getActiveFeatures(): Feature[] {
  return FEATURE_REGISTRY.filter(f => f.status === "active");
}

/**
 * Get features by plan
 */
export function getFeaturesByPlan(plan: PlanRequired): Feature[] {
  return FEATURE_REGISTRY.filter(f => f.plan_required === plan);
}

/**
 * Get coming soon features
 */
export function getComingSoonFeatures(): Feature[] {
  return FEATURE_REGISTRY.filter(f => f.status === "coming_soon");
}

/**
 * Check if feature is available for user
 */
export function isFeatureAvailable(featureKey: string, userPlan: PlanRequired): boolean {
  const feature = getFeature(featureKey);
  if (!feature) return false;
  if (feature.status === "disabled") return false;
  if (feature.status === "coming_soon") return false;
  if (feature.plan_required === "premium" && userPlan === "free") return false;
  return true;
}
