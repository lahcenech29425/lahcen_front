module.exports = {
  siteUrl: "https://www.lahcenway.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin"],
      },
    ],
    additionalSitemaps: [
      "https://www.lahcenway.com/sitemap.xml", // dynamic sitemap from app/sitemap.ts
    ],
  },
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
};
