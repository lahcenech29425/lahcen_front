"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, X, Headphones, Loader2, Filter, ChevronDown } from "lucide-react";
import type { Mp3QuranReciter } from "@/types/quranAudio";
import { extractUniqueRewayat } from "@/utils/quranAudioApi";
import ReciterCard from "@/components/custom/quran-audio/ReciterCard";
import Pagination from "@/components/elements/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/blocks/hero/PageHero";

const PAGE_SIZE = 12;

/** Arabic alphabet letters used by the API for the "letter" field */
const ALPHABET_LETTERS = [
  "ا", "أ", "إ", "ب", "ت", "ج", "ح", "خ",
  "د", "ر", "ز", "س", "ش", "ص", "ط", "ع",
  "غ", "ف", "ق", "ك", "م", "ن", "ه", "و", "ي",
];

export default function QuranAudioClient() {
  // ── State ─────────────────────────────────────────────
  const [reciters, setReciters] = useState<Mp3QuranReciter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedRewaya, setSelectedRewaya] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  // ── Fetch reciters on mount ───────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/quran-audio/reciters?language=ar");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setReciters(data.reciters ?? []);
      } catch (err) {
        console.error("Error loading reciters:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Derived data ──────────────────────────────────────
  const rewayatList = useMemo(
    () => extractUniqueRewayat(reciters),
    [reciters],
  );

  /** Letters that actually exist in the data */
  const availableLetters = useMemo(() => {
    const set = new Set(reciters.map((r) => r.letter));
    return ALPHABET_LETTERS.filter((l) => set.has(l));
  }, [reciters]);

  const filtered = useMemo(() => {
    let list = reciters;

    // Text search
    if (search.trim()) {
      const q = search.trim();
      list = list.filter((r) => r.name.includes(q));
    }

    // Alphabet filter
    if (selectedLetter) {
      list = list.filter((r) => r.letter === selectedLetter);
    }

    // Rewaya filter
    if (selectedRewaya) {
      list = list.filter((r) =>
        r.moshaf.some((m) => m.name === selectedRewaya),
      );
    }

    return list;
  }, [reciters, search, selectedLetter, selectedRewaya]);

  // Pagination
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  // ── Handlers ──────────────────────────────────────────
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleLetterClick = useCallback(
    (letter: string) => {
      setSelectedLetter(selectedLetter === letter ? null : letter);
      setPage(1);
    },
    [selectedLetter],
  );

  const handleRewayaChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRewaya(e.target.value || null);
      setPage(1);
    },
    [],
  );

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setSelectedLetter(null);
    setSelectedRewaya(null);
    setPage(1);
  }, []);

  const hasActiveFilters = search || selectedLetter || selectedRewaya;

  // ── Render ────────────────────────────────────────────
  return (
    <>
      {/* ── Hero Section ── */}
      <PageHero
        backgroundImage={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771248764/quran-audio-header_tqedwh.png`}
        breadcrumbs={[{ label: "الاستماع للقرآن" }]}
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
        >
          <Headphones className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl text-center md:text-5xl lg:text-6xl font-bold font-momken text-white mb-6"
        >
          الاستماع للقرآن الكريم
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
        >
          استمع إلى تلاوات القرآن الكريم بأصوات أشهر القراء في العالم
          الإسلامي. اختر القارئ المفضل لديك واستمتع بالتلاوات المباركة.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex justify-center gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-black font-momken text-white">
              {loading ? "..." : reciters.length}
            </div>
            <div className="text-sm text-white/70">قارئ</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-black font-momken text-white">
              114
            </div>
            <div className="text-sm text-white/70">سورة</div>
          </div>
        </motion.div>
      </PageHero>

      {/* ── Main Content ── */}
      < section className="py-12 bg-background min-h-screen" dir="rtl" >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Search & Filters Bar */}
          <div className="top-20 z-30 -mt-16 mb-10">
            <div className="bg-background/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-primary/20 p-5 md:p-6">
              {/* Search Row */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none w-5 h-5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="ابحث عن قارئ..."
                    className="w-full rounded-2xl bg-card border border-border text-foreground pr-12 pl-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
                    dir="rtl"
                  />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border transition-all font-bold text-sm ${showFilters || hasActiveFilters
                    ? "bg-primary text-white border-primary"
                    : "bg-card border-border text-foreground hover:border-primary/40"
                    }`}
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">تصفية</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-3.5 bg-card border border-border text-foreground rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all"
                  >
                    <X size={18} />
                    <span className="hidden sm:inline text-sm">مسح</span>
                  </button>
                )}
              </div>

              {/* Expanded Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-4">
                      {/* Rewaya Filter */}
                      <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                          الرواية
                        </label>
                        <div className="relative">
                          <select
                            value={selectedRewaya ?? ""}
                            onChange={handleRewayaChange}
                            className="w-full rounded-2xl bg-card border border-border text-foreground py-3 px-4 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            dir="rtl"
                          >
                            <option value="">جميع الروايات</option>
                            {rewayatList.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      {/* Alphabet Filter */}
                      <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                          الحرف الأول
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {availableLetters.map((letter) => (
                            <button
                              key={letter}
                              onClick={() => handleLetterClick(letter)}
                              className={`min-w-9 h-9 rounded-xl text-sm font-bold transition-all ${selectedLetter === letter
                                ? "bg-linear-to-r from-[#8B4513] to-[#5d3119] text-white shadow-lg shadow-primary/30"
                                : "bg-card border border-border text-foreground hover:border-primary hover:shadow-md"
                                }`}
                            >
                              {letter}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results count */}
              {(search || selectedLetter || selectedRewaya) && !loading && (
                <div className="mt-3 text-center text-sm text-muted-foreground">
                  {filtered.length > 0
                    ? `تم العثور على ${filtered.length} قارئ`
                    : "لم يتم العثور على نتائج"}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-3xl border border-border p-5 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded-lg w-3/4" />
                      <div className="h-3 bg-muted rounded-lg w-1/2" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-6 bg-muted rounded-full w-20" />
                    <div className="h-4 bg-muted rounded w-12" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/5 mb-6">
                <Search className="w-10 h-10 text-primary/30" />
              </div>
              <p className="text-muted-foreground text-lg mb-4">
                لم يتم العثور على قراء
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-linear-to-r from-[#8B4513] to-[#5d3119] text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                عرض جميع القراء
              </button>
            </motion.div>
          )}

          {/* Reciters Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paged.map((reciter, idx) => (
                <ReciterCard
                  key={reciter.id}
                  reciter={reciter}
                  delay={idx * 40}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={pageCount}
            onPageChange={setPage}
            className="mt-14"
          />
        </div>
      </section >
    </>
  );
}
