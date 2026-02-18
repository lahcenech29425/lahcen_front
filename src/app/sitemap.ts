import { SeoBlog } from "@/types/blog";
import { ImageType } from "@/types/image";
import { MetadataRoute } from "next";

interface StrapiBlog {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  seo: SeoBlog | null;
  coverImage: ImageType | null;
}

interface StrapiResponse {
  data: StrapiBlog[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

import { SURAH_NAMES } from "@/utils/surahHelpers";

// Nombre de versets par sourate (114 sourates, 6236 versets au total)
const AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111,
  110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45,
  83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55,
  78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20,
  56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21,
  11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.lahcenway.com";
  const currentDate = new Date();

  // ========================================
  // 1. PAGES STATIQUES PRINCIPALES
  // ========================================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // ========================================
  // 4. SECTION QURAN
  // ========================================
  const quranIndexPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/quran`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Pages des 114 sourates
  const surahPages: MetadataRoute.Sitemap = SURAH_NAMES.map((name) => ({
    url: `${baseUrl}/quran/${name}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Pages de tous les versets (6236 versets)
  const ayahPages: MetadataRoute.Sitemap = [];
  AYAH_COUNTS.forEach((count, surahIndex) => {
    const surahName = SURAH_NAMES[surahIndex];
    for (let ayahNumber = 1; ayahNumber <= count; ayahNumber++) {
      ayahPages.push({
        url: `${baseUrl}/quran/${surahName}/${ayahNumber}`,
        lastModified: currentDate,
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  });

  // ========================================
  // 5. SECTION HADITH
  // ========================================
  const hadithPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/hadith`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // ========================================
  // 6. SECTION PRAYER TIMES
  // ========================================
  const prayerPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/prayer-times`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // ========================================
  // 7. SECTION QURAN AUDIO
  // ========================================
  const quranAudioPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/quran-audio`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // ========================================
  // 7. AUTRES PAGES (si vous en avez)
  // ========================================
  const additionalPages: MetadataRoute.Sitemap = [
    // Décommentez si vous avez ces pages :
    // {
    //   url: `${baseUrl}/contact`,
    //   lastModified: currentDate,
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
    // {
    //   url: `${baseUrl}/privacy`,
    //   lastModified: currentDate,
    //   changeFrequency: "yearly",
    //   priority: 0.5,
    // },
    // {
    //   url: `${baseUrl}/terms`,
    //   lastModified: currentDate,
    //   changeFrequency: "yearly",
    //   priority: 0.5,
    // },
  ];

  // ========================================
  // COMBINER TOUTES LES PAGES
  // ========================================
  const allPages: MetadataRoute.Sitemap = [
    ...staticPages, // Pages principales
    ...quranIndexPage, // Index des blogs
    ...surahPages, // 114 sourates
    ...ayahPages, // 6236 versets
    ...hadithPages, // Section Hadith
    ...prayerPages, // Section Prayer Times
    ...quranAudioPages, // Section Quran Audio
    ...additionalPages, // Autres pages
  ];

  return allPages;
}
