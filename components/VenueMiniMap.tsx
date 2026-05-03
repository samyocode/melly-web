// components/VenueMiniMap.tsx

"use client";

import { useMemo } from "react";
import Link from "next/link";
import GoogleMap, { type MapMarker } from "@/components/GoogleMap";
import { distanceMeters, walkingMinutes } from "@/lib/google-maps";
import type { Venue } from "@/lib/date-spots-display";

export default function VenueMiniMap({
  venue,
  nearby,
  citySlug,
}: {
  venue: Venue;
  nearby: Venue[];
  citySlug: string;
}) {
  const nearbyWithDistance = useMemo(
    () =>
      nearby
        .map((n) => {
          const meters = distanceMeters(
            { lat: venue.lat, lng: venue.lng },
            { lat: n.lat, lng: n.lng },
          );
          return { venue: n, meters, mins: walkingMinutes(meters) };
        })
        .sort((a, b) => a.meters - b.meters)
        .slice(0, 5),
    [venue.lat, venue.lng, nearby],
  );

  const markers: MapMarker[] = useMemo(() => {
    return [
      {
        id: venue.id,
        lat: venue.lat,
        lng: venue.lng,
        title: venue.name,
      },
      ...nearbyWithDistance.map((n, i) => ({
        id: n.venue.id,
        lat: n.venue.lat,
        lng: n.venue.lng,
        rank: i + 1,
        title: n.venue.name,
      })),
    ];
  }, [venue.id, venue.lat, venue.lng, venue.name, nearbyWithDistance]);

  return (
    <section
      aria-labelledby="venue-map-heading"
      className="rounded-2xl overflow-hidden border border-gray-200 bg-white"
    >
      <h2
        id="venue-map-heading"
        className="px-5 pt-5 pb-3 text-sm font-bold text-gray-900"
      >
        Where {venue.name} sits
      </h2>

      <div className="h-72 sm:h-80 mx-5 rounded-xl overflow-hidden">
        <GoogleMap
          markers={markers}
          highlightedId={venue.id}
          center={{ lat: venue.lat, lng: venue.lng }}
          zoom={15}
        />
      </div>

      {nearbyWithDistance.length > 0 && (
        <div className="p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Walk to nearby spots
          </h3>
          <ol className="space-y-2">
            {nearbyWithDistance.map((n, i) => (
              <li key={n.venue.id}>
                <Link
                  href={`/date-spots/${citySlug}/${n.venue.slug}`}
                  className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate group-hover:text-pink-500 transition-colors">
                      {n.venue.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {n.venue.neighborhood_label ?? n.venue.primary_category}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs font-bold text-gray-700">
                      {n.mins} min
                    </p>
                    <p className="text-[10px] text-gray-400">walk</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
