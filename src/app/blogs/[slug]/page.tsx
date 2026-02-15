import { fetchApi } from "@/utils/fetchApi";
import { normalizeBlog } from "@/components/custom/blog/normalizer";
import type { BlogType } from "@/types/blog";
import Image from "next/image";
import MarkdownRenderer from "@/components/custom/markdown/MarkdownRenderer";
import { Link } from "@/components/elements/Link";
import Badge from "@/components/elements/Badge";
import ReadingProgress from "@/components/custom/blog/ReadingProgress";
import Breadcrumb from "@/components/elements/Breadcrumb";
import BlogCard from "@/components/custom/blog/BlogCard";
import TableOfContents from "@/components/custom/blog/TableOfContents";
import ShareButtons from "@/components/custom/blog/ShareButtons";
import { Calendar, User, Clock, ChevronLeft, Share2 } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getBlog(slug: string): Promise<BlogType | null> {
  const res = await fetchApi(
    `/api/blogs?populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&populate[seo][populate]=*&filters[slug][$eq]=${slug}`,
  );
  return res?.[0] ? normalizeBlog(res[0]) : null;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return {};

  const imageUrl =
    blog.seo?.metaImage?.url ?? blog.coverImage?.url ?? undefined;
  const blogTitle = blog.seo?.metaTitle ?? blog.title;
  const blogDescription =
    blog.seo?.metaDescription ??
    `${blog.content
      .replace(/.*المقدمة.*\n?/g, "")
      .replace(/[#*]/g, "")
      .trim()
      .slice(0, 120)}...`;
  return {
    title: blogTitle,
    description: blogDescription,
    authors: [{ name: blog.author || "لحسن", url: "https://www.lahcenway.com" }],
    openGraph: {
      title: blog.seo?.openGraph?.ogTitle ?? blogTitle,
      description:
        blog.seo?.openGraph?.ogDescription ?? blogDescription,
      url: `/blogs/${slug}`,
      type: "article",
      siteName: "سِرَاجٌ يُضِيءُالدَّرْبَ",
      locale: "ar_SA",
      images: imageUrl ? [imageUrl] : undefined,
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seo?.openGraph?.ogTitle ?? blogTitle,
      description: blogDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Blog not found.
      </div>
    );
  }

  // JSON-LD Article structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description:
      blog.seo?.metaDescription ??
      blog.content
        .replace(/[#*]/g, "")
        .trim()
        .slice(0, 160),
    image: blog.coverImage?.url ?? undefined,
    author: {
      "@type": "Person",
      name: blog.author || "لحسن",
      url: "https://www.lahcenway.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "سِرَاجٌ يُضِيءُالدَّرْبَ",
      url: "https://www.lahcenway.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.lahcenway.com/og-image.jpg",
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.lahcenway.com/blogs/${slug}`,
    },
    inLanguage: "ar",
  };

  const suggestionsRes = await fetchApi(
    `/api/blogs?populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText&filters[slug][$ne]=${slug}&pagination[limit]=3`,
  );
  const suggestions: BlogType[] = suggestionsRes
    ? suggestionsRes.map((s: BlogType) => normalizeBlog(s))
    : [];

  const createdText = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("ar", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* --- CINEMATIC HERO SECTION --- */}
      <div
        className="relative h-[70vh] min-h-[600px] w-full bg-[#1a1a1a] overflow-hidden"
        dir="rtl"
      >
        {/* Background Image + Pattern */}
        <div className="absolute inset-0 z-0">
          {blog.coverImage && (
            <Image
              src={blog.coverImage.url}
              alt={blog.coverImage.alternativeText || blog.title}
              fill
              className="object-cover opacity-60 scale-105"
              priority
            />
          )}
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
        </div>

        {/* Breadcrumb - Standardized Container */}
        <div className="absolute top-0 w-full pt-32 z-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-start">
            <Breadcrumb
              items={[
                { label: "المقالات", href: "/blogs" },
                { label: blog.title },
              ]}
              className="text-white/80"
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-32 md:pb-40 px-4">
          <div className="max-w-5xl mx-auto w-full text-center">
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6 animate-fade-in-up md:mb-8">
              <Badge
                bg="bg-[#8B4513]"
                color="text-white"
                className="border-none shadow-lg shadow-[#8B4513]/20"
              >
                مقالات إسلامية
              </Badge>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-sm border border-white/10">
                <Clock size={14} className="text-[#d4a373]" />
                <span>5 دقائق قراءة</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight font-momken drop-shadow-2xl max-w-4xl mx-auto animate-fade-in-up delay-100">
              {blog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-center gap-4 text-white/90 animate-fade-in-up delay-200">
              <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B4513] to-[#5d2e0c] flex items-center justify-center text-white font-bold shadow-lg">
                  <User size={18} />
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/60">كاتب المقال</div>
                  <div className="font-bold">{blog.author}</div>
                </div>
              </div>

              <div className="hidden md:flex flex-col text-right px-4">
                <div className="text-xs text-white/60">تاريخ النشر</div>
                <div className="font-bold flex items-center gap-2">
                  <Calendar size={14} className="text-[#d4a373]" />
                  {createdText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FLOATING CONTENT CARD --- */}
      <div className="relative z-20 container mx-auto px-4 -mt-12 md:-mt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* SIDEBAR (Right Side in RTL) */}
          <aside className="lg:col-span-4 order-1 lg:order-1 space-y-6">
            <div className="sticky top-32 space-y-6">
              {/* TOC Card */}
              <div className="bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                <h4 className="text-lg font-bold mb-4 font-momken text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 pb-2">
                  فهرس المحتوى
                </h4>
                <TableOfContents content={blog.content} />
              </div>

              {/* Minimal Share Card */}
              <div className="bg-[#8B4513] text-white rounded-3xl p-6 shadow-xl shadow-[#8B4513]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold font-momken leading-none">
                      شارك المقال
                    </h4>
                    <p className="text-white/70 text-xs mt-1">انشر الخير</p>
                  </div>
                  <button
                    className="bg-white text-[#8B4513] p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg active:scale-95"
                    title="Copy Link"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT (floating card) */}
          <main className="lg:col-span-8 order-2 lg:order-2">
            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-2xl p-8 md:p-12 lg:p-16 border border-gray-100 dark:border-border relative overflow-hidden">
              {/* Decorative Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B4513] to-transparent opacity-50" />

              <article
                id="article-content"
                className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                            prose-headings:font-bold prose-headings:font-momken prose-headings:text-gray-900 dark:prose-headings:text-white
                            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-loose prose-p:font-amiri prose-p:text-xl
                            prose-a:text-[#8B4513] dark:prose-a:text-primary hover:prose-a:text-[#5d2e0c] dark:hover:prose-a:text-accent prose-a:no-underline
                            prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-8
                            prose-blockquote:border-r-4 prose-blockquote:border-[#8B4513] prose-blockquote:bg-[#f9f9f9] dark:prose-blockquote:bg-card prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-l-2xl prose-blockquote:not-italic prose-blockquote:font-amiri"
              >
                <MarkdownRenderer content={blog.content} />
              </article>

              {/* Footer Signature */}
              <div className="mt-16 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
                <div className="w-16 h-1 w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-8" />
                <p className="text-muted-foreground font-amiri text-lg italic">
                  "نسأل الله أن ينفعنا وإياكم بهذا العلم، وأن يجعله حجة لنا لا
                  علينا"
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Recommended Posts */}
      {suggestions.length > 0 && (
        <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 relative">
          <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B4513]/30 to-transparent" />
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-momken">
                اقرأ أيضاً
              </h2>
              <Link
                href="/blogs"
                className="flex items-center gap-2 text-[#8B4513] dark:text-primary font-bold hover:gap-3 transition-all px-6 py-2 rounded-full hover:bg-[#8B4513]/10"
              >
                عرض الكل <ChevronLeft size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {suggestions.map((s) => (
                <div key={s.slug} className="group">
                  <BlogCard blog={s} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
