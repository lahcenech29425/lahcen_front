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
      <div className="absolute inset-0 bg-black/40 z-0" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-20 md:py-32">
        <h2
          className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl tracking-tight opacity-0 translate-y-8 animate-fade-in-up"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          {title}
        </h2>
        <p
          className="text-2xl md:text-3xl mb-8 text-white/90 max-w-3xl mx-auto font-medium opacity-0 translate-y-8 animate-fade-in-up"
          style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
        >
          {subtitle}
        </p>
        {buttonText && (
          <a
            href={buttonLink}
            className="inline-block px-8 py-3 rounded bg-primary text-black bg-gray-100 text-lg font-semibold shadow hover:bg-primary-dark transition opacity-0 translate-y-8 animate-fade-in-up"
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
