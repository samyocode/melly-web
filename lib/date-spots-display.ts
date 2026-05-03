// lib/date-spots-display.ts
//
// Pure helpers + types shared between the server (page rendering) and
// client (filter UI) sides of the date-spots routes. No Supabase or
// Node-only deps so this is safe to import from "use client" files.

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
  public_save_count: number | null;
  unique_savers: number | null;
  recent_visits_30d: number | null;
  top_intents: string[] | null;
  sample_notes: string[] | null;
};

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

export function timeLabel(time: string): string {
  return time.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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

export type FilterOptions = {
  vibes: string[];
  intents: string[];
  times: string[];
  prices: number[];
};

// Aggregate filter options from a list of venues. Tags are ranked by how
// many venues in the city carry them, so the chip bar surfaces the most
// useful filters first instead of obscure long-tail values.
//
// Note: intents are intentionally NOT aggregated. The intent field today
// stores app-internal save states (bookmark, want_to_try, been_here),
// which are meaningless as public filter chips. Re-enable once the app
// collects semantic values like first_date, anniversary, etc.
export function deriveFilterOptions(
  venues: Venue[],
  limits: { vibes?: number; times?: number } = {},
): FilterOptions {
  const { vibes: vMax = 8, times: tMax = 4 } = limits;

  const vibeCounts = new Map<string, number>();
  const timeCounts = new Map<string, number>();
  const priceLevels = new Set<number>();

  for (const v of venues) {
    for (const t of v.vibe_tags ?? []) {
      vibeCounts.set(t, (vibeCounts.get(t) ?? 0) + 1);
    }
    for (const t of v.time_of_day_fit ?? []) {
      timeCounts.set(t, (timeCounts.get(t) ?? 0) + 1);
    }
    if (v.price_level != null) priceLevels.add(v.price_level);
  }

  const topN = (m: Map<string, number>, n: number): string[] =>
    Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([k]) => k);

  return {
    vibes: topN(vibeCounts, vMax),
    intents: [],
    times: topN(timeCounts, tMax),
    prices: Array.from(priceLevels).sort((a, b) => a - b),
  };
}
