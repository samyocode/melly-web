// app/api/date-spots/featured-cities/route.ts
//
// Returns the top N cities (by venue count) for the landing-page Date Spots
// section, each with one representative photo URL. Cached at the edge for
// 1h since the underlying view shifts slowly.

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { MIN_VENUES_FOR_CITY_PAGE } from "@/lib/date-spots";

export const revalidate = 3600;

const FEATURED_LIMIT = 6;

export type FeaturedCity = {
  city: string;
  city_slug: string;
  venue_count: number;
  photo_url: string | null;
};

export async function GET() {
  const { data: cities, error: citiesErr } = await supabaseServer
    .from("cities_with_venue_counts")
    .select("city, city_slug, venue_count")
    .gte("venue_count", MIN_VENUES_FOR_CITY_PAGE)
    .order("venue_count", { ascending: false })
    .limit(FEATURED_LIMIT);

  if (citiesErr) {
    console.error("[featured-cities] cities query failed:", citiesErr.message);
    return NextResponse.json({ cities: [] satisfies FeaturedCity[] });
  }

  const citySlugs = (cities ?? []).map((c) => c.city_slug);
  if (citySlugs.length === 0) {
    return NextResponse.json({ cities: [] satisfies FeaturedCity[] });
  }

  // One round trip for photos. Highest-score venue per city wins.
  const { data: photos, error: photosErr } = await supabaseServer
    .from("places_catalog")
    .select("city_slug, photo_url, date_friendliness_score")
    .in("city_slug", citySlugs)
    .not("photo_url", "is", null)
    .not("date_friendliness_score", "is", null)
    .order("date_friendliness_score", { ascending: false });

  if (photosErr) {
    console.error("[featured-cities] photos query failed:", photosErr.message);
  }

  const firstPhotoBySlug = new Map<string, string>();
  for (const row of photos ?? []) {
    if (row.photo_url && !firstPhotoBySlug.has(row.city_slug)) {
      firstPhotoBySlug.set(row.city_slug, row.photo_url);
    }
  }

  const featured: FeaturedCity[] = (cities ?? []).map((c) => ({
    city: c.city,
    city_slug: c.city_slug,
    venue_count: Number(c.venue_count),
    photo_url: firstPhotoBySlug.get(c.city_slug) ?? null,
  }));

  return NextResponse.json({ cities: featured });
}
