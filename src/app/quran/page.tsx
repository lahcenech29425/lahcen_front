import { Metadata } from "next";
import QuranPageClient from "./QuranPageClient";

export const metadata: Metadata = {
  title: "القرآن الكريم | قراءة وتصفح القرآن الكريم برواية حفص وورش",
  description:
    "اقرأ وتصفح القرآن الكريم كاملاً برواية حفص عن عاصم ورواية ورش عن نافع. ابحث في السور والآيات، واستمع للتلاوات المباركة. منصة قرآنية شاملة للقراءة والاستماع.",
  keywords: [
    "القرآن الكريم",
    "قراءة القرآن",
    "تصفح القرآن",
    "رواية حفص",
    "رواية ورش",
    "سور القرآن",
    "آيات قرآنية",
    "القرآن الكريم كاملاً",
    "تفسير القرآن",
    "قرآن كريم",
    "مصحف إلكتروني",
    "قرآن أونلاين",
  ],
  authors: [{ name: "لحسن", url: "https://www.lahcenway.com" }],
  robots: "index, follow",
  openGraph: {
    title: "القرآن الكريم | قراءة وتصفح القرآن الكريم برواية حفص وورش",
    description:
      "اقرأ وتصفح القرآن الكريم كاملاً برواية حفص عن عاصم ورواية ورش عن نافع. منصة قرآنية شاملة للقراءة والاستماع والبحث في السور والآيات.",
    url: "/quran",
    siteName: "سِرَاجٌ يُضِيءُالدَّرْبَ",
    locale: "ar-SA",
    type: "website",
    images: [
      {
        url: "/og-quran.jpg",
        width: 1200,
        height: 630,
        alt: "القرآن الكريم - قراءة وتصفح",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "القرآن الكريم | قراءة وتصفح القرآن الكريم",
    description:
      "اقرأ وتصفح القرآن الكريم كاملاً برواية حفص وورش. منصة قرآنية شاملة للقراءة والاستماع.",
    images: ["/og-quran.jpg"],
  },
  alternates: {
    canonical: "/quran",
  },
  other: {
    "arabic-content": "true",
    "content-language": "ar",
  },
};

export default function QuranPage() {
  return <QuranPageClient />;
}
