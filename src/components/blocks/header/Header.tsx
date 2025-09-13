"use client";
import Image from "next/image";
import { normalizeHeader } from "./normalizer";
import { useState } from "react";
import { Link } from "@/components/elements/Link";
import type { HeaderCTAItem, HeaderMenuItem, HeaderType } from "@/types/header";
import { ShoppingBag } from "lucide-react";

export default function HeaderBlock({ data }: { data: HeaderType }) {
  const { logo, menu, cta } = normalizeHeader(data);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {logo?.image?.url && (
            <a href={logo.link || "/"} className="flex items-center gap-2">
              <Image
                src={logo.image.url}
                alt={logo.image.alternativeText || "Logo"}
                width={logo.image.width || 40}
                height={logo.image.height || 40}
                className="h-10 w-auto object-contain"
                priority
              />
            </a>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 lg:gap-10 items-center">
          {menu.map((item: HeaderMenuItem) => (
            <Link
              key={item.id}
              href={item.url}
              isExternal={item.is_external}
              className="text-gray-700 font-medium hover:text-primary transition px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {item.title}
            </Link>
          ))}
          
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex gap-2">
          {cta.map((item: HeaderCTAItem) => {
            if (item.title.toLowerCase().includes("login")) {
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
            }
            if (item.title.toLowerCase().includes("cart")) {
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className="px-4 py-2 rounded bg-primary text-black font-semibold hover:bg-primary-dark transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center gap-2 relative"
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                >
                  <ShoppingBag className="inline-block text-lg" />
                  {getCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                      {getCount()}
                    </span>
                  )}
                </Link>
              );
            }
            return (
              <Link
                key={item.id}
                href={item.url}
                className="px-4 py-2 rounded bg-primary text-black font-semibold hover:bg-primary-dark transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                target={item.is_external ? "_blank" : undefined}
                rel={item.is_external ? "noopener noreferrer" : undefined}
              >
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Open menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg
            className="h-7 w-7 text-gray-900"
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

      {/* Mobile Nav Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: mobileOpen ? "rgba(0,0,0,0.15)" : "transparent" }}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <nav
        className={`md:hidden fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile menu"
      >
        <div className="flex flex-col h-full p-6 gap-6">
          <div className="flex items-center justify-between mb-4">
            {logo?.image?.url && (
              <Link
                href={logo.link || "/"}
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src={logo.image.url}
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
                className="h-7 w-7 text-gray-900"
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
          <div className="flex flex-col gap-4">
            {menu.map((item: HeaderMenuItem) => (
              <Link
                key={item.id}
                href={item.url}
                isExternal={item.is_external}
                className="text-gray-700 font-medium hover:text-primary transition px-2 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setMobileOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-6">
            {cta.map((item: HeaderCTAItem) => {
              if (item.title.toLowerCase().includes("login")) {
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
              }
              if (item.title.toLowerCase().includes("cart")) {
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className="px-4 py-2 rounded bg-primary text-black font-semibold hover:bg-primary-dark transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center gap-2 relative"
                    target={item.is_external ? "_blank" : undefined}
                    rel={item.is_external ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <ShoppingBag className="inline-block text-lg" />
                    {getCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                        {getCount()}
                      </span>
                    )}
                  </Link>
                );
              }
              return (
                <a
                  key={item.id}
                  href={item.url}
                  className="px-4 py-2 rounded bg-primary text-black font-semibold hover:bg-primary-dark transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
