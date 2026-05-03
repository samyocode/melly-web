// app/date-spots/[city]/VenueListClient.tsx
//
// Client island for the city hub. Holds filter state, narrows the venue
// list in-memory, and renders the result grid. The server page passes in
// the full venue list (capped at VENUES_PER_CITY_PAGE) and the precomputed
// filter options derived from that same list.

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  type Venue,
  type FilterOptions,
  vibeLabel,
  intentLabel,
  timeLabel,
  priceLevelLabel,
  formatRating,
} from "@/lib/date-spots-display";

type Props = {
  citySlug: string;
  venues: Venue[];
  options: FilterOptions;
};

type FilterState = {
  vibes: Set<string>;
  intents: Set<string>;
  times: Set<string>;
  prices: Set<number>;
};

const empty: FilterState = {
  vibes: new Set(),
  intents: new Set(),
  times: new Set(),
  prices: new Set(),
};

function totalActive(f: FilterState): number {
  return f.vibes.size + f.intents.size + f.times.size + f.prices.size;
}

export default function VenueListClient({ citySlug, venues, options }: Props) {
  const [filters, setFilters] = useState<FilterState>(empty);
  const active = totalActive(filters);

  const filtered = useMemo(() => {
    if (active === 0) return venues;
    return venues.filter((v) => {
      if (
        filters.vibes.size > 0 &&
        !(v.vibe_tags ?? []).some((t) => filters.vibes.has(t))
      )
        return false;
      if (
        filters.intents.size > 0 &&
        !(v.top_intents ?? []).some((i) => filters.intents.has(i))
      )
        return false;
      if (
        filters.times.size > 0 &&
        !(v.time_of_day_fit ?? []).some((t) => filters.times.has(t))
      )
        return false;
      if (
        filters.prices.size > 0 &&
        (v.price_level == null || !filters.prices.has(v.price_level))
      )
        return false;
      return true;
    });
  }, [venues, filters, active]);

  const toggle = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K] extends Set<infer U> ? U : never,
  ) => {
    setFilters((prev) => {
      const next = new Set(prev[key] as Set<typeof value>);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [key]: next } as FilterState;
    });
  };

  const clearAll = () => setFilters(empty);

  const showFilters =
    options.vibes.length +
      options.intents.length +
      options.times.length +
      options.prices.length >
    0;

  return (
    <>
      {showFilters && (
        <section
          aria-label="Filters"
          className="sticky top-[57px] sm:top-[65px] z-30 -mx-5 sm:-mx-8 mb-6 px-5 sm:px-8 py-4 bg-stone-50/95 backdrop-blur-md border-b border-gray-200"
        >
          <div className="space-y-3">
            {options.vibes.length > 0 && (
              <ChipRow label="Vibe">
                {options.vibes.map((v) => (
                  <Chip
                    key={v}
                    active={filters.vibes.has(v)}
                    onClick={() => toggle("vibes", v)}
                  >
                    {vibeLabel(v)}
                  </Chip>
                ))}
              </ChipRow>
            )}
            {options.intents.length > 0 && (
              <ChipRow label="For">
                {options.intents.map((i) => (
                  <Chip
                    key={i}
                    active={filters.intents.has(i)}
                    onClick={() => toggle("intents", i)}
                  >
                    {intentLabel(i)}
                  </Chip>
                ))}
              </ChipRow>
            )}
            {options.times.length > 0 && (
              <ChipRow label="When">
                {options.times.map((t) => (
                  <Chip
                    key={t}
                    active={filters.times.has(t)}
                    onClick={() => toggle("times", t)}
                  >
                    {timeLabel(t)}
                  </Chip>
                ))}
              </ChipRow>
            )}
            {options.prices.length > 0 && (
              <ChipRow label="Price">
                {options.prices.map((p) => (
                  <Chip
                    key={p}
                    active={filters.prices.has(p)}
                    onClick={() => toggle("prices", p)}
                  >
                    {priceLevelLabel(p)}
                  </Chip>
                ))}
              </ChipRow>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filtered.length}
              </span>{" "}
              of {venues.length}
            </p>
            {active > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-medium text-pink-500 hover:text-pink-600 transition"
              >
                Clear all ({active})
              </button>
            )}
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-sm text-gray-500">
            No spots match those filters.
          </p>
          <button
            onClick={clearAll}
            className="mt-3 text-sm font-medium text-pink-500 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((v, i) => (
            <li key={v.id}>
              <Link
                href={`/date-spots/${citySlug}/${v.slug}`}
                className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-pink-300 hover:shadow-md transition"
              >
                <div className="relative aspect-[16/10] bg-gray-100">
                  {v.photo_url ? (
                    <Image
                      src={v.photo_url}
                      alt={v.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : null}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-gray-900">
                    #{i + 1}
                  </div>
                  {v.date_friendliness_score != null && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-pink-500 text-white text-xs font-bold">
                      {v.date_friendliness_score.toFixed(1)} Melly Score
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold leading-tight group-hover:text-pink-500 transition-colors">
                    {v.name}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {v.neighborhood_label ?? v.city}
                    {v.price_level != null && (
                      <> · {priceLevelLabel(v.price_level)}</>
                    )}
                    {v.rating != null && <> · ★ {formatRating(v.rating)}</>}
                  </p>
                  {v.vibe_tags && v.vibe_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {v.vibe_tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[11px] font-medium text-gray-600 bg-stone-100 border border-gray-200 rounded-full"
                        >
                          {vibeLabel(t)}
                        </span>
                      ))}
                    </div>
                  )}
                  {(v.public_save_count ?? 0) > 0 && (
                    <p className="text-xs text-pink-500 font-medium mt-3">
                      Saved by {v.public_save_count} Melly{" "}
                      {v.public_save_count === 1 ? "user" : "users"}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function ChipRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] flex-shrink-0 w-12">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition active:scale-95 ${
        active
          ? "bg-pink-500 text-white border-pink-500 shadow-sm shadow-pink-500/20"
          : "bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:text-pink-500"
      }`}
    >
      {children}
    </button>
  );
}
