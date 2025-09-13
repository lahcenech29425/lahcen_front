"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSurahDetail } from "@/utils/quranApi";
import { Link } from "@/components/elements/Link";
import { Surah } from "@/types/Surah";

type ReciterAudio = { reciter: string; url: string };

export default function SurahDetailPage() {
  const params = useParams();
  const surahNumber = params?.surah as string;
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reciter, setReciter] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    fetchSurahDetail(Number(surahNumber))
      .then((data) => {
        if (isMounted) {
          setSurah(data);
          // Correction ici : on caste data.audio
          const audios = Object.values(
            data.audio as Record<string, ReciterAudio>
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

  // Met à jour l'audio sans recharger la page
  const reciters: ReciterAudio[] = surah
    ? Object.values((surah.audio as Record<string, ReciterAudio>) || {})
    : [];
  const selectedAudio =
    reciters.find((r) => r.reciter === reciter) || reciters[0];

  useEffect(() => {
    // Met à jour l'audio quand on change de récitateur
    if (reciters.length && !reciters.find((r) => r.reciter === reciter)) {
      setReciter(reciters[0].reciter);
    }
    // eslint-disable-next-line
  }, [surahNumber, surah]);

  if (loading)
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-gray-500">
        جاري التحميل...
      </div>
    );
  if (error)
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-red-500">
        {error}
      </div>
    );
  if (!surah) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4" dir="rtl">
      {/* Navigation */}
      <nav className="mb-8 flex items-center gap-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary transition">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/quran" className="hover:text-primary transition">
          القرآن الكريم
        </Link>
        <span>/</span>
        <span className="text-primary font-semibold">
          {surah.surahNameArabicLong || surah.surahNameArabic}
        </span>
      </nav>
      {/* Titre & intro */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
        {surah.surahNameArabicLong || surah.surahNameArabic}
      </h1>
      <div className="text-center text-xs text-gray-400 mb-6">
        {surah.revelationPlace === "Mecca" ? "مكة" : "المدينة"} •{" "}
        {surah.totalAyah} آية
      </div>
      {/* Reciter selector and audio */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <label
          htmlFor="reciter"
          className="text-sm text-gray-700 font-medium mb-1"
        >
          اختر القارئ :
        </label>
        <div className="relative w-full max-w-xs mb-4">
          <select
            id="reciter"
            className="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary transition bg-white pr-10"
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
          >
            {reciters.map((r, i) => (
              <option key={i} value={r.reciter}>
                {r.reciter}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
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
        {selectedAudio?.url && (
          <audio
            key={selectedAudio.url}
            controls
            className="w-full max-w-md mt-2"
          >
            <source src={selectedAudio.url} type="audio/mp3" />
            متصفحك لا يدعم مشغل الصوت.
          </audio>
        )}
      </div>
      {/* Ayat */}
      <div className="space-y-6 mt-8">
        {surah.arabic1.map((ayah: string, idx: number) => (
          <div
            key={idx}
            className="relative bg-white rounded-xl shadow-md px-6 py-8 flex flex-col items-center group transition hover:shadow-lg animate-fade-in"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            {/* Numéro du verset style sobre */}
            <span className="absolute -right-4 -top-4 bg-[#171717] text-white border-4 border-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow group-hover:scale-110 transition">
              {idx + 1}
            </span>
            {/* Texte arabe calligraphié */}
            <div className="text-3xl md:text-4xl font-arabic text-center text-[#171717] leading-loose select-text tracking-wide">
              {ayah}
            </div>
          </div>
        ))}
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
