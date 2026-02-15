"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Search, Loader2, X } from "lucide-react";

interface LocationSelectorProps {
  onLocationSelect: (lat: number, lng: number, city: string) => void;
  onClose?: () => void;
}

type City = { name: string; country?: string; lat: number; lng: number };

export default function LocationSelector({
  onLocationSelect,
  onClose,
}: LocationSelectorProps) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search cities when user types
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
      await new Promise((resolve) => setTimeout(resolve, 300));
      onLocationSelect(picked.lat, picked.lng, picked.name);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-card border-2 border-[#8B4513]/10 dark:border-primary/30 rounded-[2rem] p-8 shadow-2xl max-w-md mx-auto">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      )}

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B4513]/5 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ecad20]/5 rounded-tr-full pointer-events-none" />

      <div className="flex flex-col items-center gap-4 mb-8 text-center relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-[#8B4513] to-[#5d3119] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 ">
          <MapPin className="h-7 w-7 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold font-momken text-[#2c1810] dark:text-[#ededed]">
            تحديد الموقع
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">
            ابحث عن مدينتك للحصول على أدق مواقيت الصلاة
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
        {/* Search */}
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مدينة (مثال: Riyadh)..."
            className="w-full px-5 py-4 pr-12 text-right text-sm font-bold rounded-xl 
                       bg-gray-50 dark:bg-background border-2 border-gray-200 dark:border-border 
                       group-focus-within:border-[#8B4513] focus:outline-none 
                       focus:ring-4 focus:ring-[#8B4513]/10 transition-all 
                       placeholder:text-gray-400 text-[#2c1810] dark:text-white shadow-inner"
            dir="rtl"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#8B4513] transition-colors" />

          {loadingCities && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="h-5 w-5 text-[#8B4513] animate-spin" />
            </div>
          )}
        </div>

        {/* City Select */}
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!cities.length}
            className="w-full px-5 py-4 text-right text-sm font-bold rounded-xl appearance-none
                       bg-gray-50 dark:bg-background border-2 border-gray-200 dark:border-border
                       focus:border-[#8B4513] focus:outline-none 
                       focus:ring-4 focus:ring-[#8B4513]/10 transition-all 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-[#2c1810] dark:text-foreground cursor-pointer hover:bg-gray-100 dark:hover:bg-card shadow-inner"
            dir="rtl"
          >
            <option value="">
              {cities.length > 0
                ? "اختر المدينة من القائمة"
                : "ادخل اسم المدينة أعلاه..."}
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedCity || isSubmitting}
          className="w-full py-4 px-6 rounded-xl font-bold text-white shadow-xl
                     bg-gradient-to-r from-[#8B4513] to-[#A0522D]
                     hover:from-[#723a0f] hover:to-[#8B4513]
                     transform active:scale-[0.98] transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <MapPin className="h-5 w-5" />
              <span>تأكيد الموقع</span>
            </>
          )}
        </button>
      </form>

      {cities.length > 0 && query && (
        <div className="mt-4 text-center">
          <span className="px-3 py-1 rounded-full bg-[#8B4513]/10 dark:bg-primary/15 text-[#8B4513] dark:text-primary text-xs font-bold">
            تم العثور على {cities.length} نتيجة
          </span>
        </div>
      )}
    </div>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
