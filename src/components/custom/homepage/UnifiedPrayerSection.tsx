"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/components/elements/Link";
import {
    Clock,
    Calendar as CalendarIcon,
    ArrowLeftRight,
    Download,
    Sparkles,
    ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";

export default function UnifiedPrayerSection() {
    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-background">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wider text-primary">
                            العبادات والتقويم
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight font-momken text-foreground"
                    >
                        نظم وقتك، وكن على صلة بخالقك
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-xl leading-relaxed"
                    >
                        وفرنا لك أدوات متكاملة لمتابعة مواقيت الصلاة، تحويل التواريخ، وتحميل التقاويم الشهرية بتصميم عصري يسهل عليك العبادة.
                    </motion.p>
                </div>

                {/* Dashboard Grid (Bento Style) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

                    {/* 1. Main Prayer Times Block */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="md:col-span-8 group relative rounded-[40px] overflow-hidden bg-linear-to-br from-card to-card/50 border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-xl"
                    >
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/prayer-times-home.png"
                                alt="مواقيت الصلاة"
                                fill
                                className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
                        </div>

                        <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end min-h-[450px]">
                            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black mb-4 font-momken text-foreground">
                                مواقيت الصلاة بدقة
                            </h3>
                            <p className="text-muted-foreground text-lg mb-8 max-w-xl">
                                تابع مواقيت الصلاة في مدينتك مع تنبيهات ذكية والعد التنازلي للصلاة القادمة. دقة متناهية وسكينة في القلب.
                            </p>
                            <Link
                                href="/prayer-times"
                                className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:gap-4 transition-all duration-300"
                            >
                                <span>عرض المواقيت الآن</span>
                                <ChevronLeft className="w-6 h-6" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* 2. Hijri & Converter Block */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-4 flex flex-col gap-6 lg:gap-8"
                    >
                        {/* Calendar Card */}
                        <div className="flex-1 rounded-[40px] bg-primary p-8 text-white relative overflow-hidden group shadow-lg">
                            <CalendarIcon className="absolute -bottom-6 -left-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                                    <CalendarIcon className="w-6 h-6" />
                                </div>
                                <h4 className="text-2xl font-bold mb-3 font-momken">التقويم الهجري</h4>
                                <p className="text-white/80 mb-6 text-base">
                                  متابعة دقيقة لأيام وشهور السنة الهجرية.
                                </p>
                                <Link
                                    href="/hijri-calendar"
                                    className="px-6 py-3 rounded-full bg-white text-primary font-bold inline-block hover:scale-105 transition-transform shadow-xl shadow-black/10"
                                >
                                    عرض التقويم
                                </Link>
                            </div>
                        </div>

                        {/* Converter Card */}
                        <div className="flex-1 rounded-[40px] bg-secondary p-8 border border-primary/10 relative overflow-hidden group shadow-lg">
                            <ArrowLeftRight className="absolute -top-6 -right-6 w-32 h-32 text-primary/5 group-hover:-rotate-12 transition-transform duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                    <ArrowLeftRight className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-2xl font-bold mb-3 font-momken">محول التاريخ</h4>
                                <p className="text-muted-foreground mb-6 text-base">
                                    حول بين الهجري والميلادي بلمسة واحدة.
                                </p>
                                <Link
                                    href="/prayer-times#date-converter"
                                    className="px-6 py-3 rounded-full bg-primary text-white font-bold inline-block hover:scale-105 transition-transform shadow-xl shadow-primary/20"
                                >
                                    حول الآن
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Bottom Download Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-12 group relative rounded-[40px] overflow-hidden min-h-[280px] flex items-center shadow-xl border border-primary/10"
                    >
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/download-calendar-home.png"
                                alt="تحميل التقويم"
                                fill
                                className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
                        </div>

                        <div className="relative z-10 p-8 md:p-10 flex flex-col justify-between w-full h-full gap-6">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <Download className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black font-momken text-foreground">
                                        تحميل التقويم الشهري
                                    </h3>
                                </div>
                                <p className="text-muted-foreground text-base max-w-lg">
                                    احصل على نسخة PDF أنيقة وجاهزة للطباعة تحتوي على جميع مواقيت الصلاة في مدينتك للشهر الحالي.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <Link
                                    href="/prayer-times#prayer-calendar"
                                    className="flex items-center gap-3 px-8 py-4 bg-primary rounded-full text-white font-black text-base shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 w-fit"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>تحميل التقويم الآن</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
