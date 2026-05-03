// lib/date-spots.ts

import { supabaseServer } from "./supabase-server";
import type { Venue } from "./date-spots-display";

export type { Venue, FilterOptions } from "./date-spots-display";
export {
  priceLevelLabel,
  formatRating,
  vibeLabel,
  intentLabel,
  timeLabel,
  servesList,
  amenityList,
  deriveFilterOptions,
} from "./date-spots-display";

export const MIN_PUBLIC_SAVES_FOR_VENUE_PAGE = 0;
export const MIN_VENUES_FOR_CITY_PAGE = 1;
export const VENUES_PER_CITY_PAGE = 50;

export interface CityRow {
  city: string;
  city_slug: string;
  venue_count: number;
}

export interface VenueAggregate {
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
}

export interface SitemapVenueRow {
  slug: string;
  city_slug: string;
  updated_at?: string;
}

interface AggregateRow {
  place_catalog_id: string;
  public_save_count: number | null;
  unique_savers: number | null;
  recent_visits_30d: number | null;
  top_intents: string[] | null;
  sample_notes: string[] | null;
}

// Note: no more `venue_seo_aggregates(...)` embedded join in this select.
// We fetch aggregates separately to avoid PostgREST MV-relationship quirks.
const VENUE_SELECT = `
  id, slug, city_slug, name, city, country, address, neighborhood_label,
  lat, lng, primary_category, place_types, vibe_tags, time_of_day_fit,
  default_energy_level, date_friendliness_score, rating, user_rating_count,
  price_level, editorial_summary, photo_url, opening_hours,
  dine_in, outdoor_seating, reservable, live_music, good_for_groups,
  serves_breakfast, serves_brunch, serves_dinner,
  serves_cocktails, serves_wine, serves_beer
`;

interface BaseVenueRow {
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
}

// Fetches aggregates for a list of venue IDs and returns them as a Map for fast lookup.
async function fetchAggregates(
  venueIds: string[],
): Promise<Map<string, AggregateRow>> {
  if (venueIds.length === 0) return new Map();

  const { data, error } = await supabaseServer
    .from("venue_seo_aggregates")
    .select(
      "place_catalog_id, public_save_count, unique_savers, recent_visits_30d, top_intents, sample_notes",
    )
    .in("place_catalog_id", venueIds);

  if (error) {
    console.error("[date-spots] fetchAggregates failed:", error.message);
    return new Map();
  }

  const map = new Map<string, AggregateRow>();
  for (const row of (data ?? []) as AggregateRow[]) {
    map.set(row.place_catalog_id, row);
  }
  return map;
}

function mergeVenue(row: BaseVenueRow, agg: AggregateRow | undefined): Venue {
  return {
    ...row,
    public_save_count: agg?.public_save_count ?? 0,
    unique_savers: agg?.unique_savers ?? 0,
    recent_visits_30d: agg?.recent_visits_30d ?? 0,
    top_intents: agg?.top_intents ?? null,
    sample_notes: agg?.sample_notes ?? null,
  };
}

export async function getCitiesWithVenues(): Promise<CityRow[]> {
  const { data, error } = await supabaseServer
    .from("cities_with_venue_counts")
    .select("city, city_slug, venue_count")
    .gte("venue_count", MIN_VENUES_FOR_CITY_PAGE)
    .order("venue_count", { ascending: false });

  console.log("[date-spots] getCitiesWithVenues — count:", data?.length ?? 0);

  if (error) {
    console.error("[date-spots] getCitiesWithVenues failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCityBySlug(citySlug: string): Promise<CityRow | null> {
  const { data, error } = await supabaseServer
    .from("cities_with_venue_counts")
    .select("city, city_slug, venue_count")
    .eq("city_slug", citySlug)
    .gte("venue_count", MIN_VENUES_FOR_CITY_PAGE)
    .maybeSingle();

  console.log(
    "[date-spots] getCityBySlug — querying:",
    citySlug,
    "— got:",
    data,
  );

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

  console.log("[date-spots] getVenuesForCity — querying:", citySlug);
  console.log("[date-spots] getVenuesForCity — error:", error);
  console.log("[date-spots] getVenuesForCity — count:", data?.length ?? 0);

  if (error) {
    console.error("[date-spots] getVenuesForCity failed:", error.message);
    return [];
  }

  const baseRows = (data ?? []) as unknown as BaseVenueRow[];
  const aggMap = await fetchAggregates(baseRows.map((r) => r.id));
  return baseRows.map((row) => mergeVenue(row, aggMap.get(row.id)));
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

  const row = data as unknown as BaseVenueRow;
  const aggMap = await fetchAggregates([row.id]);
  const venue = mergeVenue(row, aggMap.get(row.id));

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

  const baseRows = (data ?? []) as unknown as BaseVenueRow[];
  const aggMap = await fetchAggregates(baseRows.map((r) => r.id));
  return baseRows.map((row) => mergeVenue(row, aggMap.get(row.id)));
}

export async function getAllPublishableVenuesForSitemap(): Promise<
  SitemapVenueRow[]
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
