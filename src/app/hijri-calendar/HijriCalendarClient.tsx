"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    fetchHijriCalendarForGregorianMonth,
    fetchCurrentIslamicYear,
    fetchCurrentIslamicMonth,
    fetchIslamicMonths,
    type HijriCalendarDay,
    type IslamicMonth,
} from "@/utils/prayerApi";
import Breadcrumb from "@/components/elements/Breadcrumb";
import PageHero from "@/components/blocks/hero/PageHero";
import { motion } from "framer-motion";
import {
    Moon,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Calendar,
} from "lucide-react";

/** Arabic weekday names ordered Sunday..Saturday */
const WEEKDAYS_AR = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
];

/** Map English weekday names from API → 0-based index (Sun=0) */
const EN_WEEKDAY_INDEX: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

/** Convert Arabic-Indic numerals to Western numerals */
function toWesternNumerals(str: string): string {
    return str.replace(/[٠-٩]/g, (d) =>
        String("٠١٢٣٤٥٦٧٨٩".indexOf(d)),
    );
}

export default function HijriCalendarClient() {
    const [calendarDays, setCalendarDays] = useState<HijriCalendarDay[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [islamicYear, setIslamicYear] = useState<number | null>(null);
    const [islamicMonthNum, setIslamicMonthNum] = useState<number | null>(null);
    const [islamicMonths, setIslamicMonths] = useState<Record<string, IslamicMonth> | null>(null);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

    // Fetch current Islamic year/month/month-names once
    useEffect(() => {
        Promise.allSettled([
            fetchCurrentIslamicYear(),
            fetchCurrentIslamicMonth(),
            fetchIslamicMonths(),
        ]).then(([yearRes, monthRes, monthsRes]) => {
            if (yearRes.status === "fulfilled") setIslamicYear(yearRes.value);
            if (monthRes.status === "fulfilled") setIslamicMonthNum(monthRes.value);
            if (monthsRes.status === "fulfilled") setIslamicMonths(monthsRes.value);
        });
    }, []);

    // Fetch calendar for selected month
    const fetchCalendar = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchHijriCalendarForGregorianMonth(currentMonth, currentYear);
            setCalendarDays(data);
        } catch {
            setCalendarDays([]);
        } finally {
            setLoading(false);
        }
    }, [currentMonth, currentYear]);

    useEffect(() => {
        fetchCalendar();
    }, [fetchCalendar]);

    // Month navigation
    const goToPrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    };

    const gregMonthNames = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
    ];

    // First day offset for the grid
    const firstDayWeekday =
        calendarDays.length > 0
            ? EN_WEEKDAY_INDEX[calendarDays[0].gregorian.weekday.en] ?? 0
            : 0;

    // Current Hijri month name
    const currentHijriMonthName =
        islamicMonths && islamicMonthNum
            ? islamicMonths[String(islamicMonthNum)]?.ar
            : null;

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('/assets/bg.svg')] bg-repeat bg-center" />

            {/* ─── Hero Section ─── */}
            <PageHero
                backgroundImage={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771431621/calendar_kwoj5c.png`}
                breadcrumbs={[{ label: "التقويم الهجري" }]}
            // Wait, PageHero definition (viewed earlier) takes `children`.
            // Checking PageHero definition again:
            // interface PageHeroProps { ... children: ReactNode; ... }
            // It does NOT take title/description as direct props in the version I saw.
            // The version I saw in Step 1231:
            // export default function PageHero({ ... children ... }: PageHeroProps)
            // So I must pass the content as children.
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                        <Moon className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold uppercase tracking-wider text-white">
                            التقويم الإسلامي
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-momken text-white mb-4 drop-shadow-xl">
                        التقويم الهجري
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        تابع التواريخ الهجرية والميلادية في تقويم تفاعلي شامل.
                    </p>
                </motion.div>

                {/* Current Hijri Info Badge */}
                {(currentHijriMonthName || islamicYear) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center mt-8"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full shadow-lg">
                            <Calendar className="w-5 h-5 text-white" />
                            <span className="text-base font-bold text-white">
                                {currentHijriMonthName ?? ""} {islamicYear ? `${islamicYear} هـ` : ""}
                            </span>
                        </div>
                    </motion.div>
                )}
            </PageHero>

            {/* ─── Calendar Grid ─── */}
            <section className="container mx-auto px-4 max-w-5xl pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-[2rem] md:rounded-[3rem] shadow-xl border border-border p-4 mt-10 md:p-10 relative overflow-hidden"
                >
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={goToNextMonth}
                            className="p-3 rounded-xl bg-secondary hover:bg-primary/10 text-foreground hover:text-primary transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-black font-momken text-foreground">
                                {gregMonthNames[currentMonth - 1]} {currentYear}
                            </h2>
                            {calendarDays.length > 0 && (
                                <p className="text-muted-foreground text-sm mt-1">
                                    {calendarDays[0].hijri.month.ar}
                                    {calendarDays[0].hijri.month.ar !== calendarDays[calendarDays.length - 1].hijri.month.ar
                                        ? ` — ${calendarDays[calendarDays.length - 1].hijri.month.ar}`
                                        : ""}{" "}
                                    {toWesternNumerals(calendarDays[0].hijri.year)} هـ
                                </p>
                            )}
                        </div>
                        <button
                            onClick={goToPrevMonth}
                            className="p-3 rounded-xl bg-secondary hover:bg-primary/10 text-foreground hover:text-primary transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                                {WEEKDAYS_AR.map((day) => (
                                    <div
                                        key={day}
                                        className="text-center text-xs md:text-sm font-bold text-muted-foreground py-2"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1 md:gap-2">
                                {/* Empty offset slots */}
                                {Array.from({ length: firstDayWeekday }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square" />
                                ))}

                                {/* Calendar Days */}
                                {calendarDays.map((day) => {
                                    const isToday = day.gregorian.date === todayStr;
                                    const hasHoliday = day.hijri.holidays.length > 0;
                                    const gregDay = toWesternNumerals(day.gregorian.day);
                                    const hijriDay = toWesternNumerals(day.hijri.day);

                                    return (
                                        <div
                                            key={day.gregorian.date}
                                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 transition-all duration-200 relative group cursor-default ${isToday
                                                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                                : hasHoliday
                                                    ? "bg-primary/10 border border-primary/20 hover:bg-primary/15"
                                                    : "hover:bg-secondary"
                                                }`}
                                        >
                                            {/* Gregorian Day (normal) */}
                                            <span
                                                className={`text-sm md:text-base font-bold ${isToday ? "text-white" : "text-foreground"
                                                    }`}
                                            >
                                                {gregDay}
                                            </span>
                                            {/* Hijri Day (brown / primary color) */}
                                            <span
                                                className={`text-[10px] md:text-xs font-semibold ${isToday ? "text-white/80" : "text-primary"
                                                    }`}
                                            >
                                                {hijriDay}
                                            </span>
                                            {/* Holiday dot */}
                                            {hasHoliday && !isToday && (
                                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded bg-foreground/80" />
                                    <span>ميلادي</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded bg-primary" />
                                    <span>هجري</span>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </section>
        </div>
    );
}
