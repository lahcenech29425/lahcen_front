import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/blocks/header/Header";
import Footer from "@/components/blocks/footer/Footer";
import { fetchApi } from "@/utils/fetchApi";
import AnnouncementBar from "@/components/blocks/announcement_bar/AnnouncementBar";
import GoToTop from "@/components/elements/GoToTop";

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
    // titre exact demandé (avec saut de ligne)
    default:
      "سِرَاجٌ يُضِيءُالدَّرْبَ\nنُورٌ لِلرُّوحِ... وَسَكِينَةٌ لِلْقَلْبِ",
    template: "%s | لحسن",
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
      "منصة تتيح قراءة واستماع القرآن، الاطلاع على الأحاديث، وقراءة مقالات دينية نفعية.",
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
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnnouncementBar data={announcementBar} />
        <Header data={header} />
        {children}
        <Footer data={footer} />
        {showGoToTop && <GoToTop />}
      </body>
    </html>
  );
}
