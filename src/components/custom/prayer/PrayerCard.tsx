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
  highlight, // الصلاة الحالية أو القادمة
  isNext, // اختياري: لتمييز الصلاة القادمة
}: {
  t: NormalizedPrayerTime;
  highlight?: boolean;
  isNext?: boolean;
}) {
  const Icon = ICON_BY_PRAYER[t.name] ?? Clock;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white border-2 transition-all duration-300
        ${
          highlight
            ? "border-[#ecad20] shadow-2xl scale-[1.02] ring-2 ring-[#ecad20]/20"
            : "border-gray-200 shadow-md hover:shadow-xl hover:border-[#ecad20]/50"
        }
      `}
      aria-label={`${LABELS_AR[t.name]} ${t.timeLabel}`}
    >
      {/* شارة الحالة */}
      {(highlight || isNext) && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shadow-lg border ${
              highlight
                ? "bg-gradient-to-r from-[#171717] to-[#2a2a2a] text-white border-[#ecad20]/30"
                : "bg-white text-[#171717] border-gray-300"
            }`}
          >
            {highlight ? "الآن" : "القادمة"}
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                highlight ? "bg-[#ecad20] animate-pulse" : "bg-gray-400"
              }`}
            />
          </span>
        </div>
      )}

      {/* أيقونة */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`inline-flex items-center justify-center rounded-xl p-2 border shadow-sm transition-all ${
            highlight
              ? "bg-gradient-to-br from-[#ecad20] to-[#d99a1a] border-[#ecad20]"
              : "bg-gradient-to-br from-[#ecad20]/10 to-[#ecad20]/5 border-[#ecad20]/20"
          }`}
        >
          <Icon
            className="h-6 w-6"
            style={{ color: highlight ? "#ffffff" : "#ecad20" }}
          />
        </span>
      </div>

      {/* المحتوى */}
      <div className="flex h-56 sm:h-64 flex-col justify-end p-6 bg-gradient-to-br from-white via-gray-50/30 to-white">
        {/* الاسم */}
        <div className="text-base sm:text-lg font-semibold text-gray-700">
          {LABELS_AR[t.name]}
        </div>

        {/* الوقت */}
        <div
          className={`mt-1 text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums ${
            highlight
              ? "text-[#ecad20]"
              : "bg-gradient-to-br from-[#171717] via-[#2a2a2a] to-[#171717] bg-clip-text text-transparent"
          }`}
        >
          {t.timeLabel}
        </div>

        {/* سطر معلومات صغير */}
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs sm:text-sm text-gray-600">
          توقيت محلي
        </div>
      </div>
    </div>
  );
}
