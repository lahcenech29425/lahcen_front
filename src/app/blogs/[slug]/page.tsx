import { fetchApi } from "@/utils/fetchApi";
import { normalizeBlog } from "@/components/custom/blog/normalizer";
import type { BlogType } from "@/types/blog";
import Image from "next/image";
import MarkdownRenderer from "@/components/custom/markdown/MarkdownRenderer";
import { Link } from "@/components/elements/Link";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const res = await fetchApi(
    `/api/blogs?populate=*&filters[slug][$eq]=${slug}`
  );
  const blog: BlogType | null = res?.[0] ? normalizeBlog(res[0]) : null;

  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-gray-500">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* wrapper interne partagé */}
      <div className="max-w-7xl mx-auto">
        {/* Navigation (breadcrumb) */}
        <nav aria-label="breadcrumb" className="mb-12 mt-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-900">
            <Link href="/" className="hover:text-gray-600 transition">
              الرئيسية
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/blogs" className="hover:text-gray-600 transition">
              مقالات وخواطر
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-semibold truncate max-w-full sm:max-w-[40ch]">
              {blog.title}
            </span>
          </div>
        </nav>

        {/* Article */}
        <article className="pb-16 px-0 bg-white rounded-xl max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-4">{blog.title}</h1>
          <div className="mb-6 text-gray-500 text-sm">بواسطة {blog.author}</div>

          {blog.coverImage && (
            <div className="w-full max-w-7xl mx-auto mb-8">
              <Image
                src={blog.coverImage.url}
                alt={blog.coverImage.alternativeText || blog.title}
                width={blog.coverImage.width || 1200}
                height={blog.coverImage.height || 600}
                className="rounded-xl object-cover w-full max-h-[500px]"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg max-w-7xl text-gray-800">
            <MarkdownRenderer content={blog.content} />
          </div>
        </article>
      </div>
    </div>
  );
}
