import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  rounded?: string;
  className?: string;
}

export default function Badge({
  children,
  color = "text-white",
  bg = "bg-primary",
  rounded = "rounded-full",
  className = "",
}: BadgeProps) {
  return (
    <span className={`${bg} ${color} ${rounded} px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}