// app/date-spots/[city]/[venueSlug]/page.tsx
//
// Individual venue page. The on-page content blends Google enrichment
// (editorial_summary, hours, photos) with Melly's proprietary signals
// (date_friendliness_score, public save count, top intents, sample notes).
// The combination is what keeps each page genuinely unique.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import {
  getVenueBySlug,
  getRelatedVenues,
  getCityBySlug,
  amenityList,
  servesList,
  vibeLabel,
  intentLabel,
  priceLevelLabel,
  formatRating,
  type Venue,
} from "@/lib/date-spots";
import {
  SITE_NAME,
  SITE_URL,
  APP_STORE_URL,
  PLAY_STORE_URL,
  absoluteUrl,
} from "@/lib/site";

export const revalidate = 3600;

type Params = Promise<{ city: string; venueSlug: string }>;

// We deliberately don't generateStaticParams here — there are potentially
// thousands of venues, and Next will fall back to on-demand SSR for any
// path not pre-rendered. The sitemap drives crawl coverage instead.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { city, venueSlug } = await params;
  const venue = await getVenueBySlug(city, venueSlug);
  if (!venue) return { title: "Spot not found" };

  const cityName = venue.city ?? "";
  const title = `${venue.name} — Date Spot in ${cityName}`;
  const desc = buildMetaDescription(venue);
  const url = absoluteUrl(`/date-spots/${city}/${venueSlug}`);

  return {
    title: `${title} | ${SITE_NAME}`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: desc,
      siteName: SITE_NAME,
      images: venue.photo_url
        ? [{ url: venue.photo_url, alt: venue.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: venue.photo_url ? [venue.photo_url] : undefined,
    },
  };
}

function buildMetaDescription(v: Venue): string {
  const parts: string[] = [];
  if (v.neighborhood_label) {
    parts.push(`${v.neighborhood_label} spot`);
  } else if (v.primary_category) {
    parts.push(v.primary_category);
  }
  if (v.date_friendliness_score != null) {
    parts.push(`Melly date score ${v.date_friendliness_score.toFixed(1)}`);
  }
  if ((v.public_save_count ?? 0) > 0) {
    parts.push(`saved by ${v.public_save_count} Melly users`);
  }
  if (v.vibe_tags && v.vibe_tags.length > 0) {
    parts.push(v.vibe_tags.slice(0, 2).map(vibeLabel).join(", "));
  }
  const summary = parts.join(" · ");
  if (v.editorial_summary) {
    return `${summary}. ${v.editorial_summary}`.slice(0, 300);
  }
  return summary || `Date spot info for ${v.name}.`;
}

