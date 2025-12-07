import { fetchApi } from "./fetchApi";
import { fetchHadiths } from "./hadithApi";
import { searchQuran, QuranSearchResult } from "./quranApi";
import { normalizeBooks } from "@/components/custom/book/normalizer";
import { normalizeBlogs } from "@/components/custom/blog/normalizer";
import type { BookType } from "@/types/book";
import type { BlogType } from "@/types/blog";

// Types for search results
export interface SearchResults {
    quran: QuranSearchResult[];
    hadith: HadithSearchResult[];
    books: BookType[];
    articles: BlogType[];
    isLoading: {
        quran: boolean;
        hadith: boolean;
        books: boolean;
        articles: boolean;
    };
}

export interface HadithSearchResult {
    id: number;
    number: string;
    text: string;
    bookSlug: string;
    heading?: string;
}

// Initial empty state
export const emptySearchResults: SearchResults = {
    quran: [],
    hadith: [],
    books: [],
    articles: [],
    isLoading: {
        quran: false,
        hadith: false,
        books: false,
        articles: false,
    },
};

// Search Quran
export async function searchQuranVerses(query: string): Promise<QuranSearchResult[]> {
    if (!query || query.length < 2) return [];
    return searchQuran(query);
}

// Search Hadith
export async function searchHadith(query: string): Promise<HadithSearchResult[]> {
    if (!query || query.length < 2) return [];

    try {
        // Search in Sahih Bukhari for now (most popular)
        const results = await fetchHadiths({
            book: "sahih-bukhari",
            search: query,
            pageSize: 5,
        });
        return results.map((h) => ({
            id: h.id,
            number: h.number,
            text: h.text,
            bookSlug: h.bookSlug,
            heading: h.heading,
        }));
    } catch (error) {
        console.error("Error searching hadith:", error);
        return [];
    }
}

// Search Books in Strapi
export async function searchBooks(query: string): Promise<BookType[]> {
    if (!query || query.length < 2) return [];

    try {
        const encodedQuery = encodeURIComponent(query);
        const res = await fetchApi(
            `/api/books?filters[title][$containsi]=${encodedQuery}&populate=*&pagination[limit]=5`
        );
        return normalizeBooks(res || []);
    } catch (error) {
        console.error("Error searching books:", error);
        return [];
    }
}

// Search Articles in Strapi
export async function searchArticles(query: string): Promise<BlogType[]> {
    if (!query || query.length < 2) return [];

    try {
        const encodedQuery = encodeURIComponent(query);
        const res = await fetchApi(
            `/api/blogs?filters[title][$containsi]=${encodedQuery}&populate=*&pagination[limit]=5`
        );
        return normalizeBlogs(res || []);
    } catch (error) {
        console.error("Error searching articles:", error);
        return [];
    }
}

// Unified search across all sources
export async function globalSearch(query: string): Promise<Omit<SearchResults, 'isLoading'>> {
    if (!query || query.length < 2) {
        return {
            quran: [],
            hadith: [],
            books: [],
            articles: [],
        };
    }

    // Execute all searches in parallel
    const [quran, hadith, books, articles] = await Promise.all([
        searchQuranVerses(query),
        searchHadith(query),
        searchBooks(query),
        searchArticles(query),
    ]);

    return {
        quran,
        hadith,
        books,
        articles,
    };
}
