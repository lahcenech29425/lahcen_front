import BookList from "@/components/custom/book/BookList";
import { fetchApi } from "@/utils/fetchApi";
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
        url: "https://www.lahcenway.com/books",
        siteName: "لحسن",
        locale: "ar-SA",
        type: "website",
        images: [
            {
                url: "https://www.lahcenway.com/og-books.jpg",
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
        images: ["https://www.lahcenway.com/og-books.jpg"],
    },
    alternates: {
        canonical: "https://www.lahcenway.com/books",
    },
};

export default async function BooksPage() {
    // Fetch all books from Strapi
    const response = await fetchApi("/api/books?populate=*");
    const books = response?.data || [];

    return <BookList data={books} />;
}