export default async function VenuePage({ params }: { params: Params }) {
  const { city, venueSlug } = await params;
  const venue = await getVenueBySlug(city, venueSlug);
  if (!venue) notFound();

  const cityRow = await getCityBySlug(city);
  const cityName = cityRow?.city ?? venue.city ?? "";

  const related = await getRelatedVenues(
    city,
    venueSlug,
    venue.vibe_tags ?? null,
    4,
  );

  const amenities = amenityList(venue);
  const serves = servesList(venue);
  const url = absoluteUrl(`/date-spots/${city}/${venueSlug}`);

  // schema.org/Restaurant for restaurant-y types, otherwise LocalBusiness.
  const isFood =
    venue.dine_in === true ||
    venue.serves_dinner === true ||
    venue.serves_brunch === true ||
    venue.serves_breakfast === true ||
    (venue.place_types ?? []).some((t) =>
      /restaurant|food|bar|cafe|bakery/i.test(t),
    );

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": isFood ? "Restaurant" : "LocalBusiness",
    name: venue.name,
    url,
    image: venue.photo_url ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: venue.address ?? undefined,
      addressLocality: venue.city ?? undefined,
      addressCountry: venue.country ?? undefined,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: venue.lat,
      longitude: venue.lng,
    },
    aggregateRating:
      venue.rating != null && (venue.user_rating_count ?? 0) > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: venue.rating,
            reviewCount: venue.user_rating_count,
          }
        : undefined,
    priceRange:
      venue.price_level != null
        ? priceLevelLabel(venue.price_level)
        : undefined,
    description: venue.editorial_summary ?? undefined,
    servesCuisine:
      venue.primary_category && isFood ? venue.primary_category : undefined,
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
      {
        "@type": "ListItem",
        position: 3,
        name: cityName,
        item: absoluteUrl(`/date-spots/${city}`),
      },
      { "@type": "ListItem", position: 4, name: venue.name, item: url },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-gray-900">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 sm:px-8 py-6 sm:py-10">
        <nav className="text-sm text-gray-400 mb-5" aria-label="Breadcrumb">
          <Link href="/date-spots" className="hover:text-pink-500">
            Date Spots
          </Link>{" "}
          <span className="mx-1">/</span>{" "}
          <Link
            href={`/date-spots/${city}`}
            className="hover:text-pink-500"
          >
            {cityName}
          </Link>{" "}
          <span className="mx-1">/</span> {venue.name}
        </nav>

        {venue.photo_url && (
          <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden mb-6 bg-gray-100">
            <Image
              src={venue.photo_url}
              alt={venue.name}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 768px"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <header className="mb-6">
          <p className="text-xs font-bold text-pink-500 tracking-[0.15em] uppercase mb-2">
            Date spot · {cityName}
            {venue.neighborhood_label && <> · {venue.neighborhood_label}</>}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {venue.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {venue.date_friendliness_score != null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500 text-white font-bold text-xs">
                {venue.date_friendliness_score.toFixed(1)} Melly date score
              </span>
            )}
            {venue.rating != null && (
              <span>★ {formatRating(venue.rating)}{" "}
                {venue.user_rating_count != null && (
                  <span className="text-gray-400">
                    ({venue.user_rating_count.toLocaleString()})
                  </span>
                )}
              </span>
            )}
            {venue.price_level != null && (
              <span>{priceLevelLabel(venue.price_level)}</span>
            )}
            {venue.primary_category && (
              <span className="capitalize">
                {venue.primary_category.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </header>

        {/* Melly proof strip — the unique signal */}
        {((venue.public_save_count ?? 0) > 0 ||
          (venue.recent_visits_30d ?? 0) > 0) && (
          <section className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(venue.public_save_count ?? 0) > 0 && (
              <Stat
                value={String(venue.public_save_count)}
                label={`Melly user ${venue.public_save_count === 1 ? "save" : "saves"}`}
              />
            )}
            {(venue.recent_visits_30d ?? 0) > 0 && (
              <Stat
                value={String(venue.recent_visits_30d)}
                label="Visited in last 30 days"
              />
            )}
            {venue.top_intents && venue.top_intents.length > 0 && (
              <Stat
                value={intentLabel(venue.top_intents[0])}
                label="Most often saved for"
              />
            )}
          </section>
        )}

        {venue.editorial_summary && (
          <section className="mb-6">
            <p className="text-base text-gray-700 leading-relaxed">
              {venue.editorial_summary}
            </p>
          </section>
        )}

        {(venue.vibe_tags?.length ?? 0) > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Vibe</h2>
            <div className="flex flex-wrap gap-2">
              {(venue.vibe_tags ?? []).map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-full"
                >
                  {vibeLabel(t)}
                </span>
              ))}
            </div>
          </section>
        )}

        {venue.top_intents && venue.top_intents.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2">
              Why Melly users save it
            </h2>
            <div className="flex flex-wrap gap-2">
              {venue.top_intents.map((i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm text-pink-700 bg-pink-50 border border-pink-200 rounded-full"
                >
                  {intentLabel(i)}
                </span>
              ))}
            </div>
          </section>
        )}

        {venue.sample_notes && venue.sample_notes.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3">
              From Melly users
            </h2>
            <div className="space-y-3">
              {venue.sample_notes.slice(0, 3).map((note, idx) => (
                <blockquote
                  key={idx}
                  className="px-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm text-gray-700 italic leading-relaxed"
                >
                  &ldquo;{note}&rdquo;
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {(amenities.length > 0 || serves.length > 0) && (
          <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amenities.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-2">
                  Amenities
                </h2>
                <ul className="text-sm text-gray-600 space-y-1">
                  {amenities.map((a) => (
                    <li key={a}>✓ {a}</li>
                  ))}
                </ul>
              </div>
            )}
            {serves.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-2">
                  Serves
                </h2>
                <ul className="text-sm text-gray-600 space-y-1">
                  {serves.map((s) => (
                    <li key={s}>✓ {s}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {venue.address && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Where</h2>
            <p className="text-sm text-gray-600">{venue.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${venue.name} ${venue.address ?? ""}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm font-medium text-pink-500 hover:underline"
            >
              Open in Google Maps →
            </a>
          </section>
        )}

        {/* App download CTA */}
        <section className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">
            Save spots like this in the Melly app
          </h2>
          <p className="text-sm text-pink-100 mb-4 max-w-md">
            Build your shared list of date spots, see who matches your taste,
            and let Melly handle the planning.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-gray-900 text-sm font-bold hover:bg-stone-100 transition"
            >
              App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-gray-900 text-sm font-bold hover:bg-stone-100 transition"
            >
              Google Play
            </a>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-extrabold mb-4">
              More date spots in {cityName}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/date-spots/${city}/${r.slug}`}
                    className="group flex gap-3 p-3 rounded-2xl bg-white border border-gray-200 hover:border-pink-300 hover:shadow-md transition"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {r.photo_url && (
                        <Image
                          src={r.photo_url}
                          alt={r.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-pink-500 transition-colors leading-tight">
                        {r.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {r.neighborhood_label ?? r.city}
                      </p>
                      {r.vibe_tags && r.vibe_tags.length > 0 && (
                        <p className="text-[11px] text-gray-500 mt-1 truncate">
                          {r.vibe_tags.slice(0, 2).map(vibeLabel).join(" · ")}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
      <JsonLd id="ld-venue-business" data={localBusiness} />
      <JsonLd id="ld-venue-breadcrumbs" data={breadcrumbs} />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-white border border-gray-200">
      <p className="text-lg font-extrabold text-gray-900 leading-tight">
        {value}
      </p>
      <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}
