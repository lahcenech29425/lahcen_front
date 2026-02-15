"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, BookOpen, Heart, HandHelping, Quote } from "lucide-react";
import { MemorialPageType } from "@/types/memorial";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { motion } from "framer-motion";

interface AboutPageClientProps {
  memorial: MemorialPageType;
}

export default function AboutPageClient({ memorial }: AboutPageClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Récupération de l'URL de l'image
  const imageUrl = memorial.image[0].url;

  // Configuration des dates en format arabe
  const birthDate = new Date(memorial.birth_date);
  const deathDate = new Date(memorial.death_date);
  const formatter = new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main dir="rtl" className="bg-background min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden flex items-center justify-center">
        {/* Image background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundAttachment: isClient ? "fixed" : "scroll",
          }}
        ></div>

        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/30 z-10"></div>

        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-start">
            <div className="bg-black/20 backdrop-blur-sm inline-block px-4 py-2 rounded-lg border border-white/10">
              <Breadcrumb
                items={[{ label: "تعرف علينا" }]}
                textColor="text-white"
                className="mb-0!"
              />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-40">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-amiri text-4xl sm:text-5xl md:text-7xl text-white mb-6 leading-tight font-bold"
          >
            {memorial.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl text-white/95 font-light mb-8 leading-relaxed"
          >
            {memorial.subtitle}
          </motion.p>

          {/* Dates with modern card design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 text-white"
          >
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <Calendar size={20} className="text-white" />
              <span className="font-medium">
                ولد: {formatter.format(birthDate)}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <Calendar size={20} className="text-white" />
              <span className="font-medium">
                توفي: {formatter.format(deathDate)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Biography Section */}
      <section className="py-24 px-4 -mt-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl border border-primary/10 p-8 md:p-12"
          >
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <BookOpen size={32} className="text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-amiri">
                سيرة المرحوم
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-3xl mx-auto">
                في هذه السطور نستحضر بعضاً من محطات حياته وخصاله الحميدة،
                تخليداً لذكراه العطرة ودعاءً له بالرحمة والمغفرة.
              </p>
              <div className="h-1 w-32 bg-primary/20 mx-auto rounded-full"></div>
            </div>

            <div className="prose prose-lg max-w-none leading-relaxed text-foreground">
              <p className="text-justify text-lg md:text-xl leading-loose first-letter:text-6xl first-letter:font-bold first-letter:mr-4 first-letter:float-right first-letter:text-primary">
                {memorial.biography_content}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section with Gradient Background */}
      <section className="py-24 px-4 bg-linear-to-b from-primary/5 via-secondary/5 to-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
              <Heart size={32} className="text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-amiri">
              {memorial.section_title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-4xl mx-auto">
              نطمح أن يكون هذا المشروع منبرًا لنشر الخير والوعي، ووسيلة تربط
              المسلمين بكتاب الله وسنة نبيه صلى الله عليه وسلم. إنه مشروع يبدأ
              بخطوات متواضعة، لكنه بإذن الله سيمتد أثره، ليكون صدقة جارية متجددة
              للوالد الراحل ولكل من ساهم فيه. نسأل الله أن يكتب الأجر لكل من
              شارك بدعوة، أو نشر، أو تلاوة، أو حتى بكلمة طيبة، وأن يجعل هذا
              العمل نورًا في الدنيا والآخرة.
            </p>
            <div className="h-1 w-32 bg-primary/20 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card p-8 md:p-12 rounded-3xl border border-primary/10 mb-12"
          >
            <div
              className="text-right prose prose-lg max-w-none text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: memorial.sadaqah_introduction
                  .replace(/^- /m, "<br/>- ")
                  .replace(/- $/m, "-<br/>"),
              }}
            ></div>
          </motion.div>

          {/* Featured Benefits */}
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card p-8 rounded-3xl text-center border border-primary/10 transition-all hover:scale-105 hover:border-primary/20"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground font-amiri">
                القرآن الكريم
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                تلاوات متنوعة بأصوات عذبة، وتفاسير ميسرة
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card p-8 rounded-3xl text-center border border-primary/10 transition-all hover:scale-105 hover:border-primary/20"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground font-amiri">
                الحديث الشريف
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                أحاديث نبوية صحيحة مع شروحاتها
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-card p-8 rounded-3xl text-center border border-primary/10 transition-all hover:scale-105 hover:border-primary/20"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground font-amiri">
                مقالات وبحوث
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                محتوى تعليمي وتربوي في مختلف المجالات الاسلامية
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dua Section with Decorative Border */}
      <section
        id="dua-section"
        className="py-24 px-4 bg-linear-to-b from-background via-secondary/5 to-background"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
              <HandHelping size={32} className="text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-amiri">
              {memorial.dua_title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed font-amiri max-w-3xl mx-auto">
              يعد الدعاء من أعظم العبادات التي يتقرب بها المسلم إلى الله تعالى،
              وهو سلاح المؤمن في السراء والضراء. فادعوا لأخيكم المتوفى بالرحمة
              والمغفرة، فإن الدعاء ينفع الميت بإذن الله، ويكون له صدقة جارية.
              وقد قال رسول الله ﷺ:
              <span className="font-semibold text-primary">
                &quot;إذا مات الإنسان انقطع عمله إلا من ثلاث: صدقة جارية، أو علم
                ينتفع به، أو ولد صالح يدعو له&quot;
              </span>
              . فاجعلوا لدعائكم نصيبا لإخوانكم الذين سبقونا إلى الدار الآخرة،
              وتذكروا أنكم ستكونون يوما مثلهم.
            </p>

            <div className="h-1 w-32 bg-primary/20 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-12 md:p-16 bg-card rounded-3xl border border-primary/10"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-primary/20 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-primary/20 rounded-br-3xl"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary/20 rounded-tl-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-primary/20 rounded-bl-3xl"></div>

            <div className="text-center mb-8">
              <Quote size={40} className="text-primary/30 mx-auto" />
            </div>

            <div className="text-justify prose prose-lg max-w-none leading-relaxed text-foreground font-amiri text-xl md:text-2xl">
              <p>{memorial.dua_content}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-amiri">
              تابعونا على وسائل التواصل
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
              ابقوا على اتصال معنا عبر منصات التواصل الاجتماعي لمتابعة آخر
              المنشورات والتلاوات القرآنية والأحاديث النبوية الشريفة والمقالات
              التربوية. نسعد بمشاركتكم ودعمكم لإيصال هذه الصدقة الجارية لأكبر
              عدد من المستفيدين
            </p>
            <div className="h-1 w-32 bg-primary/20 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {memorial.social_media
              .filter((s) => s.is_active)
              .map((social, index) => {
                return (
                  <Link
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="inline-flex items-center justify-center p-4 bg-card hover:bg-primary/10 rounded-2xl border border-primary/10 hover:border-primary/20 transition-all hover:scale-110"
                  >
                    <Image
                      src={social.icon?.url || ""}
                      alt={social.platform}
                      width={40}
                      height={40}
                      className="object-contain dark:invert"
                      loading="lazy"
                    />
                  </Link>
                );
              })}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
