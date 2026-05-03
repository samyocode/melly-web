// app/date-spots/[city]/page.tsx
//
// City hub: top date-friendly venues in one city, sorted by Melly's
// proprietary score. The unique signal here is `date_friendliness_score`
// + aggregated save data — that's what makes this page non-templated.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import {
  getCityBySlug,
  getCitiesWithVenues,
  getVenuesForCity,
  deriveFilterOptions,
} from "@/lib/date-spots";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import VenueListClient from "./VenueListClient";

export const revalidate = 3600;

type Params = Promise<{ city: string }>;

export async function generateStaticParams() {
  const cities = await getCitiesWithVenues();
  return cities.map((c) => ({ city: c.city_slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { city } = await params;
  const cityRow = await getCityBySlug(city);
  if (!cityRow) return { title: "City not found" };

  const title = `The Melly List · ${cityRow.city}`;
  const description = `The Melly List in ${cityRow.city}: ${cityRow.venue_count} venues vetted for date energy, ranked by Melly Score. Restaurants, bars, and experiences scored on how they actually work for a date.`;
  const url = absoluteUrl(`/date-spots/${city}`);

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function CityHubPage({ params }: { params: Params }) {
  const { city } = await params;
  const cityRow = await getCityBySlug(city);
  if (!cityRow) notFound();

  const venues = await getVenuesForCity(city);
  const filterOptions = deriveFilterOptions(venues);
  const url = absoluteUrl(`/date-spots/${city}`);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `The Melly List · ${cityRow.city}`,
    itemListElement: venues.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/date-spots/${city}/${v.slug}`),
      name: v.name,
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "The Melly List",
        item: absoluteUrl("/date-spots"),
      },
      { "@type": "ListItem", position: 3, name: cityRow.city, item: url },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-gray-900">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <nav className="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/date-spots" className="hover:text-pink-500">
            The Melly List
          </Link>{" "}
          <span className="mx-1">/</span> {cityRow.city}
        </nav>

        <header className="mb-8">
          <p className="text-xs font-bold text-pink-500 tracking-[0.2em] uppercase mb-3">
            The Melly List · {cityRow.city}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 leading-[1.05]">
            The {cityRow.city} list
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
            {venues.length} venues that earned a place. Ranked by Melly Score —
            atmosphere, vibe, and what real people save them for.
          </p>
        </header>

        <VenueListClient
          citySlug={city}
          venues={venues}
          options={filterOptions}
        />
      </main>
      <Footer />
      <JsonLd id="ld-city-itemlist" data={itemList} />
      <JsonLd id="ld-city-breadcrumbs" data={breadcrumbs} />
    </div>
  );
}
