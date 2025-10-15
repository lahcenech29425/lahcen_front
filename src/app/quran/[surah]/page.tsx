import { Metadata } from "next";
import SurahDetailClient from "./SurahDetailClient";
import { fetchSurahDetail } from "@/utils/quranApi";
import { getSurahNumberFromSlug } from "@/utils/surahHelpers";

type Props = {
  params: Promise<{ surah: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surah: surahSlug } = await params;

  try {
    const surahNumber = await getSurahNumberFromSlug(surahSlug);
    const surah = await fetchSurahDetail(surahNumber);

    const surahName = surah.surahNameArabicLong || surah.surahNameArabic;
    const revelationType = surah.revelationPlace === "Mecca" ? "مكية" : "مدنية";
    const totalAyah = surah.totalAyah;
    const firstAyah = surah.arabic1[0] || "";

    const description = `اقرأ واستمع لسورة ${surahName} كاملة مع التفسير. سورة ${revelationType} تحتوي على ${totalAyah} آية. ${
      firstAyah ? `تبدأ بـ: ${firstAyah.substring(0, 50)}...` : ""
    } مع تفاسير ابن كثير والطبري والقرطبي والسعدي والتفسير الميسر.`;

    const keywords = `سورة ${surahName}, قراءة سورة ${surahName}, استماع سورة ${surahName}, تفسير سورة ${surahName}, ${surahName} كاملة, القرآن الكريم, تفسير القرآن, ${firstAyah.substring(
      0,
      30
    )}`;

    return {
      title: `سورة ${surahName} | قراءة واستماع مع التفسير`,
      description,
      keywords,
      authors: [{ name: "لحسن", url: "https://www.lahcenway.com" }],
      robots: "index, follow",
      openGraph: {
        title: `سورة ${surahName} - القرآن الكريم`,
        description,
        url: `https://www.lahcenway.com/quran/${surahSlug}`,
        siteName: "لحسن",
        locale: "ar-SA",
        type: "article",
        images: [
          {
            url: `https://www.lahcenway.com/og-quran.jpg`,
            width: 1200,
            height: 630,
            alt: `سورة ${surahName}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `سورة ${surahName} - القرآن الكريم`,
        description,
        images: [`https://www.lahcenway.com/og-quran.jpg`],
      },
      alternates: {
        canonical: `https://www.lahcenway.com/quran/${surahSlug}`,
      },
      other: {
        "arabic-content": "true",
        "content-language": "ar",
        "surah-number": String(surahNumber),
        "surah-name-arabic": surahName,
        "surah-name-english": surah.englishName || "",
        "revelation-type": revelationType,
        "total-ayah": String(totalAyah),
        "first-ayah": firstAyah.substring(0, 100),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "القرآن الكريم - قراءة واستماع",
      description: "اقرأ واستمع للقرآن الكريم مع التفسير",
    };
  }
}

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    surah: String(i + 1),
  }));
}

export default function SurahDetailPage({ params }: Props) {
  return <SurahDetailClient params={params} />;
}
