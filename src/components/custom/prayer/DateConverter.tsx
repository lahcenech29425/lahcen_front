"use client";
import React, { useState } from "react";
import {
  convertGregorianToHijri,
  convertHijriToGregorian,
  DateConversionResult,
} from "@/utils/prayerApi";
import { ArrowLeftRight, Calendar, Loader2, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ConversionMode = "gToH" | "hToG";

const HIJRI_MONTHS_AR: Record<number, string> = {
  1: "مُحَرَّم",
  2: "صَفَر",
  3: "رَبيع الأوّل",
  4: "رَبيع الثاني",
  5: "جُمادى الأولى",
  6: "جُمادى الآخرة",
  7: "رَجَب",
  8: "شَعبان",
  9: "رَمَضان",
  10: "شَوّال",
  11: "ذو القعدة",
  12: "ذو الحجة",
};

const GREGORIAN_MONTHS_AR: Record<number, string> = {
  1: "يناير",
  2: "فبراير",
  3: "مارس",
  4: "أبريل",
  5: "مايو",
  6: "يونيو",
  7: "يوليو",
  8: "أغسطس",
  9: "سبتمبر",
  10: "أكتوبر",
  11: "نوفمبر",
  12: "ديسمبر",
};

const WEEKDAYS_AR: Record<string, string> = {
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
  "Al Ahad": "الأحد",
  "Al Ithnayn": "الإثنين",
  "Al Thulatha'a": "الثلاثاء",
  "Al Arba'a": "الأربعاء",
  "Al Khamees": "الخميس",
  "Al Jumu'a": "الجمعة",
  "Al Sabt": "السبت",
};

export default function DateConverter() {
  const [mode, setMode] = useState<ConversionMode>("gToH");
  // Gregorian mode: native date string (YYYY-MM-DD)
  const [gregorianDate, setGregorianDate] = useState("");
  // Hijri mode: separate selects
  const [hijriDay, setHijriDay] = useState("");
  const [hijriMonth, setHijriMonth] = useState("");
  const [hijriYear, setHijriYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DateConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    let dateStr: string;

    if (mode === "gToH") {
      if (!gregorianDate) {
        setError("يرجى اختيار التاريخ");
        return;
      }
      // gregorianDate is "YYYY-MM-DD", API expects "DD-MM-YYYY"
      const [y, m, d] = gregorianDate.split("-");
      dateStr = `${d}-${m}-${y}`;
    } else {
      if (!hijriDay || !hijriMonth || !hijriYear) {
        setError("يرجى إدخال التاريخ الكامل");
        return;
      }
      const dd = hijriDay.padStart(2, "0");
      const mm = hijriMonth.padStart(2, "0");
      dateStr = `${dd}-${mm}-${hijriYear}`;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data =
        mode === "gToH"
          ? await convertGregorianToHijri(dateStr)
          : await convertHijriToGregorian(dateStr);
      setResult(data);
    } catch {
      setError("تعذر تحويل التاريخ. تحقق من صحة البيانات المدخلة.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "gToH" ? "hToG" : "gToH"));
    setResult(null);
    setError(null);
    setGregorianDate("");
    setHijriDay("");
    setHijriMonth("");
    setHijriYear("");
  };

  const isGregorianInput = mode === "gToH";

  // Hijri year options (1400 - 1500)
  const hijriYearOptions = Array.from({ length: 101 }, (_, i) => 1400 + i);

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <button
          onClick={toggleMode}
          className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
        >
          <span
            className={`text-sm font-bold transition-colors ${
              isGregorianInput ? "text-primary" : "text-muted-foreground"
            }`}
          >
            ميلادي
          </span>
          <ArrowLeftRight className="w-5 h-5 text-primary group-hover:rotate-180 transition-transform duration-500" />
          <span
            className={`text-sm font-bold transition-colors ${
              !isGregorianInput ? "text-primary" : "text-muted-foreground"
            }`}
          >
            هجري
          </span>
        </button>
      </div>

      {/* Input Card */}
      <motion.div
        layout
        className="bg-white dark:bg-white/5 border border-primary/10 rounded-4xl p-6 md:p-8 hover:border-primary/20 transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/5 w-10 h-10 rounded-xl flex items-center justify-center">
            {isGregorianInput ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </div>
          <h3 className="text-lg font-bold font-momken text-foreground">
            {isGregorianInput ? "اختر التاريخ الميلادي" : "أدخل التاريخ الهجري"}
          </h3>
        </div>

        {isGregorianInput ? (
          /* Gregorian: native date picker */
          <div className="mb-6">
            <input
              type="date"
              value={gregorianDate}
              onChange={(e) => setGregorianDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-primary/10 bg-background text-foreground text-center text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all cursor-pointer"
            />
          </div>
        ) : (
          /* Hijri: 3 select dropdowns */
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Day */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                اليوم
              </label>
              <select
                value={hijriDay}
                onChange={(e) => setHijriDay(e.target.value)}
                className="w-full px-3 py-3.5 rounded-xl border border-primary/10 bg-background text-foreground text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all appearance-none cursor-pointer"
              >
                <option value="">اليوم</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={String(d)}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                الشهر
              </label>
              <select
                value={hijriMonth}
                onChange={(e) => setHijriMonth(e.target.value)}
                className="w-full px-3 py-3.5 rounded-xl border border-primary/10 bg-background text-foreground text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all appearance-none cursor-pointer"
              >
                <option value="">الشهر</option>
                {Object.entries(HIJRI_MONTHS_AR).map(([num, name]) => (
                  <option key={num} value={num}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                السنة
              </label>
              <select
                value={hijriYear}
                onChange={(e) => setHijriYear(e.target.value)}
                className="w-full px-3 py-3.5 rounded-xl border border-primary/10 bg-background text-foreground text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all appearance-none cursor-pointer"
              >
                <option value="">السنة</option>
                {hijriYearOptions.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#8B4513] to-[#5d3119] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري التحويل...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              تحويل التاريخ
            </>
          )}
        </button>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500 font-medium">
            {error}
          </p>
        )}
      </motion.div>

      {/* Result Card */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            {/* Hijri Result */}
            <div className="bg-linear-to-br from-[#8B4513] to-[#5d3119] text-white rounded-4xl p-6 md:p-8 shadow-[0_15px_40px_rgba(139,69,19,0.25)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="w-5 h-5 opacity-80" />
                  <span className="text-sm font-bold opacity-80">
                    التاريخ الهجري
                  </span>
                </div>
                <div className="text-3xl md:text-4xl font-black font-momken mb-2">
                  {result.hijri.day}{" "}
                  {result.hijri.month.ar ||
                    HIJRI_MONTHS_AR[result.hijri.month.number]}{" "}
                  {result.hijri.year} هـ
                </div>
                <div className="text-base opacity-70">
                  {WEEKDAYS_AR[result.hijri.weekday.en] ||
                    result.hijri.weekday.ar}
                </div>
                {result.hijri.holidays && result.hijri.holidays.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.hijri.holidays.map((h, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/15 rounded-full text-xs font-bold"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Gregorian Result */}
            <div className="bg-white dark:bg-white/5 border border-primary/10 rounded-4xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-primary">
                  التاريخ الميلادي
                </span>
              </div>
              <div className="text-3xl md:text-4xl font-black font-momken text-foreground mb-2">
                {result.gregorian.day}{" "}
                {GREGORIAN_MONTHS_AR[result.gregorian.month.number] ||
                  result.gregorian.month.en}{" "}
                {result.gregorian.year} م
              </div>
              <div className="text-base text-muted-foreground">
                {WEEKDAYS_AR[result.gregorian.weekday.en] ||
                  result.gregorian.weekday.en}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
