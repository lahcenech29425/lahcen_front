import { Link } from "@/components/elements/Link";
import type { BlogType } from "@/types/blog";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import Image from "next/image";

export default function BlogCard({
  blog,
  index,
}: {
  blog: BlogType;
  index?: number;
}) {
  // Logic to calculate read time - basic estimation
  const wordCount = blog.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Date formatter
  const dateStr = blog.createdAt
    ? new Intl.DateTimeFormat("ar-SA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(blog.createdAt))
    : "";

  return (
    <article className="group relative bg-card rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 h-full flex flex-col shadow-lg hover:shadow-2xl">
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.2rem] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none" />

      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {blog.coverImage ? (
          <Image
            src={blog.coverImage.url}
            alt={blog.coverImage.alternativeText || blog.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        {/* Author Badge floating on image */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          <User size={12} />
          <span>{blog.author || "لحسن"}</span>
        </div>

        {/* Category/Tag placeholder (could be dynamic) */}
        <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
          مقالات إسلامية
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-1 relative z-10 bg-card group-hover:bg-card/80 transition-colors">
        {/* Meta Row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-medium">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-primary" />
            <span>{dateStr}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-primary" />
            <span>{readTime} دقيقة قراءة</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-3 text-foreground leading-snug font-momken group-hover:text-primary transition-colors line-clamp-2">
          <Link
            href={`/blogs/${blog.slug}`}
            className="before:absolute before:inset-0"
          >
            {blog.title}
          </Link>
        </h3>

        {/* Snippet */}
        <p className="text-base text-muted-foreground mb-6 line-clamp-3 leading-relaxed font-amiri opacity-90 flex-1">
          {blog.content
            .replace(/.*المقدمة.*\n?/g, "")
            .replace(/[#*]/g, "")
            .trim()
            .slice(0, 120)}
          ...
        </p>

        {/* Footer / CTA */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-border group-hover:border-primary/20 transition-colors">
          <span className="text-primary font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
            اقرأ المزيد <ArrowLeft size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}
