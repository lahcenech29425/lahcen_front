"use client";
import React from "react";
import { NormalizedPrayerTime, PrayerName } from "@/types/Prayer";
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

export default function PrayerCard({
  t,
  highlight, // الصلاة القادمة (next prayer, not yet arrived)
  isCurrent, // الصلاة الحالية (current prayer time has arrived)
}: {
  t: NormalizedPrayerTime;
  highlight?: boolean;
  isCurrent?: boolean;
}) {
  const Icon = ICON_BY_PRAYER[t.name] ?? Clock;

  return (
    <div
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-[#232323] border-2 transition-all duration-300
        ${
          highlight || isCurrent
            ? "border-[#ecad20] shadow-2xl scale-[1.02] ring-2 ring-[#ecad20]/20"
            : "border-gray-200 dark:border-[#1a1a1a] shadow-md hover:shadow-xl hover:border-[#ecad20]/50"
        }
      `}
      aria-label={`${LABELS_AR[t.name]} ${t.timeLabel}`}
    >
      {/* شارة الحالة */}
      {(highlight || isCurrent) && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <span
            className={`inline-flex items-center gap-1 sm:gap-2 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium shadow-lg border ${
              isCurrent
                ? "bg-gradient-to-r from-[#171717] to-[#2a2a2a] text-white border-[#ecad20]/30"
                : "bg-white dark:bg-[#232323] text-[#171717] dark:text-[#ededed] border-gray-300 dark:border-[#1a1a1a]"
            }`}
          >
            {isCurrent ? "الآن" : "القادمة"}
            <span
              className={`inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                isCurrent
                  ? "bg-[#ecad20] animate-pulse"
                  : "bg-gray-400 dark:bg-[#ededed]"
              }`}
            />
          </span>
        </div>
      )}

      {/* أيقونة */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
        <span
          className={`inline-flex items-center justify-center rounded-lg sm:rounded-xl p-1.5 sm:p-2 border shadow-sm transition-all ${
            highlight || isCurrent
              ? "bg-gradient-to-br from-[#ecad20] to-[#d99a1a] border-[#ecad20]"
              : "bg-gradient-to-br from-[#ecad20]/10 to-[#ecad20]/5 border-[#ecad20]/20"
          }`}
        >
          <Icon
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
            style={{ color: highlight || isCurrent ? "#ffffff" : "#ecad20" }}
          />
        </span>
      </div>

      {/* المحتوى */}
      <div className="flex h-40 sm:h-48 md:h-56 flex-col justify-end p-3 sm:p-4 md:p-6 bg-gradient-to-br from-white dark:from-[#232323] via-gray-50/30 dark:via-[#232323]/30 to-white dark:to-[#232323]">
        {/* الاسم */}
        <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 dark:text-[#ededed]">
          {LABELS_AR[t.name]}
        </div>

        {/* الوقت */}
        <div
          className={`mt-0.5 sm:mt-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight tabular-nums leading-none ${
            highlight || isCurrent
              ? "text-[#ecad20]"
              : "bg-gradient-to-br from-[#171717] via-[#2a2a2a] to-[#171717] dark:from-[#ededed] dark:via-[#ededed] dark:to-[#ededed] bg-clip-text text-transparent"
          }`}
        >
          {t.timeLabel}
        </div>

        {/* سطر معلومات صغير */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-[#1a1a1a] text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400">
          توقيت محلي
        </div>
      </div>
    </div>
  );
}
