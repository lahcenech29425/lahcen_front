import HomeWidget from "@/components/custom/homepage/homeWidget";
import { fetchApi } from "@/utils/fetchApi";
export default async function HomePage() {
  const homepage = await fetchApi('/api/homepage?populate=sections.image,sections.stats,sections.slider.image,sections.button,sections.services,sections.services.icon');
  return (
    <>
        <HomeWidget homepage={homepage} />
    </>
  );
}
