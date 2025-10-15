import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Utiliser remotePatterns au lieu de domains (méthode moderne et plus sécurisée)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "timely-wealth-923d9aeb3d.media.strapiapp.com",
        pathname: "/**",
      },
    ],

    // Formats d'image optimisés (AVIF puis WebP en fallback)
    formats: ["image/avif", "image/webp"],

    // Tailles d'écran pour responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Tailles d'icônes et petites images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache TTL minimum : 1 an (31536000 secondes)
    minimumCacheTTL: 31536000,

    // Désactiver la limite de taille de fichier statique
    dangerouslyAllowSVG: true,

    // Content Security Policy pour les SVGs
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
