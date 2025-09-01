import { createPageMetadata } from "@/lib/seo/metadata";
import HomeRunder from "./components/home/RunderHome";
import { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Indexo - Next.js boilerplate",
  description: "Next.js boilerplate with Supabase and Stripe integrations.",
  path: "/",
  keywords: ["next.js", "boilerplate", "supabase", "stripe", "saas"],
});

export default function Home() {
  return <HomeRunder></HomeRunder>;
}
