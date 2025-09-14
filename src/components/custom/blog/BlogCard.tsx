import { Link } from "@/components/elements/Link";
import type { BlogType } from "@/types/blog";
import Image from "next/image";

export default function BlogCard({ blog }: { blog: BlogType }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col h-full">
      {blog.coverImage && (
        <Image
          src={blog.coverImage.url}
          alt={blog.coverImage.alternativeText || blog.title}
          width={blog.coverImage.width || 400}
          height={blog.coverImage.height || 250}
          className="rounded-t-xl object-cover w-full h-48"
        />
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 text-primary">{blog.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content.replace(/[#*]/g, "").slice(0, 120)}...
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-gray-500">بواسطة {blog.author}</span>
            <Link
              href={`/blogs/${blog.slug}`}
              className="text-primary font-semibold hover:underline"
            >
              &larr; اقرأ المزيد
            </Link>
        </div>
      </div>
    </div>
  );
}
