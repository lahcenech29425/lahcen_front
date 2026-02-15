"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Link } from "@/components/elements/Link";
import {
  X,
  Moon,
  Sun,
  ArrowLeft,
  BookOpen,
  BookMarked,
  FileText,
  Library,
} from "lucide-react";
import type { HeaderMenuItem, HeaderCTAItem } from "@/types/header";
import ThemeSwitcher from "@/components/elements/ThemeSwitcher";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menu: HeaderMenuItem[];
  cta: HeaderCTAItem[];
  logoUrl?: string;
  darkMode?: boolean;
  setDarkMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  menu,
  cta,
  logoUrl,
  darkMode,
  setDarkMode,
}: NavigationDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const drawerContent = (
    <div
      dir="rtl"
      className={`fixed inset-0 z-[99999] isolate bg-background/98 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Decorative Background Pattern */}
      {/* Decorative Background Pattern */}
      <div
        className="absolute inset-0 z-[-1] opacity-[0.05] pointer-events-none bg-primary"
        style={{
          maskImage: "url('/assets/bg.svg')",
          WebkitMaskImage: "url('/assets/bg.svg')",
          maskSize: "600px",
          WebkitMaskSize: "600px",
        }}
      />

      <div className="flex flex-col h-full max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Header: Logo & Close Button - Fixed at Top */}
        <div className="flex items-center justify-between h-24 md:h-32 shrink-0 z-20 border-b border-border/50">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Logo"
                width={70}
                height={70}
                className="h-12 md:h-16 w-auto object-contain dark:invert transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span className="text-2xl md:text-3xl font-bold font-momken text-primary">
                الموقع الإسلامي
              </span>
            )}
          </Link>

          <button
            onClick={onClose}
            className="group p-3 rounded-full border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-300"
            aria-label="إغلاق القائمة"
          >
            <X
              size={32}
              strokeWidth={1}
              className="text-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-90"
            />
          </button>
        </div>

        {/* Content Container - Centered Grid Layout */}
        <div className="flex-1 flex items-center justify-center w-full overflow-y-auto py-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full max-w-5xl px-4">
            {/* Menu Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {menu
                .filter((item) => item.url)
                .map((item, index) => {
                  // Assign icons based on title/url
                  let Icon = BookOpen;
                  if (
                    item.url?.includes("quran") ||
                    item.title?.includes("قرآن")
                  ) {
                    Icon = BookOpen;
                  } else if (
                    item.url?.includes("hadith") ||
                    item.title?.includes("حديث")
                  ) {
                    Icon = BookMarked;
                  } else if (
                    item.url?.includes("blog") ||
                    item.title?.includes("مقالات") ||
                    item.title?.includes("خواطر")
                  ) {
                    Icon = FileText;
                  } else if (
                    item.url?.includes("book") ||
                    item.title?.includes("كتب")
                  ) {
                    Icon = Library;
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.url}
                      isExternal={item.is_external}
                      onClick={onClose}
                      className={`group relative overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-xl border border-border hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 ${
                        isOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${100 + index * 80}ms` }}
                    >
                      <div className="relative p-6 md:p-8 flex items-center gap-6">
                        {/* Icon Container */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:scale-110">
                          <Icon className="w-8 h-8" strokeWidth={1.5} />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold font-momken text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm font-amiri text-gray-500 dark:text-gray-400">
                            اضغط للتصفح والاستكشاف
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/50 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300">
                          <ArrowLeft size={18} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>

            {/* CTA & Footer Section */}
            <div
              className={`flex flex-col items-center gap-8 transition-all duration-700 delay-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Short Description */}
              <p className="text-center text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl font-amiri">
                استكشف كنوز المعرفة الإسلامية، وتصفح أحدث المقالات والكتب.
              </p>

              {/* CTA Buttons */}
              {cta.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4">
                  {cta.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      onClick={onClose}
                      isExternal={item.is_external}
                      className="px-8 py-3 text-lg font-bold font-momken text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex flex-col items-center gap-4 pt-8 border-t border-border/10 w-full max-w-xs">
                {/* Theme Switcher */}
                <ThemeSwitcher />

                <p className="text-xs text-gray-400 font-amiri mt-2">
                  © {new Date().getFullYear()} جميع الحقوق محفوظة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
