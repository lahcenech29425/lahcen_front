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
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
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
        <Link href="/" className="hover:text-gray-700 transition">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/quran" className="hover:text-gray-700 transition">
          القرآن الكريم
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">
          {surah.surahNameArabicLong || surah.surahNameArabic}
        </span>
      </nav>
      
      {/* En-tête minimaliste */}
      <header className="mb-10 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
          {surah.surahNameArabicLong || surah.surahNameArabic}
        </h1>
        <div className="text-center text-sm text-gray-500 mb-2">
          {surah.revelationPlace === "Mecca" ? "مكة" : "المدينة"} • {surah.totalAyah} آية
        </div>
      </header>
      
      {/* Lecteur audio épuré */}
      <div className="flex flex-col items-center gap-2 mb-12">
        <div className="relative w-full max-w-xs mb-3">
          <select
            id="reciter"
            className="appearance-none border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-400 transition bg-white pr-10"
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
          >
            {reciters.map((r, i) => (
              <option key={i} value={r.reciter}>
                {r.reciter}
              </option>
            ))}
          </select>
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            width="16"
            height="16"
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
            className="w-full max-w-md"
          >
            <source src={selectedAudio.url} type="audio/mp3" />
            متصفحك لا يدعم مشغل الصوت.
          </audio>
        )}
      </div>
      
      {/* Versets minimalistes */}
      <div className="space-y-8">
        {surah.arabic1.map((ayah: string, idx: number) => (
          <div
            key={idx}
            className="bg-white rounded-lg px-5 py-8 group animate-fade-in relative"
            style={{ 
              animationDelay: `${idx * 30}ms`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}
          >
            {/* Numéro discret */}
            <span className="absolute right-3 top-3 bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm">
              {idx + 1}
            </span>
            
            {/* Texte arabe */}
            <div className="text-2xl md:text-3xl font-arabic text-center text-gray-800 leading-loose tracking-wide pt-4">
              {ayah}
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation simple entre sourates */}
      <div className="flex justify-between mt-10 pt-4 border-t border-gray-100">
        {Number(surahNumber) > 1 && (
          <Link 
            href={`/quran/${Number(surahNumber) - 1}`}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            « السورة السابقة
          </Link>
        )}
        {Number(surahNumber) < 114 && (
          <Link 
            href={`/quran/${Number(surahNumber) + 1}`}
            className="text-sm text-gray-500 hover:text-gray-700 transition mr-auto"
          >
            السورة التالية »
          </Link>
        )}
      </div>
      
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        .font-arabic {
          font-family: "Amiri", "Scheherazade", "Noto Naskh Arabic", serif;
        }
        audio {
          height: 40px;
          border-radius: 20px;
        }
        audio::-webkit-media-controls-panel {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}