import { ImageType } from "./image";

export interface SocialMediaType {
  id: number;
  platform: string;
  url: string;
  is_active: boolean;
  icon?: ImageType;
}

export interface MemorialPageType {
  id: number;
  documentId: string;
  title: string;
  subtitle: string;
  birth_date: string;
  death_date: string;
  biography_content: string;
  section_title: string;
  sadaqah_introduction: string;
  dua_title: string;
  dua_content: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  image: ImageType[];
  social_media: SocialMediaType[];
}