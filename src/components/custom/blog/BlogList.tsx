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

  // Recherche par slug
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetchApi(
        `/api/blogs?filters[slug][$containsi]=${query}&populate=*`
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
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation */}
        <nav className="mb-8 flex items-center gap-4 text-sm text-gray-900">
          <Link href="/" className="hover:text-gray-600 transition">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-gray-600 font-semibold">مقالات وخواطر</span>
        </nav>

        {/* Titre */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-center">
          مقالات وخواطر
        </h1>

        {/* Paragraph */}
        <p className="text-lg text-gray-600 mb-10 leading-relaxed text-center font-amiri max-w-2xl mx-auto">
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
            placeholder="ابحث عن مقال عبر الرابط"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
          />

          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-primary/90 transition"
            >
              بحث
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition"
            >
              إعادة
            </button>
          </div>
        </form>

        {/* Liste des blogs */}
        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
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
