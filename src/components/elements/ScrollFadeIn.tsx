import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import React from "react";

export function ScrollFadeIn({
  children,
  className = "",
  style = {},
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const { ref, visible } = useScrollFadeIn<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`
        animate-fade-in-up
        transition-all
        duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${className}
      `}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
