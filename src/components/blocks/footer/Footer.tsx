import { normalizeFooter } from "./normalizer";
import Link from "next/link";
import Image from "next/image";
import { FooterType } from "@/types/footer";

export default async function Footer({ data }: { data: FooterType }) {
  const footer = normalizeFooter(data);

  return (
    <footer className="bg-gray-100 text-gray-900 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-10">
          {/* Logo & Description */}
          <div className="flex-1 min-w-[220px]">
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
            <p className="text-gray-600 text-sm">{footer.description}</p>
          </div>
          {/* Menus */}
          <div className="flex-1 flex flex-wrap gap-8 justify-center">
            {footer.menu.map((menu) => (
              <div key={menu.id}>
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
                        className="hover:text-primary transition text-sm"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Contact & Social */}
          <div className="flex-1 min-w-[220px] flex flex-col gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-base text-gray-900">
                Contact
              </h4>
              <ul className="space-y-2">
                {footer.contact.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    <Image
                      src={item.icon.url}
                      alt={item.icon.alternativeText || ""}
                      width={20}
                      height={20}
                      className="inline-block"
                    />
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-base text-gray-900">
                Follow us
              </h4>
              <div className="flex gap-4">
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
                      />
                    </Link>
                  ))}
              </div>
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
