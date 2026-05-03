// app/date-spots/[city]/_dimension/render.tsx
//
// Shared renderer for the three dimension page types:
//   /date-spots/[city]/vibe/[vibe]
//   /date-spots/[city]/category/[category]
//   /date-spots/[city]/for/[intent]
//
// All three look identical except for headline copy + which dimension
// pool they read from. Extracted to one file so we only maintain it once.
//
// Exports:
//   renderDimensionPage()  — the page body (wraps everything in Navbar/Footer)
//   buildDimensionMetadata() — generateMetadata helper
//
// Usage from a route file:
//   export { renderDimensionPage as default, buildDimensionMetadata as generateMetadata }
//   ...with the route file passing kind + slug from its params.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getCityBySlug, getVenuesForCity } from "@/lib/date-spots";
import {
  findDimension,
  filterByDimension,
  relatedDimensions,
  dimensionPath,
  type DimensionKind,
} from "@/lib/date-spots-taxonomy";
import {
  buildBreadcrumbSchema,
  buildDimensionMeta,
  homeCrumb,
  dateSpotsCrumb,
  cityCrumb,
} from "@/lib/seo";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import CityListWithMap from "../CityListWithMap";

export type DimensionRouteParams = {
  city: string;
  slug: string;
};

const MIN_VENUES_TO_PUBLISH = 3;

function headlineFor(
  kind: DimensionKind,
  pluralLabel: string,
  cityName: string,
): string {
  switch (kind) {
    case "vibe":
      return `${capitalize(pluralLabel)} in ${cityName}`;
    case "category":
      return `Best ${pluralLabel} in ${cityName} for a date`;
    case "for":
      return `Best ${pluralLabel} in ${cityName}`;
  }
}

function intro(
  kind: DimensionKind,
  pluralLabel: string,
  cityName: string,
  count: number,
): string {
  const base = `${count} ${pluralLabel} in ${cityName}, ranked by Melly Score.`;
  switch (kind) {
    case "vibe":
      return `${base} Atmosphere does a lot of work on a date — these venues nail it.`;
    case "category":
      return `${base} Vetted by real people for date energy, not by paid placement.`;
    case "for":
      return `${base} The spots people actually pick for the right occasion.`;
  }
}

export async function buildDimensionMetadata(opts: {
  kind: DimensionKind;
  citySlug: string;
  dimensionSlug: string;
}): Promise<Metadata> {
  const { kind, citySlug, dimensionSlug } = opts;
  const dim = findDimension(kind, dimensionSlug);
  const cityRow = await getCityBySlug(citySlug);
  if (!dim || !cityRow) return { title: "Not found" };

  const url = absoluteUrl(dimensionPath(citySlug, kind, dimensionSlug));
  const venues = await getVenuesForCity(citySlug);
  const matched = filterByDimension(venues, kind, dimensionSlug);

  // 404 if too thin — don't surface empty pages to Google.
  if (matched.length < (dim.minVenues ?? MIN_VENUES_TO_PUBLISH)) {
    return { title: "Not found", robots: { index: false } };
  }

  const title = headlineFor(kind, dim.pluralLabel, cityRow.city);
  const description = buildDimensionMeta({
    cityName: cityRow.city,
    dimensionLabel: dim.pluralLabel,
    count: matched.length,
  });

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary", title, description },
  };
}

export async function renderDimensionPage(opts: {
  kind: DimensionKind;
  citySlug: string;
  dimensionSlug: string;
}) {
  const { kind, citySlug, dimensionSlug } = opts;
  const dim = findDimension(kind, dimensionSlug);
  const cityRow = await getCityBySlug(citySlug);
  if (!dim || !cityRow) notFound();

  const allVenues = await getVenuesForCity(citySlug);
  const matched = filterByDimension(allVenues, kind, dimensionSlug);

  if (matched.length < (dim.minVenues ?? MIN_VENUES_TO_PUBLISH)) notFound();

  // Re-derive filter options from the matched subset so chips reflect
  // what's actually available within this dimension (cleaner UX than
  // showing options that filter to zero).
  const { deriveFilterOptions } = await import("@/lib/date-spots");
  const filterOptions = deriveFilterOptions(matched);

  const url = absoluteUrl(dimensionPath(citySlug, kind, dimensionSlug));
  const headline = headlineFor(kind, dim.pluralLabel, cityRow.city);

  const breadcrumbs = buildBreadcrumbSchema([
    homeCrumb(),
    dateSpotsCrumb(),
    cityCrumb(citySlug, cityRow.city),
    { name: capitalize(dim.pluralLabel), url },
  ]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: headline,
    itemListElement: matched.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/date-spots/${citySlug}/${v.slug}`),
      name: v.name,
    })),
  };

  const cousins = relatedDimensions(kind, dimensionSlug);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-gray-900">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/date-spots" className="hover:text-pink-500">
            The Melly List
          </Link>{" "}
          <span className="mx-1">/</span>{" "}
          <Link
            href={`/date-spots/${citySlug}`}
            className="hover:text-pink-500"
          >
            {cityRow.city}
          </Link>{" "}
          <span className="mx-1">/</span> {capitalize(dim.pluralLabel)}
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-xs font-bold text-pink-500 tracking-[0.2em] uppercase mb-3">
            {cityRow.city} · {labelForKind(kind)}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 leading-[1.05]">
            {headline}
          </h1>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
            {intro(kind, dim.pluralLabel, cityRow.city, matched.length)}
          </p>
          <p className="text-xs text-gray-400 mt-3">
            {dim.description.charAt(0).toUpperCase() + dim.description.slice(1)}
            .
          </p>
        </header>

        {/* Cross-promo: related dimension pages for internal linking */}
        {cousins.length > 0 && (
          <section
            aria-labelledby="cousins-heading"
            className="mb-8 p-5 rounded-2xl bg-white border border-gray-200"
          >
            <h2
              id="cousins-heading"
              className="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] mb-3"
            >
              You might also like
            </h2>
            <div className="flex flex-wrap gap-2">
              {cousins.map((c) => {
                const otherKind = inferKind(c.slug, kind);
                return (
                  <Link
                    key={`${otherKind}-${c.slug}`}
                    href={dimensionPath(citySlug, otherKind, c.slug)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-50 text-gray-700 border border-gray-200 hover:border-pink-300 hover:text-pink-500 transition capitalize"
                  >
                    {c.pluralLabel} in {cityRow.city}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <CityListWithMap
          citySlug={citySlug}
          cityName={cityRow.city}
          venues={matched}
          options={filterOptions}
        />

        {/* Tail link back to the city hub for internal linking */}
        <div className="mt-12 text-center">
          <Link
            href={`/date-spots/${citySlug}`}
            className="text-sm font-bold text-pink-500 hover:text-pink-600"
          >
            ← See the full {cityRow.city} list
          </Link>
        </div>
      </main>
      <Footer />
      <JsonLd id="ld-dim-itemlist" data={itemList} />
      <JsonLd id="ld-dim-breadcrumbs" data={breadcrumbs} />
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function labelForKind(kind: DimensionKind): string {
  switch (kind) {
    case "vibe":
      return "By vibe";
    case "category":
      return "By type";
    case "for":
      return "By occasion";
  }
}

/**
 * relatedDimensions() returns entries from multiple kinds; we need to
 * route each one to its correct URL. Quick lookup by checking which
 * dimension list contains the slug.
 */
function inferKind(slug: string, fallback: DimensionKind): DimensionKind {
  const kinds: DimensionKind[] = ["vibe", "category", "for"];
  for (const k of kinds) {
    if (findDimension(k, slug)) return k;
  }
  return fallback;
}
