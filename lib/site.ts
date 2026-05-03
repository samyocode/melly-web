// lib/site.ts
//
// Single source of truth for site-wide constants used in metadata,
// sitemap, JSON-LD, and absolute URL generation.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.meetmelly.com";

export const SITE_NAME = "Melly";

export const SITE_TAGLINE = "Where Singles Mingle";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/icon.png`;

export const APP_STORE_URL =
  "https://apps.apple.com/app/melly/idYOUR_ID";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.melly.app";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
