import { normalizeImage } from "@/shared/normalizers/normalizeImage";
import { HeaderType, HeaderMenuItem, HeaderCTAItem } from "@/types/header";

export function normalizeHeader(data: HeaderType): HeaderType {
  return {
    id: data.id,
    documentId: data.documentId,
    logo: {
      id: data.logo.id,
      link: data.logo.link,
      image: normalizeImage(data.logo.image) ?? data.logo.image,
    },
    menu: Array.isArray(data.menu)
      ? data.menu.map((item: HeaderMenuItem) => ({
          id: item.id,
          title: item.title,
          is_external: item.is_external,
          url: item.url,
        }))
      : [],
    cta: Array.isArray(data.cta)
      ? data.cta.map((item: HeaderCTAItem) => ({
          id: item.id,
          title: item.title,
          is_external: item.is_external,
          url: item.url,
        }))
      : [],
  };
}
