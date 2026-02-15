"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, X } from "lucide-react";
import BookCard from "@/components/custom/book/BookCard";
import { normalizeBooks } from "@/components/custom/book/normalizer";
import { fetchApiWithPagination } from "@/utils/fetchApi";
import type { BookType, BookCategory } from "@/types/book";
import { BOOK_CATEGORIES } from "@/types/book";
import Breadcrumb from "@/components/elements/Breadcrumb";

const PAGE_SIZE = 12;

export default function BooksPageClient() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Fetch books with pagination
  const fetchBooks = async (
    page = 1,
    searchQuery = "",
    category: BookCategory | null = null,
  ) => {
    setIsLoading(true);
    try {
      let endpoint = `/api/books?populate=*&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`;
      const filters: string[] = [];

      if (searchQuery) {
        filters.push(
          `filters[title][$containsi]=${encodeURIComponent(searchQuery)}`,
        );
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
        setTotalBooks(pagination.total || 0);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all books on mount
  useEffect(() => {
    fetchBooks(1);
  }, []);

  // Search by title
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchBooks(1, query, selectedCategory);
  };

  // Filter by category
  const handleCategoryFilter = async (category: BookCategory | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Pagination Range Logic
  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    const withDots: (number | string)[] = [];
    let l;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          withDots.push(l + 1);
        } else if (i - l !== 1) {
          withDots.push("...");
        }
      }
      withDots.push(i);
      l = i;
    }
    return withDots;
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative w-full h-[450px] md:h-[550px] overflow-hidden bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/90"
        dir="rtl"
      >
        {/* Background Image with Fallback Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/books-header.png'), linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 50%, hsl(var(--secondary)) 100%)",
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/50" />

          {/* Decorative Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "url('/assets/bg.svg')",
              backgroundRepeat: "repeat",
              backgroundSize: "200px",
            }}
          />
        </div>

        {/* Breadcrumbs - Inside Hero, Top Aligned */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-start">
            <div className="bg-black/20 backdrop-blur-sm inline-block px-4 py-2 rounded-lg border border-white/10">
              <Breadcrumb
                items={[{ label: "المكتبة", href: "/books" }]}
                textColor="text-white"
                showHomeLabel={false}
                className="!mb-0"
              />
            </div>
          </div>
        </div>

        {/* Hero Content - Centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mt-12"
          >
            <div className="inline-flex justify-center items-center w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg mb-6 text-white">
              <BookOpen size={36} />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-momken text-white drop-shadow-lg">
              المكتبة الإسلامية
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
              مكتبة شاملة تضم كتبًا قيّمة في علوم القرآن والحديث والفقه والعقيدة
              والسيرة وغيرها، متاحة للتحميل المجاني لنشر العلم النافع.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="px-5 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{totalBooks} كتاب</span>
              </div>
              <div className="px-5 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span>{BOOK_CATEGORIES.length} تصنيف</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto py-8 px-4 mb-20 relative min-h-screen"
        dir="rtl"
      >
        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-4 z-30 mb-8 mt-8"
        >
          <div className="max-w-4xl mx-auto bg-background/90 backdrop-blur-xl border border-primary/10 shadow-xl shadow-primary/5 rounded-2xl p-2">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-2"
            >
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search size={22} />
                </div>
                <input
                  className="w-full pl-4 pr-12 py-3 bg-transparent rounded-xl focus:outline-none placeholder:text-muted-foreground text-foreground font-medium"
                  placeholder="ابحث عن كتاب..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
                >
                  بحث
                </button>
                {(query || selectedCategory) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="px-4 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/40 scale-105"
                : "bg-card shadow-md text-foreground/80 hover:bg-primary/10 hover:text-primary hover:shadow-lg"
            }`}
          >
            الكل
          </button>
          {BOOK_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-xl shadow-primary/40 scale-105"
                  : "bg-card shadow-md text-foreground/80 hover:bg-primary/10 hover:text-primary hover:shadow-lg"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Active Filters Display */}
        {(query || selectedCategory) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center justify-center gap-2 flex-wrap"
          >
            <span className="text-sm text-muted-foreground">
              الفلاتر النشطة:
            </span>
            {query && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                البحث: {query}
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                {selectedCategory}
              </span>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">جارٍ التحميل...</p>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-20 bg-card rounded-2xl shadow-lg"
          >
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">لم يتم العثور على كتب.</p>
          </motion.div>
        ) : (
          !isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {books.map((book, idx) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </div>
          )
        )}

        {/* Smart Pagination */}
        {!isLoading && books.length > 0 && totalPages > 1 && (
          <div
            className="flex justify-center items-center gap-2 py-8 select-none"
            dir="ltr"
          >
            <button
              disabled={currentPage === 1}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card shadow-md text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span className="rotate-180">→</span>
            </button>

            <div className="flex items-center gap-2">
              {getPaginationRange().map((pageNum, idx) =>
                pageNum === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground font-bold"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all font-bold text-lg ${
                      currentPage === pageNum
                        ? "bg-primary text-white shadow-xl shadow-primary/40 scale-105"
                        : "bg-card shadow-md text-foreground/80 hover:bg-primary/10 hover:text-primary hover:shadow-lg"
                    }`}
                    onClick={() =>
                      typeof pageNum === "number" && handlePageChange(pageNum)
                    }
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>

            <button
              disabled={currentPage === totalPages}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card shadow-md text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
