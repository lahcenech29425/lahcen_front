"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/utils/fetchApi";
import type { FooterSocialLink } from "@/types/footer";
import Link from "next/link";
import Image from "next/image";
export default function SocialMediaBar() {
  const [links, setLinks] = useState<FooterSocialLink[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchApi("/api/footer?populate=socialLinks.icon")
      .then((data) => {
        if (!mounted) return;
        const items = (data?.socialLinks ?? []) as FooterSocialLink[];
        const filtered = items.filter(
          (s) => s?.is_active && s?.url && s?.icon?.url
        );
        setLinks(filtered);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (!links.length) return null;

  const base = process.env.NEXT_PUBLIC_STRAPI_URL || "";

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40 hidden md:flex">
      {links.map((s) => {
        const iconUrl = s.icon?.url?.startsWith("http")
          ? s.icon.url
          : `${base}${s.icon?.url}`;
        return (
          <Link
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.platform}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#2b2b2b] dark:bg-[#171717] text-white shadow-md hover:bg-gray-700 dark:hover:bg-[#d1d1d1] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
          >
            <Image
              src={iconUrl}
              alt={s.platform}
              className="h-5 w-5 invert"
              width={20}
              height={20}
              loading="lazy"
            />
          </Link>
        );
      })}
    </div>
  );
}
