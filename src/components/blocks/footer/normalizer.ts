import type { FooterMenu, FooterMenuLink, FooterSocialLink, FooterContact, FooterType } from "@/types/footer";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";

type FooterApi = {
  id: number;
  documentId: string;
  description: string;
  copyrightText: string;
  logo: {
    id: number;
    link: string;
    image: unknown;
  };
  menu: {
    id: number;
    title: string;
    links: {
      id: number;
      title: string;
      is_external: boolean;
      url: string;
    }[];
  }[];
  socialLinks: {
    id: number;
    platform: string;
    url: string;
    is_active: boolean;
    icon: unknown;
  }[];
  contact: {
    id: number;
    value: string;
    icon: unknown;
  }[];
};

export function normalizeFooter(data: FooterApi): FooterType {
  return {
    id: data.id,
    documentId: data.documentId,
    description: data.description,
    copyrightText: data.copyrightText,
    logo: {
      id: data.logo.id,
      link: data.logo.link,
      image: normalizeImage(data.logo.image),
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
          icon: normalizeImage(item.icon),
        }))
      : [],
    contact: Array.isArray(data.contact)
      ? data.contact.map((item): FooterContact => ({
          id: item.id,
          value: item.value,
          icon: normalizeImage(item.icon),
        }))
      : [],
  };
}