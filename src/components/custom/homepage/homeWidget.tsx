import HeroSection from "./hero_section/HeroSection";
import StatsSection from "./stats_section/StatsSection";
import ServicesSection from "./services_section/ServicesSection";
import SplitSection from "./SplitSection";
import Slider from "./slider/Slider";


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
          imageUrl="https://res.cloudinary.com/dpuhywxsf/image/upload/v1771248724/quran-explore_rpuovb.png"
          imageAlt="نُورُ القُرْآنِ الكَرِيمِ"
          imagePosition="left"
        />

        {/* Hadith */}
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

        {/* Names of Allah */}
        <SplitSection
          badge="أسماء الله الحسنى"
          title="أسماء الله الحسنى"
          description="تأمل في أسماء الله الحسنى، واكتشف معانيها العميقة التي تجلي عظمته وكماله، لتزداد معرفة وإيمانًا بخالقك."
          buttonText="تصفح الأسماء"
          buttonUrl="/names-of-allah"
          imageUrl="/names-of-allah-home.png"
          imageAlt="أسماء الله الحسنى"
          imagePosition="left"
        />

        {/* Prayer Times - High Utility */}
        <SplitSection
          badge="مواقيت الصلاة"
          title="دقة في الموعد، سكينة في القلب"
          description="تابع مواقيت الصلاة بدقة عالية حسب موقعك الجغرافي، مع تنبيهات الأذان والعد التنازلي للصلاة القادمة، لتبقى دائمًا على صلة بخالقك."
          buttonText="عرض المواقيت"
          buttonUrl="/prayer-times"
          imageUrl="/prayer-times-home.png"
          imageAlt="مواقيت الصلاة"
          imagePosition="bottom"
        />

        {/* Quran Audio (Listen) - NEW */}
        <SplitSection
          badge="القرآن الصوتي"
          title="خشوع التلاوة وجمال الصوت"
          description="استمع إلى عذب التلاوات من أشهر القراء في العالم الإسلامي، بجودة عالية تأخذك في رحلة روحانية تملأ قلبك بالخشوع."
          buttonText="استمع الآن"
          buttonUrl="/quran-audio"
          imageUrl="/quran-audio-home.png"
          imageAlt="القرآن الصوتي"
          imagePosition="left"
        />

        {/* Calendar Converter */}
        <SplitSection
          badge="التقويم والتحويل"
          title="تتبع الأيام المباركة"
          description="حول بين التواريخ الهجرية والميلادية بكل سهولة، واطلع على التقويم الإسلامي للمناسبات الدينية والأيام البيض، بتصميم عصري وأنيق."
          buttonText="التقويم والمحول"
          buttonUrl="/prayer-times"
          imageUrl="/calendar-home.png"
          imageAlt="التقويم الهجري والمحوال"
          imagePosition="right"
        />

        {/* Download Calendar - Vertical */}
        <SplitSection
          badge="تحميل التقويم"
          title="تقويمك في جيبك"
          description="حمل تقويم مواقيت الصلاة الشهري بتصميم أنيق وجاهز للطباعة، لتنظيم وقتك وعبادتك أينما كنت."
          buttonText="تحميل التقويم"
          buttonUrl="/prayer-times"
          imageUrl="/download-calendar-home.png"
          imageAlt="تحميل التقويم"
          imagePosition="bottom"
        />
      </div>

      {/* Slider Section - Visual Break */}
      <Slider />

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <ServicesSection />
    </main>
  );
}
