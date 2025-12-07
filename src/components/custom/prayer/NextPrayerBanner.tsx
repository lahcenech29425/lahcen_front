"use client";
import React, { useEffect, useMemo, useState } from "react";
import { NextPrayerInfo, PrayerName } from "@/types/Prayer";
import { formatCountdown } from "@/shared/normalizers/normalizePrayer";
import { Moon, MoonStar, Sunrise, Sun, Sunset, Clock } from "lucide-react";

const LABELS_AR: Record<PrayerName, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const ICON_BY_PRAYER: Partial<Record<PrayerName, React.ElementType>> = {
  Fajr: MoonStar,
  Sunrise: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

type Props = {
  nextPrayer: NextPrayerInfo | null;
  isLoading?: boolean;
};

export default function NextPrayerBanner({
  nextPrayer,
  isLoading = false,
}: Props) {
  const [remaining, setRemaining] = useState<string>("--:--:--");

  useEffect(() => {
    if (!nextPrayer) return;
    const tick = () => {
      const diff = nextPrayer.date.getTime() - Date.now();
      setRemaining(formatCountdown(diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextPrayer]);

  const nextTimeLabel = useMemo(() => {
    if (!nextPrayer) return "--:--";
    try {
      return nextPrayer.date.toLocaleTimeString("ar", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      const h = String(nextPrayer.date.getHours()).padStart(2, "0");
      const m = String(nextPrayer.date.getMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }
  }, [nextPrayer]);

  // Skeleton Loading State
  if (isLoading || !nextPrayer) {
    return (
      <div className="mt-6 sm:mt-8 mb-6 sm:mb-8" dir="rtl">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-[#232323] border-2 border-gray-200 dark:border-[#1a1a1a] shadow-xl">
          <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8 bg-gradient-to-br from-white dark:from-[#232323] via-gray-50/30 dark:via-[#232323]/30 to-white dark:to-[#232323]">
            {/* Header skeleton */}
            <div className="mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse" />
              <div className="h-5 w-28 bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-4 sm:gap-5 md:flex-row md:justify-between md:gap-6">
              {/* Left section skeleton */}
              <div className="flex flex-col items-center gap-3 w-full md:flex-row md:w-auto md:gap-4 lg:gap-6">
                {/* Icon skeleton */}
                <div className="rounded-xl md:rounded-2xl bg-gray-100 dark:bg-[#232323] p-3 md:p-4 border-2 border-gray-200 dark:border-[#1a1a1a] flex-shrink-0 animate-pulse">
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-300 dark:bg-[#1a1a1a] rounded" />
                </div>
                {/* Name and time skeleton */}
                <div className="text-center md:text-right w-full md:flex-1 space-y-2">
                  <div className="h-8 sm:h-10 md:h-12 w-32 sm:w-40 bg-gray-200 dark:bg-[#232323] rounded-lg animate-pulse mx-auto md:mx-0" />
                  <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-200 dark:bg-[#232323] rounded animate-pulse mx-auto md:mx-0" />
                </div>
              </div>
              {/* Right section skeleton - countdown */}
              <div className="text-center w-full md:w-auto">
                <div className="h-3 sm:h-4 w-20 bg-gray-200 dark:bg-[#232323] rounded animate-pulse mx-auto mb-2" />
                <div className="inline-flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-700 dark:from-[#232323] to-gray-800 dark:to-[#1a1a1a] px-4 py-3 md:px-6 md:py-3.5 shadow-lg">
                  <div className="h-5 w-5 bg-gray-600 dark:bg-[#ededed] rounded animate-pulse" />
                  <div className="h-8 w-28 sm:w-32 bg-gray-600 dark:bg-[#ededed] rounded animate-pulse" />
                </div>
                <div className="mt-2 h-3 w-32 bg-gray-200 dark:bg-[#232323] rounded animate-pulse mx-auto" />
              </div>
            </div>
          </div>
          {/* Bottom line skeleton */}
          <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-gray-200 dark:from-[#232323] via-gray-300 dark:via-[#232323] to-gray-200 dark:to-[#232323] animate-pulse" />
        </div>
      </div>
    );
  }

  const Icon = ICON_BY_PRAYER[nextPrayer.name] ?? Clock;

  return (
    <div
      className="mt-6 sm:mt-8 mb-6 sm:mb-8"
      dir="rtl"
      aria-label={`الصلاة القادمة ${
        LABELS_AR[nextPrayer.name]
      } في ${nextTimeLabel}`}
    >
      {/* Banner avec design moderne utilisant les couleurs du site */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-[#232323] border-2 border-gray-200 dark:border-[#1a1a1a] shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Contenu principal */}
        <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8 bg-gradient-to-br from-white dark:from-[#232323] via-gray-50/30 dark:via-[#232323]/30 to-white dark:to-[#232323]">
          <div className="mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
            <Clock
              className="h-4 w-4 sm:h-5 sm:w-5"
              style={{ color: "#ecad20" }}
            />
            <h2 className="text-base sm:text-lg font-bold text-[#171717] dark:text-[#ededed]">
              الصلاة القادمة
            </h2>
          </div>
          <div className="flex flex-col items-center gap-4 sm:gap-5 md:flex-row md:justify-between md:gap-6">
            {/* Section Info de la prière */}
            <div className="flex flex-col items-center gap-3 w-full md:flex-row md:w-auto md:gap-4 lg:gap-6">
              {/* Icône grande avec fond doré subtil */}
              <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-[#ecad20]/10 to-[#ecad20]/5 dark:from-[#232323] dark:to-[#232323] p-3 md:p-4 border-2 border-[#ecad20]/20 shadow-sm flex-shrink-0">
                <Icon
                  className="h-10 w-10 md:h-12 md:w-12"
                  style={{ color: "#ecad20" }}
                  strokeWidth={2}
                />
              </div>
              {/* Nom et heure */}
              <div className="text-center md:text-right w-full md:flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#171717] dark:text-[#ededed] tracking-tight whitespace-nowrap">
                    {LABELS_AR[nextPrayer.name]}
                  </h3>
                  <span className="inline-block h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-[#ecad20] animate-pulse shadow-md" />
                </div>
                <div className="mt-1.5 md:mt-2 flex items-center justify-center md:justify-start gap-1.5">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    في الساعة
                  </span>
                  <span className="text-base sm:text-lg md:text-xl font-bold tabular-nums text-[#171717] dark:text-[#ededed]">
                    {nextTimeLabel}
                  </span>
                </div>
              </div>
            </div>
            {/* Section Compte à rebours avec design premium */}
            <div className="text-center w-full md:w-auto">
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">
                الوقت المتبقي
              </div>
              <div className="inline-flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#171717] to-[#2a2a2a] px-4 py-3 md:px-6 md:py-3.5 shadow-lg border border-[#ecad20]/30">
                <Clock className="h-5 w-5" style={{ color: "#ecad20" }} />
                <span
                  className="text-2xl sm:text-3xl md:text-3xl font-black tabular-nums text-white leading-none"
                  aria-live="polite"
                >
                  {remaining}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span>ثوانٍ</span>
                <span>•</span>
                <span>دقائق</span>
                <span>•</span>
                <span>ساعات</span>
              </div>
            </div>
          </div>
        </div>
        {/* Ligne décorative en bas avec l'or */}
        <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-[#ecad20]/20 via-[#ecad20] to-[#ecad20]/20" />
      </div>
    </div>
  );
}
