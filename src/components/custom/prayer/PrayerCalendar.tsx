"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  fetchMonthlyPrayerCalendar,
  deriveMethodForTimezone,
} from "@/utils/prayerApi";
import { CalendarDayData } from "@/types/Prayer";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface PrayerCalendarProps {
  coords: { lat: number; lng: number } | null;
  locationName?: string;
}

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const ENGLISH_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PrayerCalendar({
  coords,
  locationName,
}: PrayerCalendarProps) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
  const [year, setYear] = useState(today.getFullYear());
  const [calendarData, setCalendarData] = useState<CalendarDayData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!coords) return;

      setLoading(true);
      setError(null);

      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const { method, latitudeAdjustmentMethod } =
          await deriveMethodForTimezone(tz, coords.lat, coords.lng);

        const response = await fetchMonthlyPrayerCalendar({
          month,
          year,
          latitude: coords.lat,
          longitude: coords.lng,
          method,
          latitudeAdjustmentMethod,
        });

        const cleanTime = (time: string) => {
          if (!time) return "";
          // Remove timezone like "(CET) " at the beginning or " (CET)" at the end
          let cleaned = time.replace(/^\([^)]*\)\s*/g, ""); // Remove from start
          cleaned = cleaned.replace(/\s*\([^)]*\)$/g, ""); // Remove from end
          cleaned = cleaned.trim();
          // If still has spaces, take the last part (the actual time)
          const parts = cleaned.split(/\s+/);
          return parts[parts.length - 1];
        };

        const days: CalendarDayData[] = response.data.map((item) => ({
          gregorianDate: item.date.gregorian.date,
          gregorianDay: item.date.gregorian.day,
          gregorianMonth: item.date.gregorian.month.en,
          gregorianYear: item.date.gregorian.year,
          gregorianWeekday:
            item.date.hijri.weekday.ar || item.date.hijri.weekday.en,
          hijriDate: item.date.hijri.date,
          hijriDay: item.date.hijri.day,
          hijriMonth: item.date.hijri.month.ar,
          hijriYear: item.date.hijri.year,
          hijriWeekday: item.date.hijri.weekday.ar,
          timings: {
            Fajr: cleanTime(item.timings.Fajr || ""),
            Sunrise: cleanTime(item.timings.Sunrise || ""),
            Dhuhr: cleanTime(item.timings.Dhuhr || ""),
            Asr: cleanTime(item.timings.Asr || ""),
            Maghrib: cleanTime(item.timings.Maghrib || ""),
            Isha: cleanTime(item.timings.Isha || ""),
          },
        }));

        setCalendarData(days);
      } catch (err) {
        console.error("Error fetching calendar:", err);
        setError("تعذر تحميل التقويم. حاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [month, year, coords]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;

    setExporting(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = printRef.current;

      // We need to ensure fonts are loaded
      await document.fonts.ready;

      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#FAFAFA",
        windowWidth: 794, // A4 width in px at 96dpi approx
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`تقويم-الصلاة-${ARABIC_MONTHS[month - 1]}-${year}.pdf`);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      alert("حدث خطأ أثناء تصدير PDF");
    } finally {
      setExporting(false);
    }
  };

  if (!coords) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CalendarIcon className="mx-auto mb-4 w-16 h-16 opacity-30" />
        <p className="text-lg font-medium">
          يرجى تحديد موقعك أولاً لعرض التقويم
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            disabled={loading}
            className="p-3 rounded-2xl bg-card border border-border hover:bg-primary/5 hover:border-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>

          <h3 className="text-2xl font-bold font-momken text-foreground min-w-50 text-center">
            {ARABIC_MONTHS[month - 1]} {year}
          </h3>

          <button
            onClick={handleNextMonth}
            disabled={loading}
            className="p-3 rounded-2xl bg-card border border-border hover:bg-primary/5 hover:border-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={loading || exporting || calendarData.length === 0}
          className="group flex items-center gap-3 px-6 py-3 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-linear-to-r from-[#8B4513] to-[#5d3119]"
        >
          {exporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري التصدير...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              <span>تحميل PDF</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800/50 rounded-xl text-center">
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
          <p className="text-muted-foreground font-medium">
            جاري تحميل التقويم...
          </p>
        </div>
      ) : (
        <div
          data-calendar="true"
          className="overflow-x-auto scroll-smooth scrollbar-custom -mx-4 px-4 md:mx-0 md:px-0"
        >
          {/* Prayer Times Table */}
          <div className="overflow-hidden rounded-3xl border border-border shadow-xl bg-card min-w-200">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-l from-[#8B4513] to-[#5d3119]">
                  {[
                    "التاريخ الهجري",
                    "الفجر",
                    "الشروق",
                    "الظهر",
                    "العصر",
                    "المغرب",
                    "العشاء",
                    "التاريخ الميلادي",
                  ].map((head, i) => (
                    <th
                      key={head}
                      className={`px-3 py-3.5 text-center text-xs md:text-sm font-bold text-white/90 tracking-wide whitespace-nowrap ${i === 0
                          ? "border-l border-white/10"
                          : i === 7
                            ? "border-r border-white/10"
                            : ""
                        }`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {calendarData.map((day, idx) => {
                  const isToday =
                    parseInt(day.gregorianDay) === today.getDate() &&
                    month === today.getMonth() + 1 &&
                    year === today.getFullYear();

                  const isFriday = day.hijriWeekday === "الجمعة";

                  return (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.015 }}
                      className={`transition-colors duration-200 ${isToday
                          ? "bg-primary/10 dark:bg-primary/20"
                          : isFriday
                            ? "bg-primary/4"
                            : idx % 2 === 0
                              ? "bg-white dark:bg-white/2"
                              : "bg-card dark:bg-white/4"
                        } hover:bg-primary/8 dark:hover:bg-primary/12`}
                    >
                      {/* Hijri Date Column */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <span className="text-xs md:text-sm font-bold text-primary">
                          {day.hijriDay} {day.hijriMonth}
                        </span>
                      </td>

                      {/* Prayer Times */}
                      {[
                        day.timings.Fajr,
                        day.timings.Sunrise,
                        day.timings.Dhuhr,
                        day.timings.Asr,
                        day.timings.Maghrib,
                        day.timings.Isha,
                      ].map((time, tIdx) => (
                        <td
                          key={tIdx}
                          className="px-3 py-2.5 text-center whitespace-nowrap"
                        >
                          <span className="text-sm md:text-base font-semibold text-foreground tabular-nums">
                            {time}
                          </span>
                        </td>
                      ))}

                      {/* Gregorian Date Column */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <span className="text-xs md:text-sm font-bold text-foreground">
                          {day.gregorianDay} {ARABIC_MONTHS[month - 1]}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Legend */}
          <div className="mt-5 flex flex-wrap justify-center gap-6 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/20 ring-2 ring-primary/40" />
              <span className="text-muted-foreground">اليوم</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/6 ring-2 ring-primary/20" />
              <span className="text-muted-foreground">الجمعة</span>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Container */}
      <div
        ref={printRef}
        style={{
          position: "fixed",
          top: "-10000px",
          left: "-10000px",
          width: "794px",
          minHeight: "1123px",
          padding: "40px",
          backgroundColor: "#FAFAFA",
          fontFamily: "Arial, sans-serif",
          direction: "rtl",
          zIndex: -1,
          color: "#1a1a1a",
        }}
        className="print-container"
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "2px solid rgba(139, 94, 60, 0.15)",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#8b5e3c",
              marginBottom: "6px",
            }}
          >
            تقويم أوقات الصلاة
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "4px",
            }}
          >
            {ARABIC_MONTHS[month - 1]} {year} — {ENGLISH_MONTHS[month - 1]}{" "}
            {year}
          </p>
          {locationName && (
            <p
              style={{
                fontSize: "13px",
                color: "#999",
              }}
            >
              {locationName}
            </p>
          )}
        </div>

        {/* Table */}
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(139, 94, 60, 0.12)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(to left, #8B4513, #5d3119)",
                  color: "white",
                }}
              >
                {[
                  "التاريخ الهجري",
                  "الفجر",
                  "الشروق",
                  "الظهر",
                  "العصر",
                  "المغرب",
                  "العشاء",
                  "التاريخ الميلادي",
                ].map((head) => (
                  <th
                    key={head}
                    style={{
                      padding: "10px 6px",
                      fontWeight: "bold",
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                      borderBottom: "2px solid rgba(139, 94, 60, 0.3)",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendarData.map((day, idx) => {
                const isFriday = day.hijriWeekday === "الجمعة";
                return (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa",
                      borderBottom: "1px solid rgba(139, 94, 60, 0.06)",
                    }}
                  >
                    <td
                      style={{
                        padding: "7px 6px",
                        fontWeight: "bold",
                        fontSize: "11px",
                        color: "#8b5e3c",
                      }}
                    >
                      {day.hijriDay} {day.hijriMonth}
                    </td>
                    {[
                      day.timings.Fajr,
                      day.timings.Sunrise,
                      day.timings.Dhuhr,
                      day.timings.Asr,
                      day.timings.Maghrib,
                      day.timings.Isha,
                    ].map((time, tIdx) => (
                      <td
                        key={tIdx}
                        style={{
                          padding: "7px 6px",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: isFriday ? "#8B4513" : "#1a1a1a",
                          fontFamily: "monospace",
                        }}
                      >
                        {time}
                      </td>
                    ))}
                    <td
                      style={{
                        padding: "7px 6px",
                        fontWeight: "bold",
                        fontSize: "11px",
                        color: "#333",
                      }}
                    >
                      {day.gregorianDay} {ARABIC_MONTHS[month - 1]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
            color: "#aaa",
            fontSize: "10px",
          }}
        >
          تم استخراج هذا الجدول من تطبيق مواقيت الصلاة
        </div>
      </div>
    </div>
  );
}
