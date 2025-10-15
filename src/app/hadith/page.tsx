import { Metadata } from "next";
import HadithPageClient from "./HadithPageClient";

export const metadata: Metadata = {
  title: "الحديث الشريف | تصفح كتب الحديث النبوي الشريف",
  description:
    "تصفح كتب الحديث النبوي الشريف مع إمكانية البحث في النصوص والأرقام. صحيح البخاري، صحيح مسلم، سنن أبي داود، الترمذي، ابن ماجه، النسائي وغيرها.",
  keywords:
    "حديث, الحديث النبوي, صحيح البخاري, صحيح مسلم, سنن أبي داود, الترمذي, ابن ماجه, النسائي, أحاديث نبوية",
  authors: [{ name: "لحسن", url: "https://www.lahcenway.com" }],
  robots: "index, follow",
  openGraph: {
    title: "الحديث الشريف | تصفح كتب الحديث النبوي",
    description:
      "تصفح كتب الحديث النبوي الشريف مع إمكانية البحث في النصوص والأرقام",
    url: "https://www.lahcenway.com/hadith",
    siteName: "لحسن",
    locale: "ar-SA",
    type: "website",
    images: [
      {
        url: "https://www.lahcenway.com/og-hadith.jpg",
        width: 1200,
        height: 630,
        alt: "الحديث الشريف",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "الحديث الشريف | تصفح كتب الحديث النبوي",
    description:
      "تصفح كتب الحديث النبوي الشريف مع إمكانية البحث في النصوص والأرقام",
    images: ["https://www.lahcenway.com/og-hadith.jpg"],
  },
  alternates: {
    canonical: "https://www.lahcenway.com/hadith",
  },
};

export default function HadithPage() {
  return <HadithPageClient />;
}
