import type { MetadataRoute } from "next";
import { generateRobots } from "@/lib/seo/robots";

export default function robots(): MetadataRoute.Robots {
  return generateRobots();
}
