module.exports = {
  siteUrl: "https://lahcenway.com",
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
