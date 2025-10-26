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

export default function AyahDetailPage({ params }: Props) {
  return <AyahDetailClient params={params} />;
}
