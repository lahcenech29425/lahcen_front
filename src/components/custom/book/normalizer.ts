import type { BookType } from "@/types/book";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";
import { ImageType } from "@/types/image";

/**
 * Normalize PDF file data from Strapi
 */
function normalizePdfFile(pdf: Record<string, unknown> | null | undefined) {
    if (!pdf) return null;
    let url = (pdf.url as string) || "";
    // Add domain if url is relative
    if (url && url.startsWith("/")) {
        url = `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
    }
    return {
        url,
        name: (pdf.name as string) || undefined,
        size: (pdf.size as number) || undefined,
        mime: (pdf.mime as string) || undefined,
    };
}

/**
 * Normalize a single book from Strapi API response
 */
export function normalizeBook(data: Record<string, unknown>): BookType {
    return {
        id: data.id as number | string,
        documentId: data.documentId as string | undefined,
        title: data.title as string,
        author: data.author as string,
        description: data.description as string,
        category: data.category as BookType["category"],
        coverImage: normalizeImage(data.coverImage as ImageType | null),
        pdfFile: normalizePdfFile(data.pdfFile as Record<string, unknown> | null),
        pageCount: data.pageCount as number,
        publishedYear: data.publishedYear as number,
        slug: data.slug as string,
        downloadCount: (data.downloadCount as number) || 0,
        createdAt: data.createdAt as string | undefined,
        updatedAt: data.updatedAt as string | undefined,
        publishedAt: data.publishedAt as string | undefined,
    };
}

/**
 * Normalize an array of books
 */
export function normalizeBooks(books: BookType[] | Record<string, unknown>[]): BookType[] {
    if (!Array.isArray(books)) return [];

    // If already BookType[], return as is
    if (books.length > 0 && 'title' in books[0] && 'author' in books[0]) {
        return books as BookType[];
    }

    // Otherwise normalize from Record<string, unknown>[]
    return (books as Record<string, unknown>[]).map(normalizeBook);
}
