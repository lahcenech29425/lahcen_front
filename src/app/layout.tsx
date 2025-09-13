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
  title: "idech Starter Kit",
  description:
    "The idech Next.js + TypeScript starter kit for freelance projects.",
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
    <html lang='ar' dir='rtl'>
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
