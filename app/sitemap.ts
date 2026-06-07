// app/sitemap.ts
//
// Placeholder-phase sitemap: home + legal pages only. The legacy quizzes /
// date-spots marketing pages were removed (see git history). Token/share entity
// pages (/list, /place, /event) are intentionally omitted — they're per-link,
// not part of the discoverable site.

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
