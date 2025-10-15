import { MetadataRoute } from "next";
// Types pour Strapi
interface StrapiBlogAttributes {
  slug: string;
  updatedAt: string;
}

interface StrapiBlog {
  attributes: StrapiBlogAttributes;
}

interface StrapiResponse {
  data: StrapiBlog[];
}
// Noms anglais des 114 sourates pour les URLs
const SURAH_NAMES = [
  "al-fatihah",
  "al-baqarah",
  "ali-imran",
  "an-nisa",
  "al-maidah",
  "al-anam",
  "al-araf",
  "al-anfal",
  "at-tawbah",
  "yunus",
  "hud",
  "yusuf",
  "ar-rad",
  "ibrahim",
  "al-hijr",
  "an-nahl",
  "al-isra",
  "al-kahf",
  "maryam",
  "ta-ha",
  "al-anbiya",
  "al-hajj",
  "al-muminun",
  "an-nur",
  "al-furqan",
  "ash-shuara",
  "an-naml",
  "al-qasas",
  "al-ankabut",
  "ar-rum",
  "luqman",
  "as-sajdah",
  "al-ahzab",
  "saba",
  "fatir",
  "ya-sin",
  "as-saffat",
  "sad",
  "az-zumar",
  "ghafir",
  "fussilat",
  "ash-shura",
  "az-zukhruf",
  "ad-dukhan",
  "al-jathiyah",
  "al-ahqaf",
  "muhammad",
  "al-fath",
  "al-hujurat",
  "qaf",
  "adh-dhariyat",
  "at-tur",
  "an-najm",
  "al-qamar",
  "ar-rahman",
  "al-waqiah",
  "al-hadid",
  "al-mujadilah",
  "al-hashr",
  "al-mumtahanah",
  "as-saf",
  "al-jumuah",
  "al-munafiqun",
  "at-taghabun",
  "at-talaq",
  "at-tahrim",
  "al-mulk",
  "al-qalam",
  "al-haqqah",
  "al-maarij",
  "nuh",
  "al-jinn",
  "al-muzzammil",
  "al-muddaththir",
  "al-qiyamah",
  "al-insan",
  "al-mursalat",
  "an-naba",
  "an-naziat",
  "abasa",
  "at-takwir",
  "al-infitar",
  "al-mutaffifin",
  "al-inshiqaq",
  "al-buruj",
  "at-tariq",
  "al-ala",
  "al-ghashiyah",
  "al-fajr",
  "al-balad",
  "ash-shams",
  "al-layl",
  "ad-duha",
  "ash-sharh",
  "at-tin",
  "al-alaq",
  "al-qadr",
  "al-bayyinah",
  "az-zalzalah",
  "al-adiyat",
  "al-qariah",
  "at-takathur",
  "al-asr",
  "al-humazah",
  "al-fil",
  "quraysh",
  "al-maun",
  "al-kawthar",
  "al-kafirun",
  "an-nasr",
  "al-masad",
  "al-ikhlas",
  "al-falaq",
  "an-nas",
];

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
  // 2. SECTION BLOGS
  // ========================================
  const blogIndexPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Fetch des articles de blog depuis Strapi
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const strapiUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const response = await fetch(
      `${strapiUrl}/api/blogs?populate=*&pagination[pageSize]=100`,
      {
        next: { revalidate: 3600 }, // Cache 1 heure
      }
    );

    if (response.ok) {
      const data: StrapiResponse = await response.json();
      if (data.data && Array.isArray(data.data)) {
        blogPages = data.data.map((blog: StrapiBlog) => ({
          url: `${baseUrl}/blogs/${blog.attributes.slug}`,
          lastModified: blog.attributes.updatedAt
            ? new Date(blog.attributes.updatedAt)
            : currentDate,
          changeFrequency: "weekly",
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.error("❌ Error fetching blogs for sitemap:", error);
  }

  // ========================================
  // 3. SECTION QURAN
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
  // 4. SECTION HADITH
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
  // 5. AUTRES PAGES (si vous en avez)
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
    ...blogIndexPage, // Index des blogs
    ...blogPages, // Articles individuels
    ...quranIndexPage, // Index du Quran
    ...surahPages, // 114 sourates
    ...ayahPages, // 6236 versets
    ...hadithPages, // Section Hadith
    ...additionalPages, // Autres pages
  ];

  // Log pour le développement
  console.log(`✅ Sitemap généré avec succès:`);
  console.log(`   📄 Pages statiques: ${staticPages.length}`);
  console.log(`   📝 Articles de blog: ${blogPages.length}`);
  console.log(`   📖 Sourates: ${surahPages.length}`);
  console.log(`   📜 Versets: ${ayahPages.length}`);
  console.log(`   📚 Pages Hadith: ${hadithPages.length}`);
  console.log(`   🌐 TOTAL: ${allPages.length} URLs`);

  return allPages;
}
