// components/PairedVenues.tsx
//
// "Often paired with" section. Reads from venue_pair_affinity MV and
// shows the top 4 venues that this venue's savers also save.
//
// Server component — runs the query at request time (cached by Next.js
// page revalidation). One indexed lookup per page render.

import Link from "next/link";
import Image from "next/image";
import { supabaseServer } from "@/lib/supabase-server";
import type { Venue } from "@/lib/date-spots-display";
import { vibeLabel } from "@/lib/date-spots-display";

type PairedVenue = {
  id: string;
  slug: string;
  city_slug: string;
  name: string;
  neighborhood_label: string | null;
  primary_category: string | null;
  photo_url: string | null;
  vibe_tags: string[] | null;
  shared_savers: number;
};

async function getPairedVenues(venueId: string, limit = 4): Promise<PairedVenue[]> {
  // Two-step: first get pair IDs from the MV, then hydrate venue details.
  // PostgREST embedded joins on MVs have been flaky for us, so we keep
  // it explicit. ~5ms total for both queries.
  const { data: pairs, error: pairError } = await supabaseServer
    .from("venue_pair_affinity")
    .select("venue_b, shared_savers")
    .eq("venue_a", venueId)
    .order("shared_savers", { ascending: false })
    .limit(limit);

  if (pairError || !pairs || pairs.length === 0) return [];

  const venueIds = pairs.map((p) => p.venue_b);
  const sharedById = new Map(pairs.map((p) => [p.venue_b, p.shared_savers]));

  const { data: venues, error: venueError } = await supabaseServer
    .from("places_catalog")
    .select("id, slug, city_slug, name, neighborhood_label, primary_category, photo_url, vibe_tags")
    .in("id", venueIds);

  if (venueError || !venues) return [];

  // Re-sort to preserve the affinity ranking (the IN query loses order).
  return venues
    .map((v) => ({
      ...v,
      shared_savers: sharedById.get(v.id) ?? 0,
    }))
    .sort((a, b) => b.shared_savers - a.shared_savers) as PairedVenue[];
}

export default async function PairedVenues({
  venueId,
  venueName,
}: {
  venueId: string;
  venueName: string;
}) {
  const paired = await getPairedVenues(venueId);

  if (paired.length === 0) return null;

  return (
    <section
      aria-labelledby="paired-heading"
      className="mb-6 p-5 sm:p-6 rounded-2xl bg-white border border-gray-200"
    >
      <div className="mb-4">
        <h2
          id="paired-heading"
          className="text-lg sm:text-xl font-extrabold text-gray-900"
        >
          Often paired with
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          People who save {venueName} also save these spots.
        </p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paired.map((p) => (
          <li key={p.id}>
            <Link
              href={`/date-spots/${p.city_slug}/${p.slug}`}
              className="group flex gap-3 p-3 rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-sm transition"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {p.photo_url && (
                  <Image
                    src={p.photo_url}
                    alt={p.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-pink-500 transition-colors">
                  {p.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {p.neighborhood_label ?? p.primary_category ?? ""}
                </p>
                {p.vibe_tags && p.vibe_tags.length > 0 && (
                  <p className="text-[11px] text-gray-500 mt-1 truncate">
                    {p.vibe_tags.slice(0, 2).map(vibeLabel).join(" · ")}
                  </p>
                )}
                <p className="text-[10px] text-pink-500 font-bold mt-1">
                  {p.shared_savers} {p.shared_savers === 1 ? "person" : "people"} saved both
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
