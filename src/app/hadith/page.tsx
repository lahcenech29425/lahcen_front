"use client";
import { useEffect, useState, useRef } from "react";
import {
  fetchHadithBooks,
  fetchChapters,
  fetchHadiths,
} from "@/utils/hadithApi";
import Link from "next/link";
import * as htmlToImage from "html-to-image";
import { HadithCard } from "@/components/elements/HadithCard";
import type { Hadith } from "@/types/Hadith";

const PAGE_SIZE = 10;

export default function HadithPage() {
  const [books, setBooks] = useState<{ slug: string; name: string }[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [chapters, setChapters] = useState<{
    number: string | number | readonly string[] | undefined; id: string; name: string 
}[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load books on mount
  useEffect(() => {
    fetchHadithBooks().then((books) => {
      setBooks(books);
      if (books.length) setSelectedBook(books[0].slug);
    });
  }, []);

  // Load chapters when book changes
  useEffect(() => {
    if (selectedBook) {
      fetchChapters(selectedBook).then((chapters) => {
        setChapters(chapters);
        setSelectedChapter("");
      });
    }
  }, [selectedBook]);
  // Load hadiths when filters change
  useEffect(() => {
    if (!selectedBook) return;
    setLoading(true);
    fetchHadiths({
      book: selectedBook,
      chapter: selectedChapter || undefined,
      search: search || undefined,
      page,
      pageSize: PAGE_SIZE,
    })
      .then(setHadiths)
      .finally(() => setLoading(false));
  }, [selectedBook, selectedChapter, search, page]);

  const handleDownload = async (idx: number) => {
    const card = cardRefs.current[idx];
    if (card) {
      const dataUrl = await htmlToImage.toPng(card);
      const link = document.createElement("a");
      link.download = `hadith-${hadiths[idx].number}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4" dir="rtl">
      {/* Navigation */}
      <nav className="mb-8 flex items-center gap-4 text-sm text-[#171717]">
        <Link href="/" className="hover:text-primary transition">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-primary font-semibold">الحديث الشريف</span>
      </nav>
      {/* Title & intro */}
      <h1 className="text-3xl font-bold mb-2 text-[#171717] text-center">
        الحديث الشريف
      </h1>
      <p className="text-center text-[#171717] mb-8 max-w-2xl mx-auto">
        تصفح كتب الحديث، اختر الكتاب والفصل، أو ابحث في نص الحديث.
      </p>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
        {/* Book selector */}
        <div className="relative w-full md:w-64">
          <select
            className="appearance-none border border-[#bdbdbd] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#171717] transition bg-white pr-10 text-[#171717]"
            value={selectedBook}
            onChange={(e) => {
              setSelectedBook(e.target.value);
              setPage(1);
            }}
          >
            {books.map((book) => (
              <option key={book.slug} value={book.slug}>
                {book.name}
              </option>
            ))}
          </select>
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#171717]"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {/* Chapter selector */}
        <div className="relative w-full md:w-64">
          <select
            className="appearance-none border border-[#bdbdbd] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#171717] transition bg-white pr-10 text-[#171717]"
            value={selectedChapter}
            onChange={(e) => {
              setSelectedChapter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">كل الفصول</option>
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.number}>
                {ch.name}
              </option>
            ))}
          </select>
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#171717]"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            className="border border-[#bdbdbd] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#171717] transition bg-white text-[#171717]"
            placeholder="ابحث في نص الحديث..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            dir="rtl"
            autoComplete="off"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>
      {/* Hadiths list */}
      <div className="space-y-8 mt-8">
        {loading ? (
          <div className="text-center text-[#a67c52] py-10">
            جاري التحميل...
          </div>
        ) : (
          hadiths.map((h, idx) => (
            <HadithCard
              key={h.id}
              hadith={h}
              idx={idx}
              cardRefs={cardRefs}
              onDownload={handleDownload}
            />
          ))
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        {page > 1 && (
          <button
            className="px-4 py-2 border border-[#e2c9a5] rounded-lg bg-white hover:bg-[#f5ecd7] transition text-[#5c4327]"
            onClick={() => setPage(page - 1)}
          >
            السابق
          </button>
        )}
        <span className="px-4 py-2 rounded-lg bg-[#a67c52] text-white font-semibold shadow">
          {page}
        </span>
        {hadiths.length === PAGE_SIZE && (
          <button
            className="px-4 py-2 border border-[#e2c9a5] rounded-lg bg-white hover:bg-[#f5ecd7] transition text-[#5c4327]"
            onClick={() => setPage(page + 1)}
          >
            التالي
          </button>
        )}
      </div>
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeInUp 0.5s forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(20px);
          }
        }
        .font-arabic {
          font-family: "Amiri", "Scheherazade", "Noto Naskh Arabic", serif;
          font-weight: 500;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}
