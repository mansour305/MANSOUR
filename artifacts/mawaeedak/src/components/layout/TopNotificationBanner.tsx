/**
 * Top Notification Banner — مواعيدك
 * 
 * إشعار علوي يظهر في أعلى الشاشة ثم يختفي تلقائياً
 */

import { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type NotificationType = "success" | "error" | "info" | "warning";

export type TopNotification = {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
};

// Global notification queue
let globalListeners: ((notification: TopNotification) => void)[] = [];

export function showTopNotification(message: string, type: NotificationType = "info", duration = 4000) {
  const notification: TopNotification = {
    id: `top-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    message,
    type,
    duration,
  };
  
  globalListeners.forEach(listener => listener(notification));
}

export function onTopNotification(callback: (notification: TopNotification) => void) {
  globalListeners.push(callback);
  return () => {
    globalListeners = globalListeners.filter(l => l !== callback);
  };
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: { bg: "bg-emerald-500", text: "text-white" },
  error: { bg: "bg-red-500", text: "text-white" },
  info: { bg: "bg-blue-500", text: "text-white" },
  warning: { bg: "bg-amber-500", text: "text-white" },
};

function SingleBanner({ 
  notification, 
  onClose 
}: { 
  notification: TopNotification; 
  onClose: () => void; 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = ICONS[notification.type];
  const colors = COLORS[notification.type];

  useEffect(() => {
    // Slide in
    setIsVisible(true);
    
    // Auto hide after duration
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, [notification, onClose, notification.duration]);

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-[9999] flex items-center gap-3 px-4 py-3 
        shadow-lg transition-all duration-300
        ${colors.bg} ${colors.text}
        ${isVisible && !isLeaving ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
      style={{ 
        maxWidth: "480px", 
        margin: "0 auto",
        direction: "rtl"
      }}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{notification.message}</p>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(onClose, 300);
        }}
        className="rounded-full p-1 opacity-80 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Container component that manages multiple notifications
export function TopNotificationContainer() {
  const [notifications, setNotifications] = useState<TopNotification[]>([]);

  useEffect(() => {
    return onTopNotification((notification) => {
      setNotifications(prev => [...prev, notification]);
    });
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      {notifications.map((notification) => (
        <SingleBanner
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
}