"use client";
import Image from "next/image";
import { normalizeHeader } from "./normalizer";
import { useState, useEffect } from "react";
import { Menu, Search } from "lucide-react";
import type { HeaderType } from "@/types/header";
import GlobalSearchModal from "@/components/custom/search/GlobalSearchModal";
import NavigationDrawer from "./NavigationDrawer";

export default function HeaderBlock({ data }: { data: HeaderType }) {
  const { logo, menu, cta } = normalizeHeader(data);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection for transparent header logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Theme is now handled by ThemeSwitcher component

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9999] w-full transition-all duration-500 ${isScrolled
          ? "bg-background/95 border-b border-border/50 backdrop-blur-xl shadow-lg"
          : "bg-transparent border-transparent py-2"
          }`}
      >
        {/* Gold accent bar - Enhanced with glow on scroll */}
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] transition-all duration-300 ${isScrolled ? 'shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'opacity-80'}`} />

        <div className="max-w-7xl mx-auto pt-6">
          {/* Main Header Row - Centered Logo Layout */}
          <div className={`relative flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${isScrolled ? 'h-16' : 'h-24'}`}>

            {/* RIGHT SIDE (RTL Start) - Menu Trigger */}
            <div className="flex items-center justify-start flex-1">
              <button
                onClick={() => setDrawerOpen(true)}
                className={`flex items-center gap-3 pl-4 pr-2 py-2 transition-all group ${isScrolled
                  ? "text-foreground hover:text-primary"
                  : "text-white hover:text-primary"
                  }`}
                aria-label="القائمة"
              >
                <div className="flex flex-col gap-1.5 items-start w-6 group-hover:gap-1 transition-all">
                  <span className="w-6 h-0.5 bg-current rounded-full shadow-sm"></span>
                  <span className="w-4 h-0.5 bg-current rounded-full shadow-sm group-hover:w-6 transition-all"></span>
                  <span className="w-5 h-0.5 bg-current rounded-full shadow-sm group-hover:w-6 transition-all"></span>
                </div>
              </button>
            </div>

            {/* CENTER - Logo (Absolute Centered) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              {logo?.image?.url ? (
                <a href={logo.link || "/"} className="flex items-center group">
                  <Image
                    src={logo.image.url}
                    alt={logo.image.alternativeText || "Logo"}
                    width={logo.image.width || 70}
                    height={logo.image.height || 70}
                    className={`object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-2xl ${isScrolled ? 'h-8 w-auto dark:invert' : 'h-12 w-auto invert'}`}
                    priority
                  />
                </a>
              ) : (
                <a href="/" className={`font-bold font-heading text-primary transition-all drop-shadow-md ${isScrolled ? 'text-xl' : 'text-3xl'}`}>
                  الموقع الإسلامي
                </a>
              )}
            </div>

            {/* LEFT SIDE (RTL End) - Search */}
            <div className="flex items-center justify-end flex-1 gap-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`group p-2 flex items-center gap-2 transition-all ${isScrolled
                  ? "text-foreground hover:text-primary"
                  : "text-white hover:text-primary"
                  }`}
                aria-label="بحث"
              >
                <Search size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform drop-shadow-sm" />
              </button>
            </div>

          </div>
        </div>

        {/* Navigation Drawer Component */}
        <NavigationDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          menu={menu}
          cta={cta}
          logoUrl={logo?.image?.url}
        />

        {/* Global Search Modal */}
        <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>
    </>
  );
}
