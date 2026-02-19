"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, X, BookOpen, Clock, Moon, Sun,
    Play, Pause, Volume2, RotateCcw, ChevronLeft,
    Droplets, Home, Plane, ShieldCheck, HeartPulse
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/elements/Breadcrumb";

// Cloudinary Base URL from Environment Variables
const CLOUDINARY_BASE = `${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/video/upload/v1771290813/siraj/adhkar` || '';
const AUDIO_MAPPING: Record<string, string> = {};

interface AdkharItem {
    id: number;
    text: string;
    count: number;
    audio: string;
    filename: string;
}

interface AdkharCategory {
    id: number;
    category: string;
    audio: string;
    filename: string;
    array: AdkharItem[];
}

interface DuaaClientProps {
    categories: AdkharCategory[];
}

export default function DuaaClient({ categories }: DuaaClientProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<AdkharCategory | null>(null);
    const [activeAudio, setActiveAudio] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const filteredCategories = useMemo(() => {
        return categories.filter(
            (c) =>
                c.category.includes(search) ||
                c.array.some(item => item.text.includes(search))
        );
    }, [categories, search]);

    const getAudioUrl = (filename: string, jsonAudioPath?: string) => {
        // 1. Priority: If the JSON already contains a full URL, use it
        if (jsonAudioPath?.startsWith("http")) {
            return jsonAudioPath;
        }

        // 2. Mapping: If the JSON has a relative path (filename.mp3), combine with base URL
        if (jsonAudioPath && !jsonAudioPath.startsWith("/")) {
            return `${CLOUDINARY_BASE}/${jsonAudioPath}`;
        }

        // 3. Fallback: Local or simple filename
        return `/audio/${filename || jsonAudioPath}.mp3`;
    };

    const handlePlayAudio = async (url: string) => {
        if (activeAudio === url && isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            try {
                if (activeAudio !== url) {
                    setActiveAudio(url);
                    if (audioRef.current) {
                        audioRef.current.src = url;
                        // Load the new source
                        audioRef.current.load();
                    }
                }

                const playPromise = audioRef.current?.play();
                if (playPromise !== undefined) {
                    setIsPlaying(true);
                    await playPromise;
                }
            } catch (error) {
                console.error("Audio playback failed:", error);
                setIsPlaying(false);
                // Optionally show a user-friendly error here
                alert("تعذر تشغيل الملف الصوتي. يرجى التحقق من الرابط أو المحاولة لاحقاً.");
            }
        }
    };

    const getCategoryIcon = (category: string) => {
        const c = category.toLowerCase();
        if (c.includes("صباح") || c.includes("مساء")) return <Sun className="w-6 h-6" />;
        if (c.includes("نوم")) return <Moon className="w-6 h-6" />;
        if (c.includes("صلاة") || c.includes("مسجد")) return <Clock className="w-6 h-6" />;
        if (c.includes("وضوء") || c.includes("خلاء")) return <Droplets className="w-6 h-6" />;
        if (c.includes("منزل") || c.includes("بيت")) return <Home className="w-6 h-6" />;
        if (c.includes("سفر")) return <Plane className="w-6 h-6" />;
        if (c.includes("خوف") || c.includes("كرب")) return <ShieldCheck className="w-6 h-6" />;
        if (c.includes("مرض") || c.includes("وجع")) return <HeartPulse className="w-6 h-6" />;
        return <BookOpen className="w-6 h-6" />;
    };

    const getCountLabel = (count: number) => {
        if (count === 1) return "مرة واحدة";
        if (count === 2) return "مرتين";
        return `${count} مرات`;
    };

    const formatDuaaText = (text: string) => {
        if (!text) return "";

        // Split by all markers: ((...)), ( ... ), [ ... ], ﴿ ... ﴾ and *
        const parts = text.split(/(\(\(.*?\)\)|\(.*?\)|\[.*?\]|﴿.*?﴾|\*)/g);

        return parts.map((part, i) => {
            if (!part) return null;

            // (( Highlighted Text )) - Main Emphasis
            if (part.startsWith("((") && part.endsWith("))")) {
                return (
                    <span key={i} className="text-primary font-bold drop-shadow-sm">
                        {part.slice(2, -2)}
                    </span>
                );
            }
            // ( Single Parentheses ) - Sub-emphasis / Repetition
            if (part.startsWith("(") && part.endsWith(")")) {
                return (
                    <span key={i} className="text-primary/70 font-bold px-1">
                        {part.slice(1, -1)}
                    </span>
                );
            }
            // [ Secondary Notes / References ]
            if (part.startsWith("[") && part.endsWith("]")) {
                return (
                    <span key={i} className="text-lg md:text-xl text-muted-foreground/60 block mt-6 font-amiri leading-relaxed italic border-t border-primary/5 pt-6 text-center max-w-lg mx-auto">
                        {part.slice(1, -1)}
                    </span>
                );
            }
            // ﴿ Quranic Brackets ﴾
            if (part.startsWith("﴿") && part.endsWith("﴾")) {
                return (
                    <span key={i} className="text-primary/95 font-amiri font-bold px-1.5 bg-primary/5 rounded-md border border-primary/10">
                        {part}
                    </span>
                );
            }
            // * Ornament
            if (part === "*") {
                return (
                    <span key={i} className="text-primary mx-1.5 font-bold inline-block scale-125">
                        ✦
                    </span>
                );
            }
            // Regular text
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground dir-rtl relative overflow-hidden" dir="rtl">
            {/* Side Decorations */}
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
                <div className="absolute inset-0">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771249644/siraj_fjzxdi.png`}
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
                            items={[{ label: "الأذكار والدعاء" }]}
                            className="text-white/80 mb-0"
                        />
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-bold font-momken text-white mb-4"
                        >
                            حصن المسلم
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/90 max-w-2xl leading-relaxed font-amiri mx-auto"
                        >
                            قال رسول الله ﷺ: "مَنْ لَبِسَ ثَوْبًا فَقَالَ الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ"
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />

            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16 px-4">
                    <div className="relative group">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform" />
                        <input
                            type="text"
                            placeholder="ابحث عن ذكر أو دعاء..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pr-12 pl-4 py-5 bg-card/50 backdrop-blur-md border border-primary/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-xl font-amiri transition-all shadow-lg"
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredCategories.map((cat, index) => (
                            <motion.div
                                key={cat.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index % 20 * 0.02 }}
                                onClick={() => setSelectedCategory(cat)}
                                className="group cursor-pointer bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl p-6 hover:border-primary/40 hover:bg-card/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        {getCategoryIcon(cat.category)}
                                    </div>
                                    <h3 className="text-xl font-bold font-momken text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {cat.category}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-amiri">
                                        {cat.array.length} أذكار
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedCategory && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setSelectedCategory(null);
                                audioRef.current?.pause();
                                setIsPlaying(false);
                            }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] mt-20 bg-card rounded-[40px] shadow-2xl overflow-hidden border border-primary/20"
                        >
                            {/* Modal Header */}
                            <div className="px-4 md:px-8 py-6 border-b border-primary/10 flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur-md z-[110]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        {getCategoryIcon(selectedCategory.category)}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold font-momken text-foreground">
                                        {selectedCategory.category}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        audioRef.current?.pause();
                                        setIsPlaying(false);
                                    }}
                                    className="p-3 rounded-full hover:bg-primary/10 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-4 md:p-10 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
                                <div className="space-y-8">
                                    {selectedCategory.array.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="relative py-5 md:p-8 rounded-3xl bg-secondary/30 border border-primary/5 hover:border-primary/20 transition-all group"
                                        >
                                            <div className="flex flex-col gap-8">
                                                <div className="text-2xl md:text-4xl font-amiri leading-[2.2] text-foreground text-center px-4">
                                                    {formatDuaaText(item.text)}
                                                </div>

                                                <div className="flex flex-wrap items-center justify-center gap-4 border-t border-primary/5 pt-8">
                                                    {/* Repetition Label */}
                                                    <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 text-primary border border-primary/10 font-bold">
                                                        <RotateCcw className="w-4 h-4" />
                                                        <span className="text-base tracking-wide">{getCountLabel(item.count)}</span>
                                                    </div>

                                                    <button
                                                        onClick={() => handlePlayAudio(getAudioUrl(item.filename, item.audio))}
                                                        className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20"
                                                    >
                                                        {activeAudio === getAudioUrl(item.filename, item.audio) && isPlaying ? (
                                                            <><Pause className="w-5 h-5" /> إيقاف</>
                                                        ) : (
                                                            <><Play className="w-5 h-5" /> استماع</>
                                                        )}
                                                    </button>

                                                    <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-muted-foreground font-bold shadow-sm">
                                                        {idx + 1}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
