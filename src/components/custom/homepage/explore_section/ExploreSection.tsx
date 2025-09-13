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
        let normalized: unknown[] = [];
        if (section.itemType === "blogs") {
          normalized = normalizeBlogs(rawItems);
        } else if (
          section.itemType === "quran-images" ||
          section.itemType === "hadith-images"
        ) {
          normalized = Array.isArray(rawItems[0]?.images)
            ? rawItems[0].images.map((img) => normalizeImage(img))
            : [];
        }
        setItems(normalized);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // eslint-disable-next-line
  }, [section.itemType, section.fetchCount, section.fetchCondition]);

  // Alternance alignement : pair = left, impair = right
  const isLeft = index % 2 !== 0;
  // Alternance background
  const bgClass = isLeft ? "bg-gray-50" : "bg-gray-100";

  // Détermine le flex selon le type d'item
  const sectionFlex =
    section.itemType === "blogs" || section.itemType === "blog"
      ? "flex flex-col"
      : `flex flex-col md:flex-row ${
          isLeft ? "" : "md:flex-row-reverse"
        } items-center gap-12`;

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className={`max-w-7xl mx-auto ${sectionFlex} px-4 md:px-8`}>
        {/* Texte & bouton */}
        <div
          className={`flex-1 flex flex-col justify-center ${
            isLeft
              ? "md:pr-12 text-left items-start"
              : "md:pl-12 text-right items-end"
          }`}
        >
          <div className="w-full md:w-auto">
            <ScrollFadeIn delay={100}>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-primary text-right">
                {section.title}
              </h2>
            </ScrollFadeIn>
            <ScrollFadeIn delay={250}>
              <p
                className={`mb-8 text-lg text-gray-600 ${
                  isLeft ? "text-left" : "text-right"
                }`}
              >
                {section.subtitle}
              </p>
            </ScrollFadeIn>
            <ScrollFadeIn delay={400}>
              <div className="flex justify-start">
                <Link
                  href={section.button.url}
                  isExternal={section.button.is_external}
                  className={`inline-block px-8 py-3 rounded-lg font-bold shadow transition
                    ${
                      isLeft
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }
                  `}
                >
                  {section.button.title}
                </Link>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
        {/* Cards */}
        <div className="flex-1 w-full mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-lg text-gray-400">
              Chargement...
            </div>
          ) : section.itemType === "blogs" || section.itemType === "blog" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {items.map((blog, idx) => (
                <ScrollFadeIn key={blog.id} delay={500 + idx * 120}>
                  <BlogCard blog={blog} />
                </ScrollFadeIn>
              ))}
            </div>
          ) : section.itemType === "quran-images" ||
            section.itemType === "hadith-images" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
              {items.map((img, idx) => (
                <ScrollFadeIn key={idx} delay={500 + idx * 120}>
                  <ImageCard image={img} />
                </ScrollFadeIn>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {/* Animation CSS globale */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(32px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.9s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </section>
  );
}
