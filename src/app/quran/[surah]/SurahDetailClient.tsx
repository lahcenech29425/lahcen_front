"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  fetchSurahDetail,
  fetchTafseerList,
  fetchAyahTafseer,
  fetchSurahList,
} from "@/utils/quranApi";
import { Link } from "@/components/elements/Link";
import { Surah } from "@/types/Surah";
import {
  X,
  Play,
  Pause,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Volume2,
  Type,
  LayoutGrid,
  List,
} from "lucide-react";
import { getSurahNumberFromSlug, getSurahSlug } from "@/utils/surahHelpers";
import { motion, AnimatePresence } from "framer-motion";
import { useQuranFont } from "@/hooks/useQuranFont";
import PageHero from "@/components/blocks/hero/PageHero";

// Types pour le tafsir
type TafseerAuthor = {
  id: number;
  name: string;
  language: string;
  author: string;
  book_name: string;
};

type TafseerContent = {
  tafseer_id: number;
  tafseer_name: string;
  ayah_url: string;
  ayah_number: number;
  text: string;
};

type ReciterAudio = { reciter: string; url: string };

// Liste complète des 8 tafsirs arabes
const arabicTafsirs: TafseerAuthor[] = [
  {
    id: 1,
    name: "التفسير الميسر",
    language: "ar",
    author: "نخبة من العلماء",
    book_name: "التفسير الميسر",
  },
  {
    id: 2,
    name: "تفسير ابن كثير",
    language: "ar",
    author: "ابن كثير",
    book_name: "تفسير ابن كثير",
  },
  {
    id: 3,
    name: "تفسير البغوي",
    language: "ar",
    author: "البغوي",
    book_name: "تفسير البغوي",
  },
  {
    id: 4,
    name: "تفسير التنوير",
    language: "ar",
    author: "ابن عباس",
    book_name: "تنوير المقباس من تفسير ابن عباس",
  },
  {
    id: 5,
    name: "التفسير الوسيط",
    language: "ar",
    author: "مجمع البحوث الإسلامية",
    book_name: "التفسير الوسيط",
  },
  {
    id: 6,
    name: "تفسير الطبري",
    language: "ar",
    author: "الطبري",
    book_name: "جامع البيان عن تأويل آي القرآن",
  },
  {
    id: 7,
    name: "تفسير القرطبي",
    language: "ar",
    author: "القرطبي",
    book_name: "الجامع لأحكام القرآن",
  },
  {
    id: 8,
    name: "تفسير السعدي",
    language: "ar",
    author: "السعدي",
    book_name: "تيسير الكريم الرحمن في تفسير كلام المنان",
  },
];

type Props = {
  params: Promise<{ surah: string }>;
};

