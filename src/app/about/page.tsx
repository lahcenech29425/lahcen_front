import AboutPageClient from "./AboutPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | تعرّف على سِرَاجٌ يُضِيءُالدَّرْبَ",
  description:
    "تعرّف على منصة سِرَاجٌ يُضِيءُالدَّرْبَ — مشروع دعوي إسلامي يهدف إلى نشر القرآن الكريم والأحاديث النبوية والمقالات الإسلامية النافعة.",
  keywords: ["من نحن", "سراج يضيء الدرب", "لحسن", "مشروع دعوي", "منصة إسلامية"],
  openGraph: {
    title: "من نحن | سِرَاجٌ يُضِيءُالدَّرْبَ",
    description:
      "تعرّف على منصة سِرَاجٌ يُضِيءُالدَّرْبَ — مشروع دعوي إسلامي يهدف إلى نشر العلم الشرعي النافع.",
    url: "/about",
    siteName: "سِرَاجٌ يُضِيءُالدَّرْبَ",
    locale: "ar_SA",
    type: "profile",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "من نحن — سِرَاجٌ يُضِيءُالدَّرْبَ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "من نحن | سِرَاجٌ يُضِيءُالدَّرْبَ",
    description: "تعرّف على منصة سِرَاجٌ يُضِيءُالدَّرْبَ — مشروع دعوي إسلامي",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
