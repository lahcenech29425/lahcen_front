"use client";
import BlockRenderer from "./renderer";
import type { BlockData } from "@/types/blocks";
import SplitSection from "./SplitSection";

// Définis un type pour la structure de homepage
type Homepage = {
  sections: BlockData[];
  // Ajoute d'autres champs si nécessaire
};

export default function HomeWidget({ homepage }: { homepage: Homepage }) {
  if (!homepage?.sections?.length) {
    return null;
  }

  return (
    <>
      <main className="">
        {/* Render Hero Section explicitly if present */}
        <BlockRenderer blocks={homepage.sections.filter(b => b.__component === "blocks.hero-section")} />

        {/* Static Content Blocks */}
        <div className="w-full bg-gradient-to-b from-background via-muted/10 to-background">
          <SplitSection
            badge="القُرْآنِ الكَرِيمِ"
            title="نُورُ القُرْآنِ الكَرِيمِ"
            description="اقرأ أو استمع إلى الآيات المباركة مع تفسير مبسط يساعدك على فهم المعاني بعمق، واستمد طمأنينة القلب وروحانية تغذي يومك بالسكينة والإيمان."
            buttonText="اكتشف الآن"
            buttonUrl="/quran"
            imageUrl="https://res.cloudinary.com/dpuhywxsf/image/upload/v1771248724/quran-explore_rpuovb.png"
            imageAlt="نُورُ القُرْآنِ الكَرِيمِ"
            imagePosition="left"
          />

          <SplitSection
            badge="السُّنَّةِ النَّبَوِيَّةِ"
            title="كُنُوزُ السُّنَّةِ النَّبَوِيَّةِ"
            description="استكشف أحاديث النبي ﷺ، واستلهم منها الهداية والسلوك القويم لتُضيء درب حياتك بالإيمان والقيم."
            buttonText="اقرأ الآن"
            buttonUrl="/hadith"
            imageUrl="https://res.cloudinary.com/dpuhywxsf/image/upload/v1771250022/hadith-explore_hfcxcj.png"
            imageAlt="كُنُوزُ السُّنَّةِ النَّبَوِيَّةِ"
            imagePosition="right"
          />
        </div>

        {/* Render remaining blocks excluding Hero */}
        <BlockRenderer blocks={homepage.sections.filter(b => b.__component !== "blocks.hero-section")} />
      </main>
    </>
  );
}
