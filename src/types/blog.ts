import type { ImageType } from "@/types/image";

export interface SeoBlog {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  metaRobots?: string;
  metaViewport?: string;
  canonicalURL?: string;
  structuredData?: Record<string, unknown> | null;
  metaImage?: ImageType | null;
  openGraph?: {
    ogTitle?: string;
    ogDescription?: string;
    ogUrl?: string;
    ogType?: string;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface BlogType {
  id: number | string;
  documentId?: string;
  title: string;
  slug: string;
  content: string;
  author?: string;
  coverImage?: ImageType | null;
  seo?: SeoBlog | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  raw?: unknown;
}
