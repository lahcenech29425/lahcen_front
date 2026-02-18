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
import Pagination from "@/components/elements/Pagination";
import PageHero from "@/components/blocks/hero/PageHero";
import type { MutableRefObject } from "react";
import { Search, BookOpen, Filter, Book } from "lucide-react";
import { motion } from "framer-motion";

type Chapter = {
  number: string | number | readonly string[] | undefined;
  id: string | number;
  name: string;
};

type BookInfo = { slug: string; name: string };

type HadithItem = {
  id: number | string;
  hadithNumber?: string;
  number?: string;
  text?: string;
  hadithArabic?: string;
  hadithEnglish?: string;
  chapterId?: string | number;
  bookSlug?: string;
  status?: string;
  book?: { bookName?: string; bookSlug?: string };
  chapter?: {
    chapterArabic?: string;
    chapterEnglish?: string;
    chapterNumber?: string;
  };
  headingArabic?: string | null;
  heading?: string | null;
  [key: string]: unknown;
};

const PAGE_SIZE = 10;

const STATUS_AR: Record<string, string> = {
  sahih: "صحيح",
  hasan: "حسن",
  "da`eef": "ضعيف",
  daif: "ضعيف",
  weak: "ضعيف",
  ضعيف: "ضعيف",
  حسن: "حسن",
  صحيح: "صحيح",
};

const BOOK_AR_NAMES: Record<string, string> = {
  "sahih-bukhari": "صحيح البخاري",
  "sahih-muslim": "صحيح مسلم",
  "al-tirmidhi": "جامع الترمذي",
  "abu-dawood": "سنن أبي داود",
  "ibn-e-majah": "سنن ابن ماجه",
  "sunan-nasai": "سنن النسائي",
  mishkat: "مشكات المصابيح",
  "musnad-ahmad": "مسند أحمد",
  "al-silsila-sahiha": "السلسلة الصحيحة",
};

