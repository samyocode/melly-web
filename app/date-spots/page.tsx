// app/date-spots/page.tsx
//
// Top-level hub: lists every city with enough indexed venues. Drives crawl
// coverage and gives users a navigable directory.

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCitiesWithVenues } from "@/lib/date-spots";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `The Melly List | ${SITE_NAME}`,
  description:
    "A standing list of venues vetted for date energy. Restaurants, bars, and experiences scored on how they actually work for dates — by atmosphere, vibe, and what real people save them for.",
  alternates: { canonical: absoluteUrl("/date-spots") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/date-spots"),
    title: `The Melly List | ${SITE_NAME}`,
    description:
      "A standing list of venues vetted for date energy — atmosphere, vibe, and what real people save them for. No paid placements.",
  },
};

export default async function DateSpotsIndexPage() {
  const cities = await getCitiesWithVenues();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-gray-900">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <header className="mb-10 sm:mb-14">
          <p className="text-xs font-bold text-pink-500 tracking-[0.2em] uppercase mb-3">
            The Melly List
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05]">
            The places dating actually happens
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed mb-6">
            A standing list of venues vetted for date energy — atmosphere,
            conversation acoustics, and what real people save them for. Every
            spot earns its place by Melly Score and community signal. No paid
            placements. No listicle filler.
          </p>
          <p className="text-xs text-gray-400 max-w-2xl">
            Updated weekly. Cities ordered by how active The List is in each.
          </p>
        </header>

        {cities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
            <p className="text-gray-500">
              We&apos;re still gathering enough saves to publish city pages.
              Check back soon.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cities.map((c) => (
              <li key={c.city_slug}>
                <Link
                  href={`/date-spots/${c.city_slug}`}
                  className="group block p-4 rounded-2xl bg-white border border-gray-200 hover:border-pink-300 hover:shadow-md transition"
                >
                  <p className="text-base font-bold group-hover:text-pink-500 transition-colors">
                    {c.city}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {c.venue_count} {c.venue_count === 1 ? "spot" : "spots"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
