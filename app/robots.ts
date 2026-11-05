import type { MetadataRoute } from "next";
import { SITE_LIVE, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!SITE_LIVE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }]
    };
  }
  const privatePaths = ["/checkout/", "/cart/", "/account/", "/search/", "/api/private/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      { userAgent: "Googlebot", allow: "/", disallow: privatePaths },
      { userAgent: "Bingbot", allow: "/", disallow: privatePaths },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: privatePaths }
    ],
    sitemap: SITE_URL + "/sitemap.xml",
    host: SITE_URL
  };
}
