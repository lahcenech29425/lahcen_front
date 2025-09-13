import { normalizeImage } from "@/shared/normalizers/normalizeImage";
import { HeroSection } from "@/types/heroSection";

export function normalizeHeroSection(data: HeroSection) {
  return {
    title: data.title || "",
    subtitle: data.subtitle || "",
    buttonText: data.buttonText || "",
    buttonLink: data.buttonLink || "",
    image: normalizeImage(data.image),
  };
}
