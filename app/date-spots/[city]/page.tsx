// app/date-spots/[city]/page.tsx
//
// City hub: top date-friendly venues in one city, sorted by Melly's
// proprietary score. The unique signal here is `date_friendliness_score`
// + aggregated save data — that's what makes this page non-templated.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import {
  getCityBySlug,
  getCitiesWithVenues,
  getVenuesForCity,
  priceLevelLabel,
  formatRating,
  vibeLabel,
} from "@/lib/date-spots";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

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

  const title = `Date Spots in ${cityRow.city}`;
  const description = `${cityRow.venue_count} date-friendly venues in ${cityRow.city}, ranked by Melly users. Restaurants, bars, and experiences picked for how they actually work on a date.`;
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
  const url = absoluteUrl(`/date-spots/${city}`);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Date Spots in ${cityRow.city}`,
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
        name: "Date Spots",
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
            Date Spots
          </Link>{" "}
          <span className="mx-1">/</span> {cityRow.city}
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Best Date Spots in {cityRow.city}
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
            {venues.length} venues in {cityRow.city} ranked by date-friendliness
            — the actual atmosphere, conversation acoustics, and date energy of
            each spot.
          </p>
        </header>

        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {venues.map((v, i) => (
            <li key={v.id}>
              <Link
                href={`/date-spots/${city}/${v.slug}`}
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
                      {v.date_friendliness_score.toFixed(1)} date score
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
      </main>
      <Footer />
      <JsonLd id="ld-city-itemlist" data={itemList} />
      <JsonLd id="ld-city-breadcrumbs" data={breadcrumbs} />
    </div>
  );
}
