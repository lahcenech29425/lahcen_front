import type { Metadata } from "next";
import PrayerPageClient from "@/app/prayer-times/PrayerPageClient";

export const metadata: Metadata = {
  title: {
    absolute: "أوقات الصلاة اليوم | Prayer Times",
  },
  description:
    "أوقات الصلاة حسب موقعك الجغرافي مع العد التنازلي للصلاة القادمة، وعرض التاريخ الميلادي والهجري.",
  alternates: { canonical: "/prayer" },
  openGraph: {
    title: "أوقات الصلاة اليوم | Prayer Times",
    description:
      "أوقات الصلاة حسب موقعك الجغرافي مع العد التنازلي للصلاة القادمة، وعرض التاريخ الميلادي والهجري.",
    url: "/prayer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "أوقات الصلاة اليوم | Prayer Times",
    description:
      "أوقات الصلاة حسب موقعك الجغرافي مع العد التنازلي للصلاة القادمة، وعرض التاريخ الميلادي والهجري.",
  },
};

export default function PrayerPage() {
  return <PrayerPageClient />;
}
