import {
  NextPrayerInfo,
  NormalizedPrayerDay,
  NormalizedPrayerTime,
  PrayerName,
  RawAladhanTimingsResponse,
} from "@/types/Prayer";

const ORDER: PrayerName[] = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

function parseTimeToDate(time: string, tz: string, baseDate: Date): Date {
  // time may include tz in parentheses, e.g., "05:29 (AST)". Extract HH:MM.
  const match = time.match(/(\d{1,2}):(\d{2})/);
  const hours = match ? parseInt(match[1], 10) : 0;
  const minutes = match ? parseInt(match[2], 10) : 0;
  // Construct a Date in local time corresponding to tz's current offset relative to baseDate.
  // We can't change system timezone in JS, so we interpret times as in the browser's local tz.
  // If timezonestring differs, we still use provided label in UI. This is acceptable for client-side display.
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function normalizePrayerDay(
  raw: RawAladhanTimingsResponse
): NormalizedPrayerDay {
  const tz = raw.data.meta.timezone;
  const baseDate = new Date(Number(raw.data.date.timestamp) * 1000);
  const readableGregorian = raw.data.date.readable;
  const gregorianDate = raw.data.date.gregorian?.date ?? readableGregorian;
  const hijriDate = raw.data.date.hijri?.date ?? "";
  const hijriMonthAr = raw.data.date.hijri?.month?.ar;
  const hijriDay = raw.data.date.hijri?.day;
  const hijriYear = raw.data.date.hijri?.year;
  const hijriReadable =
    hijriMonthAr && hijriDay && hijriYear
      ? `${hijriDay} ${hijriMonthAr} ${hijriYear}`
      : undefined;

  const timings: Partial<Record<PrayerName, NormalizedPrayerTime>> = {};
  for (const name of ORDER) {
    const label =
      raw.data.timings[name] ?? raw.data.timings[name.toUpperCase()];
    if (!label) continue;
    const date = parseTimeToDate(label, tz, baseDate);
    const timeLabel = label.match(/(\d{1,2}:\d{2})/)?.[1] || "";
    timings[name] = { name, timeLabel, date };
  }

  const result: NormalizedPrayerDay = {
    timezone: tz,
    methodName: raw.data.meta.method?.name,
    gregorian: { date: gregorianDate, readable: readableGregorian },
    hijri: { date: hijriDate, readable: hijriReadable },
    timings: timings as Record<PrayerName, NormalizedPrayerTime>,
  };
  return result;
}

export function getNextPrayer(
  now: Date,
  day: NormalizedPrayerDay
): NextPrayerInfo | null {
  for (const name of ORDER) {
    const t = day.timings[name];
    if (!t) continue;
    const diff = t.date.getTime() - now.getTime();
    if (diff > 0) {
      return { name, date: t.date, inMs: diff };
    }
  }
  // If all passed, next is tomorrow's Fajr; return null here and let caller fetch next day if needed
  return null;
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
