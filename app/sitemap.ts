import type { MetadataRoute } from "next";
import { collections, publishedProducts } from "@/lib/catalog";
import { SITE_LIVE, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_LIVE) return [];

  // Only routes that are independently reviewed and ready for indexing.
  const urls = [
    { url: SITE_URL + "/", changeFrequency: "weekly" as const, priority: 1 },
    { url: SITE_URL + "/about", changeFrequency: "monthly" as const, priority: 0.35 }
  ];
  const collectionUrls = collections.filter((collection) => collection.ready).map((collection) => ({
    url: SITE_URL + "/shop/" + collection.slug,
    changeFrequency: "weekly" as const,
    priority: 0.75
  }));
  const productUrls = publishedProducts()
    .filter((product) => product.image && product.variants.length && product.variants.every((variant) => variant.priceIrr !== null && variant.priceIrr > 0))
    .map((product) => ({
      url: SITE_URL + "/product/" + product.slug,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }));
  return [...urls, ...collectionUrls, ...productUrls];
}
