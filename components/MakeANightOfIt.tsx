// components/MakeANightOfIt.tsx
//
// Renders the buildItineraries() output as a swipeable/stackable card list.
// Each itinerary shows a sequence of stops with walking times between them
// and a clear "build this in Melly" CTA.

import Link from "next/link";
import Image from "next/image";
import type { Itinerary } from "@/lib/date-itinerary";
import { roleLabel, roleEmoji } from "@/lib/date-itinerary";

export default function MakeANightOfIt({
  itineraries,
  citySlug,
  appHref = "#download",
}: {
  itineraries: Itinerary[];
  citySlug: string;
  appHref?: string;
}) {
  if (itineraries.length === 0) return null;

  return (
    <section
      aria-labelledby="itin-heading"
      className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-stone-50 to-white border border-gray-200"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold text-pink-500 tracking-[0.2em] uppercase mb-2">
          Make a night of it
        </p>
        <h2
          id="itin-heading"
          className="text-lg sm:text-xl font-extrabold text-gray-900"
        >
          Pair this with a walk
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Sequences built from venues within walking distance.
        </p>
      </div>

      <ul className="space-y-4">
        {itineraries.map((itin) => (
          <li
            key={itin.id}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{itin.title}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">{itin.blurb}</p>
              </div>
              <span className="text-[10px] text-gray-400 font-medium flex-shrink-0 ml-3">
                {itin.totalWalkMinutes} min walk total
              </span>
            </div>

            <ol className="divide-y divide-gray-100">
              {itin.stops.map((stop, i) => (
                <li key={stop.venue.id}>
                  {i > 0 && stop.walkMinutesFromPrev != null && (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-stone-50/50">
                      <span className="text-gray-300">↓</span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {stop.walkMinutesFromPrev} min walk
                      </span>
                    </div>
                  )}
                  <Link
                    href={`/date-spots/${citySlug}/${stop.venue.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition group"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-sm">
                      {roleEmoji(stop.role)}
                    </div>
                    <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {stop.venue.photo_url && (
                        <Image
                          src={stop.venue.photo_url}
                          alt={stop.venue.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-pink-500 transition-colors">
                        {stop.venue.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {roleLabel(stop.role)}
                        {stop.venue.neighborhood_label && (
                          <> · {stop.venue.neighborhood_label}</>
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="px-4 py-3 bg-stone-50 border-t border-gray-100">
              <Link
                href={appHref}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700"
              >
                Build this date plan in Melly →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
