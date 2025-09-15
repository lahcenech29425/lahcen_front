import type { BlogType } from "@/types/blog";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";

export function normalizeBlog(data: BlogType): BlogType {
  return {
    id: data.id,
    documentId: data.documentId,
    title: data.title,
    slug: data.slug,
    content: data.content,
    author: data.author,
    coverImage: normalizeImage(data.coverImage) ?? data.coverImage,
  };
}

export function normalizeBlogs(blogs: BlogType[]): BlogType[] {
  return Array.isArray(blogs) ? blogs.map(normalizeBlog) : [];
}