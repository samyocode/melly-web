// components/LandingDateSpotsSection.tsx
//
// Landing-page section for /date-spots. Mirrors the visual rhythm of the
// quizzes section: centered header, responsive card grid, "browse all" CTA.
// Fetches featured cities from /api/date-spots/featured-cities so the
// home page (which is "use client") doesn't need to await Supabase.

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type FeaturedCity = {
  city: string;
  city_slug: string;
  venue_count: number;
  photo_url: string | null;
};

export default function LandingDateSpotsSection() {
  const [cities, setCities] = useState<FeaturedCity[] | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/date-spots/featured-cities")
      .then((r) => r.json())
      .then((data: { cities: FeaturedCity[] }) => {
        if (cancelled) return;
        setCities(data.cities ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setCities([]);
      })
      .finally(() => {
        if (!cancelled) setHasFetched(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Hide the section entirely if data fetched and no cities exist yet —
  // better than showing an empty grid that begs the question.
  if (hasFetched && (cities?.length ?? 0) === 0) {
    return null;
  }

  return (
    <section
      id="the-list"
      className="py-16 sm:py-24 bg-stone-50"
      aria-labelledby="the-list-heading"
    >
      <div className="px-5 sm:px-6 mx-auto max-w-7xl">
        <div className="mb-10 sm:mb-14 text-center">
          <p className="mb-3 text-xs font-bold text-pink-500 tracking-[0.2em] uppercase">
            The Melly List
          </p>
          <h2
            id="the-list-heading"
            className="mb-3 text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight"
          >
            The places dating actually happens
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            A standing list of venues vetted for date energy — atmosphere,
            conversation acoustics, and what real people save them for. No
            paid placements. No listicle filler.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 mb-8">
          {cities === null
            ? Array.from({ length: 6 }).map((_, i) => <CityCardSkeleton key={i} />)
            : cities.map((c) => <CityCard key={c.city_slug} city={c} />)}
        </div>

        <div className="text-center">
          <Link
            href="/date-spots"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-pink-500 rounded-full hover:bg-pink-600 transition shadow-md shadow-pink-500/20"
          >
            See The List
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CityCard({ city }: { city: FeaturedCity }) {
  return (
    <Link
      href={`/date-spots/${city.city_slug}`}
      className="group relative block aspect-[4/5] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
    >
      {city.photo_url ? (
        <Image
          src={city.photo_url}
          alt={city.city}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          className="object-cover transition duration-700 group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-stone-100 to-pink-100" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
        <h3 className="text-base sm:text-xl font-bold text-white leading-tight drop-shadow">
          {city.city}
        </h3>
        <p className="text-[11px] sm:text-xs text-white/80 mt-0.5">
          {city.venue_count} {city.venue_count === 1 ? "spot" : "spots"}
        </p>
      </div>
    </Link>
  );
}

function CityCardSkeleton() {
  return (
    <div className="aspect-[4/5] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl bg-gray-200 animate-pulse" />
  );
}
