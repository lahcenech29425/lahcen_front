import { NormalizedPrayerDay, NextPrayerInfo, PrayerName, NormalizedPrayerTime } from "@/types/Prayer";

export function normalizePrayerDay(data: any, baseDate: Date = new Date()): NormalizedPrayerDay {
    // Basic normalization - assuming data matches structure or is close enough for now
    // In a real app, we'd map API response to internal type
    const timings = data.data.timings;
    const date = data.data.date;

    // Parse times to Date objects for the baseDate
    const parsedTimings: Record<string, NormalizedPrayerTime> = {};

    Object.entries(timings).forEach(([name, timeStr]) => {
        if (typeof timeStr === 'string') {
            const [time, period] = timeStr.split(' '); // "05:00 (WIB)" or "05:00"
            const [hours, minutes] = time.split(':').map(Number);
            const prayerDate = new Date(baseDate);
            prayerDate.setHours(hours, minutes, 0, 0);
            parsedTimings[name] = {
                name: name as PrayerName,
                timeLabel: time,
                date: prayerDate
            };
        }
    });

    return {
        timings: parsedTimings as any,
        gregorian: {
            date: date.gregorian.date,
            readable: date.gregorian.date,
            timestamp: date.timestamp,
        },
        hijri: {
            date: date.hijri.date,
            readable: `${date.hijri.day} ${date.hijri.month.ar} ${date.hijri.year}`,
            weekday: { ar: date.hijri.weekday.ar, en: date.hijri.weekday.en },
            month: { ar: date.hijri.month.ar, en: date.hijri.month.en, number: date.hijri.month.number },
            year: date.hijri.year
        },
        meta: data.data.meta
    };
}

export function getNextPrayer(now: Date, day: NormalizedPrayerDay): NextPrayerInfo | null {
    const prayers: PrayerName[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

    for (const name of prayers) {
        const prayerTime = day.timings[name]?.date;
        if (prayerTime && prayerTime > now) {
            return {
                name,
                date: prayerTime,
                inMs: prayerTime.getTime() - now.getTime()
            };
        }
    }

    return null;
}

export function formatCountdown(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
