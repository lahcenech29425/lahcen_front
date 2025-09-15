"use client";
import { useEffect, useState } from "react";
import { fetchSurahList } from "@/utils/quranApi";
import { Link } from "@/components/elements/Link";
import BookReader from "@/components/elements/BookReader";
import { Surah } from "@/types/Surah";

const PAGE_SIZE = 12;

function normalizeArabic(str: string) {
  return str
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filtered, setFiltered] = useState<Surah[]>([]);
  const [search, setSearch] = useState("");
  const [place, setPlace] = useState(""); // Meccan/Medinan
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState<Surah[]>([]); // For autocomplete
  const [showSuggestions, setShowSuggestions] = useState(false); // Control visibility of suggestions

  const [type, setType] = useState<"hafs" | "warsh">("hafs");
  const [show, setShow] = useState(false);

  // Lien des Mushafs
  const mushafUrls: Record<string, string> = {
    hafs: "https://qurancomplex.gov.sa/isdarat-hafs/#flipbook-df_11311/7/",
    warsh: "https://qurancomplex.gov.sa/isdarat-qiraat/#flipbook-df_11326/1/",
  };

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
          s.englishNameTranslation.trim().toLowerCase().includes(searchNorm)
      );
      // Suggestions for autocomplete (max 5)
      setSuggestions(
        surahs
          .filter(
            (s) =>
              normalizeArabic(s.name).includes(searchNormArabic) ||
              s.englishName.trim().toLowerCase().includes(searchNorm) ||
              s.englishNameTranslation.trim().toLowerCase().includes(searchNorm)
          )
          .slice(0, 5)
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

  return (
    <div className="max-w-4xl mx-auto py-10 px-4" dir="rtl">
      {/* Navigation */}
      <nav className="mb-8 flex items-center gap-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700 transition">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold">القرآن الكريم</span>
      </nav>

      <div className="max-w-4xl mx-auto py-10" dir="rtl">
        {/* Titre principal */}
        <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
          القرآن الكريم
        </h1>

        {/* Introduction */}
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          تصفح سور القرآن الكريم، ابحث باسم السورة أو الفلترة حسب مكان النزول،
          ثم اختر المصحف المفضل (حفص أو ورش) للقراءة المباشرة.
        </p>

        {/* Sélection du type de Mushaf et bouton */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <div className="relative w-full md:w-48">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "hafs" | "warsh")}
              className="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition bg-white pr-10"
              dir="rtl"
            >
              <option value="hafs">رواية حفص</option>
              <option value="warsh">رواية ورش</option>
            </select>

            {/* أيقونة السهم */}
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

          <button
            onClick={() => setShow(!show)}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-700 transition"
          >
            {show ? "إخفاء المصحف" : "عرض المصحف"}
          </button>
        </div>

        {/* Composant BookReader */}
        {show && (
          <BookReader
            url={mushafUrls[type]}
            title="المصحف الشريف"
            height="800px"
          />
        )}

        {/* Section de recherche et filtres */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 text-center">
            البحث والفلترة
          </h2>
          <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
            ابحث باسم السورة أو الترجمة أو بالعربية، أو قم بفلترة السور حسب مكان
            النزول.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {/* Input de recherche */}
            <div className="relative w-full md:w-80">
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                placeholder="ابحث باسم السورة أو الترجمة أو بالعربية..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                dir="rtl"
                autoComplete="off"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>

              {/* Suggestions autocomplete */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-56 overflow-auto">
                  {suggestions.map((s) => (
                    <li
                      key={s.number}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-right"
                      onMouseDown={() => {
                        setSearch(s.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <span className="font-semibold text-gray-800">
                        {s.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {s.englishName}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Select lieu de révélation */}
            <div className="relative w-full md:w-48">
              <select
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition bg-white pr-10"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                dir="rtl"
              >
                <option value="">مكان النزول</option>
                <option value="Meccan">مكة</option>
                <option value="Medinan">المدينة</option>
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
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {paged.map((s, idx) => (
          <Link
            href={`/quran/${s.number}`}
            key={s.number}
            className="block bg-white rounded-xl shadow hover:shadow-lg transition p-5 group border border-gray-100 animate-fade-in"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-gray-800">
                  {s.name}
                </div>
                <div className="text-gray-700">
                  <span className="text-gray-500">({s.englishName})</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {s.revelationType === "Meccan"
                    ? "مكان النزول: مكة"
                    : "مكان النزول: المدينة"}{" "}
                  • {s.numberOfAyahs} آية
                </div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-800 font-bold text-xl group-hover:bg-gray-900 group-hover:text-white transition">
                {s.number}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        {page > 1 && (
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition text-gray-700"
            onClick={() => setPage(page - 1)}
          >
            السابق
          </button>
        )}
        <span className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow">
          {page}
        </span>
        {pageCount > page && (
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition text-gray-700"
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
