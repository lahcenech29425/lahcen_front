import { Link } from "@/components/elements/Link";
import type { BlogType } from "@/types/blog";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Badge from "@/components/elements/Badge";

export default function BlogCard({ blog }: { blog: BlogType }) {
  return (
    <div className="bg-white dark:bg-[#2b2b2b] rounded-xl shadow hover:shadow-lg transition flex flex-col h-full">
      {blog.coverImage && (
        <Image
          src={blog.coverImage.url}
          alt={blog.coverImage.alternativeText || blog.title}
          width={blog.coverImage.width || 400}
          height={blog.coverImage.height || 250}
          className="rounded-t-xl object-cover w-full h-48"
          loading="lazy"
        />
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {blog.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {blog.content
            .replace(/.*المقدمة.*\n?/g, "")
            .replace(/[#*]/g, "")
            .trim()
            .slice(0, 120)}
          ...
        </p>
        <div className="flex items-center justify-between mt-auto">
          <Badge
            bg="bg-gray-50 dark:bg-[#232323]"
            color="text-gray-700 dark:text-gray-200"
            className="font-normal"
          >
            {blog.author}
          </Badge>
          <Link
            href={`/blogs/${blog.slug}`}
            className="group inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-200 font-medium hover:text-gray-900 dark:hover:text-white transition-colors mt-auto"
          >
            <span>اقرأ المزيد</span>
            <ArrowLeft
              size={14}
              className="relative top-[1px] transition-transform group-hover:translate-x-[-2px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
