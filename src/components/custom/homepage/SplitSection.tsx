"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/components/elements/Link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SplitSectionProps {
    title: string;
    badge: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    imageUrl: string;
    imageAlt: string;
    imagePosition?: "left" | "right" | "bottom";
}

export default function SplitSection({
    title,
    badge,
    description,
    buttonText,
    buttonUrl,
    imageUrl,
    imageAlt,
    imagePosition = "left",
}: SplitSectionProps) {
    const isBottom = imagePosition === "bottom";
    const isImageRight = imagePosition === "right";

    if (isBottom) {
        return (
            <section className="py-16 md:py-24 overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center gap-10">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full"
                    >
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold uppercase tracking-wider text-primary">
                                {badge}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground font-momken">
                            {title}
                        </h2>
                        <div className="mb-2">
                            <p className="text-muted-foreground text-lg leading-[1.8]">
                                {description}
                            </p>
                        </div>
                    </motion.div>

                    {/* Image Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full max-w-2xl"
                    >
                        <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500">
                            <div className="aspect-[16/10] relative">
                                <Image
                                    src={imageUrl}
                                    alt={imageAlt}
                                    fill
                                    priority={false}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link
                            href={buttonUrl}
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary rounded-full text-primary-foreground font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                        >
                            <span>{buttonText}</span>
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        );
    }

    // Default Side-by-Side Layout
    return (
        <section className="py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-12 lg:gap-16">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: isImageRight ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`lg:col-span-2 w-full ${isImageRight ? "lg:order-2" : "lg:order-1"}`}
                    >
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold uppercase tracking-wider text-primary">
                                {badge}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground font-momken">
                            {title}
                        </h2>
                        <div className="mb-10">
                            <p className="text-muted-foreground text-lg leading-[1.8] line-clamp-4">
                                {description}
                            </p>
                        </div>
                        <div>
                            <Link
                                href={buttonUrl}
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-primary rounded-full text-primary-foreground font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                            >
                                <span>{buttonText}</span>
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Image Content */}
                    <motion.div
                        initial={{ opacity: 0, x: isImageRight ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`lg:col-span-3 w-full ${isImageRight ? "lg:order-1" : "lg:order-2"}`}
                    >
                        <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500">
                            <div className="aspect-[16/10] relative">
                                <Image
                                    src={imageUrl}
                                    alt={imageAlt}
                                    fill
                                    priority={false}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
