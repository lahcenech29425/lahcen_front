"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/elements/Breadcrumb";

interface Name {
    id: number;
    name: string;
    text: string;
}

interface NamesOfAllahClientProps {
    names: Name[];
}

export default function NamesOfAllahClient({ names }: NamesOfAllahClientProps) {
    const [search, setSearch] = useState("");
    const [selectedName, setSelectedName] = useState<Name | null>(null);

    const filteredNames = useMemo(() => {
        return names.filter(
            (n) =>
                n.name.includes(search) ||
                n.text.includes(search) ||
                n.id.toString() === search
        );
    }, [names, search]);

    return (
        <div className="min-h-screen bg-background text-foreground dir-rtl relative overflow-hidden" dir="rtl">
            {/* Side Decorations - Similar to Home/Drawer */}
            <div
                className="fixed left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-primary z-0"
                style={{
                    maskImage: "url('/assets/bg.svg')",
                    WebkitMaskImage: "url('/assets/bg.svg')",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center"
                }}
            />
            <div
                className="fixed right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-primary z-0"
                style={{
                    maskImage: "url('/assets/bg.svg')",
                    WebkitMaskImage: "url('/assets/bg.svg')",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center"
                }}
            />

            {/* Hero Section */}
            <section className="relative h-[450px] md:h-[550px] flex flex-col justify-center overflow-hidden bg-background" dir="rtl">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://res.cloudinary.com/dpuhywxsf/image/upload/v1771248765/quran-header_rqbcvq.png"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center gap-6">
                    <div className="w-full flex justify-start">
                        <Breadcrumb
                            items={[{ label: "أسماء الله الحسنى" }]}
                            className="text-white/80 mb-0"
                        />
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-9xl font-medium font-momken text-white mb-2"
                            style={{ fontFamily: 'AsmaaAllah', lineHeight: '1.2' }}
                        >
                            101
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 max-w-2xl leading-relaxed font-amiri mx-auto"
                        >
                            "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا"
                            <br />
                            تَعَرَّفْ عَلَى مَعَانِي أَسْمَاءِ اللَّهِ الْجَلِيلَةِ وَتَدَبَّرْ فِي صِفَاتِهِ الْعَلِيَّةِ
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 py-16">
                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-16 relative">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="ابحث عن اسم أو معنى..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-14 pr-12 pl-4 rounded-2xl bg-card border border-border shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute inset-y-0 left-4 flex items-center text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredNames.map((name, index) => (
                            <motion.div
                                key={name.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index % 20 * 0.02 }}
                                onClick={() => setSelectedName(name)}
                                className="group cursor-pointer"
                            >
                                <div className="relative h-full p-6 rounded-[2rem] bg-card border border-border hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
                                    {/* ID Badge */}
                                    <span className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-xs font-bold text-primary border border-primary/10">
                                        {name.id}
                                    </span>

                                    {/* Calligraphy Font rendering based on ID */}
                                    <div
                                        className="text-6xl md:text-7xl mb-4 text-primary font-normal group-hover:scale-110 transition-transform duration-500"
                                        style={{ fontFamily: 'AsmaaAllah' }}
                                    >
                                        {name.id}
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 font-momken text-foreground">
                                        {name.name}
                                    </h3>

                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                        {name.text}
                                    </p>

                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-primary text-xs font-bold">
                                        <span>التفاصيل</span>
                                        <Info className="w-3 h-3" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredNames.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">لم يتم العثور على نتائج</h3>
                        <p className="text-muted-foreground">جرب البحث بكلمة أخرى أو برقم الاسم</p>
                    </div>
                )}
            </section>

            {/* Name Detail Modal */}
            <AnimatePresence>
                {selectedName && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedName(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            layoutId={`card-${selectedName.id}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedName(null)}
                                className="absolute top-6 left-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="p-8 md:p-12 text-center">
                                <div
                                    className="text-8xl md:text-9xl mb-6 text-primary"
                                    style={{ fontFamily: 'AsmaaAllah' }}
                                >
                                    {selectedName.id}
                                </div>

                                <div className="mb-2 text-primary font-bold tracking-widest uppercase text-sm">
                                    {selectedName.id} / 99
                                </div>

                                <h2 className="text-4xl md:text-5xl font-bold font-momken mb-8">
                                    {selectedName.name}
                                </h2>

                                <div className="h-px w-24 bg-primary/20 mx-auto mb-8" />

                                <div className="bg-primary/5 rounded-3xl p-8 relative">
                                    <BookOpen className="absolute top-4 right-4 w-6 h-6 text-primary opacity-20" />
                                    <p className="text-xl md:text-2xl leading-relaxed font-amiri text-foreground/90">
                                        {selectedName.text}
                                    </p>
                                </div>

                                <div className="mt-10">
                                    <button
                                        onClick={() => setSelectedName(null)}
                                        className="px-10 h-14 rounded-2xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                                    >
                                        حسناً
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
