"use client";
import React, { useRef } from "react";
import { StatsSectionType } from "@/types/statsSection";
import { normalizeStatsSection } from "./normalizer";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Users, BookOpen, Globe, Heart } from "lucide-react";

// Helper: convert Arabic-Indic digits to Western
function toWesternDigits(str: string) {
  const easternToWestern: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  return str.replace(/[٠-٩]/g, (d) => easternToWestern[d] || d);
}

function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const normalizedValueStr = toWesternDigits(value);

  // Extract number part (including decimals) and surrounding non-numeric parts
  const match = normalizedValueStr.match(/^([^0-9.]*)([0-9.]+)([^0-9.]*)$/);

  const prefixPart = match ? match[1] : "";
  const numberPart = match ? parseFloat(match[2]) : 0;
  const suffixPart = match ? match[3] : "";

  const isNumeric = !isNaN(numberPart) && numberPart > 0;

  const springValue = useSpring(0, { stiffness: 50, damping: 20, duration: 2000 });

  useEffect(() => {
    if (inView && isNumeric) {
      springValue.set(numberPart);
    }
  }, [inView, numberPart, isNumeric, springValue]);

  if (!isNumeric) return <span>{normalizedValueStr}</span>;

  return (
    <span ref={ref} className="tabular-nums flex items-baseline justify-center direction-ltr">
      {prefixPart && <span>{prefixPart}</span>}
      <motion.span>
        {useTransform(springValue, (latest) =>
          // Format with commas, keep decimals if original had them
          latest.toLocaleString('en-US', {
            maximumFractionDigits: normalizedValueStr.includes('.') ? 1 : 0
          })
        )}
      </motion.span>
      {(suffixPart || suffix) && <span>{suffixPart || suffix}</span>}
    </span>
  );
}

// Contextual icons for stats
const statIcons = {
  0: Users,
  1: BookOpen,
  2: Globe,
  3: Heart,
};

export default function StatsSection({ data }: { data: StatsSectionType }) {
  const normalized = normalizeStatsSection(data);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 overflow-hidden bg-[#3d2a1a] dark:bg-[#2a1e13] text-white">
      {/* Dark Islamic pattern - bg1.svg - Increased Visibility */}
      <div
        className="absolute inset-0 bg-white opacity-[0.08] pointer-events-none"
        style={{
          maskImage: "url('/assets/bg1.svg')",
          WebkitMaskImage: "url('/assets/bg1.svg')",
          maskRepeat: "repeat",
          WebkitMaskRepeat: "repeat",
          maskSize: "400px",
          WebkitMaskSize: "400px",
        }}
      />

      {/* Brown gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3d2a1a] via-[#3d2a1a]/80 to-[#3d2a1a] dark:from-[#2a1e13] dark:via-[#2a1e13]/80 dark:to-[#2a1e13] pointer-events-none opacity-80" />

      {/* Subtle brown glow - Top Center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 z-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block py-2 px-6 rounded-full bg-white/20 border border-white/40 text-white text-sm font-semibold mb-6 backdrop-blur-sm"
          >
            أرقام وحقائق
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white font-momken"
          >
            {normalized.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
          >
            {normalized.subtitle}
          </motion.p>
        </div>

        {/* Stats Grid - Flexbox for perfect centering */}
        <div className="flex flex-wrap justify-center gap-6">
          {normalized.stats.map((stat, i) => {
            const Icon = statIcons[i as keyof typeof statIcons] || Heart;

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + (i * 0.1) }}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 flex flex-col items-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] min-w-[280px] max-w-[320px]"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 text-center w-full">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Number - Large and prominent - Force LTR for numbers to fix % and + position */}
                  <div
                    className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/80 mb-4 font-sans tracking-tight"
                    style={{ fontSize: "clamp(48px, 4vw, 64px)" }}
                    dir="ltr"
                  >
                    <Counter value={stat.value} />
                  </div>

                  {/* Label */}
                  <div className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300">
                    {stat.label}
                  </div>

                  {/* Description */}
                  {stat.description && (
                    <div className="text-white/60 text-sm leading-relaxed mt-2">
                      {stat.description}
                    </div>
                  )}
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
