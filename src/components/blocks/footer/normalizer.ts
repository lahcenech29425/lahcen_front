import type { FooterMenu, FooterMenuLink, FooterSocialLink, FooterContact, FooterType } from "@/types/footer";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";


export function normalizeFooter(data: FooterType): FooterType {
  return {
    id: data.id,
    documentId: data.documentId,
    description: data.description,
    copyrightText: data.copyrightText,
    logo: {
      id: data.logo.id,
      link: data.logo.link,
      image: normalizeImage(data.logo.image) ??  data.logo.image,
    },
    menu: Array.isArray(data.menu)
      ? data.menu.map((menu): FooterMenu => ({
          id: menu.id,
          title: menu.title,
          links: Array.isArray(menu.links)
            ? menu.links.map((link): FooterMenuLink => ({
                id: link.id,
                title: link.title,
                is_external: link.is_external,
                url: link.url,
              }))
            : [],
        }))
      : [],
    socialLinks: Array.isArray(data.socialLinks)
      ? data.socialLinks.map((item): FooterSocialLink => ({
          id: item.id,
          platform: item.platform,
          url: item.url,
          is_active: item.is_active,
          icon: normalizeImage(item.icon) ?? item.icon,
        }))
      : [],
    contact: Array.isArray(data.contact)
      ? data.contact.map((item): FooterContact => ({
          id: item.id,
          value: item.value,
          icon: normalizeImage(item.icon) ?? item.icon,
        }))
      : [],
  };
}