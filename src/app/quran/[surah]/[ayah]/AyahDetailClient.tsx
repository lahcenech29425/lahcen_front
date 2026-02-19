"use client";
import { useEffect, useState } from "react";
import { fetchSurahDetail, fetchAyahTafseer } from "@/utils/quranApi";
import { Link } from "@/components/elements/Link";
import { Surah } from "@/types/Surah";
import { getSurahNumberFromSlug } from "@/utils/surahHelpers";
import { ChevronLeft, ChevronRight, BookOpen, Info, Type } from "lucide-react";
import { motion } from "framer-motion";
import { useQuranFont } from "@/hooks/useQuranFont";
import PageHero from "@/components/blocks/hero/PageHero";

type TafseerAuthor = {
  id: number;
  name: string;
  author: string;
};

type TafseerContent = {
  tafseer_id: number;
  tafseer_name: string;
  ayah_url: string;
  ayah_number: number;
  text: string;
};

const arabicTafsirs: TafseerAuthor[] = [
  { id: 1, name: "التفسير الميسر", author: "نخبة من العلماء" },
  { id: 2, name: "تفسير ابن كثير", author: "ابن كثير" },
  { id: 3, name: "تفسير البغوي", author: "البغوي" },
  { id: 4, name: "تفسير التنوير", author: "ابن عباس" },
  { id: 5, name: "التفسير الوسيط", author: "مجمع البحوث الإسلامية" },
  { id: 6, name: "تفسير الطبري", author: "الطبري" },
  { id: 7, name: "تفسير القرطبي", author: "القرطبي" },
  { id: 8, name: "تفسير السعدي", author: "السعدي" },
];

type Props = {
  params: Promise<{ surah: string; ayah: string }>;
};

