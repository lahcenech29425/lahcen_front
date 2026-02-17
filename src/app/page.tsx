import HomeWidget from "@/components/custom/homepage/homeWidget";
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
export default function HomePage() {
  return (
    <>
      <HomeWidget />
    </>
  );
}
