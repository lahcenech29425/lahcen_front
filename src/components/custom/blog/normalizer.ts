import type { BlogType, SeoBlog } from "@/types/blog";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";

/**
 * Normalise les données SEO du blog
 */
function normalizeSeo(seo: SeoBlog | null | undefined): SeoBlog | null {
  if (!seo) return null;

  return {
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    keywords: seo.keywords,
    metaRobots: seo.metaRobots,
    metaViewport: seo.metaViewport,
    canonicalURL: seo.canonicalURL,
    structuredData: seo.structuredData,
    metaImage: seo.metaImage ? normalizeImage(seo.metaImage) : null,
    openGraph: seo.openGraph ? {
      ogTitle: seo.openGraph.ogTitle,
      ogDescription: seo.openGraph.ogDescription,
      ogUrl: seo.openGraph.ogUrl,
      ogType: seo.openGraph.ogType,
      ...seo.openGraph, // Conserve les autres propriétés potentielles
    } : null,
  };
}

/**
 * Normalise un article de blog avec toutes ses relations
 */
export function normalizeBlog(data: BlogType): BlogType {
  return {
    id: data.id,
    documentId: data.documentId,
    title: data.title,
    slug: data.slug,
    content: data.content,
    author: data.author,
    coverImage: normalizeImage(data.coverImage) ?? data.coverImage,
    seo: normalizeSeo(data.seo),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
  };
}

/**
 * Normalise un tableau d'articles de blog
 */
export function normalizeBlogs(blogs: BlogType[]): BlogType[] {
  return Array.isArray(blogs) ? blogs.map(normalizeBlog) : [];
}