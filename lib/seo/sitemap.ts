import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo/config";

export type StaticRoute = {
  path: string; // "/about"
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

// Central list of static routes. Add project pages here.
export const staticRoutes: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/login", changeFrequency: "yearly", priority: 0.4 },
  { path: "/register", changeFrequency: "yearly", priority: 0.4 },
  { path: "/docs", changeFrequency: "weekly", priority: 0. },
  { path: "/profile", changeFrequency: "monthly", priority: 0.5 },
  { path: "/reset-password", changeFrequency: "yearly", priority: 0.3 },
];

// Plug-in functions to append dynamic URLs (e.g., from DB or CMS)
export type DynamicSitemapSource = () => Promise<MetadataRoute.Sitemap>;
export const dynamicSitemapSources: DynamicSitemapSource[] = [];

export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency || "monthly",
    priority: r.priority ?? 0.5,
  }));

  const dynamicLists = await Promise.all(
    dynamicSitemapSources.map((fn) => fn().catch(() => [] as MetadataRoute.Sitemap))
  );

  return [...staticEntries, ...dynamicLists.flat()];
}
