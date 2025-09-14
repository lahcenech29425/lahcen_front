"use client";
import { useEffect, useState, useMemo } from "react"; // Ajouter useMemo ici
import { useParams } from "next/navigation";
import {
  fetchSurahDetail,
  fetchTafseerList,
  fetchAyahTafseer,
} from "@/utils/quranApi";
import { Link } from "@/components/elements/Link";
import { Surah } from "@/types/Surah";
import { X } from "lucide-react";

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

export default function SurahDetailPage() {
  const params = useParams();
  const surahNumber = params?.surah as string;
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reciter, setReciter] = useState<string>("");

  // États pour le tafsir
  const [tafseerAuthors, setTafseerAuthors] = useState<TafseerAuthor[]>([]);
  const [selectedTafseer, setSelectedTafseer] = useState<number>(1); // Par défaut: التفسير الميسر
  const [activeTafseer, setActiveTafseer] = useState<number | null>(null);
  const [tafseerContent, setTafseerContent] = useState<TafseerContent | null>(
    null
  );
  const [tafseerLoading, setTafseerLoading] = useState(false);

  // Chargement des données de la sourate
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

  // Chargement des auteurs de tafsir
  useEffect(() => {
    fetchTafseerList()
      .then((data) => {
        // Filtrer pour avoir principalement les tafsirs arabes
        const arabicTafseers = data
          .filter((t: TafseerAuthor) => t.language === "ar")
          .slice(0, 5);
        setTafseerAuthors(arabicTafseers);
      })
      .catch((error) => {
        console.error("Error fetching tafseer authors:", error);
      });
  }, []);

  // Mémoriser les reciters pour éviter de recalculer à chaque rendu
  const reciters = useMemo(() => {
    return surah
      ? Object.values((surah.audio as Record<string, ReciterAudio>) || {})
      : [];
  }, [surah]);

  // Mémoriser l'audio sélectionné
  const selectedAudio = useMemo(() => {
    return reciters.find((r) => r.reciter === reciter) || reciters[0];
  }, [reciters, reciter]);

  // Met à jour l'audio sans recharger la page
  useEffect(() => {
    if (reciters.length && !reciters.find((r) => r.reciter === reciter)) {
      setReciter(reciters[0].reciter);
    }
  }, [reciters, reciter]);

  // Fonction pour charger le tafsir d'un verset spécifique
  const loadTafseer = async (ayahNumber: number) => {
    if (activeTafseer === ayahNumber) {
      // Si le même tafsir est cliqué, fermer le panneau
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
        ayahNumber
      );
      setTafseerContent(tafseerData);
    } catch (error) {
      console.error("Error loading tafseer:", error);
    } finally {
      setTafseerLoading(false);
    }
  };

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
          {surah.revelationPlace === "Mecca" ? "مكة" : "المدينة"} •{" "}
          {surah.totalAyah} آية
        </div>
      </header>

      {/* Lecteur audio épuré */}
      <div className="flex flex-col items-center gap-2 mb-8">
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
          <audio key={selectedAudio.url} controls className="w-full max-w-md">
            <source src={selectedAudio.url} type="audio/mp3" />
            متصفحك لا يدعم مشغل الصوت.
          </audio>
        )}
      </div>

      {/* Sélecteur de Tafsir */}
      <div className="mb-8 bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">التفسير</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-sm text-gray-600">اختر التفسير:</span>
          <div className="relative w-full sm:max-w-xs">
            <select
              className="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition bg-white pr-10"
              value={selectedTafseer}
              onChange={(e) => setSelectedTafseer(Number(e.target.value))}
              dir="rtl"
            >
              {tafseerAuthors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} - {author.author}
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
        </div>
        <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          انقر على زر التفسير بجانب الآية لعرض تفسيرها.
        </p>
      </div>

      {/* Versets avec boutons tafsir */}
      <div className="space-y-8">
        {surah.arabic1.map((ayah: string, idx: number) => (
          <div
            key={idx}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <div className="bg-white rounded-lg px-5 py-8 relative group shadow-sm hover:shadow transition-shadow">
              {/* Numéro discret */}
              <span className="absolute right-3 top-3 bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm">
                {idx + 1}
              </span>

              {/* Bouton tafsir */}
              <button
                onClick={() => loadTafseer(idx + 1)}
                className="absolute left-3 top-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xs transition-colors"
                title="عرض التفسير"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </button>

              {/* Texte arabe */}
              <div className="text-2xl md:text-3xl font-arabic text-center text-gray-800 leading-loose tracking-wide pt-4">
                {ayah}
              </div>
            </div>

            {/* Panneau tafsir */}
            {activeTafseer === idx + 1 && (
              <div className="mt-2 bg-gray-50 rounded-lg p-4 border border-gray-100 relative animate-fade-in">
                <button
                  onClick={() => setActiveTafseer(null)}
                  className="absolute left-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>

                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  تفسير الآية {idx + 1}
                </h4>

                {tafseerLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  </div>
                ) : tafseerContent ? (
                  <div className="text-gray-800 leading-relaxed text-base">
                    <div className="mb-2 text-xs text-gray-500">
                      {tafseerContent.tafseer_name} •{" "}
                      {
                        tafseerAuthors.find(
                          (a) => a.id === tafseerContent.tafseer_id
                        )?.author
                      }
                    </div>
                    <p className="text-right">{tafseerContent.text}</p>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    لم يتم العثور على تفسير لهذه الآية.
                  </div>
                )}
              </div>
            )}
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
