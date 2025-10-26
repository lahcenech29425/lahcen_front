import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/blocks/header/Header";
import Footer from "@/components/blocks/footer/Footer";
import { fetchApi } from "@/utils/fetchApi";
import AnnouncementBar from "@/components/blocks/announcement_bar/AnnouncementBar";
import GoToTop from "@/components/elements/GoToTop";
import SocialMediaBar from "@/components/blocks/social/SocialMediaBar";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lahcenway.com"),
  title: {
    default: "سِرَاجٌ يُضِيءُالدَّرْبَ",
    template: "%s",
  },
  description:
    "نُؤْمِنُ بِأَنَّ الْكَلِمَةَ الطَّيِّبَةَ صَدَقَةٌ جَارِيَةٌ — منصة قرآنية ومحتوى دعوي: تلاوات، أحاديث، ومقالات تربوية.",
  keywords: [
    "قرآن",
    "القرآن الكريم",
    "الحديث الشريف",
    "مقالات إسلامية",
    "تلاوات",
    "سراج",
  ],
  authors: [{ name: "لحسن", url: "https://www.lahcenway.com" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  openGraph: {
    title: "سِرَاجٌ يُضِيءُالدَّرْبَ",
    description:
      "منصة إسلامية متكاملة تُمكّنك من قراءة القرآن الكريم واستماعه، والتأمل في الأحاديث النبوية الشريفة، وقراءة مقالات دينية نافعة تثري الروح وتُعمّق الفهم الديني.",
    url: "https://www.lahcenway.com",
    siteName: "لحسن",
    images: [
      {
        url: "https://www.lahcenway.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "سِرَاجٌ يُضِيءُالدَّرْبَ",
      },
    ],
    locale: "ar-SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "سِرَاجٌ يُضِيءُالدَّرْبَ",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.lahcenway.com/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const header = await fetchApi(
    "/api/header?populate[logo][populate]=*&populate[menu][populate]=*&populate[cta][populate]=*"
  );
  const footer = await fetchApi(
    "/api/footer?populate=logo.image&populate=menu.links&populate=socialLinks.icon&populate=contact.icon"
  );
  const announcementBar = await fetchApi("/api/announcement-bar");
  const showGoToTop = footer?.showGoToTop ?? false;

  const matchedPath = (await headers()).get("x-matched-path") || "";
  const isNotFoundRoute =
    matchedPath === "/not-found" ||
    matchedPath === "/404" ||
    matchedPath.toLowerCase().includes("not-found") ||
    matchedPath === "ss";
  return (
    <html lang="ar" dir="rtl">
      <head>
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
        <link rel="icon" href="/favicon.ico" />{" "}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />{" "}
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />{" "}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />{" "}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isNotFoundRoute && <AnnouncementBar data={announcementBar} />}
        {!isNotFoundRoute && <Header data={header} />}
        <SocialMediaBar />
        {children}
        {!isNotFoundRoute && <Footer data={footer} />}
        {!isNotFoundRoute && showGoToTop && <GoToTop />}
      </body>
    </html>
  );
}
