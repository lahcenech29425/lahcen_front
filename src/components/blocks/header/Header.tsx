"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import GlobalSearchModal from "@/components/custom/search/GlobalSearchModal";
import NavigationDrawer from "./NavigationDrawer";

export default function HeaderBlock() {
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

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-[9998] w-full transition-all duration-500 ${isScrolled
          ? "top-0 bg-background/80 shadow-lg backdrop-blur-md"
          : "top-[40px] bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Main Header Row - Centered Logo Layout */}
          <div className={`relative flex items-center justify-center transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>

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
              <Link href="/">
                <Image
                  src="/assets/logo.svg"
                  alt="سِرَاجٌ"
                  width={140}
                  height={60}
                  className={`object-contain transition-all duration-300 ${isScrolled ? 'h-8 md:h-10 w-auto' : 'h-10 md:h-14 w-auto brightness-0 invert'}`}
                  priority
                />
              </Link>
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
        />

        {/* Global Search Modal */}
        <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>
    </>
  );
}
