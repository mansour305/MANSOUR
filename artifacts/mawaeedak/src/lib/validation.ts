/**
 * validation.ts â€” ظ†ط¸ط§ظ… ط§ظ„ط¬ظˆط¯ط© ظˆط§ظ„طھط­ظ‚ظ‚
 * 
 * ظٹطھط¶ظ…ظ†:
 * - Build Validation
 * - Route Validation
 * - Import Validation
 * - Dependency Check
 */

import { logger } from "./logger";
import { configManager } from "./config";

// ============================================================================
// Types
// ============================================================================

export interface ValidationResult {
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: string;
  message: string;
  file?: string;
  line?: number;
}

export interface ValidationWarning {
  type: string;
  message: string;
  file?: string;
}

// ============================================================================
// Build Validation
// ============================================================================

export function validateBuild(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // 1. ظپط­طµ Supabase
  const supabase = configManager.getValue("supabase");
  if (!supabase.enabled && configManager.isProduction()) {
    errors.push({
      type: "MISSING_SUPABASE",
      message: "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£ ظپظٹ ط¨ظٹط¦ط© ط§ظ„ط¥ظ†طھط§ط¬",
    });
  }
  
  // 2. ظپط­طµ API URL
  const api = configManager.getValue("api");
  if (!api.baseUrl && configManager.isProduction()) {
    warnings.push({
      type: "MISSING_API_URL",
      message: "API URL ط؛ظٹط± ظ…ط­ط¯ط¯ ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬",
    });
  }
  
  // 3. ظپط­طµ ط§ظ„ظ…ظٹط²ط§طھ ط§ظ„ظ…ط¹ط·ظ‘ظ„ط©
  const features = configManager.getFeatures();
  const criticalFeatures = ["homePage", "login", "signup"];
  const disabledCritical = criticalFeatures.filter(
    (f) => features[f] === false
  );
  
  if (disabledCritical.length > 0) {
    errors.push({
      type: "DISABLED_FEATURES",
      message: `ظ…ظٹط²ط§طھ ط£ط³ط§ط³ظٹط© ظ…ط¹ط·ظ‘ظ„ط©: ${disabledCritical.join(", ")}`,
    });
  }
  
  // 4. ظپط­طµ ظˆط¶ط¹ ط§ظ„طھطµط­ظٹط­
  if (features.debugMode && configManager.isProduction()) {
    errors.push({
      type: "PRODUCTION_DIAGNOSTICS_ENABLED",
      message: "ظˆط¶ط¹ ط§ظ„طھطµط­ظٹط­ ظ…ظپط¹ظ‘ظ„ ظپظٹ ط¨ظٹط¦ط© ط§ظ„ط¥ظ†طھط§ط¬",
    });
  }
  
  // 5. ظپط­طµ SSL
  if (typeof window !== "undefined" && !window.location.protocol.includes("https")) {
    if (configManager.isProduction()) {
      warnings.push({
        type: "NO_HTTPS",
        message: "ط§ظ„طھط·ط¨ظٹظ‚ ظ„ط§ ظٹط³طھط®ط¯ظ… HTTPS ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬",
      });
    }
  }
  
  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Route Validation
// ============================================================================

export interface RouteInfo {
  path: string;
  component: string;
  guards?: string[];
  isProtected: boolean;
}

const VALID_ROUTES: RouteInfo[] = [
  { path: "/", component: "HomePage", isProtected: false },
  { path: "/welcome", component: "WelcomePage", isProtected: false },
  { path: "/auth", component: "AuthPage", isProtected: false },
  { path: "/calendar", component: "CalendarPage", isProtected: true },
  { path: "/finance", component: "FinancePage", isProtected: true },
  { path: "/centers", component: "CentersPage", isProtected: true },
  { path: "/account", component: "AccountPage", isProtected: true },
  { path: "/story", component: "StoryPage", isProtected: true },
  { path: "/daily-card", component: "DailyCardPage", isProtected: false },
  { path: "/notifications", component: "NotificationsPage", isProtected: true },
  { path: "/splash", component: "SplashScreen", isProtected: false },
  { path: "/privacy", component: "PrivacyPage", isProtected: false },
  { path: "/terms", component: "TermsPage", isProtected: false },
  { path: "/support", component: "SupportPage", isProtected: false },
  // Admin Routes
  { path: "/admin", component: "AdminLayout", isProtected: true, guards: ["admin"] },
  { path: "/admin/dashboard", component: "AdminDashboard", isProtected: true, guards: ["admin"] },
  { path: "/admin/messages", component: "AdminMessages", isProtected: true, guards: ["admin"] },
  { path: "/admin/events", component: "AdminEvents", isProtected: true, guards: ["admin"] },
  { path: "/admin/financial", component: "AdminFinancial", isProtected: true, guards: ["admin"] },
  { path: "/admin/members", component: "AdminMembers", isProtected: true, guards: ["admin"] },
  { path: "/admin/settings", component: "AdminSettings", isProtected: true, guards: ["admin"] },
];

export function validateRoutes(definedRoutes: string[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  const definedSet = new Set(definedRoutes);
  
  // ظپط­طµ ط§ظ„ظ…ط³ط§ط±ط§طھ ط§ظ„ظ…ط¹ط±ظپط©
  VALID_ROUTES.forEach((route) => {
    if (!definedSet.has(route.path)) {
      warnings.push({
        type: "MISSING_ROUTE",
        message: `ظ…ط³ط§ط± ط؛ظٹط± ظ…ط¶ط§ظپ: ${route.path} -> ${route.component}`,
      });
    }
  });
  
  // ظپط­طµ ط§ظ„ظ…ط³ط§ط±ط§طھ ط§ظ„ط¥ط¶ط§ظپظٹط©
  definedRoutes.forEach((route) => {
    if (!VALID_ROUTES.find((r) => r.path === route)) {
      warnings.push({
        type: "UNKNOWN_ROUTE",
        message: `ظ…ط³ط§ط± ط؛ظٹط± ظ…ط¹ط±ظˆظپ ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط©: ${route}`,
      });
    }
  });
  
  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Import Validation
// ============================================================================

interface ImportInfo {
  from: string;
  to: string;
  isValid: boolean;
}

export function validateImports(imports: ImportInfo[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  imports.forEach((imp) => {
    if (!imp.isValid) {
      errors.push({
        type: "INVALID_IMPORT",
        message: `ط§ط³طھظٹط±ط§ط¯ ط؛ظٹط± طµط§ظ„ط­: ${imp.from} -> ${imp.to}`,
      });
    }
  });
  
  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Dependency Validation
// ============================================================================

interface DependencyCheck {
  name: string;
  version: string;
  required: boolean;
  installed: boolean;
}

const REQUIRED_DEPENDENCIES = [
  "react",
  "react-dom",
  "wouter",
  "@tanstack/react-query",
  "@supabase/supabase-js",
];

export function validateDependencies(
  installed: Record<string, string>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  const installedSet = new Set(Object.keys(installed));
  
  REQUIRED_DEPENDENCIES.forEach((dep) => {
    if (!installedSet.has(dep)) {
      errors.push({
        type: "MISSING_DEPENDENCY",
        message: `طھط¨ط¹ظٹط© ظ…ط·ظ„ظˆط¨ط© ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط©: ${dep}`,
      });
    }
  });
  
  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Asset Validation
// ============================================================================

export function validateAssets(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // ظپط­طµ ط§ظ„ط£ظٹظ‚ظˆظ†ط§طھ
  const requiredIcons = ["favicon.svg", "manifest.json"];
  
  requiredIcons.forEach((icon) => {
    const exists = document.querySelector(`link[href*="${icon}"]`) !== null;
    if (!exists) {
      warnings.push({
        type: "MISSING_ASSET",
        message: `ط£ط¯ط§ط© ظ…ط·ظ„ظˆط¨ط© ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط©: ${icon}`,
      });
    }
  });
  
  // ظپط­طµ ط§ظ„ط®ط·ظˆط·
  const fonts = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  if (fonts.length === 0) {
    warnings.push({
      type: "MISSING_FONTS",
      message: "ظ„ظ… ظٹطھظ… طھط­ظ…ظٹظ„ ط£ظٹ ط®ط·ظˆط·",
    });
  }
  
  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Accessibility Validation
// ============================================================================

export function validateAccessibility(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  if (typeof document === "undefined") {
    return { passed: true, errors: [], warnings: [] };
  }
  
  // ظپط­طµ ظ„ط؛ط© ط§ظ„طµظپط­ط©
  const html = document.querySelector("html");
  if (!html?.getAttribute("lang")) {
    errors.push({
      type: "MISSING_LANG",
      message: "ظ„ط؛ط© ط§ظ„طµظپط­ط© ط؛ظٹط± ظ…ط­ط¯ط¯ط©",
    });
  }
  
  // ظپط­طµ ط§طھط¬ط§ظ‡ ط§ظ„ظ†طµ RTL
  if (!html?.getAttribute("dir")) {
    warnings.push({
      type: "MISSING_DIR",
      message: "ط§طھط¬ط§ظ‡ ط§ظ„ظ†طµ ط؛ظٹط± ظ…ط­ط¯ط¯",
    });
  }
  
  // ظپط­طµ meta tags
  const requiredMeta = ["description", "viewport"];
  requiredMeta.forEach((meta) => {
    const exists = document.querySelector(`meta[name="${meta}"]`) !== null;
    if (!exists) {
      warnings.push({
        type: "MISSING_META",
        message: `Meta tag ظ…ط·ظ„ظˆط¨: ${meta}`,
      });
    }
  });
  
  // ظپط­طµ title
  const title = document.querySelector("title");
  if (!title?.textContent) {
    errors.push({
      type: "MISSING_TITLE",
      message: "ط¹ظ†ظˆط§ظ† ط§ظ„طµظپط­ط© ط؛ظٹط± ظ…ظˆط¬ظˆط¯",
    });
  }
  
  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Combined Validation
// ============================================================================

export async function runFullValidation(): Promise<ValidationResult> {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];
  
  // Build
  const buildResult = validateBuild();
  allErrors.push(...buildResult.errors);
  allWarnings.push(...buildResult.warnings);
  
  // Assets
  const assetsResult = validateAssets();
  allErrors.push(...assetsResult.errors);
  allWarnings.push(...assetsResult.warnings);
  
  // Accessibility
  const a11yResult = validateAccessibility();
  allErrors.push(...a11yResult.errors);
  allWarnings.push(...a11yResult.warnings);
  
  logger.info("[Validation] Full validation complete", {
    errors: allErrors.length,
    warnings: allWarnings.length,
  });
  
  return {
    passed: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

// ============================================================================
// Export
// ============================================================================

export const validation = {
  validateBuild,
  validateRoutes,
  validateImports,
  validateDependencies,
  validateAssets,
  validateAccessibility,
  runFullValidation,
  VALID_ROUTES,
};

