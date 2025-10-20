// Types for Aladhan API and normalized prayer timings used in the app

export type PrayerName =
  | "Fajr"
  | "Sunrise"
  | "Dhuhr"
  | "Asr"
  | "Maghrib"
  | "Isha";

export type RawAladhanTimingsResponse = {
  code: number;
  status: string;
  data: {
    timings: Record<string, string>; // e.g., { Fajr: "05:29 (AST)", Dhuhr: "12:34", ... }
    date: {
      readable: string; // e.g., "22 Oct 2024"
      timestamp: string; // unix timestamp as string
      gregorian: {
        date: string; // dd-mm-yyyy
        day: string;
        weekday?: { en?: string };
        month?: { number?: number; en?: string };
        year?: string;
      };
      hijri: {
        date: string; // dd-mm-yyyy
        day: string;
        weekday?: { ar?: string; en?: string };
        month?: { number?: number; ar?: string; en?: string };
        year?: string;
      };
    };
    meta: {
      timezone: string; // e.g., "Africa/Casablanca"
      method?: { id?: number; name?: string };
    };
  };
};

export type NormalizedPrayerTime = {
  name: PrayerName;
  timeLabel: string; // formatted like 05:29
  date: Date; // local Date instance representing today's prayer time
};

export type NormalizedPrayerDay = {
  timezone: string;
  methodName?: string;
  gregorian: {
    date: string; // dd-mm-yyyy
    readable: string; // e.g., 22 Oct 2024
  };
  hijri: {
    date: string; // dd-mm-yyyy
    readable?: string; // optional composed label like "8 ربيع الآخر 1446"
  };
  timings: Record<PrayerName, NormalizedPrayerTime>;
};

export type NextPrayerInfo = {
  name: PrayerName;
  date: Date;
  inMs: number;
};
