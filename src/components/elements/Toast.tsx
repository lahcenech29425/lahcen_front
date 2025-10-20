"use client";

import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES = {
  success: {
    container: "bg-white border border-[#ecad20] shadow-md",
    icon: "text-[#ecad20]",
    iconBg: "bg-[#ecad20]/10",
  },
  error: {
    container: "bg-white border border-red-300 shadow-md",
    icon: "text-red-600",
    iconBg: "bg-red-50",
  },
  warning: {
    container: "bg-white border border-[#ecad20] shadow-md",
    icon: "text-[#ecad20]",
    iconBg: "bg-[#ecad20]/10",
  },
  info: {
    container: "bg-white border border-gray-300 shadow-md",
    icon: "text-[#ecad20]",
    iconBg: "bg-[#ecad20]/10",
  },
};

export default function Toast({
  message,
  type = "info",
  duration = 2000,
  onClose,
}: ToastProps) {
  const Icon = TOAST_ICONS[type];
  const styles = TOAST_STYLES[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.container} rounded-xl p-4 flex items-center gap-3 min-w-[260px] max-w-md animate-fade-in-up`}
      dir="rtl"
    >
      <div className={`${styles.iconBg} rounded-lg p-2 flex-shrink-0`}>
        <Icon className={`h-5 w-5 ${styles.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#171717] leading-relaxed text-right">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-[#ecad20] transition-colors"
        aria-label="إغلاق"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
