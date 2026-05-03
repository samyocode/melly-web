// app/sitemap.ts
//
// Single-file sitemap. Stays well under the 50K-URL / 50MB sitemap limit
// for now; split via generateSitemaps() if/when venue counts grow large.

import type { MetadataRoute } from "next";
import { QUIZ_REGISTRY, QUIZ_PREVIEWS } from "@/lib/quiz-data";
import {
  getCitiesWithVenues,
  getAllPublishableVenuesForSitemap,
} from "@/lib/date-spots";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, priority: 1.0 },
    { url: absoluteUrl("/quizzes"), lastModified: now, priority: 0.9 },
    { url: absoluteUrl("/date-spots"), lastModified: now, priority: 0.9 },
    { url: absoluteUrl("/safety"), lastModified: now, priority: 0.4 },
    { url: absoluteUrl("/safety-standards"), lastModified: now, priority: 0.4 },
    { url: absoluteUrl("/privacy"), lastModified: now, priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, priority: 0.3 },
  ];

  const quizPages: MetadataRoute.Sitemap = [
    ...Object.keys(QUIZ_REGISTRY),
    ...Object.keys(QUIZ_PREVIEWS),
  ].map((slug) => ({
    url: absoluteUrl(`/quiz/${slug}`),
    lastModified: now,
    priority: 0.8,
  }));

  const [cities, venues] = await Promise.all([
    getCitiesWithVenues(),
    getAllPublishableVenuesForSitemap(),
  ]);

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: absoluteUrl(`/date-spots/${c.city_slug}`),
    lastModified: now,
    priority: 0.7,
  }));

  const venuePages: MetadataRoute.Sitemap = venues.map((v) => ({
    url: absoluteUrl(`/date-spots/${v.city_slug}/${v.slug}`),
    lastModified: v.updated_at ? new Date(v.updated_at) : now,
    priority: 0.6,
  }));

  return [...staticPages, ...quizPages, ...cityPages, ...venuePages];
}
