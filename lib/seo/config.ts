/**
 * Centralized SEO configuration
 * All SEO-related defaults live here and can be overridden per page.
 */

export type SiteSEOConfig = {
  siteName: string;
  siteDescription: string;
  siteUrl: string; // absolute origin, e.g. https://example.com
  locale: string; // e.g. en_US
  themeColor?: string;
  twitterHandle?: string; // e.g. @yourbrand
  defaultOgImage?: string; // absolute or path under public/
  company?: {
    name: string;
    logoUrl?: string; // absolute or path under public/
  };
  robots?: {
    index: boolean;
    follow: boolean;
  };
};

/**
 * Determine the base URL for the app. Uses NEXT_PUBLIC_APP_URL if provided,
 * otherwise falls back to http://localhost:3000
 */
export const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  return envUrl && /^https?:\/\//.test(envUrl)
    ? envUrl
    : "http://localhost:3000";
};

/**
 * Default SEO config derived from app-config and env.
 */
export const defaultSeoConfig = (): SiteSEOConfig => {
  const app = {
    app_details: {
      name: "Indexo",
      description: "Build your Next.js app with Indexo",
    },
  };
  const baseUrl = getBaseUrl();
  return {
    siteName: app.app_details.name,
    siteDescription: app.app_details.description,
    siteUrl: baseUrl,
    locale: "en_US",
    themeColor: "#000000",
    twitterHandle: "@yourbrand",
    defaultOgImage: "/next.svg", // Replace with a PNG in /public for better sharing previews
    company: {
      name: app.app_details.name,
      logoUrl: "/next.svg",
    },
    robots: {
      index:
        process.env.NEXT_PUBLIC_NO_INDEX !== "1" &&
        process.env.NEXT_PUBLIC_NO_INDEX !== "true",
      follow: true,
    },
  };
};

/**
 * Get merged SEO config. Pass overrides to customize.
 */
export const getSeoConfig = (
  overrides?: Partial<SiteSEOConfig>
): SiteSEOConfig => {
  return { ...defaultSeoConfig(), ...(overrides || {}) };
};
