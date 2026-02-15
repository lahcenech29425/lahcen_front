"use client";

import React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

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
    border: "border-[#8B4513]/40",
    bg: "bg-[#FDF8F3] dark:bg-[#2a1a0e]",
    icon: "text-[#8B4513]",
    iconBg: "bg-[#8B4513]/10",
    bar: "bg-[#8B4513]",
  },
  error: {
    border: "border-red-400/40 dark:border-red-500/30",
    bg: "bg-red-50 dark:bg-red-950/40",
    icon: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    bar: "bg-red-500",
  },
  warning: {
    border: "border-amber-400/40 dark:border-amber-500/30",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    icon: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    bar: "bg-amber-500",
  },
  info: {
    border: "border-[#8B4513]/30",
    bg: "bg-[#FDF8F3] dark:bg-[#2a1a0e]",
    icon: "text-[#8B4513]",
    iconBg: "bg-[#8B4513]/10",
    bar: "bg-[#8B4513]",
  },
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  const Icon = TOAST_ICONS[type];
  const styles = TOAST_STYLES[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-xl border ${styles.border} ${styles.bg} shadow-xl min-w-[300px] max-w-sm`}
      dir="rtl"
    >
      {/* Accent bar on the right */}
      <div
        className={`absolute top-0 right-0 w-1 h-full ${styles.bar} rounded-r-xl`}
      />

      <div className="relative py-3.5 pr-5 pl-3 flex items-center gap-3">
        {/* Icon */}
        <div
          className={`shrink-0 w-9 h-9 rounded-lg ${styles.iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${styles.icon}`} />
        </div>

        {/* Message */}
        <p className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100 leading-relaxed font-sans">
          {message}
        </p>

        {/* Close */}
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}
