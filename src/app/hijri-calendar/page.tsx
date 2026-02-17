import type { Metadata } from "next";
import HijriCalendarClient from "./HijriCalendarClient";

export const metadata: Metadata = {
    title: "التقويم الهجري | Hijri Calendar",
    description:
        "تقويم هجري شامل مع المناسبات الإسلامية والأعياد والأيام المباركة. تحويل بين التواريخ الهجرية والميلادية.",
    keywords: [
        "التقويم الهجري",
        "تقويم هجري",
        "المناسبات الإسلامية",
        "الأعياد الإسلامية",
        "hijri calendar",
        "islamic calendar",
        "islamic holidays",
        "رمضان",
        "عيد الفطر",
        "عيد الأضحى",
    ],
    alternates: { canonical: "/hijri-calendar" },
    openGraph: {
        title: "التقويم الهجري | Hijri Calendar",
        description:
            "تقويم هجري شامل مع المناسبات الإسلامية والأعياد والأيام المباركة.",
        url: "/hijri-calendar",
        siteName: "سِرَاجٌ يُضِيءُالدَّرْبَ",
        locale: "ar_SA",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "التقويم الهجري",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "التقويم الهجري | Hijri Calendar",
        description:
            "تقويم هجري شامل مع المناسبات الإسلامية والأعياد والأيام المباركة.",
        images: ["/og-image.jpg"],
    },
};

export default function HijriCalendarPage() {
    return <HijriCalendarClient />;
}
