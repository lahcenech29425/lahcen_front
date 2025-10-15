import BlogList from "@/components/custom/blog/BlogList";
import { fetchApi } from "@/utils/fetchApi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مقالات وخواطر | لحسن",
  description:
    "اقرأ مقالات إسلامية وخواطر إيمانية تثري الروح وتُعمّق الفهم الديني. مواضيع متنوعة في العقيدة والعبادة والأخلاق.",
  keywords: [
    "مقالات إسلامية",
    "خواطر دينية",
    "مقالات دعوية",
    "كتابات إسلامية",
    "موضوعات دينية",
    "تربية إسلامية",
  ],
  authors: [{ name: "لحسن", url: "https://www.lahcenway.com" }],
  robots: "index, follow",
  openGraph: {
    title: "مقالات وخواطر | مقالات إسلامية وخواطر إيمانية",
    description:
      "اقرأ مقالات إسلامية وخواطر إيمانية تثري الروح وتُعمّق الفهم الديني. مواضيع متنوعة في العقيدة والعبادة والأخلاق.",
    url: "https://www.lahcenway.com/blogs",
    siteName: "لحسن",
    locale: "ar-SA",
    type: "website",
    images: [
      {
        url: "https://www.lahcenway.com/og-blogs.jpg",
        width: 1200,
        height: 630,
        alt: "مقالات وخواطر إسلامية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مقالات وخواطر | مقالات إسلامية وخواطر إيمانية",
    description:
      "اقرأ مقالات إسلامية وخواطر إيمانية تثري الروح وتُعمّق الفهم الديني",
    images: ["https://www.lahcenway.com/og-blogs.jpg"],
  },
  alternates: {
    canonical: "https://www.lahcenway.com/blogs",
  },
};

export default async function BlogPage() {
  // Récupérer tous les blogs côté serveur
  const data = await fetchApi("/api/blogs?populate=*");

  return <BlogList data={data} />;
}
