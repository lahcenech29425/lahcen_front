"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/components/elements/Link";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";
import type { ImageType } from "@/types/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

interface FeatureSectionData {
    id: number;
    __component: string;
    badge?: string;
    title: string;
    description?: string;
    button?: {
        id: number;
        title: string;
        url: string;
        is_external?: boolean;
    };
    image?: {
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
    };
    imagePosition?: "left" | "right";
}

interface FeatureSectionProps {
    data: FeatureSectionData;
    index: number;
}

export default function FeatureSection({ data, index }: FeatureSectionProps) {
    const isImageRight = data.imagePosition === "right" || !data.imagePosition;
    const normalizedImage = data.image ? normalizeImage(data.image as unknown as ImageType) : null;
    const imageUrl = normalizedImage?.url || "";

    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <section ref={ref} className="relative py-24 overflow-hidden bg-transparent">
            {/* Background patterns are now handled globally in globals.css */}

            {/* Subtle decorative elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* 60/40 Split Layout */}
                <div className={`grid grid-cols-1 lg:grid-cols-5 items-center gap-12 lg:gap-16 ${isImageRight ? '' : 'lg:flex-row-reverse'}`}>

                    {/* Content Panel - 40% (2/5) */}
                    <motion.div
                        style={{ opacity }}
                        className={`lg:col-span-2 w-full ${!isImageRight ? 'lg:order-2' : ''}`}
                    >
                        {data.badge && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                            >
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                                    {data.badge}
                                </span>
                            </motion.div>
                        )}

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground font-momken"
                        >
                            {data.title}
                        </motion.h2>

                        {/* Description */}
                        {data.description && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="mb-10"
                            >
                                <p className="text-muted-foreground text-lg leading-[1.8] line-clamp-4">
                                    {data.description}
                                </p>
                            </motion.div>
                        )}

                        {/* CTA Button */}
                        {data.button && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link
                                    href={data.button.url}
                                    isExternal={data.button.is_external}
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-primary rounded-full text-primary-foreground font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                                >
                                    <span>{data.button.title}</span>
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Image - 60% (3/5) */}
                    <div className={`lg:col-span-3 w-full ${!isImageRight ? 'lg:order-1' : ''}`}>
                        <motion.div style={{ y }}>
                            {imageUrl && (
                                <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500">
                                    <div className="aspect-[16/10] relative">
                                        <Image
                                            src={imageUrl}
                                            alt={data.image?.alternativeText || data.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {/* Subtle overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    {/* Decorative corner */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
