import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "localhost", // for local Strapi
      "127.0.0.1",
      "images.unsplash.com",
      "your-production-domain.com", // replace with your production domain
    ],
  },
};

export default nextConfig;
