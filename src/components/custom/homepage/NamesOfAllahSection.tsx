"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "@/components/elements/Link";
import { Star, ChevronLeft, Sparkles } from "lucide-react";

/** 6 sample names to showcase in the section */
const SHOWCASE_NAMES = [
    { name: "الرَّحْمَنُ", meaning: "ذو الرحمة الواسعة" },
    { name: "الرَّحِيمُ", meaning: "ذو الرحمة بالمؤمنين" },
    { name: "المَلِكُ", meaning: "المالك لكل شيء" },
    { name: "القُدُّوسُ", meaning: "المنزه عن كل نقص" },
    { name: "السَّلاَمُ", meaning: "ذو السلامة من كل عيب" },
    { name: "النُّورُ", meaning: "نور السماوات والأرض" },
];

export default function NamesOfAllahSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-[#3d2a1a] dark:bg-[#2a1e13] text-white">
            {/* Islamic pattern background */}
            <div
                className="absolute inset-0 bg-white opacity-[0.06] pointer-events-none"
                style={{
                    maskImage: "url('/assets/bg1.svg')",
                    WebkitMaskImage: "url('/assets/bg1.svg')",
                    maskRepeat: "repeat",
                    WebkitMaskRepeat: "repeat",
                    maskSize: "400px",
                    WebkitMaskSize: "400px",
                }}
            />

            {/* Brown gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#3d2a1a] via-[#3d2a1a]/80 to-[#3d2a1a] dark:from-[#2a1e13] dark:via-[#2a1e13]/80 dark:to-[#2a1e13] pointer-events-none opacity-80" />

            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10" ref={ref}>
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
                    >
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">
                            أسماء الله الحسنى
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-momken leading-tight"
                    >
                        وَلِلَّهِ الأَسْمَاءُ الحُسْنَى
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
                    >
                        تأمل في أسماء الله الحسنى واكتشف معانيها العميقة التي تجلي عظمته
                        وكماله سبحانه وتعالى.
                    </motion.p>
                </div>

                {/* Names Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
                    {SHOWCASE_NAMES.map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1"
                        >
                            {/* Sparkle */}
                            <Sparkles className="w-4 h-4 text-white/20 absolute top-3 right-3 group-hover:text-white/50 transition-colors" />

                            {/* Name */}
                            <span className="text-2xl md:text-3xl font-black font-momken mb-2 text-white group-hover:scale-110 transition-transform duration-300">
                                {item.name}
                            </span>

                            {/* Meaning */}
                            <span className="text-xs md:text-sm text-white/50 text-center leading-snug group-hover:text-white/70 transition-colors">
                                {item.meaning}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center"
                >
                    <Link
                        href="/names-of-allah"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#3d2a1a] rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-2xl shadow-black/20"
                    >
                        <span>تصفح</span>
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
