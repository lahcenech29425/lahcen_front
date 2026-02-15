"use client";
import { normalizeFooter } from "./normalizer";
import Link from "next/link";
import Image from "next/image";
import { FooterType } from "@/types/footer";

export default function Footer({ data }: { data: FooterType }) {
  const footer = normalizeFooter(data);

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
            {footer.logo?.image?.url && (
              <Link
                href={footer.logo.link || "/"}
                className="inline-block mb-6 group"
              >
                <Image
                  src={footer.logo.image.url}
                  alt={footer.logo.image.alternativeText || "Logo"}
                  width={footer.logo.image.width || 50}
                  height={footer.logo.image.height || 50}
                  className="h-14 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </Link>
            )}
            <p className="text-white/70 text-base mb-6 leading-relaxed">
              {footer.description}
            </p>

            {/* Social Links - Enhanced with brown hover */}
            <div className="flex gap-4 justify-start">
              {footer.socialLinks
                .filter((s) => s.is_active && s.url && s.icon?.url)
                .map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary transition-all duration-300 group shadow-lg hover:shadow-primary/20"
                  >
                    <Image
                      src={item.icon.url}
                      alt={item.platform}
                      width={20}
                      height={20}
                      className="inline-block brightness-0 invert group-hover:scale-110 transition-transform"
                      loading="lazy"
                    />
                  </Link>
                ))}
            </div>
          </div>

          {/* Menus */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-10 text-right">
              {footer.menu.map((menu) => (
                <div key={menu.id} className="min-w-[120px]">
                  <h4 className="font-bold mb-5 text-lg text-white font-momken relative inline-block">
                    {menu.title}
                    <span className="absolute -bottom-2 right-0 w-8 h-0.5 bg-primary" />
                  </h4>
                  <ul className="space-y-3">
                    {menu.links
                      .filter((link) => link.url)
                      .map((link) => (
                        <li key={link.id}>
                          <Link
                            href={link.url}
                            target={link.is_external ? "_blank" : undefined}
                            rel={
                              link.is_external
                                ? "noopener noreferrer"
                                : undefined
                            }
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
          <p className="text-white/50 text-sm">{footer.copyrightText}</p>
          <p className="text-white/50 text-xs flex items-center gap-1">
            <span>صُنع بـ</span>
            <span className="text-red-500">❤️</span>
            <span>للأمة الإسلامية</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
