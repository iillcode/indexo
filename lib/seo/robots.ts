import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo/config";

export function generateRobots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  const noIndex = process.env.NEXT_PUBLIC_NO_INDEX === "1" || process.env.NEXT_PUBLIC_NO_INDEX === "true";

  return {
    rules: noIndex
      ? [
          {
            userAgent: "*",
            disallow: "/",
          },
        ]
      : [
          {
            userAgent: "*",
            allow: "/",
          },
        ],
    sitemap: `${base}/sitemap.xml`,
  };
}
