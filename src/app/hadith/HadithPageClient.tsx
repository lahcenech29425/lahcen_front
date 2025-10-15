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
import type { MutableRefObject } from "react";

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
  const [loading, setLoading] = useState(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>(
    [] as (HTMLDivElement | null)[]
  );

  useEffect(() => {
    fetchHadithBooks().then((bs) => {
      setBooks(bs as BookInfo[]);
      if (Array.isArray(bs) && bs.length) {
        const first = (bs as BookInfo[])[0];
        if (first?.slug) setSelectedBook(first.slug);
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
        console.log("Raw fetched hadiths:", res);
        const list = normalizeHadiths(res);
        console.log("Fetched hadiths:", list);

        if (hadithNumber && selectedBook && selectedChapter) {
          const filtered = list.filter(
            (h) =>
              String(h.hadithNumber ?? h.number ?? h.id) ===
              String(hadithNumber)
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
              String(search.trim())
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
    <div className="max-w-4xl mx-auto py-10 px-4" dir="rtl">
      <nav className="mb-8 flex items-center gap-4 text-sm text-gray-900">
        <Link href="/" className="hover:text-gray-600 transition">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-600 font-semibold">الحديث الشريف</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
        الحديث الشريف
      </h1>
      <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
        تصفح كتب الحديث، اختر الكتاب والفصل، أو ابحث في نص الحديث أو برقم
        الحديث.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <div className="relative w-full md:w-64">
          <select
            className="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-full bg-white text-gray-700"
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

        <div className="relative w-full md:w-64">
          <select
            className="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-full bg-white text-gray-700"
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

        <div className="relative w-full md:w-80">
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white text-gray-700"
            placeholder="ابحث في نص الحديث..."
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

      {selectedBook && selectedChapter && (
        <div className="mb-6 flex justify-center">
          <div className="relative w-full md:w-64">
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white text-gray-700"
              placeholder="ابحث برقم الحديث (مثال: 1)"
              value={hadithNumber}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setHadithNumber(v);
                setPage(1);
                if (v) setSearch("");
              }}
              dir="rtl"
              autoComplete="off"
            />
          </div>
        </div>
      )}

      <div className="space-y-8 mt-8">
        {loading ? (
          <div className="text-center text-gray-600 py-10">جاري التحميل...</div>
        ) : hadiths.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            لا توجد أحاديث مطابقة.
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
                    String(ch.id) === String(chapterIdOrNum)
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

      <div className="flex justify-center gap-2 mt-10">
        {page > 1 && (
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-gray-700"
            onClick={() => setPage(page - 1)}
          >
            السابق
          </button>
        )}
        <span className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow">
          {page}
        </span>
        {hadiths.length === PAGE_SIZE && (
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 text-gray-700"
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
      `}</style>
    </div>
  );
}
