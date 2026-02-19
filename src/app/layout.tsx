import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Poppins, Lateef, Noto_Naskh_Arabic } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/blocks/header/Header";
import Footer from "@/components/blocks/footer/Footer";
import AnnouncementBar from "@/components/blocks/announcement_bar/AnnouncementBar";
import GoToTop from "@/components/elements/GoToTop";
import SocialMediaBar from "@/components/blocks/social/SocialMediaBar";
import { headers } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const lateef = Lateef({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["arabic"],
  variable: "--font-lateef",
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-naskh-arabic",
  display: "swap",
});

const thuluth = localFont({
  src: [
    {
      path: "../../public/fonts/AThuluthRegular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-thuluth",
  display: "swap",
});

const momken = localFont({
  src: [
    {
      path: "../../public/fonts/KoMomken-Regular.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-momken",
  display: "swap",
});

const amiri = localFont({
  src: [
    {
      path: "../../public/fonts/Amiri-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-amiri",
  display: "swap",
});

const warshQuran = localFont({
  src: [
    {
      path: "../../public/fonts/Almaghribi Warsh-Quran.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-warsh-quran",
  display: "swap",
});

const elgharibHafs = localFont({
  src: [
    {
      path: "../../public/fonts/Elgharib-HAFSTharwatEmara.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-elgharib-hafs",
  display: "swap",
});

const kfgqpcWarsh = localFont({
  src: [
    {
      path: "../../public/fonts/KFGQPC-Warsh V2-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-kfgqpc-warsh",
  display: "swap",
});

const kfgqpcHafs = localFont({
  src: [
    {
      path: "../../public/fonts/KFGQPC-HAFS Uthmanic-V22.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-kfgqpc-hafs",
  display: "swap",
});

const surahName = localFont({
  src: [
    {
      path: "../../public/fonts/Surah Name Ejazah @Am9li9.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-surah-name",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lahcenway.com"),
  title: {
    default: "سِرَاجٌ يُضِيءُالدَّرْبَ — منصة إسلامية شاملة",
    template: "%s | سِرَاجٌ يُضِيءُالدَّرْبَ",
  },
  description:
    "منصة إسلامية متكاملة لقراءة القرآن الكريم برواية حفص وورش، والاستماع للتلاوات، وتصفح الأحاديث النبوية، ومطالعة المقالات الدينية والكتب الإسلامية. نُؤْمِنُ بِأَنَّ الْكَلِمَةَ الطَّيِّبَةَ صَدَقَةٌ جَارِيَةٌ.",
  keywords: [
    "قرآن",
    "القرآن الكريم",
    "قراءة القرآن",
    "استماع القرآن",
    "تلاوة القرآن",
    "الحديث الشريف",
    "الأحاديث النبوية",
    "مقالات إسلامية",
    "كتب إسلامية",
    "أوقات الصلاة",
    "تفسير القرآن",
    "رواية حفص",
    "رواية ورش",
    "سراج يضيء الدرب",
    "Quran",
    "Quran online",
    "Islamic articles",
    "Hadith",
    "Prayer times",
  ],
  authors: [{ name: "لحسن", url: "https://www.lahcenway.com" }],
  creator: "لحسن",
  publisher: "سِرَاجٌ يُضِيءُالدَّرْبَ",
  category: "religion",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  openGraph: {
    title: "سِرَاجٌ يُضِيءُالدَّرْبَ — منصة إسلامية شاملة",
    description:
      "منصة إسلامية متكاملة تُمكّنك من قراءة القرآن الكريم واستماعه، والتأمل في الأحاديث النبوية الشريفة، وقراءة مقالات دينية نافعة تثري الروح وتُعمّق الفهم الديني.",
    url: "https://www.lahcenway.com",
    siteName: "سِرَاجٌ يُضِيءُالدَّرْبَ",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "سِرَاجٌ يُضِيءُالدَّرْبَ — منصة إسلامية شاملة",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "سِرَاجٌ يُضِيءُالدَّرْبَ — منصة إسلامية شاملة",
    description:
      "منصة إسلامية متكاملة لقراءة القرآن الكريم والاستماع للتلاوات وتصفح الأحاديث والمقالات الدينية",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const matchedPath = (await headers()).get("x-matched-path") || "";
  const isNotFoundRoute =
    matchedPath === "/not-found" ||
    matchedPath === "/404" ||
    matchedPath.toLowerCase().includes("not-found") ||
    matchedPath === "ss";

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <GoogleAnalytics gaId="G-0KRYV6CWTN" />
        {/* JSON-LD Structured Data - WebSite + Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://www.lahcenway.com/#website",
                  url: "https://www.lahcenway.com",
                  name: "سِرَاجٌ يُضِيءُالدَّرْبَ",
                  description:
                    "منصة إسلامية متكاملة لقراءة القرآن الكريم والاستماع للتلاوات وتصفح الأحاديث والمقالات الدينية",
                  inLanguage: "ar",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate:
                        "https://www.lahcenway.com/quran?search={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.lahcenway.com/#organization",
                  name: "سِرَاجٌ يُضِيءُالدَّرْبَ",
                  url: "https://www.lahcenway.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://www.lahcenway.com/og-image.jpg",
                    width: 1200,
                    height: 630,
                  },
                  sameAs: [],
                },
              ],
            }),
          }}
        />
        {/* AdSense Script - Optimized loading */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4133177659377237"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Inject dark mode script before CSS for instant theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    }
  } catch(e){}
})();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${lateef.variable} ${notoNaskhArabic.variable} ${thuluth.variable} ${momken.variable} ${amiri.variable} ${warshQuran.variable} ${elgharibHafs.variable} ${kfgqpcWarsh.variable} ${kfgqpcHafs.variable} ${surahName.variable} antialiased flex flex-col min-h-screen`}
      >
        {!isNotFoundRoute && <AnnouncementBar />}
        {!isNotFoundRoute && <Header />}
        <SocialMediaBar />
        <main className="flex-1 min-h-[calc(100vh-200px)]">{children}</main>
        {!isNotFoundRoute && <Footer />}
        {!isNotFoundRoute && <GoToTop />}
      </body>
    </html>
  );
}
