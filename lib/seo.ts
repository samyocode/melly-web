// lib/seo.ts
//
// Centralized JSON-LD generators + meta helpers.

import type { Venue } from "./date-spots-display";
import {
  amenityList,
  servesList,
  vibeLabel,
  priceLevelLabel,
} from "./date-spots-display";
import { SITE_NAME, SITE_URL, absoluteUrl } from "./site";

const FOOD_TYPE_REGEX =
  /restaurant|food|bar|cafe|bakery|pub|brewery|izakaya|bistro|gastropub|tavern/i;
const BAR_TYPE_REGEX = /bar|lounge|pub|brewery|cocktail|wine|tavern|izakaya/i;
const CAFE_TYPE_REGEX = /cafe|coffee|bakery|teahouse|patisserie/i;

export function detectVenueSchemaType(v: Venue): string {
  const types = (v.place_types ?? []).join(" ");
  const cat = v.primary_category ?? "";

  if (BAR_TYPE_REGEX.test(types) || BAR_TYPE_REGEX.test(cat)) return "BarOrPub";
  if (CAFE_TYPE_REGEX.test(types) || CAFE_TYPE_REGEX.test(cat))
    return "CafeOrCoffeeShop";

  const isFood =
    v.dine_in === true ||
    v.serves_dinner === true ||
    v.serves_brunch === true ||
    v.serves_breakfast === true ||
    FOOD_TYPE_REGEX.test(types) ||
    FOOD_TYPE_REGEX.test(cat);

  return isFood ? "Restaurant" : "LocalBusiness";
}

type OpeningHours = {
  weekday_text?: string[];
  periods?: Array<{
    open?: { day?: number; time?: string };
    close?: { day?: number; time?: string };
  }>;
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function parseOpeningHours(raw: unknown): string[] | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const oh = raw as OpeningHours;
  if (!oh.periods?.length) return undefined;

  return oh.periods
    .map((p) => {
      if (p.open?.day == null || !p.open?.time || !p.close?.time) return null;
      const day = DAY_NAMES[p.open.day]?.slice(0, 2);
      if (!day) return null;
      const open = `${p.open.time.slice(0, 2)}:${p.open.time.slice(2, 4)}`;
      const close = `${p.close.time.slice(0, 2)}:${p.close.time.slice(2, 4)}`;
      return `${day} ${open}-${close}`;
    })
    .filter((x): x is string => x !== null);
}

export function buildVenueSchema(v: Venue, citySlug: string) {
  const url = absoluteUrl(`/date-spots/${citySlug}/${v.slug}`);
  const schemaType = detectVenueSchemaType(v);
  const isFood = schemaType === "Restaurant";

  const amenityFeatures = [
    ...amenityList(v).map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    ...servesList(v).map((name) => ({
      "@type": "LocationFeatureSpecification",
      name: `Serves ${name}`,
      value: true,
    })),
  ];

  const openingHours = parseOpeningHours(v.opening_hours);

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": url,
    name: v.name,
    url,
    image: v.photo_url ?? undefined,
    description: v.editorial_summary ?? undefined,
    address: v.address
      ? {
          "@type": "PostalAddress",
          streetAddress: v.address,
          addressLocality: v.city ?? undefined,
          addressCountry: v.country ?? undefined,
        }
      : undefined,
    geo: {
      "@type": "GeoCoordinates",
      latitude: v.lat,
      longitude: v.lng,
    },
    aggregateRating:
      v.rating != null && (v.user_rating_count ?? 0) > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: v.rating,
            reviewCount: v.user_rating_count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    priceRange:
      v.price_level != null ? priceLevelLabel(v.price_level) : undefined,
    servesCuisine:
      isFood && v.primary_category
        ? v.primary_category.replace(/_/g, " ")
        : undefined,
    openingHours,
    amenityFeature: amenityFeatures.length > 0 ? amenityFeatures : undefined,
    publicAccess: true,
  };
}

// ─── FAQ schema ─────────────────────────────────────────────────────────────
//
// Auto-generated FAQ from venue data. Intent-based questions removed since
// the app's intent field stores mechanical save states (bookmark, want_to_try)
// rather than semantic intents.

export type FAQPair = { question: string; answer: string };