export default function HadithPageClient() {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [search, setSearch] = useState("");
  const [hadithNumber, setHadithNumber] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const cardRefs = useRef<(HTMLDivElement | null)[]>(
    [] as (HTMLDivElement | null)[],
  );

  useEffect(() => {
    fetchHadithBooks().then((bs) => {
      setBooks(bs as BookInfo[]);
      if (Array.isArray(bs) && bs.length) {
        const first = (bs as BookInfo[])[0];
        if (first?.slug) setSelectedBook(first.slug);
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedBook) {
      setChapters([]);
      setSelectedChapter("");
      return;
    }
    fetchChapters(selectedBook).then((chs) => {
      setChapters(chs as Chapter[]);
      setSelectedChapter("");
      setHadithNumber("");
    });
  }, [selectedBook]);

  const normalizeHadiths = (res: unknown): HadithItem[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res as HadithItem[];

    if (typeof res === "object" && res !== null) {
      const obj = res as Record<string, unknown>;
      const hadithsObj = obj["hadiths"];
      if (hadithsObj && typeof hadithsObj === "object" && hadithsObj !== null) {
        const data = (hadithsObj as Record<string, unknown>)["data"];
        if (Array.isArray(data)) return data as HadithItem[];
        if (Array.isArray(hadithsObj)) return hadithsObj as HadithItem[];
      }
      const dataRoot = obj["data"];
      if (Array.isArray(dataRoot)) return dataRoot as HadithItem[];
    }

    return [];
  };

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
      .then((res) => {
        const list = normalizeHadiths(res);

        if (hadithNumber && selectedBook && selectedChapter) {
          const filtered = list.filter(
            (h) =>
              String(h.hadithNumber ?? h.number ?? h.id) ===
              String(hadithNumber),
          );
          setHadiths(filtered);
          return;
        }
        if (
          /^\d+$/.test(search) &&
          selectedBook &&
          selectedChapter &&
          !hadithNumber
        ) {
          const filtered = list.filter(
            (h) =>
              String(h.hadithNumber ?? h.number ?? h.id) ===
              String(search.trim()),
          );
          setHadiths(filtered);
          return;
        }
        setHadiths(list);
      })
      .catch((err) => {
        console.error("fetchHadiths error", err);
        setHadiths([]);
      })
      .finally(() => setLoading(false));
  }, [selectedBook, selectedChapter, search, hadithNumber, page]);

  const handleDownload = async (idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    const dataUrl = await htmlToImage.toPng(card);
    const safeBook = (
      hadiths[idx]?.book?.bookSlug ??
      hadiths[idx]?.bookSlug ??
      selectedBook ??
      "book"
    )
      .toString()
      .replace(/\s+/g, "-");
    const safeChapter = (
      hadiths[idx]?.chapter?.chapterNumber ??
      hadiths[idx]?.chapterId ??
      selectedChapter ??
      "ch"
    )
      .toString()
      .replace(/\s+/g, "-");
    const safeNumber = (
      hadiths[idx]?.hadithNumber ??
      hadiths[idx]?.number ??
      hadiths[idx]?.id ??
      idx
    ).toString();
    const link = document.createElement("a");
    link.download = `hadith-${safeBook}-${safeChapter}-${safeNumber}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background Patterns (Brown) */}
      <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] opacity-[0.04] pointer-events-none z-0 rotate-12">
        <div
          className="w-full h-full bg-primary"
          style={{
            maskImage: "url('/assets/bg.svg')",
            WebkitMaskImage: "url('/assets/bg.svg')",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      </div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] opacity-[0.04] pointer-events-none z-0 -rotate-12">
        <div
          className="w-full h-full bg-primary"
          style={{
            maskImage: "url('/assets/bg.svg')",
            WebkitMaskImage: "url('/assets/bg.svg')",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      </div>

      {/* 1. HERO SECTION */}
      <PageHero
        backgroundImage={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771248764/hadith-header_xhaqg4.png`}
        breadcrumbs={[{ label: "الحديث الشريف" }]}
        showHomeLabel={true}
        heightClass="h-[350px] md:h-[400px]"
        overlayClass="bg-black/60"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-momken text-white drop-shadow-2xl">
            الحديث الشريف
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            تصفح كتب الحديث، اختر الكتاب والفصل، أو ابحث في نص الحديث لتعميق
            فهمك للسنة النبوية.
          </p>
        </motion.div>
      </PageHero>

      {/* 2. FILTERS & SEARCH */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Book Select */}
            <div className="relative group">
              <label className="block text-xs font-bold text-primary mb-2 pr-1">
                كتاب الحديث
              </label>
              <div className="relative">
                <Book
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <select
                  className="w-full appearance-none bg-secondary/50 border border-border rounded-xl py-3 pr-10 pl-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={selectedBook}
                  onChange={(e) => {
                    setSelectedBook(e.target.value);
                    setPage(1);
                  }}
                >
                  {books.map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {BOOK_AR_NAMES[b.slug] ?? b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapter Select */}
            <div className="relative group">
              <label className="block text-xs font-bold text-primary mb-2 pr-1">
                الباب / الفصل
              </label>
              <div className="relative">
                <BookOpen
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <select
                  className="w-full appearance-none bg-secondary/50 border border-border rounded-xl py-3 pr-10 pl-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={selectedChapter}
                  onChange={(e) => {
                    setSelectedChapter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">كل الفصول</option>
                  {chapters.map((ch) => (
                    <option key={String(ch.id)} value={String(ch.number)}>
                      {ch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative group lg:col-span-1">
              <label className="block text-xs font-bold text-primary mb-2 pr-1">
                بحث نصي
              </label>
              <div className="relative">
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  className="w-full bg-secondary/50 border border-border rounded-xl py-3 pr-10 pl-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="كلمة مفتاحية..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  dir="rtl"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Number Search */}
            <div className="relative group">
              <label className="block text-xs font-bold text-primary mb-2 pr-1">
                رقم الحديث
              </label>
              <div className="relative">
                <Filter
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full bg-secondary/50 border border-border rounded-xl py-3 pr-10 pl-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="مثال: 142"
                  value={hadithNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setHadithNumber(v);
                    setPage(1);
                    if (v) setSearch("");
                  }}
                  dir="rtl"
                  autoComplete="off"
                  disabled={!selectedBook || !selectedChapter}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. CONTENT GRID */}
      <div className="container mx-auto px-4 pb-20 max-w-4xl" dir="rtl">
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-primary animate-pulse">
                جاري تحميل الأحاديث...
              </p>
            </div>
          ) : hadiths.length === 0 ? (
            <div className="text-center py-20 bg-background/50 rounded-3xl border border-dashed border-border">
              <BookOpen
                size={48}
                className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
              />
              <p className="text-gray-500 dark:text-gray-400">
                لا توجد أحاديث مطابقة للبحث.
              </p>
            </div>
          ) : (
            hadiths.map((h, idx) => {
              const rawStatus = (h.status ?? "") as string;
              const statusKey = rawStatus.trim().toLowerCase();
              const status = STATUS_AR[statusKey] ?? rawStatus ?? "";

              const bookSlug = (h.bookSlug ?? h.book?.bookSlug ?? "") as string;
              const bookApiName = (h.book?.bookName ??
                h.bookName ??
                "") as string;
              const bookName =
                (bookApiName && /[^\x00-\x7F]/.test(bookApiName)
                  ? bookApiName
                  : "") ||
                BOOK_AR_NAMES[bookSlug] ||
                books.find((b) => b.slug === bookSlug)?.name ||
                bookApiName ||
                "";

              const chapterIdOrNum = (h.chapterId ??
                h.chapterNumber ??
                h.chapter?.chapterNumber ??
                "") as string | number;
              const chapterLabel =
                ((h.chapter?.chapterArabic as string | undefined) ||
                  (h.chapter?.chapterEnglish as string | undefined) ||
                  (h.chapter?.chapterNumber as string | undefined) ||
                  chapters.find(
                    (ch) =>
                      String(ch.number) === String(chapterIdOrNum) ||
                      String(ch.id) === String(chapterIdOrNum),
                  )?.name) ??
                "";

              return (
                <HadithCard
                  key={String(h.id) ?? idx}
                  hadith={h}
                  idx={idx}
                  cardRefs={
                    cardRefs as MutableRefObject<(HTMLDivElement | null)[]>
                  }
                  onDownload={handleDownload}
                  bookName={bookName}
                  chapterLabel={chapterLabel}
                  status={status}
                />
              );
            })
          )}
        </div>

        {/* Pagination */}
        {hadiths.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={hadiths.length < PAGE_SIZE ? page : page + 1}
            onPageChange={setPage}
            className="mt-12"
          />
        )}
      </div>
    </div>
  );
}
