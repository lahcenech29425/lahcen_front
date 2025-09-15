import { fetchApi } from "@/utils/fetchApi";
import { normalizeMemorialPage } from "./normalizer";
import AboutPageClient from "./AboutPageClient";

async function getAboutPageData() {
  try {
    const response = await fetchApi("/api/about-page?populate=social_media.icon&populate=image");
    return normalizeMemorialPage(response);
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return null;
  }
}

export default async function AboutPage() {
  const memorial = await getAboutPageData();
  
  if (!memorial || !memorial.id) {
    return <div className="text-center py-20">Failed to load content</div>;
  }
  
  return <AboutPageClient memorial={memorial} />;
}