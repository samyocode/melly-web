// lib/date-spots.ts
//
// Server-only data access for the /date-spots/* routes.
// All queries are read-only and routed through the public anon key,
// so they only see what RLS allows + the venue_seo_aggregates MV.

import { supabaseServer } from "./supabase-server";

// Minimum public saves required before a venue page is published.
// Below this threshold, pages are 404 (and excluded from sitemap).
// Tune up if Search Console shows thin-page issues; tune down only
// once you have moderation in place.
export const MIN_PUBLIC_SAVES_FOR_VENUE_PAGE = 0;

// Minimum venues required for a city hub to be published.
export const MIN_VENUES_FOR_CITY_PAGE = 5;

// Max venues per city hub page.
export const VENUES_PER_CITY_PAGE = 50;

export type VenueAggregate = {
  place_catalog_id: string;
  slug: string;
  city_slug: string;
  city: string | null;
  name: string;
  neighborhood_label: string | null;
  public_save_count: number;
  unique_savers: number;
  recent_visits_30d: number;
  top_intents: string[] | null;
  sample_notes: string[] | null;
};

export type Venue = {
  id: string;
  slug: string;
  city_slug: string;
  name: string;
  city: string | null;
  country: string | null;
  address: string | null;
  neighborhood_label: string | null;
  lat: number;
  lng: number;
  primary_category: string | null;
  place_types: string[] | null;
  vibe_tags: string[] | null;
  time_of_day_fit: string[] | null;
  default_energy_level: string | null;
  date_friendliness_score: number | null;
  rating: number | null;
  user_rating_count: number | null;
  price_level: number | null;
  editorial_summary: string | null;
  photo_url: string | null;
  opening_hours: unknown;
  dine_in: boolean | null;
  outdoor_seating: boolean | null;
  reservable: boolean | null;
  live_music: boolean | null;
  good_for_groups: boolean | null;
  serves_breakfast: boolean | null;
  serves_brunch: boolean | null;
  serves_dinner: boolean | null;
  serves_cocktails: boolean | null;
  serves_wine: boolean | null;
  serves_beer: boolean | null;
  // joined aggregates (left-join: may be null when MV row missing)
  public_save_count: number | null;
  unique_savers: number | null;
  recent_visits_30d: number | null;
  top_intents: string[] | null;
  sample_notes: string[] | null;
};

const VENUE_SELECT = `
  id, slug, city_slug, name, city, country, address, neighborhood_label,
  lat, lng, primary_category, place_types, vibe_tags, time_of_day_fit,
  default_energy_level, date_friendliness_score, rating, user_rating_count,
  price_level, editorial_summary, photo_url, opening_hours,
  dine_in, outdoor_seating, reservable, live_music, good_for_groups,
  serves_breakfast, serves_brunch, serves_dinner,
  serves_cocktails, serves_wine, serves_beer,
  venue_seo_aggregates(public_save_count, unique_savers, recent_visits_30d, top_intents, sample_notes)
`;

type VenueRow = Omit<
  Venue,
  | "public_save_count"
  | "unique_savers"
  | "recent_visits_30d"
  | "top_intents"
  | "sample_notes"
> & {
  venue_seo_aggregates:
    | {
        public_save_count: number | null;
        unique_savers: number | null;
        recent_visits_30d: number | null;
        top_intents: string[] | null;
        sample_notes: string[] | null;
      }
    | null
    | Array<{
        public_save_count: number | null;
        unique_savers: number | null;
        recent_visits_30d: number | null;
        top_intents: string[] | null;
        sample_notes: string[] | null;
      }>;
};

function flattenVenue(row: VenueRow): Venue {
  const agg = Array.isArray(row.venue_seo_aggregates)
    ? row.venue_seo_aggregates[0]
    : row.venue_seo_aggregates;
  const { venue_seo_aggregates: _ignored, ...rest } = row;
  void _ignored;
  return {
    ...rest,
    public_save_count: agg?.public_save_count ?? 0,
    unique_savers: agg?.unique_savers ?? 0,
    recent_visits_30d: agg?.recent_visits_30d ?? 0,
    top_intents: agg?.top_intents ?? null,
    sample_notes: agg?.sample_notes ?? null,
  };
}

// ─── PUBLIC QUERIES ─────────────────────────────────────────────────────────

export async function getCitiesWithVenues(): Promise<
  Array<{ city: string; city_slug: string; venue_count: number }>
