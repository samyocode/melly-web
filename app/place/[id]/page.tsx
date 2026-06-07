// app/place/[id]/page.tsx
//
// Public, read-only place page. Reached from a share link
// (/place/<id>?t=<token>) or directly — places are public-by-construction, so
// the read is by entity uuid via the anon `seo_get_place` RPC (NOT token-gated
// like lists). The token, when present, is carried only for the canonical URL.

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DownloadCTA } from "@/components/share/DownloadCTA";
import { Unavailable } from "@/components/share/Unavailable";
import {
  getSharedPlace,
  categoryLabel,
  readToken,
  type SharedPlace,
} from "@/lib/share";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic"; // per-request reads

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function metaLine(place: SharedPlace): string {
  return [categoryLabel(place.category), place.city].filter(Boolean).join(" · ");
}

function mapsUrl(place: SharedPlace): string {
  if (place.lat != null && place.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  }
  const q = [place.name, place.address, place.city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const token = readToken(await searchParams);

  const place = await getSharedPlace(id);
  if (!place) return { title: "Place" };

  const title = place.name;
  const description =
    place.description?.trim() || metaLine(place) || `A place on ${SITE_NAME}`;
  const canonical = absoluteUrl(
    token ? `/place/${id}?t=${encodeURIComponent(token)}` : `/place/${id}`,
  );

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url: canonical,
      images: place.photo_url ? [{ url: place.photo_url }] : undefined,
    },
    twitter: {
      card: place.photo_url ? "summary_large_image" : "summary",
      title: `${title} · ${SITE_NAME}`,
      description,
      images: place.photo_url ? [place.photo_url] : undefined,
    },
  };
}

export default async function SharedPlacePage({ params }: PageProps) {
  const { id } = await params;

  const place = await getSharedPlace(id);
  if (!place) {
    return (
      <Unavailable
        title="This place isn't available"
        message="It may have been removed. If someone shared this with you, ask them for a fresh link."
      />
    );
  }

  const meta = metaLine(place);

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Navbar position="sticky" variant="inner" />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:pt-10">
        {place.photo_url && (
          <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-pink-100 bg-pink-50 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.photo_url}
              alt={place.name}
              className="h-full w-full object-cover"
            />
            {place.is_curated && (
              <span className="absolute left-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Curated
              </span>
            )}
          </div>
        )}

        <p className="text-sm font-semibold text-pink-500">Place</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {place.name}
        </h1>
        {meta && <p className="mt-2 text-gray-500">{meta}</p>}

        {(place.loved_count > 0 || place.rating_count > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {place.loved_count > 0 && (
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-pink-600 shadow-sm ring-1 ring-pink-100">
                ❤️ Loved by {place.loved_count}
              </span>
            )}
            {place.rating_count > 0 && (
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-pink-100">
                {place.rating_count}{" "}
                {place.rating_count === 1 ? "rating" : "ratings"}
              </span>
            )}
          </div>
        )}

        {place.description && (
          <p className="mt-6 max-w-2xl leading-relaxed text-gray-700">
            {place.description}
          </p>
        )}

        {place.address && (
          <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Address
            </p>
            <p className="mt-1 text-gray-800">{place.address}</p>
            <a
              href={mapsUrl(place)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-pink-500 hover:text-pink-600"
            >
              View on map →
            </a>
          </div>
        )}

        <DownloadCTA />
      </main>

      <Footer />
    </div>
  );
}
