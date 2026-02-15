"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/utils/fetchApi";
import type { FooterSocialLink } from "@/types/footer";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Send, Share2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Fallback social links when Strapi is unavailable
const FALLBACK_LINKS = [
  { id: 1, platform: "facebook", url: "https://facebook.com", icon: Facebook },
  { id: 2, platform: "twitter", url: "https://twitter.com", icon: Twitter },
  { id: 3, platform: "instagram", url: "https://instagram.com", icon: Instagram },
  { id: 4, platform: "youtube", url: "https://youtube.com", icon: Youtube },
  { id: 5, platform: "telegram", url: "https://telegram.org", icon: Send },
];

export default function SocialMediaBar() {
  const [links, setLinks] = useState<FooterSocialLink[]>([]);
  const [useFallback, setUseFallback] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    fetchApi("/api/footer?populate=socialLinks.icon")
      .then((data) => {
        if (!mounted) return;
        const items = (data?.socialLinks ?? []) as FooterSocialLink[];
        
        // Filter valid links
        const filtered = items.filter(
          (s) => s?.is_active && s?.url && s?.icon?.url
        );

        if (filtered.length > 0) {
          setLinks(filtered);
        } else {
          setUseFallback(true);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn("Using fallback social links due to API error:", err);
        setUseFallback(true);
      });

    return () => { mounted = false; };
  }, []);

  const base = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  const displayLinks = useFallback ? FALLBACK_LINKS : links;

  if (!isClient) return null; // Prevent hydration mismatch

  if (!displayLinks.length && !useFallback) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: "24px",
        bottom: "24px",
        zIndex: 9998,
      }}
      className="hidden md:flex flex-col-reverse items-start gap-3"
    >
      {/* Social Icons - Appear Above Button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            {displayLinks.map((item, index) => {
              const rawIcon = 'icon' in item ? (item as any).icon : null;
              const IconComponent = typeof rawIcon === 'function' ? rawIcon : null;

              const iconUrl = !IconComponent && rawIcon && typeof rawIcon === 'object' && rawIcon.url
                ? (rawIcon.url.startsWith("http") ? rawIcon.url : `${base}${rawIcon.url}`)
                : null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 hover:border-primary hover:bg-primary shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-110"
                    aria-label={item.platform}
                  >
                    {IconComponent ? (
                      <IconComponent
                        size={22}
                        strokeWidth={2}
                        className="text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300"
                      />
                    ) : iconUrl ? (
                      <div className="relative w-6 h-6">
                        <Image
                          src={iconUrl}
                          alt={item.platform}
                          fill
                          className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-white">
                        {typeof item.platform === 'string' ? item.platform[0].toUpperCase() : 'S'}
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group overflow-hidden"
        aria-label="Toggle Social Media"
        whileTap={{ scale: 0.95 }}
      >
        {/* Subtle glow animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#A0522D]/50 to-transparent"
          animate={{
            opacity: isOpen ? [0.5, 0.8, 0.5] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10"
        >
          {isOpen ? (
            <X size={26} strokeWidth={2.5} />
          ) : (
            <Share2 size={26} strokeWidth={2.5} />
          )}
        </motion.div>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-white/50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </motion.button>
    </div>
  );
}
