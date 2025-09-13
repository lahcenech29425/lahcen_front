"use client";
import BlogCard from "./BlogCard";
import { normalizeBlogs } from "./normalizer";
import type { BlogType } from "@/types/blog";

export default function BlogList({ data }: { data: BlogType[] }) {
  const blogs = normalizeBlogs(data);

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Our Blog</h1>
        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No blogs found.</div>
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