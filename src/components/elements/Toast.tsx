"use client";
import { ToastProps } from "@/types/Toast";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 3000,
  position = "top-right",
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    if (duration && onClose) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation before closing
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const color =
    type === "success"
      ? "bg-green-100 text-green-800 border border-green-200"
      : type === "error"
      ? "bg-red-100 text-red-800 border border-red-200"
      : type === "warning"
      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
      : "bg-blue-100 text-blue-800 border border-blue-200";

  const icon =
    type === "success" ? (
      <CheckCircle className="text-green-500" size={22} />
    ) : type === "error" ? (
      <XCircle className="text-red-500" size={22} />
    ) : type === "warning" ? (
      <AlertTriangle className="text-yellow-500" size={22} />
    ) : (
      <Info className="text-blue-500" size={22} />
    );

  const positionClass =
    position === "top-right"
      ? "top-6 right-6"
      : position === "top-left"
      ? "top-6 left-6"
      : position === "bottom-right"
      ? "bottom-6 right-6"
      : position === "bottom-left"
      ? "bottom-6 left-6"
      : position === "top-middle"
      ? "top-6 left-1/2 -translate-x-1/2"
      : position === "bottom-middle"
      ? "bottom-6 left-1/2 -translate-x-1/2"
      : "top-6 right-6"; // default

  return (
    <div
      className={`fixed z-50 px-5 py-3 rounded-xl shadow-lg ${color} flex items-center gap-3 ${positionClass} transition-all
        ${
          show
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }
        duration-300`}
      role="alert"
      style={{ minWidth: "260px", maxWidth: "92vw" }}
    >
      {icon}
      <span className="flex-1 font-medium">{message}</span>
      {onClose && (
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-gray-400 hover:text-gray-600 rounded-full p-1"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
