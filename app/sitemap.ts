// app/sitemap.ts
//
// Placeholder-phase sitemap: home + legal pages only. The quizzes / date-spots
// marketing pages are offline (redirected to home in next.config.ts), so they're
// intentionally omitted here. Restore the fuller sitemap from git history when
// the marketing site comes back.

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, priority: 1.0 },
    { url: absoluteUrl("/safety"), lastModified: now, priority: 0.4 },
    { url: absoluteUrl("/safety-standards"), lastModified: now, priority: 0.4 },
    { url: absoluteUrl("/privacy"), lastModified: now, priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, priority: 0.3 },
  ];
}
