import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "localhost", // for local Strapi
      "127.0.0.1",
      "images.unsplash.com",
      "timely-wealth-923d9aeb3d.strapiapp.com", // replace with your production domain
    ],
  },
};

export default nextConfig;
