import { fetchHadiths } from "./hadithApi";
import { searchQuran, QuranSearchResult } from "./quranApi";

// Types for search results
export interface SearchResults {
    quran: QuranSearchResult[];
    hadith: HadithSearchResult[];
    isLoading: {
        quran: boolean;
        hadith: boolean;
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
    isLoading: {
        quran: false,
        hadith: false,
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

// Unified search across all sources
export async function globalSearch(query: string): Promise<Omit<SearchResults, 'isLoading'>> {
    if (!query || query.length < 2) {
        return {
            quran: [],
            hadith: [],
        };
    }

    // Execute all searches in parallel
    const [quran, hadith] = await Promise.all([
        searchQuranVerses(query),
        searchHadith(query),
    ]);

    return {
        quran,
        hadith,
    };
}
