"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  targetId?: string;
};

export default function ReadingProgress({
  targetId = "article-content",
}: Props) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress in [0,1] from top entering to bottom leaving
      const raw = (vh - rect.top) / (rect.height + vh);
      const progress = Math.min(Math.max(raw, 0), 1);

      if (barRef.current) {
        // use scaleX for smooth hardware-accelerated animation
        barRef.current.style.transform = `scaleX(${progress})`;
        // subtle opacity so it doesn't draw attention when not started
        barRef.current.style.opacity = String(progress > 0 ? 1 : 0.6);
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        ref={barRef}
        className="h-full bg-black origin-left"
        style={{
          transform: "scaleX(0)",
          transition: "transform 120ms linear, opacity 200ms linear",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
