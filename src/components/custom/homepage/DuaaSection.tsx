"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "@/components/elements/Link";
import { HandHeart, ChevronLeft, BookOpen, Sun, Moon } from "lucide-react";

/** Sample duaa categories to showcase */
const DUAA_CARDS = [
    {
        icon: Sun,
        title: "أذكار الصباح",
        subtitle: "ابدأ يومك بذكر الله",
        gradient: "from-[#8b5e3c] to-[#a06d45]",
        borderColor: "border-[#bca47e]/30",
        iconColor: "text-[#f5e6d3]",
    },
    {
        icon: Moon,
        title: "أذكار المساء",
        subtitle: "اختم يومك بالطمأنينة",
        gradient: "from-[#8b5e3c] to-[#a06d45]",
        borderColor: "border-[#bca47e]/30",
        iconColor: "text-[#f5e6d3]",
    },
    {
        icon: BookOpen,
        title: "أدعية من القرآن",
        subtitle: "دعوات مباركة من كتاب الله",
        gradient: "from-[#8b5e3c] to-[#a06d45]",
        borderColor: "border-[#bca47e]/30",
        iconColor: "text-[#f5e6d3]",
    },
    {
        icon: HandHeart,
        title: "أدعية متنوعة",
        subtitle: "أدعية لكل مناسبة ووقت",
        gradient: "from-[#8b5e3c] to-[#a06d45]",
        borderColor: "border-[#bca47e]/30",
        iconColor: "text-[#f5e6d3]",
    },
];

export default function DuaaSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-transparent">

            <div className="relative max-w-7xl mx-auto px-4 md:px-8 z-10" ref={ref}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
                        >
                            <HandHeart className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold uppercase tracking-wider text-primary">
                                أذكار وأدعية
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-momken text-foreground leading-tight"
                        >
                            حَصِّن يومك بالأذكار
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg"
                        >
                            أذكار الصباح والمساء، وأدعية من القرآن والسنة لتبقى على ذكر الله
                            في كل حين وتنال الطمأنينة والسكينة.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Link
                                href="/duaa"
                                className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-2xl shadow-primary/20"
                            >
                                <span>تصفح الأذكار</span>
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Cards Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {DUAA_CARDS.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                                    className={`group relative p-6 md:p-8 rounded-3xl bg-gradient-to-br ${card.gradient} border ${card.borderColor} backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 cursor-default`}
                                >
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Text */}
                                    <h3 className="text-lg md:text-xl font-bold font-momken text-white mb-1">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-white/70 leading-relaxed font-medium">
                                        {card.subtitle}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
