"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, BookOpen, Heart, HandHelping, Quote } from "lucide-react";
import { MemorialPageType } from "@/types/memorial";
import { useState, useEffect } from "react";

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
    <main dir="rtl" className="bg-white font-amiri">
      {/* Hero Section with Parallax Effect - responsive */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden flex items-center justify-center">
        {/* Image background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundAttachment: isClient ? "fixed" : "scroll",
          }}
        ></div>

        {/* Dark overlay pour lisibilité */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Navigation (inchangé) */}
        <nav className="absolute top-4 right-4 md:top-10 md:right-10 z-30 flex items-center gap-3 text-sm text-white/90 bg-black/25/60 rounded-md px-3 py-1 md:px-0 md:py-0">
          <Link href="/" className="hover:text-white transition">
            الرئيسية
          </Link>
          <span className="inline text-white">/</span>
          <span className="text-white font-semibold">تعرف علينا</span>
        </nav>

        {/* Contenu Hero */}
        <div className="relative z-20 text-center px-4 sm:px-6 max-w-3xl mx-auto">
          <h1 className="font-amiri text-3xl sm:text-4xl md:text-6xl text-white mb-4 sm:mb-5 leading-tight">
            {memorial.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light mb-6 leading-relaxed">
            {memorial.subtitle}
          </p>

          {/* Dates responsives */}
           <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white/80">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>ولد: {formatter.format(birthDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>توفي: {formatter.format(deathDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Biography Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <div className="inline-block p-2 bg-gray-100 rounded-full mb-4">
              <BookOpen size={28} className="text-gray-700" />
            </div>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">
              سيرة المرحوم
            </h2>
            <p className="text-lg text-gray-600 mb-5 leading-relaxed">
              في هذه السطور نستحضر بعضاً من محطات حياته وخصاله الحميدة، تخليداً
              لذكراه العطرة ودعاءً له بالرحمة والمغفرة.
            </p>

            <div className="h-1 w-24 bg-gray-300 mx-auto"></div>
          </div>

          <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
            <p className="text-justify first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-right first-letter:text-gray-900">
              {memorial.biography_content}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section with Gradient Background */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-100 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-block p-2 bg-white rounded-full mb-4 shadow-sm">
              <Heart size={28} className="text-gray-700" />
            </div>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">
              {memorial.section_title}
            </h2>
            <p className="text-lg text-gray-600 mb-5 leading-relaxed">
              نطمح أن يكون هذا المشروع منبرًا لنشر الخير والوعي، ووسيلة تربط
              المسلمين بكتاب الله وسنة نبيه صلى الله عليه وسلم. إنه مشروع يبدأ
              بخطوات متواضعة، لكنه بإذن الله سيمتد أثره، ليكون صدقة جارية متجددة
              للوالد الراحل ولكل من ساهم فيه. نسأل الله أن يكتب الأجر لكل من
              شارك بدعوة، أو نشر، أو تلاوة، أو حتى بكلمة طيبة، وأن يجعل هذا
              العمل نورًا في الدنيا والآخرة.
            </p>
            <div className="h-1 w-24 bg-gray-300 mx-auto"></div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div
              className="text-justify prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: memorial.sadaqah_introduction.replace(/- /g, "<br/>- "),
              }}
            ></div>

            {/* Featured Benefits */}
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              <div className="p-5 bg-gray-50 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-900"
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
                <h3 className="font-semibold text-lg mb-2">القرآن الكريم</h3>
                <p className="text-gray-600">
                  تلاوات متنوعة بأصوات عذبة، وتفاسير ميسرة
                </p>
              </div>

              <div className="p-5 bg-gray-50 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-900"
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
                <h3 className="font-semibold text-lg mb-2">الحديث الشريف</h3>
                <p className="text-gray-600">أحاديث نبوية صحيحة مع شروحاتها</p>
              </div>

              <div className="p-5 bg-gray-50 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-900"
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
                <h3 className="font-semibold text-lg mb-2">مقالات وبحوث</h3>
                <p className="text-gray-600">
                  محتوى تعليمي وتربوي في مختلف المجالات الاسلامية
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dua Section with Decorative Border */}
      <section id="dua-section" className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <div className="inline-block p-2 bg-white rounded-full mb-4 shadow-sm">
              <HandHelping size={28} className="text-gray-700" />
            </div>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">
              {memorial.dua_title}
            </h2>
            <p className="text-lg text-gray-600 mb-5 leading-relaxed font-amiri">
              يعد الدعاء من أعظم العبادات التي يتقرب بها المسلم إلى الله تعالى،
              وهو سلاح المؤمن في السراء والضراء. فادعوا لأخيكم المتوفى بالرحمة
              والمغفرة، فإن الدعاء ينفع الميت بإذن الله، ويكون له صدقة جارية.
              وقد قال رسول الله ﷺ:
              <span className="font-semibold">
                &quot;إذا مات الإنسان انقطع عمله إلا من ثلاث: صدقة جارية، أو علم
                ينتفع به، أو ولد صالح يدعو له&quot;
              </span>
              . فاجعلوا لدعائكم نصيبا لإخوانكم الذين سبقونا إلى الدار الآخرة،
              وتذكروا أنكم ستكونون يوما مثلهم.
            </p>

            <div className="h-1 w-24 bg-gray-300 mx-auto"></div>
          </div>

          <div className="relative p-10 bg-white rounded-lg shadow-sm border border-gray-100">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-gray-200 rounded-tr-lg"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-gray-200 rounded-br-lg"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-gray-200 rounded-tl-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-gray-200 rounded-bl-lg"></div>

            <div className="text-center mb-6">
              <Quote size={32} className="text-gray-300 mx-auto" />
            </div>

            <div className="text-justify prose prose-lg max-w-none leading-relaxed text-gray-700 font-amiri text-xl">
              <p>{memorial.dua_content}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
              تابعونا على وسائل التواصل
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6 text-lg leading-relaxed">
              ابقوا على اتصال معنا عبر منصات التواصل الاجتماعي لمتابعة آخر
              المنشورات والتلاوات القرآنية والأحاديث النبوية الشريفة والمقالات
              التربوية. نسعد بمشاركتكم ودعمكم لإيصال هذه الصدقة الجارية لأكبر
              عدد من المستفيدين
            </p>
            <div className="h-1 w-24 bg-gray-300 mx-auto"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
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
                    className="inline-flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Image
                      src={social.icon?.url || ""}
                      alt={social.platform}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </main>
  );
}
