"use client";

import { useState } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { normalizeBlogs } from "./normalizer";
import { fetchApi } from "@/utils/fetchApi";
import type { BlogType } from "@/types/blog";
import Breadcrumb from "@/components/elements/Breadcrumb";

interface BlogListProps {
  data: BlogType[];
}

export default function BlogList({ data }: BlogListProps) {
  const [blogs, setBlogs] = useState(normalizeBlogs(data || []));
  const [query, setQuery] = useState("");

  // Recherche par titre
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const encodedQuery = encodeURIComponent(query); // sécuriser l'encodage UTF-8
      const res = await fetchApi(
        `/api/blogs?filters[title][$containsi]=${encodedQuery}&populate=*`,
      );
      setBlogs(normalizeBlogs(res || []));
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    }
  };

  // Réinitialiser la recherche
  const handleReset = async () => {
    setQuery("");
    const res = await fetchApi("/api/blogs?populate=*");
    setBlogs(normalizeBlogs(res || []));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('/assets/bg.svg')] bg-repeat bg-center"></div>

      {/* HERO SECTION */}
      <section
        className="relative min-h-[60vh] flex flex-col items-start pt-32 pb-32 overflow-hidden"
        dir="rtl"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/assets/blog-header.png')] bg-cover bg-center opacity-100" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col h-full">
          {/* Breadcrumb - Aligned Right (Start in RTL) */}
          <div className="w-full flex justify-start mb-12">
            <Breadcrumb
              items={[{ label: "المقالات", href: "/blogs" }]}
              className="text-white/90"
            />
          </div>

          <div className="flex flex-col items-center text-center w-full max-w-4xl mx-auto mt-4">
            <h1 className="text-5xl md:text-7xl font-bold font-momken text-white mb-8 drop-shadow-2xl leading-tight">
              مقالات وخواطر
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed font-amiri max-w-2xl mx-auto opacity-90">
              مساحة للتأمل والمعرفة.. نجمع فيها بين الفائدة العلمية والتوجيه
              التربوي لتكون زاداً للقلوب
            </p>

            {/* FLOATING SEARCH BAR */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-2xl mx-auto relative group mb-12"
            >
              <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-lg transition-all hover:border-white/40 hover:bg-white/15">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث في المقالات..."
                  className="flex-1 bg-transparent border-none text-white placeholder-white/60 px-4 py-3 text-lg focus:outline-none focus:ring-0"
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <span className="sr-only">Reset</span>✕
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-white/90 hover:bg-white text-[#8B4513] px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  بحث
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* LIST SECTION */}
      <section className="container mx-auto px-4 mt-20 relative z-20 pb-24">
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-card rounded-3xl border border-gray-100 dark:border-border shadow-xl">
            <p className="text-xl text-muted-foreground font-amiri">
              لم يتم العثور على مقالات تطابق بحثك.
            </p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-[#8B4513] text-white rounded-full hover:bg-[#6d3610] transition-colors"
            >
              عرض كل المقالات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
