/**
 * useNotificationPermission - Phase 16
 * Manages browser notification permissions with graceful degradation.
 * Provides visible UI controls for requesting notification access.
 */
import { useState, useCallback, useEffect } from "react";

export type NotificationPermissionStatus = "granted" | "denied" | "prompt" | "unsupported" | "unknown";

const NOTIFICATION_PREFS_KEY = "mawaeedak_notification_prefs_v1";

interface NotificationPrefs {
  permissionStatus: NotificationPermissionStatus;
  lastUpdated: string | null;
  source: "user" | "default";
}

function loadPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (!raw) return { permissionStatus: "unknown", lastUpdated: null, source: "default" };
    return JSON.parse(raw);
  } catch {
    return { permissionStatus: "unknown", lastUpdated: null, source: "default" };
  }
}

function savePrefs(prefs: NotificationPrefs): void {
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
}

export function useNotificationPermission() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadPrefs);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const supported = "Notification" in window && "serviceWorker" in navigator;
    setIsSupported(supported);
  }, []);

  const getCurrentStatus = useCallback((): NotificationPermissionStatus => {
    if (!("Notification" in window)) return "unsupported";
    if (!navigator.serviceWorker) return "unsupported";
    const status = Notification.permission;
    if (status === "granted") return "granted";
    if (status === "denied") return "denied";
    return "prompt";
  }, []);

  const syncWithBrowser = useCallback(() => {
    const currentStatus = getCurrentStatus();
    if (currentStatus !== prefs.permissionStatus) {
      const newPrefs: NotificationPrefs = {
        permissionStatus: currentStatus,
        lastUpdated: new Date().toISOString(),
        source: "user",
      };
      setPrefs(newPrefs);
      savePrefs(newPrefs);
    }
    return currentStatus;
  }, [getCurrentStatus, prefs.permissionStatus]);

  const requestPermission = useCallback(async (): Promise<{ success: boolean; status: NotificationPermissionStatus; message: string }> => {
    if (!("Notification" in window)) {
      return { success: false, status: "unsupported", message: "ط§ظ„ظ…طھطµظپط­ ظ„ط§ ظٹط¯ط¹ظ… ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ" };
    }
    if (!navigator.serviceWorker) {
      return { success: false, status: "unsupported", message: "ظ„ط§ ظٹظˆط¬ط¯ Service Worker" };
    }
    setIsRequesting(true);
    try {
      if (Notification.permission === "denied") {
        const newPrefs: NotificationPrefs = {
          permissionStatus: "denied",
          lastUpdated: new Date().toISOString(),
          source: "user",
        };
        setPrefs(newPrefs);
        savePrefs(newPrefs);
        return {
          success: false,
          status: "denied",
          message: "طھظ… ط±ظپط¶ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ظ…ط³ط¨ظ‚ط§ظ‹. ظٹظ…ظƒظ†ظƒ طھظپط¹ظٹظ„ظ‡ط§ ظ…ظ† ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…طھطµظپط­.",
        };
      }
      const permission = await Notification.requestPermission();
      const newStatus: NotificationPermissionStatus = permission === "granted" ? "granted" 
        : permission === "denied" ? "denied" 
        : "prompt";
      const newPrefs: NotificationPrefs = {
        permissionStatus: newStatus,
        lastUpdated: new Date().toISOString(),
        source: "user",
      };
      setPrefs(newPrefs);
      savePrefs(newPrefs);
      if (permission === "granted") {
        try {
          const registration = await navigator.serviceWorker.ready;
          console.log("Notification permission granted, service worker ready:", registration.scope);
        } catch (e) {
          console.log("Service worker registration for push not available:", e);
        }
        return {
          success: true,
          status: "granted",
          message: "طھظ… طھظپط¹ظٹظ„ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط¨ظ†ط¬ط§ط­",
        };
      }
      return {
        success: false,
        status: newStatus,
        message: newStatus === "denied" 
          ? "طھظ… ط±ظپط¶ ط§ظ„ط¥ط°ظ†. ظٹظ…ظƒظ†ظƒ طھط؛ظٹظٹط±ظ‡ ظ…ظ† ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…طھطµظپط­."
          : "طھظ… ط¥ظ„ط؛ط§ط، ط·ظ„ط¨ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ",
      };
    } catch (error) {
      console.error("Notification permission error:", error);
      return {
        success: false,
        status: "unknown",
        message: "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط·ظ„ط¨ ط¥ط°ظ† ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ",
      };
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const getIPhoneGuidance = useCallback((): string | null => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isIOS && isSafari && !window.matchMedia("(display-mode: standalone)").matches) {
      return "ظ„ط¥ط´ط¹ط§ط±ط§طھ iPhone: ط£ط¶ظپ ظ…ظˆط§ط¹ظٹط¯ظƒ ط¥ظ„ظ‰ ط§ظ„ط´ط§ط´ط© ط§ظ„ط±ط¦ظٹط³ظٹط© ط«ظ… ظپط¹ظ‘ظ„ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ.";
    }
    return null;
  }, []);

  const getStatusLabel = useCallback((status: NotificationPermissionStatus): string => {
    switch (status) {
      case "granted": return "ظ…ظپط¹ظ„ط©";
      case "denied": return "ظ…ط±ظپظˆط¶ط©";
      case "prompt": return "ط؛ظٹط± ظ…ظپط¹ظ„ط©";
      case "unsupported": return "ط؛ظٹط± ظ…ط¯ط¹ظˆظ…ط©";
      default: return "ط؛ظٹط± ظ…ظپط¹ظ„ط©";
    }
  }, []);

  useEffect(() => {
    syncWithBrowser();
  }, [syncWithBrowser]);

  return {
    status: prefs.permissionStatus,
    statusLabel: getStatusLabel(prefs.permissionStatus),
    isRequesting,
    isSupported,
    iPhoneGuidance: getIPhoneGuidance(),
    requestPermission,
    syncWithBrowser,
  };
}

