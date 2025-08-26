// Single-text guide data. Source of truth lives in projectData.ts
export interface GuideEntry {
  path: string;
  content: string;
}

import { guideContent } from "./projectData";

// Convenience export: array shape if needed by any consumer
export const guides: GuideEntry[] = Object.entries(guideContent).map(
  ([path, content]) => ({ path, content })
);
