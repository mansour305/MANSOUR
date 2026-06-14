/**
 * config.ts â€” ظ†ط¸ط§ظ… ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط¯ظٹظ†ط§ظ…ظٹظƒظٹط©
 * 
 * ظٹطھط¶ظ…ظ†:
 * - Feature Flags
 * - Dynamic Config
 * - Feature Toggle
 * - Runtime Configuration
 */

import { secureStorage } from "./security";
import { logger } from "./logger";

// ============================================================================
// Types
// ============================================================================

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface AppConfig {
  appName: string;
  version: string;
  environment: "development" | "staging" | "production";
  features: Record<string, boolean>;
  api: {
    baseUrl: string | null;
    timeout: number;
    retryAttempts: number;
  };
  supabase: {
    url: string | null;
    anonKey: string | null;
    enabled: boolean;
  };
  maintenance: {
    enabled: boolean;
    message?: string;
    allowedIPs?: string[];
  };
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: AppConfig = {
  appName: "ظ…ظˆط§ط¹ظٹط¯ظƒ",
  version: "1.0.0",
  environment: import.meta.env.PROD ? "production" : "development",
  features: {
    // Auth
    login: true,
    signup: true,
    socialLogin: false,
    passwordReset: true,
    
    // Core Features
    homePage: true,
    calendar: true,
    finance: true,
    centers: true,
    notificationsEnabled: true,
    story: true,
    dailyCard: true,
    
    // Admin
    adminPanel: true,
    adminDashboard: true,
    adminMessages: true,
    adminEvents: true,
    adminFinancial: true,
    adminMembers: true,
    adminReports: true,
    adminSettings: true,
    adminThemes: true,
    adminNotifications: true,
    
    // Advanced
    rtlSupport: true,
    darkMode: true,
    notifications: true,
    offlineMode: true,
    
    // Debug (production = false)
    debugMode: !import.meta.env.PROD,
    showPerformanceMetrics: !import.meta.env.PROD,
  },
  api: {
    baseUrl: (import.meta.env.VITE_API_BASE_URL as string) || null,
    timeout: 30000,
    retryAttempts: 3,
  },
  supabase: {
    url: (import.meta.env.VITE_SUPABASE_URL as string) || null,
    anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || null,
    enabled: Boolean(
      import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY
    ),
  },
  maintenance: {
    enabled: false,
  },
};

// ============================================================================
// Configuration Manager
// ============================================================================

class ConfigManager {
  private config: AppConfig;
  private listeners: Set<(config: AppConfig) => void> = new Set();
  
  constructor() {
    this.config = this.loadConfig();
  }
  
  /**
   * ط§ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ
   */
  get(): AppConfig {
    return { ...this.config };
  }
  
  /**
   * ط§ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ ظ‚ظٹظ…ط© ظ…ط¹ظٹظ†ط©
   */
  getValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }
  
  /**
   * طھط­ط¯ظٹط« ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط¬ط²ط¦ظٹط§ظ‹
   */
  update(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    this.notifyListeners();
  }
  
  /**
   * ظپط­طµ ظ…ظٹط²ط© ظ…ط¹ظٹظ†ط©
   */
  isFeatureEnabled(feature: string): boolean {
    return this.config.features[feature] ?? false;
  }
  
  /**
   * طھظپط¹ظٹظ„/طھط¹ط·ظٹظ„ ظ…ظٹط²ط©
   */
  setFeature(feature: string, enabled: boolean): void {
    this.config.features = {
      ...this.config.features,
      [feature]: enabled,
    };
    this.saveConfig();
    this.notifyListeners();
  }
  
  /**
   * ط§ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ ط¬ظ…ظٹط¹ ط§ظ„ظ…ظٹط²ط§طھ
   */
  getFeatures(): Record<string, boolean> {
    return { ...this.config.features };
  }
  
  /**
   * ظپط­طµ ط¨ظٹط¦ط© ط§ظ„ط¥ظ†طھط§ط¬
   */
  isProduction(): boolean {
    return this.config.environment === "production";
  }
  
  /**
   * ظپط­طµ ط¨ظٹط¦ط© ط§ظ„طھط·ظˆظٹط±
   */
  isDevelopment(): boolean {
    return this.config.environment === "development";
  }
  
  /**
   * ظپط­طµ ظˆط¶ط¹ ط§ظ„طµظٹط§ظ†ط©
   */
  isMaintenanceMode(): boolean {
    return this.config.maintenance.enabled;
  }
  
  /**
   * ط¥ط¶ط§ظپط© ظ…ط³طھظ…ط¹ ظ„ظ„طھط؛ظٹظٹط±ط§طھ
   */
  addListener(callback: (config: AppConfig) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  // ============================================================================
  // Private Methods
  // ============================================================================
  
  private loadConfig(): AppConfig {
    try {
      const stored = secureStorage.get<AppConfig>("config");
      if (stored) {
        return { ...DEFAULT_CONFIG, ...stored };
      }
    } catch (error) {
      logger.warn("Failed to load config from storage", { error });
    }
    return { ...DEFAULT_CONFIG };
  }
  
  private saveConfig(): void {
    try {
      secureStorage.set("config", this.config);
    } catch (error) {
      logger.warn("Failed to save config to storage", { error });
    }
  }
  
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.config));
  }
  
  /**
   * ط¥ط¹ط§ط¯ط© طھط¹ظٹظٹظ† ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط§ظپطھط±ط§ط¶ظٹط©
   */
  reset(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
    this.notifyListeners();
  }
}