export default function SurahDetailClient({ params }: Props) {
  const [surahSlug, setSurahSlug] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // View and Font Settings (with localStorage)
  const [viewMode, setViewMode] = useState<"ayah" | "mushaf">("ayah");
  const {
    selectedFont,
    setSelectedFont,
    getFontFamily,
    cleanText,
    fonts: quranFonts,
  } = useQuranFont();

  useEffect(() => {
    params.then((p) => setSurahSlug(p.surah));
  }, [params]);

  const [surahNumber, setSurahNumber] = useState<number | null>(null);
  const [prevSlug, setPrevSlug] = useState<string | null>(null);
  const [nextSlug, setNextSlug] = useState<string | null>(null);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reciter, setReciter] = useState<string>("");

  // États pour le tafsir
  const [tafseerAuthors, setTafseerAuthors] = useState<TafseerAuthor[]>([]);
  const [selectedTafseer, setSelectedTafseer] = useState<number>(1);
  const [activeTafseer, setActiveTafseer] = useState<number | null>(null);
  const [tafseerContent, setTafseerContent] = useState<TafseerContent | null>(
    null,
  );
  const [tafseerLoading, setTafseerLoading] = useState(false);

  // Convertir le slug en number
  useEffect(() => {
    getSurahNumberFromSlug(surahSlug).then(setSurahNumber);
  }, [surahSlug]);

  // Compute prev/next slugs
  useEffect(() => {
    if (!surahNumber) return;
    let mounted = true;
    (async () => {
      try {
        const list = await fetchSurahList();
        if (!mounted || !Array.isArray(list)) return;
        const prev = list[surahNumber - 2];
        const next = list[surahNumber];
        setPrevSlug(prev ? getSurahSlug(prev) : null);
        setNextSlug(next ? getSurahSlug(next) : null);
      } catch {
        setPrevSlug(null);
        setNextSlug(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [surahNumber]);

  // Chargement des données de la sourate
  useEffect(() => {
    if (!surahNumber) return;
    let isMounted = true;
    fetchSurahDetail(surahNumber)
      .then((data) => {
        if (isMounted) {
          setSurah(data);
          const audios = Object.values(
            data.audio as Record<string, ReciterAudio>,
          );
          setReciter(audios[0]?.reciter || "");
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("السورة غير موجودة");
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [surahNumber]);

  // Chargement des auteurs de tafsir
  useEffect(() => {
    setTafseerAuthors(arabicTafsirs);
    fetchTafseerList()
      .then((data) => {
        if (data && data.length > 0) {
          setTafseerAuthors([...arabicTafsirs]); // Keep it simple for now or merge
        }
      })
      .catch(() => { });
  }, []);

  const reciters = useMemo(() => {
    return surah
      ? Object.values((surah.audio as Record<string, ReciterAudio>) || {})
      : [];
  }, [surah]);

  const selectedAudio = useMemo(() => {
    return reciters.find((r) => r.reciter === reciter) || reciters[0];
  }, [reciters, reciter]);

  useEffect(() => {
    if (reciters.length && !reciters.find((r) => r.reciter === reciter)) {
      setReciter(reciters[0].reciter);
    }
  }, [reciters, reciter]);

  useEffect(() => {
    if (activeTafseer !== null) {
      loadTafseer(activeTafseer, true);
    }
  }, [selectedTafseer]);

  const loadTafseer = async (ayahNumber: number, forceReload = false) => {
    if (activeTafseer === ayahNumber && !forceReload) {
      setActiveTafseer(null);
      setTafseerContent(null);
      return;
    }
    setTafseerLoading(true);
    setActiveTafseer(ayahNumber);
    try {
      const tafseerData = await fetchAyahTafseer(
        selectedTafseer,
        Number(surahNumber),
        ayahNumber,
      );
      setTafseerContent(tafseerData);
    } catch (error) {
      setTafseerContent({
        tafseer_id: selectedTafseer,
        tafseer_name:
          tafseerAuthors.find((a) => a.id === selectedTafseer)?.name || "",
        ayah_url: `/quran/${surahNumber}/${ayahNumber}`,
        ayah_number: ayahNumber,
        text: "عذراً، لم نتمكن من تحميل التفسير. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setTafseerLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary font-medium animate-pulse">
            جاري تحميل السورة...
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-medium">
        {error}
      </div>
    );
  if (!surah) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('/assets/bg.svg')] bg-repeat bg-center"></div>

      {/* 1. HERO SECTION */}
      <PageHero
        backgroundImage="/assets/quran-header.png"
        breadcrumbs={[
          { label: "القرآن الكريم", href: "/quran" },
          { label: surah.name || surah.surahNameArabic || "" },
        ]}
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-center"
        >
          <h1
            className="text-6xl md:text-8xl font-medium mb-6 text-white drop-shadow-2xl"
            style={{ fontFamily: "var(--font-surah-name)" }}
          >
            {surah.name || surah.surahNameArabic}
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold flex items-center gap-3 shadow-lg">
              <span
                className={`w-2 h-2 rounded-full ${surah.revelationPlace === "Mecca" ? "bg-primary" : "bg-secondary"}`}
              />
              <span>
                {surah.revelationPlace === "Mecca" ? "مكية" : "مدنية"}
              </span>
            </div>
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold flex items-center gap-3 shadow-lg">
              <BookOpen size={18} className="text-primary" />
              <span>{surah.totalAyah} آية</span>
            </div>
          </div>
        </motion.div>
      </PageHero>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 -mt-10 relative z-20 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          {/* Audio Player Card - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-white dark:bg-card from-card via-card to-primary/5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border-2 border-primary/20 p-6 md:p-8 mb-12 overflow-hidden backdrop-blur-sm"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl translate-x-20 -translate-y-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-16 translate-y-16" />

            <div className="relative z-10 flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-primary/10">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/25">
                  <Volume2 size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    الاستماع للسورة
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    اختر القارئ المفضل لديك
                  </p>
                </div>
              </div>

              {/* Reciter Selector */}
              <div className="relative">
                <label className="text-sm text-primary font-bold mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  القارئ
                </label>
                <div className="relative">
                  <select
                    value={reciter}
                    onChange={(e) => setReciter(e.target.value)}
                    className="w-full appearance-none bg-card border-2 border-primary/20 hover:border-primary/40 rounded-2xl px-5 py-4 pr-12 text-foreground font-bold text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-md transition-all"
                    dir="rtl"
                  >
                    {reciters.map((r, i) => (
                      <option key={i} value={r.reciter}>
                        {r.reciter}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center pointer-events-none">
                    <ChevronDown className="text-primary" size={18} />
                  </div>
                </div>
              </div>

              {/* Audio Controls */}
              {selectedAudio?.url && (
                <div className="flex items-center gap-4 bg-gradient-to-r from-secondary/60 to-secondary/40 rounded-2xl p-5 border-2 border-primary/10 shadow-lg">
                  <button
                    onClick={handlePlayPause}
                    className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center hover:scale-105 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 shadow-lg shadow-primary/25"
                  >
                    {isPlaying ? (
                      <Pause size={26} fill="currentColor" />
                    ) : (
                      <Play size={26} fill="currentColor" className="ml-1" />
                    )}
                  </button>

                  <div className="flex-1">
                    <audio
                      ref={audioRef}
                      src={selectedAudio.url}
                      className="w-full h-12 accent-primary [&::-webkit-media-controls-panel]:bg-card/80 [&::-webkit-media-controls-panel]:rounded-lg"
                      controls
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tafsir Selector */}
          <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* View Mode & Font Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-full border border-primary/10 shadow-sm">
                <button
                  onClick={() => setViewMode("ayah")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${viewMode === "ayah"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <List size={16} />
                  <span className="text-sm font-bold">آية بآية</span>
                </button>
                <button
                  onClick={() => setViewMode("mushaf")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${viewMode === "mushaf"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <LayoutGrid size={16} />
                  <span className="text-sm font-bold">مصحف</span>
                </button>
              </div>

              {/* Font Selector */}
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-full border border-primary/10 shadow-sm">
                <Type size={16} className="text-primary" />
                <select
                  className="bg-transparent border-none text-foreground font-semibold text-sm focus:outline-none cursor-pointer"
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                >
                  {quranFonts.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tafsir Selector */}
            <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-full border border-primary/10 shadow-sm">
              <span className="text-sm font-bold text-primary flex items-center gap-2">
                <BookOpen size={16} />
                تفسير:
              </span>
              <select
                className="bg-transparent border-none text-foreground font-semibold text-sm focus:outline-none cursor-pointer"
                value={selectedTafseer}
                onChange={(e) => setSelectedTafseer(Number(e.target.value))}
              >
                {tafseerAuthors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verses List - Conditional Rendering Based on View Mode */}
          {viewMode === "ayah" ? (
            /* Ayah by Ayah View */
            <div className="space-y-8">
              {surah.arabic1.map((ayah, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className={`group relative bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden ${activeTafseer === idx + 1 ? "ring-2 ring-primary/20" : ""}`}
                  >
                    {/* Ayah Header */}
                    <div className="flex justify-between items-center px-6 py-4 bg-secondary/30 border-b border-border/50">
                      <span className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary font-bold rounded-full font-sans text-sm">
                        {idx + 1}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadTafseer(idx + 1)}
                          className={`p-2 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold ${activeTafseer === idx + 1 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}
                        >
                          <BookOpen size={16} />
                          <span>التفسير</span>
                        </button>
                      </div>
                    </div>

                    {/* Ayah Text */}
                    <div className="p-8 md:p-10 text-center relative">
                      <Link
                        href={`/quran/${surahSlug}/${idx + 1}`}
                        className="block"
                      >
                        <p
                          className="text-3xl md:text-5xl leading-[2.5] text-foreground drop-shadow-sm cursor-pointer hover:text-primary transition-colors"
                          style={{
                            lineHeight: "2.2",
                            fontFamily: getFontFamily(),
                          }}
                        >
                          {cleanText(ayah)}
                        </p>
                      </Link>
                    </div>

                    {/* Tafsir Panel (Expandable) */}
                    <AnimatePresence>
                      {activeTafseer === idx + 1 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-secondary/20 border-t border-primary/10 overflow-hidden"
                        >
                          <div className="p-6 md:p-8 relative">
                            <button
                              onClick={() => setActiveTafseer(null)}
                              className="absolute left-4 top-4 p-2 text-primary/50 hover:text-primary transition"
                            >
                              <X size={20} />
                            </button>

                            <div className="mb-4 flex items-center gap-3">
                              <div className="w-1 h-8 bg-primary rounded-full" />
                              <div>
                                <h4 className="font-bold text-primary">
                                  تفسير الآية {idx + 1}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {
                                    tafseerAuthors.find(
                                      (a) => a.id === selectedTafseer,
                                    )?.name
                                  }
                                </span>
                              </div>
                            </div>

                            {tafseerLoading ? (
                              <div className="py-8 flex justify-center text-primary">
                                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              </div>
                            ) : (
                              <p className="text-lg leading-relaxed text-foreground text-justify pl-4 border-r-2 border-primary/10 pr-4">
                                {tafseerContent?.text}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Mushaf View - Continuous Text */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl border border-border/50 shadow-lg p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 rounded-full">
                  <BookOpen size={18} className="text-primary" />
                  <span className="font-bold text-primary">
                    قراءة مصحفية متصلة
                  </span>
                </div>
              </div>

              <p
                className="text-2xl md:text-4xl leading-[2.5] text-foreground text-justify"
                style={{
                  lineHeight: "2.5",
                  fontFamily:
                    quranFonts.find((f) => f.value === selectedFont)?.family ||
                    "var(--font-amiri)",
                }}
              >
                {surah.arabic1.map((ayah, idx) => (
                  <span key={idx} className="inline">
                    <Link
                      href={`/quran/${surahSlug}/${idx + 1}`}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      {cleanText(ayah)}
                    </Link>
                    <span className="inline-flex items-center justify-center w-8 h-8 mx-2 text-sm font-bold text-primary bg-primary/10 rounded-full align-middle font-sans">
                      {idx + 1}
                    </span>{" "}
                  </span>
                ))}
              </p>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-primary/10">
            {surahNumber && surahNumber > 1 ? (
              <Link
                href={
                  prevSlug ? `/quran/${prevSlug}` : `/quran/${surahNumber - 1}`
                }
                className="flex items-center gap-3 px-6 py-4 bg-card text-foreground rounded-2xl shadow-sm hover:shadow-lg hover:text-primary transition-all group border border-primary/5"
              >
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ChevronRight size={20} />
                </div>
                <div className="text-right">
                  <span className="font-bold">السورة السابقة</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {surahNumber && surahNumber < 114 ? (
              <Link
                href={
                  nextSlug ? `/quran/${nextSlug}` : `/quran/${surahNumber + 1}`
                }
                className="flex items-center gap-3 px-6 py-4 bg-card text-foreground rounded-2xl shadow-sm hover:shadow-lg hover:text-primary transition-all group border border-primary/5"
              >
                <div className="text-left">
                  <span className="font-bold">السورة التالية</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ChevronLeft size={20} />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
