import type { MetadataRoute } from "next";
import { generateSitemap } from "@/lib/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return generateSitemap();
}
