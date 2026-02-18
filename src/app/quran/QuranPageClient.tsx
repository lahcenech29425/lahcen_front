"use client";
import { useEffect, useState } from "react";
import { fetchSurahList } from "@/utils/quranApi";
import { Link } from "@/components/elements/Link";
import dynamic from "next/dynamic";
import { Surah } from "@/types/Surah";
import { getSurahSlug } from "@/utils/surahHelpers";
import { motion } from "framer-motion";
import { Search, BookOpen, Star, ChevronDown, Filter } from "lucide-react";
import PageHero from "@/components/blocks/hero/PageHero";
import Pagination from "@/components/elements/Pagination";

// Dynamically import PdfFlipbook (client-only, no SSR) to avoid pdfjs-dist build issues
const PdfFlipbook = dynamic(() => import("@/components/elements/PdfFlipbook"), {
  ssr: false,
  loading: () => (
    <div className="text-center py-20 text-muted-foreground">
      جاري تحميل المصحف...
    </div>
  ),
});

const PAGE_SIZE = 12;

// Hardcoded Mushaf PDF URLs - Update these with your actual PDF links
const MUSHAF_PDF_URLS: Record<"hafs" | "warsh" | "charmali", string> = {
  hafs: "/uploads/mushaf-hafs.pdf", // Replace with your Hafs PDF URL
  warsh: "/uploads/mushaf-warsh.pdf", // Replace with your Warsh PDF URL
  charmali: "http://localhost:1337/uploads/mshf_alshmrly_86223bd937.pdf", // Replace with your Charmali PDF URL
};