export default function AyahDetailClient({ params }: Props) {
  const [surahSlug, setSurahSlug] = useState<string>("");
  const [ayahNumber, setAyahNumber] = useState<number>(0);

  const [surahNumber, setSurahNumber] = useState<number | null>(null);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTafseer, setSelectedTafseer] = useState<number>(1);
  const [tafseerContent, setTafseerContent] = useState<TafseerContent | null>(
    null,
  );
  const [tafseerLoading, setTafseerLoading] = useState(false);

  // Use shared Quran font hook
  const {
    selectedFont,
    setSelectedFont,
    getFontFamily,
    cleanText,
    fonts: quranFonts,
  } = useQuranFont();

  // Unwrap params
  useEffect(() => {
    params.then((p) => {
      setSurahSlug(p.surah);
      setAyahNumber(Number(p.ayah));
    });
  }, [params]);

  // Convertir le slug en number
  useEffect(() => {
    if (!surahSlug) return;
    getSurahNumberFromSlug(surahSlug).then(setSurahNumber);
  }, [surahSlug]);

  // Chargement de la sourate
  useEffect(() => {
    if (!surahNumber) return;

    fetchSurahDetail(surahNumber)
      .then((data) => {
        setSurah(data);
        setLoading(false);
      })
      .catch(() => {
        setError("السورة غير موجودة");
        setLoading(false);
      });
  }, [surahNumber]);

  // Chargement du tafsir
  useEffect(() => {
    if (!surahNumber || !ayahNumber) return;

    setTafseerLoading(true);
    fetchAyahTafseer(selectedTafseer, surahNumber, ayahNumber)
      .then((data) => {
        setTafseerContent(data);
        setTafseerLoading(false);
      })
      .catch(() => {
        setTafseerContent({
          tafseer_id: selectedTafseer,
          tafseer_name:
            arabicTafsirs.find((a) => a.id === selectedTafseer)?.name || "",
          ayah_url: `/quran/${surahSlug}/${ayahNumber}`,
          ayah_number: ayahNumber,
          text: "عذراً، لم نتمكن من تحميل التفسير. يرجى المحاولة مرة أخرى.",
        });
        setTafseerLoading(false);
      });
  }, [surahNumber, ayahNumber, selectedTafseer, surahSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary font-medium animate-pulse">
            جاري تحميل الآية...
          </p>
        </div>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-medium">
        {error || "الآية غير موجودة"}
      </div>
    );
  }

  const ayahText = surah.arabic1[ayahNumber - 1];
  const prevAyah = ayahNumber > 1 ? ayahNumber - 1 : null;
  const nextAyah =
    ayahNumber < (surah.totalAyah ?? Infinity) ? ayahNumber + 1 : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. HERO SECTION */}
      <PageHero
        backgroundImage={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771249645/quran_ykrns1.png`}
        breadcrumbs={[
          { label: "القرآن الكريم", href: "/quran" },
          {
            label: surah.name || surah.surahNameArabic || "",
            href: `/quran/${surahSlug}`,
          },
          { label: `الآية ${ayahNumber}` },
        ]}
        heightClass="h-[400px] md:h-[450px]"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-momken text-white drop-shadow-2xl">
            تفسير الآية {ayahNumber} من {surah.name || surah.surahNameArabic}
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold flex items-center gap-3 shadow-lg">
              <span
                className={`w-2 h-2 rounded-full ${surah.revelationPlace === "Mecca" ? "bg-primary" : "bg-secondary"}`}
              />
              <span>
                {surah.revelationPlace === "Mecca" ? "مكية" : "مدنية"}
              </span>
            </div>
          </div>
        </motion.div>
      </PageHero>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 -mt-16 relative z-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Font Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8 mt-4"
          >
            <div className="flex items-center gap-3 bg-card px-4 py-3 rounded-2xl border border-primary/10 shadow-lg">
              <Type size={18} className="text-primary" />
              <select
                className="bg-transparent border-none text-foreground font-bold text-sm focus:outline-none cursor-pointer"
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                dir="rtl"
              >
                {quranFonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Verse Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-[2rem] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-primary/20 mb-12 overflow-hidden text-center backdrop-blur-sm"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl translate-x-20 translate-y-20" />

            {/* Ornamental Top Border */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="relative z-10">
              <p
                className="text-3xl md:text-4xl leading-[2.5] text-foreground relative"
                style={{
                  lineHeight: "2.2",
                  fontFamily: getFontFamily(),
                  textShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                {cleanText(ayahText)}
              </p>

              <div className="mt-10 flex justify-center items-center gap-2">
                <div className="w-2 h-2 bg-primary/40 rounded-full" />
                <div className="w-24 h-0.5 bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 rounded-full" />
                <div className="w-2 h-2 bg-primary/40 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Tafsir Controls & Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary/20 rounded-3xl p-8 md:p-10 border border-primary/5"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b border-primary/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">التفسير</h2>
              </div>

              <div className="relative w-full md:w-auto min-w-[250px]">
                <select
                  className="appearance-none w-full bg-card border border-primary/10 rounded-xl px-4 py-3 pr-10 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                  value={selectedTafseer}
                  onChange={(e) => setSelectedTafseer(Number(e.target.value))}
                  dir="rtl"
                >
                  {arabicTafsirs.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name} - {author.author}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                  <Info size={18} />
                </div>
              </div>
            </div>

            {tafseerLoading ? (
              <div className="flex justify-center py-12 text-primary">
                <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tafseerContent ? (
              <div className="prose prose-lg max-w-none [.dark_&]:prose-invert">
                <p className="text-xl leading-relaxed text-foreground text-justify font-normal">
                  {tafseerContent.text}
                </p>
                <div className="mt-8 pt-6 border-t border-primary/5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    المصدر:{" "}
                    {arabicTafsirs.find((a) => a.id === selectedTafseer)?.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لم يتم العثور sur le contenu
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            {/* Main Navigation Row - Desktop */}
            <div className="hidden md:grid md:grid-cols-3 gap-4 items-center">
              {/* Previous Ayah */}
              {prevAyah ? (
                <Link
                  href={`/quran/${surahSlug}/${prevAyah}`}
                  className="group flex items-center gap-3 px-5 py-3.5 bg-gradient-to-l from-card to-primary/5 rounded-2xl shadow-md hover:shadow-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <ChevronRight
                      size={20}
                      className="text-primary group-hover:text-white"
                    />
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-muted-foreground font-medium">
                      السابقة
                    </span>
                    <span className="font-bold text-foreground">
                      الآية {prevAyah}
                    </span>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {/* Center Button */}
              <Link
                href={`/quran/${surahSlug}`}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl shadow-lg shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 font-bold"
              >
                <BookOpen size={19} />
                <span>فهرس السورة</span>
              </Link>

              {/* Next Ayah */}
              {nextAyah ? (
                <Link
                  href={`/quran/${surahSlug}/${nextAyah}`}
                  className="group flex items-center justify-end gap-3 px-5 py-3.5 bg-gradient-to-r from-card to-primary/5 rounded-2xl shadow-md hover:shadow-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-left">
                    <span className="block text-xs text-muted-foreground font-medium">
                      التالية
                    </span>
                    <span className="font-bold text-foreground">
                      الآية {nextAyah}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <ChevronLeft
                      size={20}
                      className="text-primary group-hover:text-white"
                    />
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden space-y-3">
              <div className="flex gap-3">
                {prevAyah && (
                  <Link
                    href={`/quran/${surahSlug}/${prevAyah}`}
                    className="flex-1 group flex items-center gap-2 px-4 py-3 bg-gradient-to-l from-card to-primary/5 rounded-xl shadow-md border border-primary/20 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all">
                      <ChevronRight
                        size={18}
                        className="text-primary group-hover:text-white"
                      />
                    </div>
                    <div className="text-right text-sm">
                      <span className="block text-xs text-muted-foreground">
                        السابقة
                      </span>
                      <span className="font-bold text-foreground">
                        الآية {prevAyah}
                      </span>
                    </div>
                  </Link>
                )}
                {nextAyah && (
                  <Link
                    href={`/quran/${surahSlug}/${nextAyah}`}
                    className="flex-1 group flex items-center justify-end gap-2 px-4 py-3 bg-gradient-to-r from-card to-primary/5 rounded-xl shadow-md border border-primary/20 transition-all"
                  >
                    <div className="text-left text-sm">
                      <span className="block text-xs text-muted-foreground">
                        التالية
                      </span>
                      <span className="font-bold text-foreground">
                        الآية {nextAyah}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all">
                      <ChevronLeft
                        size={18}
                        className="text-primary group-hover:text-white"
                      />
                    </div>
                  </Link>
                )}
              </div>
              <div className="text-center pt-1">
                <Link
                  href={`/quran/${surahSlug}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-primary to-primary/80 text-white font-bold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <BookOpen size={18} />
                  <span>العودة للسورة</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
