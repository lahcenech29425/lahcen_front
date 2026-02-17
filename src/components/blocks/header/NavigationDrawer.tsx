"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/components/elements/Link";
import Image from "next/image";
import {
  X,
  ArrowLeft,
  BookOpen,
  BookMarked,
  FileText,
  Library,
  Clock,
  Mic2,
  Heart,
  ShieldCheck,
} from "lucide-react";
import ThemeSwitcher from "@/components/elements/ThemeSwitcher";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
}: NavigationDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const menu = [
    {
      id: 1,
      title: 'القرآن الكريم',
      url: '/quran',
      icon: BookOpen,
      description: 'تصفح المصحف الشريف واستمع للتلاوات'
    },
    {
      id: 2,
      title: 'الحديث الشريف',
      url: '/hadith',
      icon: BookMarked,
      description: 'كنوز السنة النبوية والأحاديث الصحيحة'
    },
    {
      id: 3,
      title: 'مواقيت الصلاة',
      url: '/prayer-times',
      icon: Clock,
      description: 'اوقات الصلاة والاذان في مدينتك'
    },
    {
      id: 4,
      title: 'التلاوات',
      url: '/quran-audio',
      icon: Mic2,
      description: 'استمع إلى أعذب التلاوات القرآنية'
    },
    {
      id: 5,
      title: 'أسماء الله الحسنى',
      url: '/names-of-allah',
      icon: Heart,
      description: 'تعرف على أسماء الله الحسنى وصفاته العلى'
    },
    {
      id: 6,
      title: 'أذكار وأدعية',
      url: '/duaa',
      icon: ShieldCheck,
      description: 'أذكار وأدعية يومية مأثورة.'
    },
  ];

  const cta = [
    { id: 1, title: 'تعرف علينا', url: '/about' }
  ];

  const drawerContent = (
    <div
      dir="rtl"
      className={`fixed inset-0 z-[99999] isolate bg-background/98 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
        }`}
    >
      {/* Decorative Backgrounds - Left and Right Halves */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] z-[-1] opacity-[0.04] pointer-events-none bg-primary"
        style={{
          maskImage: "url('/assets/bg.svg')",
          WebkitMaskImage: "url('/assets/bg.svg')",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center"
        }}
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] z-[-1] opacity-[0.04] pointer-events-none bg-primary"
        style={{
          maskImage: "url('/assets/bg.svg')",
          WebkitMaskImage: "url('/assets/bg.svg')",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center"
        }}
      />

      <div className="flex flex-col h-full max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Header: Logo & Close Button - Fixed at Top */}
        <div className="flex items-center justify-between h-20 shrink-0 z-20 border-b border-border/50">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-20 h-8 transition-all duration-300"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#5D4037',
                maskImage: "url('/assets/logo.svg')",
                WebkitMaskImage: "url('/assets/logo.svg')",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskPosition: "center",
                WebkitMaskPosition: "center"
              }}
            />
          </Link>

          <button
            onClick={onClose}
            className="group p-2 rounded-full border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-300"
            aria-label="إغلاق القائمة"
          >
            <X
              size={24}
              strokeWidth={1.5}
              className="text-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-90"
            />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col w-full overflow-hidden py-4">
          <div className="w-full max-w-7xl mx-auto h-full flex flex-col">

            {/* Menu Cards Grid - Scrollable if needed but compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 mb-2 content-center">
              {menu.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={onClose}
                    className={`group relative overflow-hidden rounded-xl bg-card shadow-sm hover:shadow-md border border-border hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 ${isOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                      }`}
                    style={{ transitionDelay: `${50 + index * 50}ms` }}
                  >
                    <div className="relative p-6 flex items-center gap-5">
                      {/* Icon Container */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:scale-110">
                        <Icon className="w-6 h-6" strokeWidth={1.5} />
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold font-momken text-foreground group-hover:text-primary transition-colors duration-300 mb-1 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm font-amiri text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/50 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:-rotate-45 rtl:group-hover:rotate-45">
                        <ArrowLeft size={18} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Compact Footer Section - Always Visible */}
            <div
              className={`pt-4 border-t border-border/10 transition-all duration-700 delay-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                {/* Description - Left aligned or hidden on very small screens if needed */}
                <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400 font-amiri">
                  استكشف كنوز المعرفة الإسلامية
                </p>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  {/* CTA Button */}
                  {cta.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      onClick={onClose}
                      className="px-6 py-2 text-base font-bold font-momken text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {item.title}
                    </Link>
                  ))}

                  <div className="h-8 w-px bg-border/50 mx-2" />

                  {/* Theme Switcher & Copyright */}
                  <div className="flex items-center gap-3">
                    <div className="scale-90">
                      <ThemeSwitcher />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline-block">© 2026</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
