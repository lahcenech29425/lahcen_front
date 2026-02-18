import HeroSection from "./hero_section/HeroSection";
import StatsSection from "./stats_section/StatsSection";
import ServicesSection from "./services_section/ServicesSection";
import SplitSection from "./SplitSection";
import Slider from "./slider/Slider";
import UnifiedPrayerSection from "./UnifiedPrayerSection";
import NamesOfAllahSection from "./NamesOfAllahSection";
import DuaaSection from "./DuaaSection";


export default function HomeWidget() {
  return (
    <main className="">
      {/* Render Hero Section */}
      <HeroSection data={{} as any} />



      {/* Static Content Blocks */}
      <div className="w-full bg-gradient-to-b from-background via-muted/10 to-background">

        {/* Quran (Read) */}
        <SplitSection
          badge="القُرْآنِ الكَرِيمِ"
          title="نُورُ القُرْآنِ الكَرِيمِ"
          description="اقرأ الآيات المباركة مع تفسير مبسط يساعدك على فهم المعاني بعمق، واستمد طمأنينة القلب وروحانية تغذي يومك بالسكينة والإيمان."
          buttonText="اكتشف الآن"
          buttonUrl="/quran"
          imageUrl={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771248724/quran-explore_rpuovb.png`}
          imageAlt="نُورُ القُرْآنِ الكَرِيمِ"
          imagePosition="left"
        />

        {/* Hadith */}
        <SplitSection
          badge="السُّنَّةِ النَّبَوِيَّةِ"
          title="كُنُوزُ السُّنَّةِ النَّبَوِيَّةِ"
          description="استكشف أحاديث النبي ﷺ، واستلهم منها الهداية والسلوك القويم لتُضيء درب حياتك بالإيمان والقيم."
          buttonText="اقرأ الآن"
          buttonUrl="/hadith"
          imageUrl={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771250022/hadith-explore_hfcxcj.png`}
          imageAlt="كُنُوزُ السُّنَّةِ النَّبَوِيَّةِ"
          imagePosition="right"
        />


        {/* Unified Prayer & Calendar Dashboard Section */}
        <UnifiedPrayerSection />
      </div>

      {/* Quran Audio (Listen) */}
      <SplitSection
        badge="القرآن الصوتي"
        title="خشوع التلاوة وجمال الصوت"
        description="استمع إلى عذب التلاوات من أشهر القراء في العالم الإسلامي، بجودة عالية تأخذك في رحلة روحانية تملأ قلبك بالخشوع."
        buttonText="استمع الآن"
        buttonUrl="/quran-audio"
        imageUrl={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771249646/audio_quran_hd6c0l.png`}
        imageAlt="القرآن الصوتي"
        imagePosition="bottom"
      />
      {/* Names of Allah Section - Brown themed */}
      <NamesOfAllahSection />

      {/* Duaa / Azkar Section */}
      <DuaaSection />

      {/* Slider Section - Visual Break */}
      <Slider />

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <ServicesSection />
    </main>
  );
}
