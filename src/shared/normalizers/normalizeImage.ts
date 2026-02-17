import { ImageType } from "@/types/image";

// Stub normalizer - no longer using Strapi
export function normalizeImage(data: any): ImageType | null {
    if (!data?.url) return null;

    return {
        id: data.id || 1,
        url: data.url,
        alt: data.alt || data.alternativeText || "",
        width: data.width,
        height: data.height,
    };
}
