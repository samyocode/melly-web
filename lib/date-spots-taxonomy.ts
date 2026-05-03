// lib/date-spots-taxonomy.ts
//
// Defines the dimensions used for programmatic landing pages:
//   /date-spots/[city]/vibe/[vibe]
//   /date-spots/[city]/category/[category]
//   /date-spots/[city]/for/[intent]
//
// Each dimension entry maps a URL slug → human label + matching predicate
// against your existing Venue fields. We curate the values rather than
// auto-generating from raw data because:
//   1. URL slugs need to be stable (data values change)
//   2. Search intent matters more than data shape — "cocktail bars" is a
//      better SEO target than "cocktail_bar_seafood_fusion"
//   3. Bad/spammy values (long tail garbage) shouldn't get indexed
//
// Add new entries as your save data reveals new search intents. Anything
// not in this file is treated as 404 by the dimension pages.

import type { Venue } from "./date-spots-display";

export type DimensionKind = "vibe" | "category" | "for";

export type DimensionEntry = {
  slug: string; // URL slug, stable
  label: string; // Display label (singular noun phrase)
  pluralLabel: string; // Plural for headlines
  description: string; // SEO meta description prefix
  /** Returns true if venue matches this dimension value. */
  matches: (v: Venue) => boolean;
  /** Minimum venues needed in a city before this page publishes. Avoids thin pages. */
  minVenues?: number;
};

// ─── VIBES ──────────────────────────────────────────────────────────────────
// Match against venue.vibe_tags. Slug is the search-friendly noun phrase.

export const VIBE_DIMENSIONS: DimensionEntry[] = [
  {
    slug: "cozy",
    label: "cozy date spot",
    pluralLabel: "cozy date spots",
    description: "intimate, low-lit, warm",
    matches: (v) => hasAny(v.vibe_tags, ["cozy", "intimate", "warm"]),
  },
  {
    slug: "romantic",
    label: "romantic date spot",
    pluralLabel: "romantic date spots",
    description: "candlelit, intimate, dressed-up",
    matches: (v) => hasAny(v.vibe_tags, ["romantic", "intimate", "candlelit"]),
  },
  {
    slug: "lively",
    label: "lively date spot",
    pluralLabel: "lively date spots",
    description: "energetic, fun, social",
    matches: (v) =>
      hasAny(v.vibe_tags, ["lively", "energetic", "buzzy", "social"]),
  },
  {
    slug: "casual",
    label: "casual date spot",
    pluralLabel: "casual date spots",
    description: "low-pressure, relaxed, easy",
    matches: (v) => hasAny(v.vibe_tags, ["casual", "relaxed", "laid_back"]),
  },
  {
    slug: "trendy",
    label: "trendy date spot",
    pluralLabel: "trendy date spots",
    description: "of-the-moment, design-forward, scene-y",
    matches: (v) =>
      hasAny(v.vibe_tags, ["trendy", "scene", "design", "stylish"]),
  },
  {
    slug: "quiet",
    label: "quiet date spot",
    pluralLabel: "quiet date spots",
    description: "good for talking, low noise",
    matches: (v) => hasAny(v.vibe_tags, ["quiet", "intimate", "low_noise"]),
  },
  {
    slug: "upscale",
    label: "upscale date spot",
    pluralLabel: "upscale date spots",
    description: "elevated, fine dining, special occasion",
    matches: (v) =>
      hasAny(v.vibe_tags, [
        "upscale",
        "fine_dining",
        "elegant",
        "special_occasion",
      ]) || (v.price_level ?? 0) >= 3,
  },
  {
    slug: "outdoor",
    label: "outdoor date spot",
    pluralLabel: "outdoor date spots",
    description: "patio, rooftop, garden seating",
    matches: (v) =>
      v.outdoor_seating === true ||
      hasAny(v.vibe_tags, ["outdoor", "patio", "rooftop", "garden"]),
  },
];

