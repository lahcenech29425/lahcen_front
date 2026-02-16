"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Globe, Heart } from "lucide-react";

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const title = "مِنْصَةٌ يَتَّسِعُ نُورُهَا وَتَزْدَادُ بِهَا القُلُوبُ إِيمَانًا";
  const description = "منصتنا تجمع بين جمال القرآن الكريم ونقاء السنة النبوية، لتكون معك حيثما كنت، تهديك الكلمة الصادقة، والذكر المبارك، والطمأنينة التي يبحث عنها قلبك.";

  const stats = [
    {
      id: 1,
      value: "25,000",
      label: "قلب نابض بالذكر",
      description: "يجدون السكينة في آيات الله يوميًا",
      icon: Heart,
    },
    {
      id: 2,
      value: "80+",
      label: "بلدًا حول العالم",
      description: "تصلها رسالتنا بنور القرآن والسنة",
      icon: Globe,
    },
    {
      id: 3,
      value: "99.9%",
      label: "استمرارية",
      description: "منصة ثابتة بخدمتكم لتبقى قلوبكم على صلة بالهدى",
      icon: BookOpen,
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-[#3d2a1a] dark:bg-[#2a1e13] text-white">
      {/* Dark Islamic pattern - bg1.svg - Increased Visibility */}
      <div
        className="absolute inset-0 bg-white opacity-[0.08] pointer-events-none"
        style={{
          maskImage: "url('/assets/bg1.svg')",
          WebkitMaskImage: "url('/assets/bg1.svg')",
          maskRepeat: "repeat",
          WebkitMaskRepeat: "repeat",
          maskSize: "400px",
          WebkitMaskSize: "400px",
        }}
      />

      {/* Brown gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3d2a1a] via-[#3d2a1a]/80 to-[#3d2a1a] dark:from-[#2a1e13] dark:via-[#2a1e13]/80 dark:to-[#2a1e13] pointer-events-none opacity-80" />

      {/* Subtle brown glow - Top Center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 z-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block py-2 px-6 rounded-full bg-white/20 border border-white/40 text-white text-sm font-semibold mb-6 backdrop-blur-sm"
          >
            أرقام وحقائق
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white font-momken"
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>
        </div>

        {/* Stats Grid - Flexbox for perfect centering */}
        <div className="flex flex-wrap justify-center gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + (i * 0.1) }}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 flex flex-col items-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] min-w-[280px] max-w-[320px]"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 text-center w-full">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Number - Large and prominent - Force LTR for numbers to fix % and + position */}
                  <div
                    className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/80 mb-4 font-sans tracking-tight"
                    style={{ fontSize: "clamp(48px, 4vw, 64px)" }}
                    dir="ltr"
                  >
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300">
                    {stat.label}
                  </div>

                  {/* Description */}
                  {stat.description && (
                    <div className="text-white/60 text-sm leading-relaxed mt-2">
                      {stat.description}
                    </div>
                  )}
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
