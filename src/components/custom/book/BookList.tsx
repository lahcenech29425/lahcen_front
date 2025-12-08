"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BookCard from "./BookCard";
import { normalizeBooks } from "./normalizer";
import { fetchApiWithPagination } from "@/utils/fetchApi";
import type { BookType, BookCategory } from "@/types/book";
import { BOOK_CATEGORIES } from "@/types/book";
import { Search, X } from "lucide-react";

interface BookListProps {
    data: BookType[];
}

export default function BookList({ data }: BookListProps) {
    const [books, setBooks] = useState(normalizeBooks(data || []));
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<BookCategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 12; // 12 books per page

    // Fetch books with pagination
    const fetchBooks = async (page = 1, searchQuery = "", category: BookCategory | null = null) => {
        setIsLoading(true);
        try {
            let endpoint = `/api/books?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
            const filters: string[] = [];

            if (searchQuery) {
                filters.push(`filters[title][$containsi]=${encodeURIComponent(searchQuery)}`);
            }

            if (category) {
                filters.push(`filters[category][$eq]=${encodeURIComponent(category)}`);
            }

            if (filters.length > 0) {
                endpoint += `&${filters.join("&")}`;
            }

            const response = await fetchApiWithPagination(endpoint);
            const booksData = response?.data || [];
            const pagination = response?.meta?.pagination;

            setBooks(normalizeBooks(booksData));

            if (pagination) {
                setTotalPages(pagination.pageCount || 1);
                setCurrentPage(pagination.page || 1);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            setBooks([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all books on mount if no initial data
    useEffect(() => {
        if (books.length === 0) {
            fetchBooks(1);
        }
    }, []); // Run only once on mount

    // Search by title
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to page 1 on new search
        await fetchBooks(1, query, selectedCategory);
    };

    // Filter by category
    const handleCategoryFilter = async (category: BookCategory | null) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to page 1 on filter change
        await fetchBooks(1, query, category);
    };

    // Reset search and filters
    const handleReset = async () => {
        setQuery("");
        setSelectedCategory(null);
        setCurrentPage(1);
        await fetchBooks(1);
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            fetchBooks(newPage, query, selectedCategory);
            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-16 bg-gray-50 dark:bg-[#232323] min-h-screen transition-colors">
            <div className="max-w-7xl mx-auto px-4">
                {/* Navigation */}
                <nav className="mb-8 flex items-center gap-4 text-sm text-gray-900 dark:text-[#ededed]">
                    <Link href="/" className="hover:text-gray-600 transition">
                        الرئيسية
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600 font-semibold">المكتبة</span>
                </nav>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4 text-center">
                    المكتبة الإسلامية
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed text-center font-amiri max-w-2xl mx-auto">
                    مكتبة شاملة تضم كتبًا قيّمة في علوم القرآن والحديث والفقه والعقيدة والسيرة وغيرها،
                    متاحة للتحميل المجاني لنشر العلم النافع.
                </p>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto"
                >
                    <div className="relative w-full">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="ابحث عن كتاب..."
                            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-white pr-10 pl-4 py-2 text-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-700 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-primary/90 dark:hover:bg-gray-100 transition disabled:opacity-50"
                        >
                            بحث
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition disabled:opacity-50"
                        >
                            إعادة
                        </button>
                    </div>
                </form>

                {/* Category Filters */}
                <div className="mb-10 flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => handleCategoryFilter(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === null
                            ? "bg-gray-800 text-white"
                            : "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700"
                            }`}
                    >
                        الكل
                    </button>
                    {BOOK_CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryFilter(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category
                                ? "bg-gray-800 text-white"
                                : "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Active Filters Display */}
                {(query || selectedCategory) && (
                    <div className="mb-6 flex items-center justify-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-500">الفلاتر النشطة:</span>
                        {query && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                البحث: {query}
                                <button
                                    onClick={() => {
                                        setQuery("");
                                        handleCategoryFilter(selectedCategory);
                                    }}
                                    className="hover:text-gray-900"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {selectedCategory && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {selectedCategory}
                                <button
                                    onClick={() => handleCategoryFilter(null)}
                                    className="hover:text-gray-900"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-10">
                        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Books Grid */}
                {!isLoading && books.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-20">
                        لم يتم العثور على كتب.
                    </div>
                ) : (
                    !isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {books.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    )
                )}

                {/* Pagination Controls */}
                {!isLoading && books.length > 0 && totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            السابق
                        </button>

                        {/* Page Numbers */}
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                // Show first page, last page, current page, and pages around current
                                const showPage =
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1);

                                if (!showPage) {
                                    // Show ellipsis
                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                        return (
                                            <span
                                                key={page}
                                                className="px-3 py-2 text-gray-500 dark:text-gray-400"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                }

                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded-lg transition ${currentPage === page
                                            ? "bg-gray-800 dark:bg-white text-white dark:text-gray-900 font-semibold"
                                            : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            التالي
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
