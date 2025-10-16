import { fetchApi } from "@/utils/fetchApi";
import { normalizeBlog } from "@/components/custom/blog/normalizer";
import type { BlogType } from "@/types/blog";
import Image from "next/image";
import MarkdownRenderer from "@/components/custom/markdown/MarkdownRenderer";
import { Link } from "@/components/elements/Link";
import Badge from "@/components/elements/Badge";
import ReadingProgress from "@/components/custom/blog/ReadingProgress";
import BlogCard from "@/components/custom/blog/BlogCard"; // { changed code }
type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Fonction helper pour récupérer le blog
async function getBlog(slug: string): Promise<BlogType | null> {
  const res = await fetchApi(
    `/api/blogs?populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&populate[seo][populate]=*&filters[slug][$eq]=${slug}`
  );
  return res?.[0] ? normalizeBlog(res[0]) : null;
}

/**
 * Génère les meta tags SEO pour la page article
 */
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return {};

  const imageUrl =
    blog.seo?.metaImage?.url ?? blog.coverImage?.url ?? undefined;

  return {
    title: blog.seo?.metaTitle ?? blog.title,
    description:
      blog.seo?.metaDescription ??
      `${blog.content
        .replace(/.*المقدمة.*\n?/g, "")
        .replace(/[#*]/g, "")
        .trim()
        .slice(0, 120)}...`,
    keywords: blog.seo?.keywords ?? undefined,
    openGraph: {
      title: blog.seo?.openGraph?.ogTitle ?? blog.seo?.metaTitle ?? blog.title,
      description:
        blog.seo?.openGraph?.ogDescription ??
        blog.seo?.metaDescription ??
        undefined,
      url: blog.seo?.openGraph?.ogUrl ?? blog.seo?.canonicalURL ?? undefined,
      type: blog.seo?.openGraph?.ogType ?? "article",
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seo?.metaTitle ?? blog.title,
      description: blog.seo?.metaDescription ?? undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
    robots: blog.seo?.metaRobots ?? undefined,
    alternates: blog.seo?.canonicalURL
      ? { canonical: blog.seo.canonicalURL }
      : undefined,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-gray-500">
        Blog not found.
      </div>
    );
  }

  // Récupérer d'autres articles pour les suggestions (serveur)
  const suggestionsRes = await fetchApi(
    `/api/blogs?populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&filters[slug][$ne]=${slug}&pagination[limit]=3`
  );
  const suggestions: BlogType[] = suggestionsRes
    ? suggestionsRes.map((s: BlogType) => normalizeBlog(s))
    : [];

  // Formatage des dates en arabe
  const createdText = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("ar", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const updatedText = blog.updatedAt
    ? new Date(blog.updatedAt).toLocaleDateString("ar", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* barre de progression de lecture (client) */}
      <ReadingProgress targetId="article-content" />

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
        <article
          id="article-content"
          className="pb-16 px-0 bg-white rounded-xl max-w-7xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-primary mb-4">{blog.title}</h1>
          <div className="mb-2 text-gray-500 text-sm">بواسطة {blog.author}</div>

          {/* Dates de création et mise à jour en arabe avec Badges */}
          <div className="mb-6 flex-col gap-4 items-center">
            <div className="flex gap-2 mt-2">
              <Badge
                bg="bg-gray-100"
                color="text-gray-800"
                rounded="rounded-lg"
              >
                تاريخ النشر
              </Badge>
              <span className="text-gray-600 text-sm">{createdText}</span>
            </div>

            <div className="flex gap-2 mt-2">
              <Badge
                bg="bg-gray-100"
                color="text-gray-800"
                rounded="rounded-lg"
              >
                آخر تحديث
              </Badge>
              <span className="text-gray-600 text-sm">{updatedText}</span>
            </div>
          </div>

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

        {/* Suggestions d'articles */}
        <section className="mt-10 mb-20">
          <div className="max-w-7xl mx-auto bg-gray-50 rounded-2xl shadow-md p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-3">
                <span
                  className="inline-block w-1.5 h-8 bg-black rounded-sm"
                  aria-hidden
                />
                اقرأ أيضاً
              </h2>

              {suggestions.length > 3 && (
                <Link
                  href="/blogs"
                  className="ml-4 inline-flex items-center gap-2 text-sm bg-primary text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  قراءة المزيد
                </Link>
              )}
            </div>

            {suggestions.length === 0 ? (
              <div className="text-gray-500">لا توجد اقتراحات حالياً.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {suggestions.slice(0, 3).map((s) => (
                  <div
                    key={s.slug}
                    className="transition-transform hover:scale-[1.01] focus-scale:scale-[1.01]"
                  >
                    <BlogCard blog={s} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
