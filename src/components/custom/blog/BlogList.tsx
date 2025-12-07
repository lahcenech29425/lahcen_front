"use client";

import { useState } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { normalizeBlogs } from "./normalizer";
import { fetchApi } from "@/utils/fetchApi";
import type { BlogType } from "@/types/blog";

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
        `/api/blogs?filters[title][$containsi]=${encodedQuery}&populate=*`
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
    <section className="py-16 bg-gray-50 dark:bg-[#1a1a1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation */}
        <nav className="mb-8 flex items-center gap-4 text-sm text-gray-900 dark:text-gray-100">
          <Link
            href="/"
            className="hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 font-semibold">
            مقالات وخواطر
          </span>
        </nav>

        {/* Titre */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-primary-light mb-4 text-center">
          مقالات وخواطر
        </h1>

        {/* Paragraph */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed text-center font-amiri max-w-2xl mx-auto">
          نهدف من خلال هذه المدونة إلى نشر مقالات وبحوث نافعة للمسلمين، تجمع بين
          الفائدة العلمية والتوجيه التربوي، لتكون زادًا للقلوب والعقول في طريق
          الهداية.
        </p>

        {/* Search & Reset */}
        <form
          onSubmit={handleSearch}
          className="mb-10 flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مقال عبر العنوان"
            className="w-full rounded-xl border border-[#232323] dark:border-[#1a1a1a] px-4 py-2 text-[#232323] dark:text-[#ededed] bg-white dark:bg-[#232323] focus:ring-2 focus:ring-primary focus:outline-none"
          />

          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              type="submit"
              className="px-4 py-2 bg-[#232323] dark:bg-[#232323] text-[#ededed] rounded-xl hover:bg-[#1a1a1a] dark:hover:bg-[#2b2b2b] transition"
            >
              بحث
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-[#ededed] dark:bg-[#232323] text-[#232323] dark:text-[#ededed] rounded-xl hover:bg-[#232323] dark:hover:bg-[#2b2b2b] hover:text-white dark:hover:text-white transition"
            >
              إعادة
            </button>
          </div>
        </form>

        {/* Liste des blogs */}
        {blogs.length === 0 ? (
          <div className="text-center text-[#232323] dark:text-[#ededed] py-20">
            لم يتم العثور على مقالات.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
