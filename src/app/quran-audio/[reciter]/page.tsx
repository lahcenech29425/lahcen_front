import { Metadata } from "next";
import { findEditionById } from "@/utils/quranAudioApi";
import ReciterPageClient from "./ReciterPageClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ reciter: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { reciter: editionId } = await params;
  const edition = findEditionById(editionId);

  if (!edition) {
    return { title: "قارئ غير موجود | الاستماع للقرآن الكريم" };
  }

  return {
    title: `${edition.arabicName} | الاستماع للقرآن الكريم`,
    description: `استمع إلى القرآن الكريم كاملاً بصوت القارئ ${edition.arabicName}. تلاوات عالية الجودة لجميع السور.`,
    keywords: [
      edition.arabicName,
      edition.englishName,
      "القرآن الكريم",
      "استماع القرآن",
      "تلاوة",
      edition.style || "",
    ],
    openGraph: {
      title: `${edition.arabicName} | الاستماع للقرآن الكريم`,
      description: `استمع إلى القرآن الكريم بصوت ${edition.arabicName}`,
      url: `https://www.lahcenway.com/quran-audio/${editionId}`,
      siteName: "لحسن",
      locale: "ar-SA",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${edition.arabicName} | الاستماع للقرآن الكريم`,
    },
    alternates: {
      canonical: `https://www.lahcenway.com/quran-audio/${editionId}`,
    },
  };
}

export default async function ReciterPage({ params }: PageProps) {
  const { reciter: editionId } = await params;
  const edition = findEditionById(editionId);

  if (!edition) notFound();

  return <ReciterPageClient edition={edition} />;
}
