import { fetchApi } from "@/utils/fetchApi";
import { normalizeBlog } from "@/components/custom/blog/normalizer";
import type { BlogType } from "@/types/blog";
import Image from "next/image";
import MarkdownRenderer from "@/components/custom/markdown/MarkdownRenderer";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogDetailPage({ params }: Props) {
  // Await the params Promise
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
    <article className="max-w-2xl mx-auto py-16 px-4 bg-white rounded-xl">
      <h1 className="text-3xl font-bold text-primary mb-4">{blog.title}</h1>
      <div className="mb-6 text-gray-500 text-sm">بواسطة {blog.author}</div>
      {blog.image && (
        <Image
          src={blog.image.url}
          alt={blog.image.alternativeText || blog.title}
          width={blog.image.width || 600}
          height={blog.image.height || 400}
          className="rounded mb-6 object-cover w-full h-64"
        />
      )}
      <div className="prose prose-lg max-w-none text-gray-800">
        <MarkdownRenderer content={blog.content} />
      </div>
    </article>
  );
}