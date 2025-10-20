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
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ORDER.map((name) => {
        const t = day.timings[name];
        if (!t) return null;
        const highlight = nextName === name;
        return <PrayerCard key={name} t={t} highlight={highlight} />;
      })}
    </div>
  );
}
