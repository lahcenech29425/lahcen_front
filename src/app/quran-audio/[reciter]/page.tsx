import { Metadata } from "next";
import { fetchReciterById } from "@/utils/quranAudioApi";
import ReciterPageClient from "./ReciterPageClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ reciter: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { reciter: reciterId } = await params;
  const reciter = await fetchReciterById(reciterId);

  if (!reciter) {
    return { title: "قارئ غير موجود | الاستماع للقرآن الكريم" };
  }

  const moshafName = reciter.moshaf[0]?.name ?? "";

  return {
    title: `${reciter.name} | الاستماع للقرآن الكريم`,
    description: `استمع إلى القرآن الكريم كاملاً بصوت القارئ ${reciter.name}. ${moshafName}. تلاوات عالية الجودة لجميع السور.`,
    keywords: [
      reciter.name,
      moshafName,
      "القرآن الكريم",
      "استماع القرآن",
      "تلاوة",
    ],
    openGraph: {
      title: `${reciter.name} | الاستماع للقرآن الكريم`,
      description: `استمع إلى القرآن الكريم بصوت ${reciter.name}`,
      url: `/quran-audio/${reciterId}`,
      siteName: "سِرَاجٌ يُضِيءُالدَّرْبَ",
      locale: "ar-SA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${reciter.name} | الاستماع للقرآن الكريم`,
      description: `استمع إلى القرآن الكريم بصوت ${reciter.name}`,
      images: ["/og-quran-audio.jpg"],
    },
    alternates: {
      canonical: `/quran-audio/${reciterId}`,
    },
  };
}

export default async function ReciterPage({ params }: PageProps) {
  const { reciter: reciterId } = await params;
  const reciter = await fetchReciterById(reciterId);

  if (!reciter) notFound();

  return <ReciterPageClient reciter={reciter} />;
}
