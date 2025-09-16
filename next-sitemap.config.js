module.exports = {
  siteUrl: "https://lahcen-front.vercel.app",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
};
