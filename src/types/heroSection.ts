import { ImageType } from "./image";

export interface HeroSection {
  title: string;
  subtitle?: string; // This is what Strapi calls it
  description?: string; // Keep for backwards compatibility
  buttonText?: string; // Strapi field
  buttonLink?: string; // Strapi field
  button?: {
    id: number;
    title: string;
    url: string;
    is_external: boolean;
  } | null;
  image?: ImageType;
}
