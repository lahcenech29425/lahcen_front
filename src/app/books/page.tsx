import BooksPageClient from "./BooksPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المكتبة الإسلامية | لحسن",
  description:
    "مكتبة إسلامية شاملة تضم كتبًا في القرآن والحديث والفقه والعقيدة والسيرة. تحميل مجاني للكتب الإسلامية.",
  keywords: [
    "كتب إسلامية",
    "مكتبة إسلامية",
    "تحميل كتب",
    "كتب دينية",
    "كتب القرآن",
    "كتب الحديث",
    "كتب الفقه",
  ],
  authors: [{ name: "لحسن", url: "https://www.lahcenway.com" }],
  robots: "index, follow",
  openGraph: {
    title: "المكتبة الإسلامية | كتب إسلامية للتحميل المجاني",
    description:
      "مكتبة إسلامية شاملة تضم كتبًا في القرآن والحديث والفقه والعقيدة والسيرة. تحميل مجاني للكتب الإسلامية.",
    url: "/books",
    siteName: "سِرَاجٌ يُضِيءُالدَّرْبَ",
    locale: "ar-SA",
    type: "website",
    images: [
      {
        url: "/og-books.jpg",
        width: 1200,
        height: 630,
        alt: "المكتبة الإسلامية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "المكتبة الإسلامية | كتب إسلامية للتحميل المجاني",
    description:
      "مكتبة إسلامية شاملة تضم كتبًا في القرآن والحديث والفقه والعقيدة والسيرة",
    images: ["/og-books.jpg"],
  },
  alternates: {
    canonical: "/books",
  },
};

export default function BooksPage() {
  return <BooksPageClient />;
}
