// Quran Audio API utilities
// Uses Islamic Network CDN for surah-level audio streaming

import {
  SurahAudioEdition,
  SURAH_AUDIO_EDITIONS,
  // Legacy imports kept for backward-compat
  Reciter,
  ReciterWithArabic,
  ChapterRecitation,
  RECITER_ARABIC_NAMES,
} from "@/types/quranAudio";

const CDN_BASE = "https://cdn.islamic.network/quran/audio-surah";
const DEFAULT_BITRATE = 128;
const API_BASE_URL = "https://api.quran.com/api/v4";

// ─── CDN-based helpers ─────────────────────────────────

/**
 * Build the audio URL for a surah on the Islamic Network CDN.
 *
 * @example getSurahAudioUrl("ar.alafasy", 1) →
 *   "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3"
 */
export function getSurahAudioUrl(
  editionId: string,
  surahNumber: number,
  bitrate: number = DEFAULT_BITRATE,
): string {
  return `${CDN_BASE}/${bitrate}/${editionId}/${surahNumber}.mp3`;
}

/** Return the full curated editions list (sync, no network). */
export function getSurahEditions(): SurahAudioEdition[] {
  return SURAH_AUDIO_EDITIONS;
}

/** Find an edition by its CDN id. */
export function findEditionById(id: string): SurahAudioEdition | undefined {
  return SURAH_AUDIO_EDITIONS.find((e) => e.id === id);
}

// ─── Legacy Quran.com API helpers (kept for compat) ────

/**
 * Fetch all available reciters from Quran.com API
 */
export async function fetchReciters(): Promise<ReciterWithArabic[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/recitations`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data.recitations.map((reciter: Reciter) => ({
      ...reciter,
      arabic_name:
        RECITER_ARABIC_NAMES[reciter.reciter_name] || reciter.reciter_name,
    }));
  } catch (error) {
    console.error("Error fetching reciters:", error);
    return [];
  }
}

/**
 * Fetch audio file for a specific chapter by a reciter
 */
export async function fetchChapterAudio(
  recitationId: number,
  chapterNumber: number,
): Promise<ChapterRecitation | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/chapter_recitations/${recitationId}/${chapterNumber}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching audio for chapter ${chapterNumber}:`, error);
    return null;
  }
}

/**
 * Fetch all chapters audio for a specific reciter
 */
export async function fetchAllChaptersAudio(
  recitationId: number,
): Promise<ChapterRecitation[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/chapter_recitations/${recitationId}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.audio_files || [];
  } catch (error) {
    console.error("Error fetching all chapters audio:", error);
    return [];
  }
}

/**
 * Generate a slug from reciter name
 */
export function getReciterSlug(reciter: ReciterWithArabic): string {
  const baseName = reciter.reciter_name
    .toLowerCase()
    .replace(/[`']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (reciter.style) {
    return `${baseName}-${reciter.style.toLowerCase()}`;
  }
  return baseName;
}

/**
 * Get reciter by slug
 */
export function findReciterBySlug(
  reciters: ReciterWithArabic[],
  slug: string,
): ReciterWithArabic | undefined {
  return reciters.find((r) => getReciterSlug(r) === slug);
}
