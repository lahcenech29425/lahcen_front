"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, BookOpen, FileText, BookMarked, Loader2 } from "lucide-react";
import { Link } from "@/components/elements/Link";
import {
    searchQuranVerses,
    searchHadith,
    searchBooks,
    searchArticles,
    HadithSearchResult,
} from "@/utils/globalSearch";
import { QuranSearchResult } from "@/utils/quranApi";
import type { BookType } from "@/types/book";
import type { BlogType } from "@/types/blog";
import { getSurahSlug } from "@/utils/surahHelpers";

interface GlobalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
    const [query, setQuery] = useState("");
    const [quranResults, setQuranResults] = useState<QuranSearchResult[]>([]);
    const [hadithResults, setHadithResults] = useState<HadithSearchResult[]>([]);
    const [bookResults, setBookResults] = useState<BookType[]>([]);
    const [articleResults, setArticleResults] = useState<BlogType[]>([]);

    const [loading, setLoading] = useState({
        quran: false,
        hadith: false,
        books: false,
        articles: false,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    // Debounced search
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery || searchQuery.length < 2) {
            setQuranResults([]);
            setHadithResults([]);
            setBookResults([]);
            setArticleResults([]);
            return;
        }

        // Search Quran
        setLoading((prev) => ({ ...prev, quran: true }));
        searchQuranVerses(searchQuery).then((results) => {
            setQuranResults(results);
            setLoading((prev) => ({ ...prev, quran: false }));
        });

        // Search Hadith
        setLoading((prev) => ({ ...prev, hadith: true }));
        searchHadith(searchQuery).then((results) => {
            setHadithResults(results);
            setLoading((prev) => ({ ...prev, hadith: false }));
        });

        // Search Books
        setLoading((prev) => ({ ...prev, books: true }));
        searchBooks(searchQuery).then((results) => {
            setBookResults(results);
            setLoading((prev) => ({ ...prev, books: false }));
        });

        // Search Articles
        setLoading((prev) => ({ ...prev, articles: true }));
        searchArticles(searchQuery).then((results) => {
            setArticleResults(results);
            setLoading((prev) => ({ ...prev, articles: false }));
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        // Debounce search
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            performSearch(value);
        }, 300);
    };

    // Clear search and close
    const handleClose = () => {
        setQuery("");
        setQuranResults([]);
        setHadithResults([]);
        setBookResults([]);
        setArticleResults([]);
        onClose();
    };

    // Handle click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Check if any results exist
    const hasResults =
        quranResults.length > 0 ||
        hadithResults.length > 0 ||
        bookResults.length > 0 ||
        articleResults.length > 0;

    const isAnyLoading =
        loading.quran || loading.hadith || loading.books || loading.articles;

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[99998] flex items-start justify-center pt-20 px-4 transition-all"
            style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-border"
                dir="rtl"
            >
                {/* Search Input */}
                <div className="p-4 border-b border-border">
                    <div className="relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            placeholder="ابحث في القرآن، الأحاديث، الكتب، المقالات..."
                            className="w-full pr-12 pl-12 py-3 text-lg border-0 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-600"
                            autoComplete="off"
                        />
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery("");
                                    setQuranResults([]);
                                    setHadithResults([]);
                                    setBookResults([]);
                                    setArticleResults([]);
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {/* Empty State */}
                    {!query && (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p>ابدأ بالكتابة للبحث في محتوى الموقع</p>
                            <p className="text-sm mt-2 text-gray-400 dark:text-gray-500">القرآن الكريم • الأحاديث • الكتب • المقالات</p>
                        </div>
                    )}

                    {/* Loading State (initial) */}
                    {query && query.length >= 2 && isAnyLoading && !hasResults && (
                        <div className="p-8 text-center">
                            <Loader2 size={32} className="mx-auto mb-4 text-gray-400 animate-spin" />
                            <p className="text-gray-500 dark:text-gray-400">جاري البحث...</p>
                        </div>
                    )}

                    {/* No Results */}
                    {query && query.length >= 2 && !isAnyLoading && !hasResults && (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <p>لم يتم العثور على نتائج لـ &quot;{query}&quot;</p>
                        </div>
                    )}

                    {/* Quran Results */}
                    {(quranResults.length > 0 || loading.quran) && (
                        <div className="border-b border-border">
                            <div className="px-4 py-2 bg-secondary/50 flex items-center gap-2">
                                <BookOpen size={18} className="text-emerald-600 dark:text-emerald-500" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">القرآن الكريم</span>
                                {loading.quran && <Loader2 size={14} className="animate-spin text-gray-400" />}
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-[#2a2a2a]">
                                {quranResults.map((result) => (
                                    <Link
                                        key={result.number}
                                        href={`/quran/${getSurahSlug({ englishName: result.surah.englishName, number: result.surah.number } as { englishName: string; number: number })}/${result.numberInSurah}`}
                                        className="block px-4 py-3 hover:bg-secondary transition"
                                        onClick={handleClose}
                                    >
                                        <p className="text-gray-800 dark:text-gray-200 font-arabic line-clamp-2">{result.text}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {result.surah.name} - الآية {result.numberInSurah}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hadith Results */}
                    {(hadithResults.length > 0 || loading.hadith) && (
                        <div className="border-b border-border">
                            <div className="px-4 py-2 bg-secondary/50 flex items-center gap-2">
                                <BookMarked size={18} className="text-amber-600 dark:text-amber-500" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">الأحاديث</span>
                                {loading.hadith && <Loader2 size={14} className="animate-spin text-gray-400" />}
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-[#2a2a2a]">
                                {hadithResults.map((result) => (
                                    <Link
                                        key={result.id}
                                        href="/hadith"
                                        className="block px-4 py-3 hover:bg-secondary transition"
                                        onClick={handleClose}
                                    >
                                        <p className="text-gray-800 dark:text-gray-200 line-clamp-2">{result.text}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {result.bookSlug === "sahih-bukhari" ? "صحيح البخاري" : result.bookSlug} - حديث {result.number}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Books Results */}
                    {(bookResults.length > 0 || loading.books) && (
                        <div className="border-b border-border">
                            <div className="px-4 py-2 bg-secondary/50 flex items-center gap-2">
                                <BookOpen size={18} className="text-blue-600 dark:text-blue-500" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">المكتبة</span>
                                {loading.books && <Loader2 size={14} className="animate-spin text-gray-400" />}
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-[#2a2a2a]">
                                {bookResults.map((book) => (
                                    <Link
                                        key={book.id}
                                        href={`/books/${book.slug}`}
                                        className="block px-4 py-3 hover:bg-secondary transition"
                                        onClick={handleClose}
                                    >
                                        <p className="text-gray-800 dark:text-gray-200 font-semibold">{book.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Articles Results */}
                    {(articleResults.length > 0 || loading.articles) && (
                        <div>
                            <div className="px-4 py-2 bg-secondary/50 flex items-center gap-2">
                                <FileText size={18} className="text-purple-600 dark:text-purple-500" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">المقالات</span>
                                {loading.articles && <Loader2 size={14} className="animate-spin text-gray-400" />}
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-[#2a2a2a]">
                                {articleResults.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/blogs/${article.slug}`}
                                        className="block px-4 py-3 hover:bg-secondary transition"
                                        onClick={handleClose}
                                    >
                                        <p className="text-gray-800 dark:text-gray-200 font-semibold">{article.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                            {article.content.replace(/[#*]/g, "").slice(0, 80)}...
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border bg-secondary/30 flex items-center justify-between text-xs text-muted-foreground">
                    <span>اضغط ESC للإغلاق</span>
                    <span>⌘K للبحث السريع</span>
                </div>
            </div>
        </div>
    );
}