// ─── CATEGORIES ─────────────────────────────────────────────────────────────
// Match against primary_category + place_types regex.

export const CATEGORY_DIMENSIONS: DimensionEntry[] = [
  {
    slug: "cocktail-bars",
    label: "cocktail bar",
    pluralLabel: "cocktail bars",
    description: "craft cocktails, mixology, evening drinks",
    matches: (v) =>
      v.serves_cocktails === true ||
      (matchesType(v, /cocktail|bar|lounge/i) && v.serves_cocktails !== false),
  },
  {
    slug: "wine-bars",
    label: "wine bar",
    pluralLabel: "wine bars",
    description: "wine list, by-the-glass, sommelier picks",
    matches: (v) =>
      (v.serves_wine === true && matchesType(v, /wine|bar/i)) ||
      matchesType(v, /wine_bar/i),
  },
  {
    slug: "restaurants",
    label: "restaurant",
    pluralLabel: "restaurants",
    description: "sit-down dinner spots",
    matches: (v) => v.serves_dinner === true || matchesType(v, /restaurant/i),
    minVenues: 8,
  },
  {
    slug: "cafes",
    label: "cafe",
    pluralLabel: "cafes",
    description: "coffee, low-key conversation, daytime dates",
    matches: (v) => matchesType(v, /cafe|coffee|bakery/i),
  },
  {
    slug: "brunch-spots",
    label: "brunch spot",
    pluralLabel: "brunch spots",
    description: "weekend mornings, mimosas, eggs benedict",
    matches: (v) => v.serves_brunch === true || v.serves_breakfast === true,
  },
  {
    slug: "rooftop-bars",
    label: "rooftop bar",
    pluralLabel: "rooftop bars",
    description: "skyline views, open-air, sunset drinks",
    matches: (v) =>
      hasAny(v.vibe_tags, ["rooftop", "skyline", "view"]) ||
      matchesType(v, /rooftop/i),
  },
  {
    slug: "live-music",
    label: "live music venue",
    pluralLabel: "live music venues",
    description: "bands, DJs, jazz nights",
    matches: (v) =>
      v.live_music === true || matchesType(v, /music|jazz|concert/i),
  },
  {
    slug: "breweries",
    label: "brewery",
    pluralLabel: "breweries",
    description: "craft beer, taprooms, casual evenings",
    matches: (v) =>
      (v.serves_beer === true && matchesType(v, /brewery|brewpub|taproom/i)) ||
      matchesType(v, /brewery/i),
  },
];

// ─── INTENTS ────────────────────────────────────────────────────────────────
// Match against top_intents (from venue_seo_aggregates MV).

export const INTENT_DIMENSIONS: DimensionEntry[] = [
  {
    slug: "first-date",
    label: "first date spot",
    pluralLabel: "first date spots",
    description: "low-pressure, conversation-friendly, neutral ground",
    matches: (v) => hasAny(v.top_intents, ["first_date"]),
  },
  {
    slug: "anniversary",
    label: "anniversary dinner spot",
    pluralLabel: "anniversary dinner spots",
    description: "special occasion, memorable, dressed-up",
    matches: (v) =>
      hasAny(v.top_intents, ["anniversary", "special_occasion"]) ||
      ((v.price_level ?? 0) >= 3 &&
        hasAny(v.vibe_tags, ["romantic", "upscale"])),
  },
  {
    slug: "casual-hangout",
    label: "casual date spot",
    pluralLabel: "casual hangout spots",
    description: "low-pressure, relaxed, easy",
    matches: (v) => hasAny(v.top_intents, ["casual", "hangout", "low_key"]),
  },
  {
    slug: "group-date",
    label: "group date spot",
    pluralLabel: "group date spots",
    description: "good for 4+, double dates, friend hangs",
    matches: (v) =>
      v.good_for_groups === true ||
      hasAny(v.top_intents, ["group", "double_date"]),
  },
  {
    slug: "late-night",
    label: "late night date spot",
    pluralLabel: "late night spots",
    description: "open late, after-dinner drinks, post-show",
    matches: (v) =>
      hasAny(v.top_intents, ["late_night", "nightcap"]) ||
      hasAny(v.time_of_day_fit, ["late_night", "evening"]),
  },
  {
    slug: "afternoon",
    label: "afternoon date spot",
    pluralLabel: "afternoon date spots",
    description: "daytime, coffee, low-stakes",
    matches: (v) =>
      hasAny(v.top_intents, ["afternoon", "coffee_date"]) ||
      hasAny(v.time_of_day_fit, ["afternoon", "lunch"]),
  },
  {
    slug: "post-work-drinks",
    label: "post-work drinks spot",
    pluralLabel: "post-work drink spots",
    description: "after-work, happy hour, easy weeknight",
    matches: (v) =>
      hasAny(v.top_intents, ["happy_hour", "post_work", "drinks"]) ||
      (hasAny(v.time_of_day_fit, ["evening"]) && v.serves_cocktails === true),
  },
];