export const configManager = new ConfigManager();

// ============================================================================
// Feature Flag Hook
// ============================================================================

import { useState, useEffect } from "react";

export function useFeatureFlag(feature: string): boolean {
  const [enabled, setEnabled] = useState(
    configManager.isFeatureEnabled(feature)
  );
  
  useEffect(() => {
    return configManager.addListener(() => {
      setEnabled(configManager.isFeatureEnabled(feature));
    });
  }, [feature]);
  
  return enabled;
}

// ============================================================================
// Environment Validation
// ============================================================================

export function validateEnvironment(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Supabase
  if (!configManager.getValue("supabase").enabled) {
    if (configManager.isProduction()) {
      errors.push("Supabase ط؛ظٹط± ظ…ظ‡ظٹط£ ظپظٹ ط¨ظٹط¦ط© ط§ظ„ط¥ظ†طھط§ط¬");
    } else {
      warnings.push("Supabase ط؛ظٹط± ظ…ظ‡ظٹط£ - ظˆط¶ط¹ طھط¬ط±ظٹط¨ظٹ");
    }
  }
  
  // API
  if (!configManager.getValue("api").baseUrl) {
    warnings.push("API URL ط؛ظٹط± ظ…ط­ط¯ط¯");
  }
  
  // Maintenance
  if (configManager.isMaintenanceMode() && configManager.isProduction()) {
    warnings.push("ظˆط¶ط¹ ط§ظ„طµظٹط§ظ†ط© ظ…ظپط¹ظ‘ظ„ ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬");
  }
  
  // Debug mode
  if (configManager.isFeatureEnabled("debugMode") && configManager.isProduction()) {
    errors.push("ظˆط¶ط¹ ط§ظ„طھطµط­ظٹط­ ظ…ظپط¹ظ‘ظ„ ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬");
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Production Readiness Check
// ============================================================================

export async function checkProductionReadiness(): Promise<{
  ready: boolean;
  checks: Array<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
  }>;
}> {
  const checks: Array<{
    name: string;
    status: "pass" | "fail" | "warn";
    message?: string;
  }> = [];
  
  // 1. Supabase Check
  const supabase = configManager.getValue("supabase");
  checks.push({
    name: "Supabase",
    status: supabase.enabled ? "pass" : "fail",
    message: supabase.enabled
      ? "Supabase ظ…ظ‡ظٹط£"
      : "Supabase ط؛ظٹط± ظ…ظ‡ظٹط£ - ظ…ط·ظ„ظˆط¨ ظ„ظ„ط¥ظ†طھط§ط¬",
  });
  
  // 2. Environment Check
  const envValidation = validateEnvironment();
  checks.push({
    name: "Environment",
    status: envValidation.valid ? "pass" : "warn",
    message: envValidation.errors.join(", ") || "ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ طµط­ظٹط­ط©",
  });
  
  // 3. Network Check
  try {
    const response = await fetch("/api/health", {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    checks.push({
      name: "Network",
      status: response.ok ? "pass" : "warn",
      message: response.ok ? "ط§ظ„ط´ط¨ظƒط© طھط¹ظ…ظ„" : `HTTP ${response.status}`,
    });
  } catch {
    checks.push({
      name: "Network",
      status: "warn",
      message: "ظپط´ظ„ ظپط­طµ ط§ظ„ط´ط¨ظƒط©",
    });
  }
  
  // 4. Features Check
  const features = configManager.getFeatures();
  const disabledFeatures = Object.entries(features)
    .filter(([, enabled]) => !enabled)
    .map(([name]) => name);
  
  checks.push({
    name: "Features",
    status: disabledFeatures.length > 0 ? "warn" : "pass",
    message: disabledFeatures.length > 0
      ? `${disabledFeatures.length} ظ…ظٹط²ط§طھ ظ…ط¹ط·ظ‘ظ„ط©`
      : "ط¬ظ…ظٹط¹ ط§ظ„ظ…ظٹط²ط§طھ ظ…ظ‡ظٹط£ط©",
  });
  
  // 5. Maintenance Check
  checks.push({
    name: "Maintenance",
    status: configManager.isMaintenanceMode() ? "warn" : "pass",
    message: configManager.isMaintenanceMode()
      ? "ظˆط¶ط¹ ط§ظ„طµظٹط§ظ†ط© ظ…ظپط¹ظ‘ظ„"
      : "ط§ظ„طھط·ط¨ظٹظ‚ ظٹط¹ظ…ظ„ ط¨ط´ظƒظ„ ط·ط¨ظٹط¹ظٹ",
  });
  
  const ready = checks.every((c) => c.status !== "fail");
  
  return { ready, checks };
}

// ============================================================================
// Export
// ============================================================================

export const config = {
  manager: configManager,
  validateEnvironment,
  checkProductionReadiness,
  useFeatureFlag,
};
