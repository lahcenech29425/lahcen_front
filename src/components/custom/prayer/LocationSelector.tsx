"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";

interface LocationSelectorProps {
  onLocationSelect: (lat: number, lng: number, city: string) => void;
}

type City = { name: string; country?: string; lat: number; lng: number };

export default function LocationSelector({
  onLocationSelect,
}: LocationSelectorProps) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search cities when user types or chooses a country
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        if (!query) {
          setCities([]);
          return;
        }
        setLoadingCities(true);
        const params = new URLSearchParams();
        params.set("q", query);
        const res = await fetch(`/api/location/cities?${params.toString()}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        setCities(json.cities || []);
      } catch (e) {
        const err = e as { name?: string } | undefined;
        if (err?.name !== "AbortError") setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    const id = setTimeout(run, 350);
    return () => {
      controller.abort();
      clearTimeout(id);
    };
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const picked = cities.find((c) => c.name === selectedCity);
    if (picked) {
      setIsSubmitting(true);
      // Simulate a brief loading state for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      onLocationSelect(picked.lat, picked.lng, picked.name);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-2xl p-4 sm:p-7 border-2 border-gray-200 shadow-lg max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <MapPin className="h-5 w-5 text-[#ecad20]" />
        <h3 className="text-lg sm:text-xl font-bold text-[#171717]">
          اختيار الموقع يدوياً
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مدينة..."
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-right text-sm font-semibold focus:border-[#ecad20] focus:ring-2 focus:ring-[#ecad20]/20 outline-none transition-all max-w-md"
            dir="rtl"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* City Select */}
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
            المدينة
          </label>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-right text-sm font-semibold focus:border-[#ecad20] focus:ring-2 focus:ring-[#ecad20]/20 outline-none transition-all appearance-none max-w-md"
              dir="rtl"
              required
            >
              <option value="">
                {loadingCities ? "جاري تحميل المدن..." : "اختر مدينة"}
              </option>
              {cities.map((city) => (
                <option
                  key={`${city.name}-${city.lat}-${city.lng}`}
                  value={city.name}
                >
                  {city.name} {city.country ? `- ${city.country}` : ""}
                </option>
              ))}
            </select>
          </div>
          {!loadingCities && cities.length === 0 && (
            <p className="mt-2 text-xs text-gray-500">
              لا توجد نتائج، جرّب كتابة اسم المدينة.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedCity || isSubmitting}
          className="w-full bg-gradient-to-br from-[#171717] to-[#2a2a2a] text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-[#ecad20]/30 relative overflow-hidden group"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              جاري التحميل...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" />
              تأكيد الموقع
            </span>
          )}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-500 text-center">
        {loadingCities ? "جاري التحميل..." : `${cities.length} نتيجة`}
      </p>
    </div>
  );
}
