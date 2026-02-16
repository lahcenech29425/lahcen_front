"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Twitter, Phone, MessageCircle } from "lucide-react";

export default function Footer() {
  const footerData = {
    description: "سِرَاجٌ يُضِيءُ الدَّرْبَ… نُورٌ لِلرُّوحِ وَسَكِينَةٌ لِلْقَلْبِ",
    socialLinks: [
      { id: 1, platform: "facebook", url: "https://facebook.com", icon: Facebook },
      { id: 2, platform: "instagram", url: "https://instagram.com", icon: Instagram },
      { id: 3, platform: "youtube", url: "https://youtube.com", icon: Youtube },
      { id: 4, platform: "x", url: "https://x.com", icon: Twitter },
      { id: 5, platform: "tiktok", url: "https://tiktok.com", icon: MessageCircle }, // Using MessageCircle as placeholder for TikTok
      { id: 6, platform: "whatsapp", url: "https://whatsapp.com", icon: Phone },
    ],
    menu: [
      {
        id: 1,
        title: "القرآن الكريم",
        links: [
          { id: 11, title: "تلاوات صوتية", url: "/quran/recitations" },
          { id: 12, title: "ترجمات القرآن", url: "/quran/translations" },
          { id: 13, title: "البحث في السور والآيات", url: "/quran/search" },
        ],
      },
      {
        id: 2,
        title: "الحديث الشريف",
        links: [
          { id: 21, title: "حديث اليوم", url: "/hadith/today" },
          { id: 22, title: "البحث في الأحاديث", url: "/hadith/search" },
          { id: 23, title: "التصنيف حسب الموضوع", url: "/hadith/topics" },
        ],
      },
      {
        id: 3,
        title: "المقالات",
        links: [
          { id: 31, title: "تدبر القرآن", url: "/articles/quran-reflections" },
          { id: 32, title: "السيرة النبوية", url: "/articles/prophet-biography" },
          { id: 33, title: "الأخلاق والسلوك", url: "/articles/ethics" },
        ],
      },
      {
        id: 4,
        title: "الموارد",
        links: [
          { id: 41, title: "المرئيات", url: "/resources/videos" },
          { id: 42, title: "الصوتيات", url: "/resources/audio" },
          { id: 43, title: "دروس ومحاضرات", url: "/resources/lessons" },
        ],
      },
    ],
    copyrightText: "© 2025 لحسن – جميع الحقوق محفوظة",
  };

  return (
    <footer
      className="relative bg-[#3E2723] dark:bg-[#2D1B14] text-white pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden"
      dir="rtl"
    >
      {/* Dark Islamic pattern - bg1.svg for dark sections */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "url('/assets/bg1.svg')",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Brown gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B14] to-transparent pointer-events-none opacity-60" />

      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-12 mb-16">
          {/* Logo & Description & Social */}
          <div className="md:w-1/3 text-right">
            <Link href="/" className="inline-block mb-6 group">
              <Image
                src="/assets/logo.svg"
                alt="سِرَاجٌ"
                width={120}
                height={50}
                className="brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-white/70 text-base mb-6 leading-relaxed">
              {footerData.description}
            </p>

            {/* Social Links - Enhanced with brown hover */}
            <div className="flex gap-4 justify-start">
              {footerData.socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary transition-all duration-300 group shadow-lg hover:shadow-primary/20"
                  >
                    <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Menus */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-10 text-right">
              {footerData.menu.map((menu) => (
                <div key={menu.id} className="min-w-[120px]">
                  <h4 className="font-bold mb-5 text-lg text-white font-momken relative inline-block">
                    {menu.title}
                    <span className="absolute -bottom-2 right-0 w-8 h-0.5 bg-primary" />
                  </h4>
                  <ul className="space-y-3">
                    {menu.links.map((link) => (
                      <li key={link.id}>
                        <Link
                          href={link.url}
                          className="text-white/60 hover:text-primary transition-colors duration-300 text-sm block hover:translate-x-[-4px]"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <p className="text-white/50 text-sm">{footerData.copyrightText}</p>
          <p className="text-white/50 text-xs flex items-center gap-1">
            <span>صُنع بـ</span>
            <span className="text-red-500">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