function normalizeArabic(str: string) {
  return str
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

export default function QuranPageClient() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filtered, setFiltered] = useState<Surah[]>([]);
  const [search, setSearch] = useState("");
  const [place, setPlace] = useState(""); // Meccan/Medinan
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState<Surah[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mushafType, setMushafType] = useState<"hafs" | "warsh" | "charmali">(
    "hafs",
  );
  const [showMushaf, setShowMushaf] = useState(false);

  useEffect(() => {
    fetchSurahList().then(setSurahs);
  }, []);

  useEffect(() => {
    let data = surahs;
    if (search) {
      const searchNorm = search.trim().toLowerCase();
      const searchNormArabic = normalizeArabic(searchNorm);
      data = data.filter(
        (s) =>
          normalizeArabic(s.name).includes(searchNormArabic) ||
          s.englishName.trim().toLowerCase().includes(searchNorm) ||
          s.englishNameTranslation.trim().toLowerCase().includes(searchNorm),
      );
      setSuggestions(
        surahs
          .filter(
            (s) =>
              normalizeArabic(s.name).includes(searchNormArabic) ||
              s.englishName.trim().toLowerCase().includes(searchNorm) ||
              s.englishNameTranslation
                .trim()
                .toLowerCase()
                .includes(searchNorm),
          )
          .slice(0, 5),
      );
    } else {
      setSuggestions([]);
    }
    if (place) data = data.filter((s) => s.revelationType === place);
    setFiltered(data);
    setPage(1);
  }, [search, place, surahs]);

  // Pagination
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  // Stats
  const meccanCount = surahs.filter(
    (s) => s.revelationType === "Meccan",
  ).length;
  const medinanCount = surahs.filter(
    (s) => s.revelationType === "Medinan",
  ).length;

  // Pagination Range Logic
  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 ||
        i === pageCount ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }

    const withDots: (number | string)[] = [];
    let l;
    for (let i of range) {
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

  const getMushafTitle = () => {
    switch (mushafType) {
      case "hafs":
        return "المصحف الشريف - رواية حفص عن عاصم";
      case "warsh":
        return "المصحف الشريف - رواية ورش عن نافع";
      case "charmali":
        return "المصحف الشريف - الرسم الشرمالي";
      default:
        return "المصحف الشريف";
    }
  };

  return (
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[url('/assets/bg.svg')] bg-repeat bg-center dark:invert"></div>

      {/* Full-Width Hero Section */}
      <PageHero
        backgroundImage={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771248765/quran-header_rqbcvq.png`}
        breadcrumbs={[{ label: "القرآن الكريم", href: "/quran" }]}
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-center"
        >
          <div className="inline-flex justify-center items-center w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg mb-6 text-white">
            <BookOpen size={36} />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-momken text-white drop-shadow-lg">
            القرآن الكريم
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
            تصفح سور القرآن الكريم، ابحث باسم السورة أو الفلترة حسب مكان
            النزول، واستمتع بتلاوة مباشرة بروايات حفص، ورش، والرسم الشرمالي.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="px-5 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{surahs.length} سورة</span>
            </div>
            <div className="px-5 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>{meccanCount} مكية</span>
            </div>
            <div className="px-5 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>{medinanCount} مدنية</span>
            </div>
          </div>
        </motion.div>
      </PageHero>

      <div
        className="max-w-7xl mx-auto py-8 px-4 mb-20 relative min-h-screen"
        dir="rtl"
      >
        {/* Mushaf Selection & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 mt-8 relative z-20"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto bg-card p-2 rounded-2xl shadow-xl">
            <div className="relative w-full">
              <select
                value={mushafType}
                onChange={(e) =>
                  setMushafType(e.target.value as "hafs" | "warsh" | "charmali")
                }
                className="appearance-none w-full px-6 py-3 rounded-xl bg-transparent text-foreground font-semibold focus:outline-none cursor-pointer"
                dir="rtl"
              >
                <option value="hafs">رواية حفص عن عاصم</option>
                <option value="warsh">رواية ورش عن نافع</option>
                <option value="charmali">الرسم الشرمالي</option>
              </select>
              <ChevronDown
                className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
                size={20}
              />
            </div>

            <button
              onClick={() => setShowMushaf(!showMushaf)}
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90 transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2"
            >
              <BookOpen size={20} />
              {showMushaf ? "إخفاء المصحف" : "فتح المصحف"}
            </button>
          </div>
        </motion.div>

        {/* PDF Viewer */}
        {showMushaf && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-16"
          >
            <PdfFlipbook
              pdfUrl={MUSHAF_PDF_URLS[mushafType]}
              title={getMushafTitle()}
            />
          </motion.div>
        )}

        {/* Search & Filter Bar */}
        <div className="sticky top-4 z-30 mb-8">
          <div className="max-w-4xl mx-auto bg-background/90 backdrop-blur-xl shadow-2xl rounded-2xl p-2 flex flex-col md:flex-row gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={22} />
              </div>
              <input
                className="w-full pl-4 pr-12 py-3 bg-transparent rounded-xl focus:outline-none placeholder:text-muted-foreground text-foreground font-medium"
                placeholder="ابحث باسم السورة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {/* Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50 border-2 border-primary/20">
                  {suggestions.map((s) => (
                    <button
                      key={s.number}
                      className="w-full px-4 py-3 text-right hover:bg-primary/10 flex justify-between items-center group border-b border-border/50 last:border-b-0"
                      onClick={() => {
                        setSearch(s.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <span className="font-momken text-foreground">
                        {s.name}
                      </span>
                      <span className="text-sm text-muted-foreground group-hover:text-primary">
                        {s.englishName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Select */}
            <div className="relative min-w-[150px] border-t md:border-t-0 md:border-r border-border/30">
              <select
                className="appearance-none w-full px-4 py-3 bg-transparent text-foreground font-medium focus:outline-none cursor-pointer text-center md:text-right"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                dir="rtl"
              >
                <option value="">جميع السور</option>
                <option value="Meccan">مكية</option>
                <option value="Medinan">مدنية</option>
              </select>
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </div>

        {/* Surah Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {paged.map((s, idx) => (
            <motion.div
              key={s.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={`/quran/${getSurahSlug(s)}`}
                className="group relative block p-6 h-full bg-card border border-border rounded-2xl shadow-lg hover:shadow-2xl hover:border-primary hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  {/* Number Badge */}
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <Star
                      className="absolute inset-0 text-primary/10 rotate-0 group-hover:rotate-180 transition-transform duration-700"
                      fill="currentColor"
                      size={40}
                    />
                    <span className="relative z-10 text-sm font-bold text-primary font-sans pt-1">
                      {s.number}
                    </span>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-md ${s.revelationType === "Meccan" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}
                  >
                    {s.revelationType === "Meccan" ? "مكية" : "مدنية"}
                  </span>
                </div>

                <div className="text-center mb-2">
                  <h3
                    className="text-6xl font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors"
                    style={{ fontFamily: "var(--font-surah-name)" }}
                  >
                    {s.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {s.englishName}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
                  <span>{s.numberOfAyahs} آية</span>
                  <span className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                    اقرأ السورة ←
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Smart Pagination */}
        {pageCount > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pageCount}
            onPageChange={setPage}
            className="py-8"
          />
        )}
      </div>
    </div>
  );
}
