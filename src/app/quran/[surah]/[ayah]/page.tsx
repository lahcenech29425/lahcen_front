import { Metadata } from "next";
import AyahDetailClient from "./AyahDetailClient";
import { fetchSurahDetail } from "@/utils/quranApi";
import { getSurahNumberFromSlug } from "@/utils/surahHelpers";

type Props = {
  params: Promise<{ surah: string; ayah: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surah: surahSlug, ayah: ayahParam } = await params;
  const ayahNumber = Number(ayahParam);

  try {
    const surahNumber = await getSurahNumberFromSlug(surahSlug);
    const surah = await fetchSurahDetail(surahNumber);

    const surahName = surah.surahNameArabicLong || surah.surahNameArabic;
    const revelationType = surah.revelationPlace === "Mecca" ? "مكية" : "مدنية";
    const ayahText = surah.arabic1[ayahNumber - 1] || "";

    const description = `اقرأ الآية ${ayahNumber} من ${surahName} مع التفسير الكامل. ${ayahText} - تفسير ابن كثير، الطبري، القرطبي، السعدي، التفسير الميسر وغيرها من التفاسير المعتمدة.`;

    const keywords = `آية ${ayahNumber} ${surahName}, تفسير آية ${ayahNumber} ${surahName}, ${ayahText.substring(
      0,
      50
    )}, القرآن الكريم, تفسير القرآن`;

    return {
      title: `الآية ${ayahNumber} من ${surahName} | تفسير ومعنى`,
      description,
      keywords,
      authors: [{ name: "لحسن", url: "https://www.lahcenway.com" }],
      robots: "index, follow",
      openGraph: {
        title: `الآية ${ayahNumber} من ${surahName}`,
        description,
        url: `https://www.lahcenway.com/quran/${surahSlug}/${ayahNumber}`,
        siteName: "لحسن",
        locale: "ar-SA",
        type: "article",
        images: [
          {
            url: `https://www.lahcenway.com/og-quran.jpg`,
            width: 1200,
            height: 630,
            alt: `الآية ${ayahNumber} من ${surahName}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `الآية ${ayahNumber} من ${surahName}`,
        description,
        images: [`https://www.lahcenway.com/og-quran.jpg`],
      },
      alternates: {
        canonical: `https://www.lahcenway.com/quran/${surahSlug}/${ayahNumber}`,
      },
      other: {
        "arabic-content": "true",
        "content-language": "ar",
        "surah-number": String(surahNumber),
        "surah-name": surahName,
        "ayah-number": String(ayahNumber),
        "ayah-text": ayahText.substring(0, 200),
        "revelation-type": revelationType,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "القرآن الكريم - قراءة وتفسير",
      description: "اقرأ واستمع للقرآن الكريم مع التفسير",
    };
  }
}

// Pre-render all 6,236 ayah pages at build time for SEO
export async function generateStaticParams() {
  const SURAH_NAMES = [
    "al-faatiha", "al-baqara", "aal-i-imraan", "an-nisaa", "al-maaida",
    "al-an'aam", "al-a'raaf", "al-anfaal", "at-tawba", "yunus",
    "hud", "yusuf", "ar-ra'd", "ibrahim", "al-hijr",
    "an-nahl", "al-israa", "al-kahf", "maryam", "taa-haa",
    "al-anbiyaa", "al-hajj", "al-muminoon", "an-noor", "al-furqaan",
    "ash-shu'araa", "an-naml", "al-qasas", "al-ankaboot", "ar-room",
    "luqman", "as-sajda", "al-ahzaab", "saba", "faatir",
    "yaseen", "as-saaffaat", "saad", "az-zumar", "ghafir",
    "fussilat", "ash-shura", "az-zukhruf", "ad-dukhaan", "al-jaathiya",
    "al-ahqaf", "muhammad", "al-fath", "al-hujuraat", "qaaf",
    "adh-dhaariyat", "at-tur", "an-najm", "al-qamar", "ar-rahmaan",
    "al-waaqia", "al-hadid", "al-mujaadila", "al-hashr", "al-mumtahanah",
    "as-saff", "al-jumu'a", "al-munaafiqoon", "at-taghaabun", "at-talaaq",
    "at-tahrim", "al-mulk", "al-qalam", "al-haaqqa", "al-ma'aarij",
    "nooh", "al-jinn", "al-muzzammil", "al-muddaththir", "al-qiyaama",
    "al-insaan", "al-mursalaat", "an-naba", "an-naazi'at", "abasa",
    "at-takwir", "al-infitaar", "al-mutaffifin", "al-inshiqaaq", "al-burooj",
    "at-taariq", "al-a'laa", "al-ghaashiya", "al-fajr", "al-balad",
    "ash-shams", "al-lail", "ad-dhuhaa", "ash-sharh", "at-tin",
    "al-alaq", "al-qadr", "al-bayyina", "az-zalzala", "al-aadiyat",
    "al-qaari'a", "at-takaathur", "al-asr", "al-humaza", "al-fil",
    "quraish", "al-maa'un", "al-kawthar", "al-kaafiroon", "an-nasr",
    "al-masad", "al-ikhlaas", "al-falaq", "an-naas"
  ];

  const AYAH_COUNTS = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111,
    110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45,
    83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55,
    78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20,
    56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21,
    11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
  ];

  const params: { surah: string; ayah: string }[] = [];

  AYAH_COUNTS.forEach((count, surahIndex) => {
    const surahName = SURAH_NAMES[surahIndex];
    for (let ayahNumber = 1; ayahNumber <= count; ayahNumber++) {
      params.push({
        surah: surahName,
        ayah: String(ayahNumber)
      });
    }
  });

  return params; // Returns 6,236 param combinations
}

export default function AyahDetailPage({ params }: Props) {
  return <AyahDetailClient params={params} />;
}
