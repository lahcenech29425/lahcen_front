import type { ImageType } from "@/types/image";

export type BookCategory =
    | "القرآن الكريم"
    | "الحديث الشريف"
    | "العقيدة"
    | "الفقه"
    | "السيرة"
    | "التزكية"
    | "الدعوة"
    | "اللغة"
    | "الروحانيات";

export interface BookType {
    id: number | string;
    documentId?: string;
    title: string;
    author: string;
    description: string;
    category: BookCategory;
    coverImage?: ImageType | null;
    pdfFile?: {
        url: string;
        name?: string;
        size?: number;
        mime?: string;
    } | null;
    pageCount: number;
    publishedYear: number;
    slug: string;
    downloadCount?: number;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
}

// Category labels for display (already in Arabic)
export const BOOK_CATEGORIES: BookCategory[] = [
    "القرآن الكريم",
    "الحديث الشريف",
    "العقيدة",
    "الفقه",
    "السيرة",
    "التزكية",
    "الدعوة",
    "اللغة",
    "الروحانيات",
];
