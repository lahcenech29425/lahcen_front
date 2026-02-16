"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Library, Mic2, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesSection() {
  const section = {
    title: "لِمَاذَا تَخْتَارُ مَنْصَّتَنَا؟",
    description: "اكتشف المزايا التي تجعل رحلتك مع القرآن والسنة سهلة وملهمة، مع دعم مستمر يغذي قلبك وروحك.",
    services: [
      {
        id: 1,
        title: "تلاوات وقراءات متنوعة",
        description: "استمع أو اقرأ القرآن الكريم بتلاوات مختلفة لترتقي بروحك كل يوم.",
        link: "/quran",
        icon: Mic2,
      },
      {
        id: 2,
        title: "أحاديث موثوقة",
        description: "الوصول إلى آلاف الأحاديث النبوية الصحيحة مع التفسير والشرح المبسط.",
        link: "/hadith",
        icon: BookOpen,
      },
      {
        id: 3,
        title: "مجتمع عالمي",
        description: "شارك مع آلاف المسلمين حول العالم، وتبادل العلم والخير والذكر.",
        link: "/community",
        icon: Users,
      },
      {
        id: 4,
        title: "موارد تعليمية سهلة الوصول",
        description: "مقالات، فيديوهات، ودروس صوتية تساعدك على فهم الكتاب والسنة بسهولة.",
        link: "/resources",
        icon: Library,
      },
    ],
  };

  return (
    <section className="relative py-24 overflow-hidden bg-transparent">
      {/* Background patterns are now handled globally in globals.css */}

      {/* Subtle decorative glows */}
      <div className="absolute top-0 right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-momken"
          >
            {section.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {section.description}
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.1 * i,
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="group"
              >
                <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 flex flex-col">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">
                    {service.description}
                  </p>

                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                  >
                    <span>اقرأ المزيد</span>
                    <ArrowLeft size={16} className="transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
