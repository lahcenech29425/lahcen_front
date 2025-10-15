"use client";
import { useEffect, useState } from "react";
import { fetchSurahDetail, fetchAyahTafseer } from "@/utils/quranApi";
import { Link } from "@/components/elements/Link";
import { Surah } from "@/types/Surah";
import { getSurahNumberFromSlug } from "@/utils/surahHelpers";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Badge from "@/components/elements/Badge";

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
    null
  );
  const [tafseerLoading, setTafseerLoading] = useState(false);

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
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-red-500">
        {error || "الآية غير موجودة"}
      </div>
    );
  }

  const ayahText = surah.arabic1[ayahNumber - 1];
  const prevAyah = ayahNumber > 1 ? ayahNumber - 1 : null;
  const nextAyah =
    ayahNumber < (surah.totalAyah ?? Infinity) ? ayahNumber + 1 : null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4" dir="rtl">
      {/* Navigation */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-gray-700 transition">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/quran" className="hover:text-gray-700 transition">
          القرآن الكريم
        </Link>
        <span>/</span>
        <Link
          href={`/quran/${surahSlug}`}
          className="hover:text-gray-700 transition"
        >
          {surah.surahNameArabicLong || surah.surahNameArabic}
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">الآية {ayahNumber}</span>
      </nav>

      {/* En-tête */}
      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-4 text-sm text-gray-500">
          <BookOpen size={16} />
          <span>
            {surah.surahNameArabicLong || surah.surahNameArabic} • الآية{" "}
            {ayahNumber}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          تفسير الآية {ayahNumber} من سورة {surah.surahNameArabic}
        </h1>
        <div className="text-sm text-gray-500">
          {surah.revelationPlace === "Mecca" ? "مكة" : "المدينة"} •{" "}
          {surah.totalAyah} آية
        </div>
      </header>

      {/* Texte de la Ayah */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 mb-8 shadow-sm border border-gray-200">
        <p className="text-3xl md:text-4xl font-arabic text-center text-gray-900 leading-loose tracking-wide">
          {ayahText}
        </p>
      </div>

      {/* Sélecteur de Tafsir */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <BookOpen size={20} />
          التفسير
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <span className="text-sm text-gray-600">اختر التفسير:</span>
          <div className="relative w-full sm:max-w-md">
            <select
              className="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition bg-white pr-10"
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
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
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
        </div>

        {/* Contenu du Tafsir */}
        {tafseerLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        ) : tafseerContent ? (
          <div className="prose prose-lg max-w-none">
            <div className="mb-3 text-sm text-gray-500 pb-3 border-b border-gray-100">
              {arabicTafsirs.find((a) => a.id === selectedTafseer)?.name} •{" "}
              {arabicTafsirs.find((a) => a.id === selectedTafseer)?.author}
            </div>
            <p className="text-gray-800 leading-relaxed text-right text-lg">
              {tafseerContent.text}
            </p>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            لم يتم العثور على تفسير لهذه الآية.
          </div>
        )}
      </div>

      {/* Navigation entre versets */}
      <div className="flex justify-center items-center gap-4 mt-10 pt-6 border-t border-gray-200 flex-wrap">
        {prevAyah ? (
          <Link href={`/quran/${surahSlug}/${prevAyah}`}>
            <Badge
              bg="bg-gray-100"
              color="text-gray-800"
              rounded="rounded-lg"
              className="flex items-center gap-2 hover:bg-gray-200 transition cursor-pointer px-4 py-2"
            >
              <ChevronRight size={16} />
              <span>الآية السابقة</span>
            </Badge>
          </Link>
        ) : (
          <div className="w-32"></div>
        )}

        <Link href={`/quran/${surahSlug}`}>
          <Badge
            bg="bg-gray-800"
            color="text-white"
            rounded="rounded-lg"
            className="hover:bg-gray-700 transition cursor-pointer px-5 py-2"
          >
            العودة للسورة
          </Badge>
        </Link>

        {nextAyah ? (
          <Link href={`/quran/${surahSlug}/${nextAyah}`}>
            <Badge
              bg="bg-gray-100"
              color="text-gray-800"
              rounded="rounded-lg"
              className="flex items-center gap-2 hover:bg-gray-200 transition cursor-pointer px-4 py-2"
            >
              <span>الآية التالية</span>
              <ChevronLeft size={16} />
            </Badge>
          </Link>
        ) : (
          <div className="w-32"></div>
        )}
      </div>
    </div>
  );
}
