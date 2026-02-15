import type { Metadata } from "next";
import PrayerPageClient from "@/app/prayer-times/PrayerPageClient";

export const metadata: Metadata = {
  title: "أوقات الصلاة اليوم | Prayer Times",
  description:
    "أوقات الصلاة حسب موقعك الجغرافي مع العد التنازلي للصلاة القادمة، وعرض التاريخ الميلادي والهجري.",
  keywords: [
    "أوقات الصلاة",
    "مواقيت الصلاة",
    "صلاة الفجر",
    "صلاة الظهر",
    "صلاة العصر",
    "صلاة المغرب",
    "صلاة العشاء",
    "prayer times",
    "salat times",
  ],
  alternates: { canonical: "/prayer-times" },
  openGraph: {
    title: "أوقات الصلاة اليوم | Prayer Times",
    description:
      "أوقات الصلاة حسب موقعك الجغرافي مع العد التنازلي للصلاة القادمة، وعرض التاريخ الميلادي والهجري.",
    url: "/prayer-times",
    siteName: "سِرَاجٌ يُضِيءُالدَّرْبَ",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "أوقات الصلاة اليوم",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أوقات الصلاة اليوم | Prayer Times",
    description:
      "أوقات الصلاة حسب موقعك الجغرافي مع العد التنازلي للصلاة القادمة، وعرض التاريخ الميلادي والهجري.",
    images: ["/og-image.jpg"],
  },
};

export default function PrayerPage() {
  return <PrayerPageClient />;
}
