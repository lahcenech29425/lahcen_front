"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/components/elements/Link";
import { ArrowLeft, Calendar, Moon, ChevronDown } from "lucide-react";
import type { HeroSection as HeroSectionType } from "@/types/heroSection";
import { motion } from "framer-motion";
import { fetchHijriFromGregorian } from "@/utils/prayerApi";

export default function HeroSection({ data }: { data: HeroSectionType }) {
  const description = data.description || data.subtitle;
  const buttonTitle = data.button?.title || data.buttonText;
  const buttonUrl = data.button?.url || data.buttonLink;
  const isExternal = data.button?.is_external || false;

  // Live clock state
  const [currentTime, setCurrentTime] = useState<string>("");
  const [hijriDate, setHijriDate] = useState<string>("");
  const [gregorianDate, setGregorianDate] = useState<string>("");

  // Fetch Hijri date
  useEffect(() => {
    const fetchDates = async () => {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const dateStr = `${dd}-${mm}-${yyyy}`;

      try {
        const conv = await fetchHijriFromGregorian(dateStr);
        setHijriDate(conv.hijriReadable || conv.hijriDate);
      } catch (error) {
        console.error("Failed to fetch Hijri date:", error);
      }

      // Format Gregorian date in Arabic
      const gregorianArabic = new Intl.DateTimeFormat("ar", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(today);
      setGregorianDate(gregorianArabic);
    };

    fetchDates();
  }, []);

  // Live clock - WITHOUT SECONDS (HH:MM only)
  useEffect(() => {
    const updateClock = () => {
      const formatted = new Intl.DateTimeFormat("ar", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());
      setCurrentTime(formatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden bg-background"
      dir="rtl"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {data.image ? (
          <>
            <Image
              src={data.image.url}
              alt={data.image.alternativeText || "Hero Background"}
              fill
              priority
              className="object-cover"
              quality={90}
            />
            {/* Theme-tinted dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-primary/20 to-background/95 mix-blend-multiply" />
            {/* Vignette effect - Soft warm brown instead of harsh black */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(45,27,20,0.6)_100%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(250,250,250,1)_100%)] dark:bg-transparent" />

            {/* Dark Mode Background Pattern (White) */}
            <div
              className="hidden dark:block absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: "url('/assets/bg1.svg')",
                backgroundRepeat: "repeat",
                backgroundSize: "400px",
                filter: "invert(1)", // Invert to make it white if the SVG is black
              }}
            />

            {/* Light Mode Background Pattern (Primary Color via Mask) */}
            <div
              className="block dark:hidden absolute inset-0 bg-primary opacity-[0.08]"
              style={{
                maskImage: "url('/assets/bg1.svg')",
                WebkitMaskImage: "url('/assets/bg1.svg')",
                maskPosition: "center",
                WebkitMaskPosition: "center",
                maskSize: "cover",
                WebkitMaskSize: "cover",
              }}
            />

            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 container mx-auto px-6 flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl w-full text-center"
        >
          {/* BIG TITLE with Momken Font */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-momken mb-6"
            style={{
              fontSize: "clamp(64px, 10vw, 120px)",
              lineHeight: "1.4",
              textShadow: data.image
                ? "0 6px 50px rgba(0, 0, 0, 0.9), 0 3px 20px hsl(var(--primary) / 0.5)"
                : "0 4px 20px hsl(var(--primary) / 0.15)",
            }}
          >
            <span
              className={`inline-block ${
                data.image
                  ? "text-white drop-shadow-2xl"
                  : "text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-primary"
              }`}
            >
              {data.title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className={`text-lg md:text-xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed ${
                data.image ? "text-white/95 drop-shadow-lg" : "text-foreground"
              }`}
            >
              {description}
            </motion.p>
          )}

          {/* CTA Button - BROWN COLOR */}
          {buttonTitle && buttonUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex justify-center"
            >
              <Link
                href={buttonUrl}
                isExternal={isExternal}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-12 py-5 text-primary-foreground font-bold text-lg shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:bg-primary/90 hover:-translate-y-1 hover:scale-105 transition-all duration-300"
              >
                <span>{buttonTitle}</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Animated Scroll Indicator - Very Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 pb-8"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <div className="text-xs text-white/60 font-medium tracking-wider">
            اكتشف المزيد
          </div>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