> {
  // The view `cities_with_venue_counts` is created in the migration.
  const { data, error } = await supabaseServer
    .from("cities_with_venue_counts")
    .select("city, city_slug, venue_count")
    .gte("venue_count", MIN_VENUES_FOR_CITY_PAGE)
    .order("venue_count", { ascending: false });

  if (error) {
    console.error("[date-spots] getCitiesWithVenues failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCityBySlug(
  citySlug: string,
): Promise<{ city: string; city_slug: string; venue_count: number } | null> {
  const { data, error } = await supabaseServer
    .from("cities_with_venue_counts")
    .select("city, city_slug, venue_count")
    .eq("city_slug", citySlug)
    .gte("venue_count", MIN_VENUES_FOR_CITY_PAGE)
    .maybeSingle();

  if (error) {
    console.error("[date-spots] getCityBySlug failed:", error.message);
    return null;
  }
  return data;
}

export async function getVenuesForCity(citySlug: string): Promise<Venue[]> {
  const { data, error } = await supabaseServer
    .from("places_catalog")
    .select(VENUE_SELECT)
    .eq("city_slug", citySlug)
    .not("date_friendliness_score", "is", null)
    .order("date_friendliness_score", { ascending: false })
    .limit(VENUES_PER_CITY_PAGE);

  if (error) {
    console.error("[date-spots] getVenuesForCity failed:", error.message);
    return [];
  }
  return ((data ?? []) as unknown as VenueRow[]).map(flattenVenue);
}

export async function getVenueBySlug(
  citySlug: string,
  venueSlug: string,
): Promise<Venue | null> {
  const { data, error } = await supabaseServer
    .from("places_catalog")
    .select(VENUE_SELECT)
    .eq("city_slug", citySlug)
    .eq("slug", venueSlug)
    .maybeSingle();

  if (error) {
    console.error("[date-spots] getVenueBySlug failed:", error.message);
    return null;
  }
  if (!data) return null;
  const venue = flattenVenue(data as unknown as VenueRow);
  if ((venue.public_save_count ?? 0) < MIN_PUBLIC_SAVES_FOR_VENUE_PAGE) {
    return null;
  }
  return venue;
}

export async function getRelatedVenues(
  citySlug: string,
  excludeSlug: string,
  vibeTags: string[] | null,
  limit = 4,
): Promise<Venue[]> {
  let query = supabaseServer
    .from("places_catalog")
    .select(VENUE_SELECT)
    .eq("city_slug", citySlug)
    .neq("slug", excludeSlug)
    .not("date_friendliness_score", "is", null);

  if (vibeTags && vibeTags.length > 0) {
    query = query.overlaps("vibe_tags", vibeTags);
  }

  const { data, error } = await query
    .order("date_friendliness_score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[date-spots] getRelatedVenues failed:", error.message);
    return [];
  }
  return ((data ?? []) as unknown as VenueRow[]).map(flattenVenue);
}

export async function getAllPublishableVenuesForSitemap(): Promise<
  Array<{ slug: string; city_slug: string; updated_at?: string }>
> {
  const { data, error } = await supabaseServer
    .from("places_catalog")
    .select("slug, city_slug, updated_at")
    .not("city_slug", "is", null)
    .not("date_friendliness_score", "is", null);

  if (error) {
    console.error("[date-spots] sitemap query failed:", error.message);
    return [];
  }
  return data ?? [];
}

// ─── DISPLAY HELPERS ────────────────────────────────────────────────────────

export function priceLevelLabel(level: number | null): string {
  if (level == null) return "";
  return "$".repeat(Math.max(1, Math.min(4, level)));
}

export function formatRating(rating: number | null): string {
  if (rating == null) return "—";
  return rating.toFixed(1);
}

export function vibeLabel(tag: string): string {
  return tag.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function intentLabel(intent: string): string {
  return intent.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function servesList(v: Venue): string[] {
  const items: string[] = [];
  if (v.serves_breakfast) items.push("Breakfast");
  if (v.serves_brunch) items.push("Brunch");
  if (v.serves_dinner) items.push("Dinner");
  if (v.serves_cocktails) items.push("Cocktails");
  if (v.serves_wine) items.push("Wine");
  if (v.serves_beer) items.push("Beer");
  return items;
}

export function amenityList(v: Venue): string[] {
  const items: string[] = [];
  if (v.outdoor_seating) items.push("Outdoor seating");
  if (v.reservable) items.push("Reservations");
  if (v.dine_in) items.push("Dine-in");
  if (v.live_music) items.push("Live music");
  if (v.good_for_groups) items.push("Good for groups");
  return items;
}
