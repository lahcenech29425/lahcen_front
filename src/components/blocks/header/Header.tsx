"use client";
import Image from "next/image";
import { normalizeHeader } from "./normalizer";
import { useState, useEffect } from "react";
import { Link } from "@/components/elements/Link";
import { Moon, Sun } from "lucide-react";
import type { HeaderCTAItem, HeaderMenuItem, HeaderType } from "@/types/header";
import { Search } from "lucide-react";
import GlobalSearchModal from "@/components/custom/search/GlobalSearchModal";

export default function HeaderBlock({ data }: { data: HeaderType }) {
  const { logo, menu, cta } = normalizeHeader(data);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
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

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? true
        : false;
    }
    return false;
  });

  // Apply dark mode to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#232323] shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto flex items-center gap-4 py-3 px-4 md:px-8">
        {/* Logo - Left (Fixed small width) */}
        <div className="flex items-center gap-2 justify-start shrink-0">
          {logo?.image?.url && (
            <a href={logo.link || "/"} className="flex items-center gap-2">
              <Image
                src={logo.image.url}
                alt={logo.image.alternativeText || "Logo"}
                width={logo.image.width || 40}
                height={logo.image.height || 40}
                className="h-10 w-auto object-contain dark:invert"
                priority
              />
            </a>
          )}
        </div>

        {/* Desktop Nav - Center (Takes maximum available space) */}
        <nav className="hidden md:flex gap-3 lg:gap-6 items-center justify-center flex-1">
          {menu.map((item: HeaderMenuItem) => (
            <Link
              key={item.id}
              href={item.url}
              isExternal={item.is_external}
              className="text-gray-800 dark:text-[#ededed] hover:text-gray-700 dark:hover:text-white font-medium hover:text-primary dark:hover:text-primary transition px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Search + CTA - Right (Fixed small width) */}
        <div className="hidden md:flex gap-2 items-center justify-end shrink-0">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition"
            aria-label="البحث"
          >
            <Search size={18} />
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-[#333] dark:text-gray-300 rounded">⌘K</kbd>
          </button>

          {/* Desktop CTA */}
          {cta.map((item: HeaderCTAItem) => {
            return (
              <Link
                key={item.id}
                href={item.url}
                className="px-4 py-2 rounded bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                target={item.is_external ? "_blank" : undefined}
                rel={item.is_external ? "noopener noreferrer" : undefined}
              >
                {item.title}
              </Link>
            );
          })}

          {/* Dark Mode Toggle (Desktop) */}
          <button
            aria-label="تبديل الوضع الليلي"
            onClick={() => setDarkMode((v) => !v)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile menu button - Right aligned */}
        <div className="md:hidden flex items-center justify-end">
          <button
            className="flex items-center justify-center p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg
              className="h-7 w-7 text-gray-900 dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${mobileOpen
          ? "opacity-100 pointer-events-auto backdrop-blur-sm"
          : "opacity-0 pointer-events-none"
          }`}
        style={{ background: mobileOpen ? "rgba(0,0,0,0.15)" : "transparent" }}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <nav
        className={`md:hidden text-center fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        aria-label="Mobile menu"
      >
        <div
          className={`flex flex-col h-full p-6 gap-6 ${darkMode ? "dark bg-[#232323]" : "bg-white"} transition-colors`}
        >
          <div className="flex items-center justify-between mb-4">
            {logo?.image?.url && (
              <Link
                href={logo.link || "/"}
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src={darkMode ? "/logowhite.png" : logo.image.url}
                  alt={logo.image.alternativeText || "Logo"}
                  width={logo.image.width || 36}
                  height={logo.image.height || 36}
                  className="h-9 w-auto object-contain"
                  priority
                />
              </Link>
            )}
            <button
              className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <svg
                className="h-7 w-7 text-gray-900 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Dark mode toggle in mobile menu */}
          <div className="flex flex-col gap-4">
            {menu.map((item: HeaderMenuItem) => (
              <Link
                key={item.id}
                href={item.url}
                isExternal={item.is_external}
                className="text-gray-700 dark:text-[#ededed] hover:bg-gray-100 dark:hover:bg-[#232323] font-medium hover:text-primary dark:hover:text-primary transition px-2 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setMobileOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-6">
            {cta.map((item: HeaderCTAItem) => {
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* Search & Dark Mode Toggle Row */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setSearchOpen(true);
                setMobileOpen(false);
              }}
              aria-label="البحث"
              className="p-2 rounded bg-gray-100 dark:bg-[#232323] cursor-pointer text-gray-700 dark:text-[#ededed] hover:bg-gray-200 dark:hover:bg-[#1a1a1a] transition"
            >
              <Search size={20} />
            </button>

            {/* Dark Mode Toggle */}
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode((v) => !v)}
              className="p-2 rounded bg-gray-100 dark:bg-[#232323] cursor-pointer text-gray-700 dark:text-[#ededed] hover:bg-gray-200 dark:hover:bg-[#1a1a1a] transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
