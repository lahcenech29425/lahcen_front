// Quran Audio API utilities — mp3quran.net v3
import type { Mp3QuranReciter, Mp3QuranResponse } from "@/types/quranAudio";

const API_BASE = "https://mp3quran.net/api/v3";

/**
 * Fetch all reciters from the mp3quran.net API.
 * @param language - Language code (default "ar")
 */
export async function fetchReciters(
  language: string = "ar",
): Promise<Mp3QuranReciter[]> {
  try {
    const res = await fetch(
      `${API_BASE}/reciters?language=${language}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data: Mp3QuranResponse = await res.json();
    return data.reciters ?? [];
  } catch (error) {
    console.error("Error fetching reciters:", error);
    return [];
  }
}

/**
 * Fetch a single reciter by ID.
 */
export async function fetchReciterById(
  id: number | string,
  language: string = "ar",
): Promise<Mp3QuranReciter | null> {
  try {
    const res = await fetch(
      `${API_BASE}/reciters?reciter=${id}&language=${language}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data: Mp3QuranResponse = await res.json();
    return data.reciters?.[0] ?? null;
  } catch (error) {
    console.error(`Error fetching reciter ${id}:`, error);
    return null;
  }
}

/**
 * Build the audio URL for a surah.
 * mp3quran.net convention: surah numbers are zero-padded to 3 digits.
 * @example getSurahAudioUrl("https://server8.mp3quran.net/afs/", 1) → ".../001.mp3"
 */
export function getSurahAudioUrl(
  serverUrl: string,
  surahNumber: number,
): string {
  const paddedNumber = surahNumber.toString().padStart(3, "0");
  return `${serverUrl}${paddedNumber}.mp3`;
}

/**
 * Parse a comma-separated surah_list string into an array of numbers.
 */
export function parseSurahList(surahList: string): number[] {
  return surahList
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
}

/**
 * Extract unique rewaya (recitation style) names from a list of reciters.
 * Used to populate the rewaya filter dropdown.
 */
export function extractUniqueRewayat(
  reciters: Mp3QuranReciter[],
): string[] {
  const set = new Set<string>();
  for (const r of reciters) {
    for (const m of r.moshaf) {
      set.add(m.name);
    }
  }
  return Array.from(set).sort();
}
