import { LinkType } from "@/types/link";

// Normalizer for header menu/cta links
export function normalizeLink(link: LinkType): LinkType {
  return {
    id: link.id,
    title: link.title || "",
    url: link.url || "",
    is_external: !!link.is_external,
  };
}
