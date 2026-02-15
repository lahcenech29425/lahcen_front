"use client";
import { useEffect, useState } from "react";
import { normalizeExploreSection } from "./normalizer";
import BlogCard from "@/components/custom/blog/BlogCard";
import { Link } from "@/components/elements/Link";
import type { ExploreSection } from "@/types/ExploreSection";
import { fetchApi } from "@/utils/fetchApi";
import { normalizeBlogs } from "../../blog/normalizer";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";
import ImageCard from "@/components/elements/ImageCard";
import { ScrollFadeIn } from "@/components/elements/ScrollFadeIn";
import type { BlogType } from "@/types/blog";
import type { ImageType } from "@/types/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface ExploreSectionProps {
  data: ExploreSection;
  index: number;
}

export default function ExploreSection({ data, index }: ExploreSectionProps) {
  const section = normalizeExploreSection(data);
  const [items, setItems] = useState<(BlogType | ImageType)[]>([]);
  const [loading, setLoading] = useState(true);

  const getEndpoint = () => {
    const endpoint = `/api/${section.itemType}`;
    const params = [
      `pagination[page]=1`,
      `pagination[pageSize]=${section.fetchCount}`,
    ];
    if (section.fetchCondition) {
      params.push(`filters[${section.fetchCondition}][$eq]=true`);
    }
    return `${endpoint}?populate=*&${params.join("&")}`;
  };

  useEffect(() => {
    setLoading(true);
    fetchApi(getEndpoint())
      .then((data) => {
        const rawItems = Array.isArray(data) ? data : [];
        let normalized: (BlogType | ImageType)[] = [];
        if (section.itemType === "blogs") {
          normalized = normalizeBlogs(rawItems) as BlogType[];
        } else if (
          section.itemType === "quran-images" ||
          section.itemType === "hadith-images"
        ) {
          normalized = Array.isArray(rawItems[0]?.images)
            ? rawItems[0].images.map(
              (img: ImageType) => normalizeImage(img) as ImageType
            )
            : [];
        }
        setItems(normalized);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // eslint-disable-next-line
  }, [section.itemType, section.fetchCount, section.fetchCondition]);

  return (
    <section className="relative py-24 overflow-hidden bg-transparent">
      {/* Background patterns are now handled globally in globals.css */}

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto flex flex-col px-4 md:px-8 z-10">
        {/* Header - Centered */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-momken"
          >
            {section.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {section.subtitle}
          </motion.p>
        </div>

        {/* Cards */}
        <div className="w-full mb-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: section.fetchCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#2a2219] dark:to-[#221c16] animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : section.itemType === "blogs" || section.itemType === "blog" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, idx) => (
                <ScrollFadeIn key={item.id} delay={450 + idx * 120}>
                  <BlogCard blog={item as BlogType} />
                </ScrollFadeIn>
              ))}
            </div>
          ) : section.itemType === "quran-images" || section.itemType === "hadith-images" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((img, idx) => (
                <ScrollFadeIn key={idx} delay={150 + idx * 60}>
                  <ImageCard
                    image={img as ImageType}
                    fetchType={section.itemType === "quran-images" ? "quran" : "hadith"}
                  />
                </ScrollFadeIn>
              ))}
            </div>
          ) : null}
        </div>

        {/* CTA Button - Bottom centered */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href={section.button.url}
              isExternal={section.button.is_external}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-primary rounded-full text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300"
            >
              <span>{section.button.title}</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
