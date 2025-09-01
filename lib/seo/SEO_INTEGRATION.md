# SEO Integration Guide

This guide documents the centralized SEO system under `lib/seo/` and how to use it across your app. It explains every variable, function, and component, with examples for both server and client contexts.

## Overview

- Add per-page metadata with one call: [createPageMetadata({ ... })](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/metadata.ts:24:0-79:2).
- Render per-page JSON-LD with `<WebPageSEO ... />`.
- Global defaults (title template, OG/Twitter, robots) come from [rootMetadata()](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/metadata.ts:81:0-118:2) in [app/layout.tsx](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/app/layout.tsx:0:0-0:0).
- `sitemap.xml` and `robots.txt` are generated from centralized config.

## Environment Variables

- `NEXT_PUBLIC_APP_URL` (string): Absolute origin used for canonical URLs and assets, e.g. `https://yourdomain.com`.
- `NEXT_PUBLIC_NO_INDEX` (0 | 1 | true | false): When `1`/`true`, robots indexing is disabled (staging/preview). Defaults to allowing indexing.

## Files and APIs

### [lib/seo/config.ts](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/config.ts:0:0-0:0)

- [getBaseUrl(): string](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/config.ts:25:0-32:2)
  - Returns `NEXT_PUBLIC_APP_URL` without trailing slash, or `http://localhost:3000` fallback.

- [SiteSEOConfig](cci:2://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/config.ts:7:0-23:2) (type)
  - `siteName`: Brand/site name
  - `siteDescription`: Default description
  - `siteUrl`: Absolute origin (from env)
  - `locale`: Default `en_US`
  - `themeColor`: Optional theme color
  - `twitterHandle`: Optional X/Twitter handle `@yourbrand`
  - `defaultOgImage`: Path or absolute URL to default social image
  - `company`: `{ name, logoUrl? }` for JSON-LD
  - [robots](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/app/robots.ts:3:0-5:1): `{ index, follow }`

- [defaultSeoConfig(): SiteSEOConfig](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/config.ts:34:0-57:2)
  - Builds defaults from [config/app-config.ts](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/config/app-config.ts:0:0-0:0) and env.

- [getSeoConfig(overrides?: Partial<SiteSEOConfig>): SiteSEOConfig](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/config.ts:59:0-64:2)
  - Returns merged configuration. Pass `overrides` to tweak fields at call sites.

### [lib/seo/metadata.ts](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/metadata.ts:0:0-0:0)

- [rootMetadata(): Metadata](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/metadata.ts:81:0-118:2)
  - Global defaults for the App Router (title template `%s | <siteName>`, OG/Twitter, robots, metadataBase).

- [createPageMetadata(opts: PageSEOOptions): Metadata](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/metadata.ts:24:0-79:2)
  - [PageSEOOptions](cci:2://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/metadata.ts:3:0-13:2):
    - `title` (string)
    - `description` (string)
    - `path?` (string): Route path, e.g. `/about`. Used for canonical URL.
    - `keywords?` (string[] | string)
    - `image?` (string): Social image URL or path
    - `noIndex?` (boolean)
    - `type?` ("website" | "article" | "profile")
    - `publishedTime?`, `modifiedTime?` (ISO strings; optional)
  - Returns a fully populated Next.js `Metadata` object (canonical, OpenGraph, Twitter, robots, etc.).

### [lib/seo/jsonld.tsx](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/jsonld.tsx:0:0-0:0)

- [GlobalJsonLd](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/jsonld.tsx:6:0-23:1)
  - Client component that renders Organization JSON-LD using config (name, URL, logo).

- [WebPageSEO({ path, title, description, isAccessibleForFree?, breadcrumbs? })](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/jsonld.tsx:33:0-60:1)
  - Client component that renders WebPage JSON-LD and optional breadcrumbs.
  - `breadcrumbs`: Array of `{ name, item }` with absolute URLs.

### [lib/seo/sitemap.ts](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/sitemap.ts:0:0-0:0)

- `staticRoutes: StaticRoute[]`
  - Central list of static routes to include in `sitemap.xml`.
  - [StaticRoute](cci:2://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/sitemap.ts:3:0-7:2) fields: `path`, `changeFrequency?`, `priority?`.

- `dynamicSitemapSources: Array<() => Promise<MetadataRoute.Sitemap>>`
  - Push async providers to append dynamic URLs (from DB/CMS).

- [generateSitemap(): Promise<MetadataRoute.Sitemap>](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/sitemap.ts:24:0-39:1)
  - Merges static and dynamic entries; used by [app/sitemap.ts](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/app/sitemap.ts:0:0-0:0).

### [lib/seo/robots.ts](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/robots.ts:0:0-0:0)

- [generateRobots(): MetadataRoute.Robots](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/robots.ts:3:0-23:1)
  - Produces robots rules respecting `NEXT_PUBLIC_NO_INDEX`. Used by [app/robots.ts](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/app/robots.ts:0:0-0:0).

## App Router wiring

- [app/layout.tsx](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/app/layout.tsx:0:0-0:0)
  - `export const metadata = rootMetadata();`
  - Renders `<GlobalJsonLd />` near the top of `<body>`.

- [app/sitemap.ts](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/app/sitemap.ts:0:0-0:0)
  - Returns [generateSitemap()](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/sitemap.ts:24:0-39:1).

- [app/robots.ts](cci:7://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/app/robots.ts:0:0-0:0)
  - Returns [generateRobots()](cci:1://file:///c:/Users/HP/Desktop/Projects/illcode/New%20folder/show-project/lib/seo/robots.ts:3:0-23:1).

## Usage Examples

### Server page (recommended)

```ts
// app/about/page.tsx
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { WebPageSEO } from "@/lib/seo/jsonld";

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description: "Learn more about our company, mission, and values.",
  path: "/about",
  keywords: ["about", "company", "mission", "values"],
});

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD can be rendered in a client child if needed */}
      <WebPageSEO
        path="/about"
        title="About Us"
        description="Learn more about our company, mission, and values."
      />
      {/* Page content */}
    </>
  );
}