export function buildVenueFAQ(v: Venue): FAQPair[] {
  const faqs: FAQPair[] = [];
  const cityName = v.city ?? "the area";

  if (v.date_friendliness_score != null && v.date_friendliness_score >= 7) {
    faqs.push({
      question: `Is ${v.name} a good date spot?`,
      answer: `${v.name} earns a Melly Score of ${v.date_friendliness_score.toFixed(
        1,
      )} out of 10, putting it among the more date-friendly venues in ${cityName}. The score weighs atmosphere, vibe, and conversation acoustics.`,
    });
  }

  if (v.reservable === true) {
    faqs.push({
      question: `Does ${v.name} take reservations?`,
      answer: `Yes, ${v.name} accepts reservations. Booking ahead is recommended for date nights, especially on weekends.`,
    });
  } else if (v.reservable === false) {
    faqs.push({
      question: `Does ${v.name} take reservations?`,
      answer: `${v.name} is walk-in only — no reservations. Arrive early on weekend evenings to avoid a wait.`,
    });
  }

  if (v.outdoor_seating === true) {
    faqs.push({
      question: `Does ${v.name} have outdoor seating?`,
      answer: `Yes — ${v.name} has outdoor seating, which makes it a popular pick on Melly for warm-weather dates.`,
    });
  }

  if (v.vibe_tags && v.vibe_tags.length > 0) {
    const vibesText = v.vibe_tags
      .slice(0, 3)
      .map(vibeLabel)
      .join(", ")
      .toLowerCase();
    faqs.push({
      question: `What's the vibe at ${v.name}?`,
      answer: `Melly users describe ${v.name} as ${vibesText}.${
        v.editorial_summary ? ` ${v.editorial_summary}` : ""
      }`,
    });
  }

  const serves = servesList(v);
  if (serves.length > 0) {
    faqs.push({
      question: `What does ${v.name} serve?`,
      answer: `${v.name} serves ${serves.join(", ").toLowerCase()}.${
        v.price_level != null
          ? ` Price range: ${priceLevelLabel(v.price_level)}.`
          : ""
      }`,
    });
  }

  if (v.neighborhood_label && v.address) {
    faqs.push({
      question: `Where is ${v.name} located?`,
      answer: `${v.name} is in ${v.neighborhood_label}, ${cityName}. Address: ${v.address}.`,
    });
  }

  return faqs;
}

export function buildFAQSchema(faqs: FAQPair[]) {
  if (faqs.length < 3) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

// ─── Breadcrumb helper ──────────────────────────────────────────────────────

type BreadcrumbCrumb = { name: string; url: string };

export function buildBreadcrumbSchema(crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function homeCrumb(): BreadcrumbCrumb {
  return { name: "Home", url: SITE_URL };
}

export function dateSpotsCrumb(): BreadcrumbCrumb {
  return { name: "Date Spots", url: absoluteUrl("/date-spots") };
}

export function cityCrumb(citySlug: string, cityName: string): BreadcrumbCrumb {
  return { name: cityName, url: absoluteUrl(`/date-spots/${citySlug}`) };
}

// ─── Meta description builders ──────────────────────────────────────────────

export function buildVenueMeta(v: Venue): string {
  const parts: string[] = ["On The Melly List"];
  if (v.neighborhood_label) parts.push(v.neighborhood_label);
  else if (v.primary_category) parts.push(v.primary_category);
  if (v.date_friendliness_score != null) {
    parts.push(`Melly Score ${v.date_friendliness_score.toFixed(1)}`);
  }
  if ((v.public_save_count ?? 0) > 0) {
    parts.push(`saved by ${v.public_save_count} Melly users`);
  }
  if (v.vibe_tags?.length) {
    parts.push(v.vibe_tags.slice(0, 2).map(vibeLabel).join(", "));
  }
  const summary = parts.join(" · ");
  if (v.editorial_summary) {
    return `${summary}. ${v.editorial_summary}`.slice(0, 300);
  }
  return summary || `Date spot info for ${v.name}.`;
}

export function buildCityMeta(cityName: string, venueCount: number): string {
  return `The Melly List in ${cityName}: ${venueCount} venues vetted for date energy. Atmosphere, vibe, and what real people save them for. Updated weekly. No paid placements.`;
}

export function buildDimensionMeta(opts: {
  cityName: string;
  dimensionLabel: string;
  count: number;
}): string {
  const { cityName, dimensionLabel, count } = opts;
  return `${count} ${dimensionLabel.toLowerCase()} in ${cityName} for date night, ranked by Melly Score. Real venues real people save. Updated weekly.`;
}

export { SITE_NAME, SITE_URL, absoluteUrl };
