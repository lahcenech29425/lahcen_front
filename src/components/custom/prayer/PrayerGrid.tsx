"use client";
import React from "react";
import { NormalizedPrayerDay, PrayerName } from "@/types/Prayer";
import PrayerCard from "./PrayerCard";

const ORDER: PrayerName[] = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

export default function PrayerGrid({
  day,
  nextName,
}: {
  day: NormalizedPrayerDay;
  nextName?: PrayerName;
}) {
  const now = new Date();

  // Find current prayer (time has arrived within last 30 minutes)
  let currentPrayerName: PrayerName | undefined;
  const CURRENT_PRAYER_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

  for (let i = 0; i < ORDER.length; i++) {
    const name = ORDER[i];
    const t = day.timings[name];
    if (!t) continue;

    const timeSincePrayer = now.getTime() - t.date.getTime();

    // If prayer time has passed but within the last 30 minutes
    if (timeSincePrayer >= 0 && timeSincePrayer <= CURRENT_PRAYER_WINDOW_MS) {
      currentPrayerName = name;
      break;
    }
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ORDER.map((name) => {
        const t = day.timings[name];
        if (!t) return null;
        const isNext = nextName === name;
        const isCurrent = currentPrayerName === name;
        return (
          <PrayerCard
            key={name}
            t={t}
            highlight={isNext}
            isCurrent={isCurrent}
          />
        );
      })}
    </div>
  );
}