// ─── Lookup helpers ─────────────────────────────────────────────────────────

const ALL_DIMENSIONS: Record<DimensionKind, DimensionEntry[]> = {
  vibe: VIBE_DIMENSIONS,
  category: CATEGORY_DIMENSIONS,
  for: INTENT_DIMENSIONS,
};

export function findDimension(
  kind: DimensionKind,
  slug: string,
): DimensionEntry | null {
  return ALL_DIMENSIONS[kind].find((d) => d.slug === slug) ?? null;
}

export function getAllDimensions(kind: DimensionKind): DimensionEntry[] {
  return ALL_DIMENSIONS[kind];
}

/** All dimension slugs across all kinds — used for sitemap / static params. */
export function allDimensionPaths(): Array<{
  kind: DimensionKind;
  slug: string;
}> {
  return Object.entries(ALL_DIMENSIONS).flatMap(([kind, entries]) =>
    entries.map((e) => ({ kind: kind as DimensionKind, slug: e.slug })),
  );
}

// ─── Predicate helpers ──────────────────────────────────────────────────────

function hasAny(arr: string[] | null | undefined, needles: string[]): boolean {
  if (!arr || arr.length === 0) return false;
  const set = new Set(arr.map((s) => s.toLowerCase()));
  return needles.some((n) => set.has(n.toLowerCase()));
}

function matchesType(v: Venue, regex: RegExp): boolean {
  if (v.primary_category && regex.test(v.primary_category)) return true;
  if (v.place_types?.some((t) => regex.test(t))) return true;
  return false;
}

// ─── Filter venues against a dimension ──────────────────────────────────────

export function filterByDimension(
  venues: Venue[],
  kind: DimensionKind,
  slug: string,
): Venue[] {
  const dim = findDimension(kind, slug);
  if (!dim) return [];
  return venues.filter(dim.matches);
}

/** Cross-promotion: show "you might also like" dimension links. */
export function relatedDimensions(
  kind: DimensionKind,
  slug: string,
): DimensionEntry[] {
  // Same kind: pick 3 sibling entries (excluding current).
  const siblings = ALL_DIMENSIONS[kind]
    .filter((d) => d.slug !== slug)
    .slice(0, 3);
  // Add one from each other kind for cross-discovery.
  const otherKinds = (Object.keys(ALL_DIMENSIONS) as DimensionKind[])
    .filter((k) => k !== kind)
    .map((k) => ALL_DIMENSIONS[k][0])
    .filter(Boolean);
  return [...siblings, ...otherKinds];
}

/** URL builder for dimension pages. */
export function dimensionPath(
  citySlug: string,
  kind: DimensionKind,
  slug: string,
): string {
  return `/date-spots/${citySlug}/${kind}/${slug}`;
}
