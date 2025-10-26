import { HeroSection as HeroSectionType } from "@/types/heroSection";
import { normalizeHeroSection } from "./normalizer";

export default function HeroSection({ data }: { data: HeroSectionType }) {
  const { title, subtitle, buttonText, buttonLink, image } =
    normalizeHeroSection(data || {});
  const bgUrl = image && image.url ? `url('${image.url}')` : undefined;

  return (
    <section
      className="relative flex items-center justify-center min-h-[60vh] md:min-h-[80vh] overflow-hidden text-center"
      style={{
        backgroundImage: bgUrl,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-16 md:py-32 max-w-screen-lg mx-auto">
        <h2
          className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 md:mb-8 text-white drop-shadow-2xl tracking-tight opacity-0 translate-y-8 animate-fade-in-up leading-tight md:leading-tight"
          style={{
            animationDelay: "100ms",
            animationFillMode: "forwards",
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          {title}
        </h2>
        <p
          className="text-xl md:text-2xl lg:text-3xl mb-8 md:mb-10 text-white/90 max-w-3xl mx-auto font-medium opacity-0 translate-y-8 animate-fade-in-up leading-relaxed md:leading-relaxed"
          style={{
            animationDelay: "300ms",
            animationFillMode: "forwards",
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          }}
        >
          {subtitle}
        </p>
        {buttonText && (
          <a
            href={buttonLink}
            className="inline-block px-6 py-3 md:px-8 md:py-4 rounded bg-gray-100 dark:bg-[#1a1a1a] text-black dark:text-white text-base md:text-lg font-semibold shadow-lg hover:bg-white dark:hover:bg-[#232323] hover:scale-105 transition-all duration-300 opacity-0 translate-y-8 animate-fade-in-up"
            style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
          >
            {buttonText}
          </a>
        )}
      </div>
      {/* Animation CSS */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(32px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.9s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </section>
  );
}
