import { HeroSection } from "@/types/heroSection";
import { getStrapiMediaURL } from "@/utils/strapiHelpers";

export function normalizeHeroSection(data: any): HeroSection {
    return {
        title: data?.title || "",
        subtitle: data?.subtitle || "",
        buttonText: data?.buttonText || "",
        buttonLink: data?.buttonLink || "",
        image: data?.image?.url ? {
            id: data.image.id || 0,
            url: getStrapiMediaURL(data.image.url),
            alt: data.image.alternativeText || data.image.alt || "",
            alternativeText: data.image.alternativeText || "",
            width: data.image.width || 0,
            height: data.image.height || 0,
        } : undefined,
    };
}
