// Types for mp3quran.net v3 API

/** A single moshaf (recitation edition) available for a reciter */
export interface Mp3QuranMoshaf {
  /** Unique moshaf ID */
  id: number;
  /** Moshaf name, e.g. "حفص عن عاصم - مرتل" */
  name: string;
  /** CDN server base URL, e.g. "https://server8.mp3quran.net/afs/" */
  server: string;
  /** Number of surahs available */
  surah_total: number;
  /** Moshaf type code */
  moshaf_type: number;
  /** Comma-separated list of available surah numbers */
  surah_list: string;
}

/** A reciter from the mp3quran.net API */
export interface Mp3QuranReciter {
  /** Unique reciter ID */
  id: number;
  /** Reciter name (Arabic) */
  name: string;
  /** First Arabic letter of the name (for alphabet filtering) */
  letter: string;
  /** Last updated date */
  date?: string;
  /** Available recitations (moshaf editions) */
  moshaf: Mp3QuranMoshaf[];
}

/** API response shape */
export interface Mp3QuranResponse {
  reciters: Mp3QuranReciter[];
}

/** Arabic alphabet letters for the alphabetical filter */
export const ARABIC_LETTERS = [
  "ا", "أ", "إ", "ب", "ت", "ث", "ج", "ح", "خ",
  "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض",
  "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل",
  "م", "ن", "ه", "و", "ي",
] as const;
