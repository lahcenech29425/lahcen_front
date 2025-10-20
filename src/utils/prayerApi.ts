// Get country code from lat/lng using Nominatim API
export async function getCountryCodeFromLatLng(
  lat: number,
  lng: number
): Promise<string | undefined> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3&addressdetails=1`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const json = await res.json();
    return json?.address?.country_code?.toUpperCase();
  } catch {
    return undefined;
  }
}
import { RawAladhanTimingsResponse } from "@/types/Prayer";

const ALADHAN_BASE = "https://api.aladhan.com/v1";

export type FetchPrayerParams = {
  date: string; // format: dd-mm-yyyy
  latitude: number;
  longitude: number;
  method?: number; // default: 3 (Muslim World League) or 14 (Morocco Waqf)? We'll use 3 by default.
  school?: 0 | 1; // 0: Shafi, 1: Hanafi
  tune?: string; // optional adjustments
  timezonestring?: string; // e.g., "Africa/Casablanca"
  latitudeAdjustmentMethod?: 1 | 2 | 3; // 1: Middle of the Night, 2: One Seventh, 3: Angle Based
};

export async function fetchAladhanTimings(
  params: FetchPrayerParams
): Promise<RawAladhanTimingsResponse> {
  const {
    date,
    latitude,
    longitude,
    method,
    school,
    tune,
    timezonestring,
    latitudeAdjustmentMethod,
  } = params;

  const url = new URL(`${ALADHAN_BASE}/timings/${encodeURIComponent(date)}`);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  if (typeof method !== "undefined") {
    url.searchParams.set("method", String(method));
  }
  if (school !== undefined) url.searchParams.set("school", String(school));
  if (tune) url.searchParams.set("tune", tune);
  if (timezonestring) url.searchParams.set("timezonestring", timezonestring);
  if (latitudeAdjustmentMethod)
    url.searchParams.set(
      "latitudeAdjustmentMethod",
      String(latitudeAdjustmentMethod)
    );

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch prayer timings: ${res.status} ${res.statusText}`
    );
  }
  const json = (await res.json()) as RawAladhanTimingsResponse;
  return json;
}

// Region-based method selection utilities
const METHOD_BY_CC: Record<string, number> = {
  SA: 4,
  AE: 16,
  QA: 10,
  KW: 9,
  OM: 4,
  BH: 4,
  MA: 21,
  DZ: 19,
  TN: 18,
  TR: 13,
  FR: 12,
  GB: 15,
  US: 2,
  CA: 2,
  MY: 17,
  ID: 20,
  JO: 23,
  RU: 14,
  PK: 1,
  SG: 11,
};

const TZ_TO_CC: Record<string, string> = {
  "Africa/Casablanca": "MA",
  "Africa/Algiers": "DZ",
  "Africa/Tunis": "TN",
  "Europe/Istanbul": "TR",
  "Europe/Paris": "FR",
  "Europe/London": "GB",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Jakarta": "ID",
  "Asia/Amman": "JO",
  "Europe/Moscow": "RU",
  "Asia/Karachi": "PK",
  "Asia/Kuwait": "KW",
  "Asia/Qatar": "QA",
  "Asia/Singapore": "SG",
  "Asia/Dubai": "AE",
  "Asia/Riyadh": "SA",
  "Asia/Muscat": "OM",
  "Asia/Bahrain": "BH",
};

export function pickCountryCodeFromTimezone(tz?: string): string | undefined {
  if (!tz) return undefined;
  return TZ_TO_CC[tz];
}

export function pickMethodByCountryCode(cc?: string): number | undefined {
  if (!cc) return undefined;
  return METHOD_BY_CC[cc];
}

export async function deriveMethodForTimezone(
  tz?: string,
  lat?: number,
  lng?: number
): Promise<{
  method?: number;
  latitudeAdjustmentMethod?: 1 | 2 | 3;
}> {
  let cc = pickCountryCodeFromTimezone(tz);
  // If timezone mapping fails, get country code from lat/lng
  if (!cc && typeof lat === "number" && typeof lng === "number") {
    cc = await getCountryCodeFromLatLng(lat, lng);
  }
  const method = pickMethodByCountryCode(cc);
  const highLat = tz
    ? /Europe\/(London|Oslo|Stockholm)|America\/(Edmonton|Winnipeg)/.test(tz)
    : false;
  return { method, latitudeAdjustmentMethod: highLat ? 3 : undefined };
}

// Convert Gregorian date (dd-mm-yyyy) to Hijri using Aladhan API
export async function fetchHijriFromGregorian(date: string) {
  const url = new URL(`${ALADHAN_BASE}/gToH`);
  url.searchParams.set("date", date);
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok)
    throw new Error(`Failed to convert date to hijri: ${res.status}`);
  const json = (await res.json()) as {
    code: number;
    status: string;
    data: {
      hijri: {
        date: string;
        day: string;
        month: { ar?: string; number?: number };
        year: string;
      };
      gregorian: { date: string };
    };
  };
  const h = json.data.hijri;
  const readable =
    h.month?.ar && h.day && h.year
      ? `${h.day} ${h.month.ar} ${h.year}`
      : h.date;
  return { hijriDate: h.date, hijriReadable: readable };
}
