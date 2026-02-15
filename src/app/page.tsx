import HomeWidget from "@/components/custom/homepage/homeWidget";
import { fetchApi } from "@/utils/fetchApi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute:
      "سِرَاجٌ يُضِيءُالدَّرْبَ — القرآن الكريم، الأحاديث، المقالات الإسلامية",
  },
  description:
    "منصة إسلامية متكاملة لقراءة القرآن الكريم برواية حفص وورش، والاستماع لأشهر القراء، وتصفح الأحاديث النبوية الشريفة، ومطالعة المقالات الدينية والكتب الإسلامية ومعرفة أوقات الصلاة.",
  openGraph: {
    title: "سِرَاجٌ يُضِيءُالدَّرْبَ — منصة إسلامية شاملة",
    description:
      "قراءة القرآن الكريم، تلاوات مرتلة، أحاديث نبوية، مقالات إسلامية، كتب دينية، وأوقات الصلاة — كل ذلك في منصة واحدة.",
    url: "/",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};
export default async function HomePage() {
  let homepage = null;
  try {
    homepage = await fetchApi(
      "/api/homepage?populate=sections.image,sections.stats,sections.slider.image,sections.button,sections.services,sections.services.icon",
    );
  } catch (e) {
    console.error("Failed to fetch homepage data:", e);
  }

  if (!homepage || !homepage.sections) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <p>تعذر تحميل محتوى الصفحة الرئيسية. يرجى المحاولة لاحقاً.</p>
      </div>
    );
  }

  return (
    <>
      <HomeWidget homepage={homepage} />
    </>
  );
}
