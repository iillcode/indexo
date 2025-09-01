import type { Metadata } from "next";
import { getSeoConfig } from "@/lib/seo/config";

export type PageSEOOptions = {
  title: string;
  description: string;
  path?: string; // e.g. "/about"
  keywords?: string[] | string;
  image?: string; // absolute or path under public/
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
  publishedTime?: string; // ISO
  modifiedTime?: string; // ISO
};

/** Normalize to absolute URL */
const toAbsoluteUrl = (
  urlOrPath?: string,
  base?: string
): string | undefined => {
  if (!urlOrPath) return undefined;
  if (/^https?:\/\//.test(urlOrPath)) return urlOrPath;
  const origin = (base || "").replace(/\/$/, "");
  const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${origin}${path}`;
};

/** Create metadata for a single page */
export const createPageMetadata = (opts: PageSEOOptions): Metadata => {
  const cfg = getSeoConfig();
  const base = new URL(cfg.siteUrl);
  const url = opts.path ? toAbsoluteUrl(opts.path, cfg.siteUrl) : cfg.siteUrl;
  const keywords = Array.isArray(opts.keywords)
    ? opts.keywords
    : opts.keywords?.split(",").map((s) => s.trim());
  const img = toAbsoluteUrl(opts.image || cfg.defaultOgImage, cfg.siteUrl);
  const noIndex = !!opts.noIndex || cfg.robots?.index === false;

  return {
    metadataBase: base,
    applicationName: cfg.siteName,
    title: opts.title,
    description: opts.description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      type: opts.type || "website",
      url,
      siteName: cfg.siteName,
      locale: cfg.locale,
      images: img
        ? [
            {
              url: img,
              width: 1200,
              height: 630,
              alt: opts.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: cfg.twitterHandle,
      creator: cfg.twitterHandle,
      title: opts.title,
      description: opts.description,
      images: img ? [img] : undefined,
    },
    robots: {
      index: !noIndex,
      follow: cfg.robots?.follow !== false,
    },
    other: {
      // Convenience for consumers that need the absolute URL
      ...(url && { url }),
    },
  } satisfies Metadata;
};

/** Root-level metadata with template support */
export const rootMetadata = (): Metadata => {
  const cfg = getSeoConfig();
  const base = new URL(cfg.siteUrl);
  const img = toAbsoluteUrl(cfg.defaultOgImage, cfg.siteUrl);
  return {
    metadataBase: base,
    applicationName: cfg.siteName,
    title: {
      default: cfg.siteName,
      template: `%s | ${cfg.siteName}`,
    },
    description: cfg.siteDescription,
    themeColor: cfg.themeColor,
    openGraph: {
      title: cfg.siteName,
      description: cfg.siteDescription,
      type: "website",
      url: cfg.siteUrl,
      siteName: cfg.siteName,
      locale: cfg.locale,
      images: img
        ? [{ url: img, width: 1200, height: 630, alt: cfg.siteName }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: cfg.twitterHandle,
      creator: cfg.twitterHandle,
    },
    robots: {
      index: cfg.robots?.index !== false,
      follow: cfg.robots?.follow !== false,
    },
  } satisfies Metadata;
};
