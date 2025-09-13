export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: "Meccan" | "Medinan" | string;
  numberOfAyahs: number;
  audio?: Record<string, { reciter: string; url: string }>;
  arabic1: string[];
  // Attributs supplémentaires utilisés dans ta page :
  surahNameArabicLong?: string;
  surahNameArabic?: string;
  revelationPlace?: "Mecca" | "Medina" | string;
  totalAyah?: number;
}
