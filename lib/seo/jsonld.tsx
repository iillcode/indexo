"use client";

import React from "react";
import { OrganizationJsonLd, WebPageJsonLd, BreadcrumbJsonLd } from "next-seo";
import { getSeoConfig } from "@/lib/seo/config";

/** Renders global JSON-LD for Organization */
export function GlobalJsonLd() {
  const cfg = getSeoConfig();
  return (
    <>
      <OrganizationJsonLd
        useAppDir
        type="Organization"
        id={`${cfg.siteUrl}#organization`}
        name={cfg.company?.name || cfg.siteName}
        url={cfg.siteUrl}
        logo={cfg.company?.logoUrl && cfg.company.logoUrl.startsWith("http")
          ? cfg.company.logoUrl
          : `${cfg.siteUrl}${(cfg.company?.logoUrl || "").startsWith("/") ? cfg.company?.logoUrl : `/${cfg.company?.logoUrl || ""}`}`}
      />
    </>
  );
}

export type WebPageSEOProps = {
  path: string;
  title: string;
  description: string;
  isAccessibleForFree?: boolean;
  breadcrumbs?: Array<{ name: string; item: string }>; // absolute URLs
};

/** Per-page WebPage JSON-LD with optional breadcrumbs */
export function WebPageSEO(props: WebPageSEOProps) {
  const cfg = getSeoConfig();
  const pageUrl = props.path.startsWith("http")
    ? props.path
    : `${cfg.siteUrl}${props.path.startsWith("/") ? props.path : `/${props.path}`}`;

  return (
    <>
      <WebPageJsonLd
        useAppDir
        id={pageUrl}
        url={pageUrl}
        title={`${props.title} | ${cfg.siteName}`}
        description={props.description}
        isAccessibleForFree={props.isAccessibleForFree ?? true}
        publisher={{
          "@type": "Organization",
          name: cfg.company?.name || cfg.siteName,
          url: cfg.siteUrl,
        }}
      />
      {props.breadcrumbs && props.breadcrumbs.length > 0 && (
        <BreadcrumbJsonLd useAppDir itemListElements={props.breadcrumbs} />
      )}
    </>
  );
}
