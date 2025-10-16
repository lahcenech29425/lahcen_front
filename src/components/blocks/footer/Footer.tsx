import { normalizeFooter } from "./normalizer";
import Link from "next/link";
import Image from "next/image";
import { FooterType } from "@/types/footer";

export default async function Footer({ data }: { data: FooterType }) {
  const footer = normalizeFooter(data);

  return (
    <footer className="bg-gray-100 text-gray-900 pt-12 pb-6" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Logo & Description & Social */}
          <div className="md:w-1/4 text-right">
            <Link href={footer.logo.link || "/"} className="inline-block mb-4">
              <Image
                src={footer.logo.image.url}
                alt={footer.logo.image.alternativeText || "Logo"}
                width={footer.logo.image.width || 40}
                height={footer.logo.image.height || 40}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-gray-600 text-sm mb-5">{footer.description}</p>
            
            {/* Social Links */}
            <div className="flex gap-4 justify-start">
              {footer.socialLinks
                .filter((s) => s.is_active)
                .map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80"
                  >
                    <Image
                      src={item.icon.url}
                      alt={item.platform}
                      width={24}
                      height={24}
                      className="inline-block"
                      loading="lazy"
                    />
                  </Link>
                ))}
            </div>
          </div>
          
          {/* Menus - Using CSS Grid for better organization */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-8 text-right">
              {footer.menu.map((menu) => (
                <div key={menu.id} className="min-w-[120px]">
                  <h4 className="font-semibold mb-3 text-base text-gray-900">
                    {menu.title}
                  </h4>
                  <ul className="space-y-2">
                    {menu.links.map((link) => (
                      <li key={link.id}>
                        <Link
                          href={link.url}
                          target={link.is_external ? "_blank" : undefined}
                          rel={
                            link.is_external ? "noopener noreferrer" : undefined
                          }
                          className="hover:text-gray-700 transition text-sm text-gray-600"
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
        
        <div className="border-t border-gray-300 pt-6 text-center text-xs text-gray-600">
          {footer.copyrightText}
        </div>
      </div>
    </footer>
  );
}