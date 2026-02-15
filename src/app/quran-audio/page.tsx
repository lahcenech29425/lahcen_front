import { Metadata } from "next";
import QuranAudioClient from "./QuranAudioClient";

export const metadata: Metadata = {
    title: "الاستماع للقرآن الكريم | مكتبة القراء والتلاوات",
    description:
        "استمع إلى القرآن الكريم بصوت أشهر القراء العالميين: عبد الباسط عبد الصمد، مشاري العفاسي، السديس والشريم وغيرهم. تلاوات مرتلة ومجودة عالية الجودة.",
    keywords: [
        "القرآن الكريم",
        "استماع القرآن",
        "تلاوة القرآن",
        "قراء القرآن",
        "عبد الباسط",
        "المصحف المرتل",
        "المصحف المجود",
        "مشاري العفاسي",
        "السديس",
        "الحصري",
    ],
    authors: [{ name: "لحسن", url: "https://www.lahcenway.com" }],
    robots: "index, follow",
    openGraph: {
        title: "الاستماع للقرآن الكريم | مكتبة القراء والتلاوات",
        description:
            "استمع إلى القرآن الكريم بصوت أشهر القراء العالميين. تلاوات مرتلة ومجودة عالية الجودة.",
        url: "https://www.lahcenway.com/quran-audio",
        siteName: "لحسن",
        locale: "ar-SA",
        type: "website",
        images: [
            {
                url: "https://www.lahcenway.com/og-quran-audio.jpg",
                width: 1200,
                height: 630,
                alt: "الاستماع للقرآن الكريم",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "الاستماع للقرآن الكريم | مكتبة القراء والتلاوات",
        description:
            "استمع إلى القرآن الكريم بصوت أشهر القراء العالميين",
        images: ["https://www.lahcenway.com/og-quran-audio.jpg"],
    },
    alternates: {
        canonical: "https://www.lahcenway.com/quran-audio",
    },
    other: {
        "arabic-content": "true",
        "content-language": "ar",
    },
};

export default function QuranAudioPage() {
    return <QuranAudioClient />;
}
