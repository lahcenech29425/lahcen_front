import type { ImageType } from "@/types/image";

export interface FooterContact {
  id: number;
  value: string;
  icon: ImageType;
}

export interface FooterSocialLink {
  id: number;
  platform: string;
  url: string;
  is_active: boolean;
  icon: ImageType;
}

export interface FooterMenuLink {
  id: number;
  title: string;
  is_external: boolean;
  url: string;
}

export interface FooterMenu {
  id: number;
  title: string;
  links: FooterMenuLink[];
}

export interface FooterLogo {
  id: number;
  link: string;
  image: ImageType;
}

export interface FooterType {
  id: number;
  documentId: string;
  description: string;
  copyrightText: string;
  logo: FooterLogo;
  menu: FooterMenu[];
  socialLinks: FooterSocialLink[];
  contact: FooterContact[];
}