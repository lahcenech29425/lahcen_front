"use client";
import { useMemo, useState } from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { Search, X, Headphones, Loader2 } from "lucide-react";
import { SurahAudioEdition, SURAH_AUDIO_EDITIONS } from "@/types/quranAudio";
import ReciterCard from "@/components/custom/quran-audio/ReciterCard";
import { motion } from "framer-motion";

const PAGE_SIZE = 12;

export default function QuranAudioClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filter editions based on search (no API call needed — fully static)
  const filtered = useMemo(() => {
    if (!search.trim()) return SURAH_AUDIO_EDITIONS;
    const q = search.toLowerCase().trim();
    return SURAH_AUDIO_EDITIONS.filter(
      (e) =>
        e.arabicName.includes(search.trim()) ||
        e.englishName.toLowerCase().includes(q) ||
        (e.style && e.style.includes(search.trim())),
    );
  }, [search]);

  // Pagination
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      {/* ── Hero Section ── */}
      <div
        className="relative w-full h-[450px] md:h-[550px] overflow-hidden"
        dir="rtl"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/quran-audio-header.png')" }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-start">
            <div className="bg-black/20 backdrop-blur-sm inline-block px-4 py-2 rounded-lg border border-white/10">
              <Breadcrumb
                items={[{ label: "الاستماع للقرآن" }]}
                textColor="text-white"
                showHomeLabel={false}
                className="!mb-0"
              />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 pt-24">
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
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-momken text-white mb-6"
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
                {SURAH_AUDIO_EDITIONS.length}
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
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="py-12 bg-background min-h-screen" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Search Bar */}
          <div className="sticky top-20 z-30 -mt-16 mb-10">
            <div className="bg-white/60 dark:bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-primary/10 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none w-5 h-5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="ابحث عن قارئ بالعربية أو الإنجليزية..."
                    className="w-full rounded-2xl bg-white dark:bg-white/5 border border-primary/10 text-foreground pr-12 pl-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60"
                    dir="rtl"
                  />
                </div>

                {search && (
                  <button
                    onClick={() => handleSearch("")}
                    className="flex items-center gap-2 px-4 py-3.5 bg-white dark:bg-white/5 border border-primary/10 text-foreground rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all"
                  >
                    <X size={18} />
                    <span className="hidden sm:inline text-sm">مسح</span>
                  </button>
                )}
              </div>

              {search && (
                <div className="mt-3 text-center text-sm text-muted-foreground">
                  {filtered.length > 0
                    ? `تم العثور على ${filtered.length} قارئ`
                    : "لم يتم العثور على نتائج"}
                </div>
              )}
            </div>
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
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
                onClick={() => handleSearch("")}
                className="px-6 py-3 bg-linear-to-r from-[#8B4513] to-[#5d3119] text-white font-bold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                عرض جميع القراء
              </button>
            </motion.div>
          )}

          {/* Reciters Grid */}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paged.map((edition, idx) => (
                <ReciterCard
                  key={edition.id}
                  edition={edition}
                  delay={idx * 40}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex justify-center items-center gap-2 mt-14">
              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="px-5 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-primary/10 shadow-md hover:border-primary/30 hover:shadow-lg transition-all text-foreground font-bold"
                >
                  السابق
                </button>
              )}

              <div className="flex gap-1.5">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => {
                  const show =
                    p === 1 ||
                    p === pageCount ||
                    (p >= page - 1 && p <= page + 1);
                  if (!show) {
                    if (p === page - 2 || p === page + 2)
                      return (
                        <span
                          key={p}
                          className="px-2 py-2 text-muted-foreground"
                        >
                          ...
                        </span>
                      );
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        page === p
                          ? "bg-linear-to-r from-[#8B4513] to-[#5d3119] text-white shadow-lg shadow-primary/30"
                          : "bg-white dark:bg-white/5 border border-primary/10 text-foreground hover:border-primary/30 hover:shadow-md"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {page < pageCount && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-5 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-primary/10 shadow-md hover:border-primary/30 hover:shadow-lg transition-all text-foreground font-bold"
                >
                  التالي
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
