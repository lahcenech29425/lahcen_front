import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack with empty config (pdfjs-dist is loaded via dynamic import with ssr:false)
  turbopack: {},
  
  // Fix pdfjs-dist build: exclude node-specific modules from client/SSR bundles
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        zlib: false,
        http: false,
        https: false,
        url: false,
        util: false,
        canvas: false,
      };
    }
    return config;
  },

  images: {
    // Allow localhost images in development (Next.js 16 blocks private IPs by default)
    localPatterns: [
      {
        pathname: "/uploads/**",
        search: "",
      },
    ],

    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/**",
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],

    // Disable image optimization for localhost in development
    unoptimized: process.env.NODE_ENV === "development",

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

