import { ImageType } from "@/types/image";

export function normalizeImage(image: ImageType): ImageType | null {
  if (!image) return null;
  let url = image?.url || image.url || "";
  // Add domain if url is relative
  if (url && url.startsWith("/")) {
    url = `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
  }
  return {
    id: image.id,
    url,
    alt: image.alternativeText || image.caption || "",
    width: image?.width || image.width || undefined,
    height: image?.height || image.height || undefined,
    mime: image.mime || "",
  };
}
