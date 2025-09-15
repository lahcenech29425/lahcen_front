import { MemorialPageType, SocialMediaType } from "@/types/memorial";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";
import { ImageType } from "@/types/image";

// Normaliser la réponse de l'API
export function normalizeMemorialPage(
  data: MemorialPageType
): MemorialPageType {
  if (!data) return {} as MemorialPageType;

  // Si les données sont encapsulées dans data.data (format Strapi)
  const memorial = data;

  return {
    id: memorial.id || 0,
    documentId: memorial.documentId || "",
    title: memorial.title || "",
    subtitle: memorial.subtitle || "",
    birth_date: memorial.birth_date || "",
    death_date: memorial.death_date || "",
    biography_content: memorial.biography_content || "",
    section_title: memorial.section_title || "",
    sadaqah_introduction: memorial.sadaqah_introduction || "",
    dua_title: memorial.dua_title || "",
    dua_content: memorial.dua_content || "",
    createdAt: memorial.createdAt,
    updatedAt: memorial.updatedAt,
    publishedAt: memorial.publishedAt,
    // Utiliser le normalizeImage existant
    image: Array.isArray(memorial.image)
      ? memorial.image
          .map(
            (img: ImageType | null | undefined) => img && normalizeImage(img)
          ) // normaliser seulement si img existe
          .filter((img): img is ImageType => !!img) // filtrer les null/undefined
      : [],
    // Normaliser les médias sociaux
    social_media: Array.isArray(memorial.social_media)
      ? memorial.social_media.map((social: SocialMediaType) =>
          normalizeSocialMedia(social)
        )
      : [],
  };
}

function normalizeSocialMedia(social: SocialMediaType): SocialMediaType {
  if (!social) return {} as SocialMediaType;

  return {
    id: social.id || 0,
    platform: social.platform || "",
    url: social.url || "#",
    is_active: Boolean(social.is_active),
    icon: normalizeImage(social.icon) ?? social.icon,
  };
}
