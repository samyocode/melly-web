// app/event/[id]/page.tsx
//
// Public, read-only event page. Reached from a share link
// (/event/<id>?t=<token>) or directly. Read by entity uuid via the anon
// `seo_get_event` RPC, which returns moderation-cleared events only — a pending/
// rejected event resolves to null and renders the Unavailable dead-end (the
// moderation render-surface invariant). The token, when present, is carried only
// for the canonical URL.

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DownloadCTA } from "@/components/share/DownloadCTA";
import { Unavailable } from "@/components/share/Unavailable";
import { getSharedEvent, readToken, type SharedEvent } from "@/lib/share";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic"; // per-request reads

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "long",
  day: "numeric",
  year: "numeric",
});
const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

/** "Sat, March 15, 2026 · 7:00 PM – 10:00 PM" (end shown only when present). */
function whenLine(ev: SharedEvent): string {
  const start = new Date(ev.starts_at);
  const date = DATE_FMT.format(start);
  let time = TIME_FMT.format(start);
  if (ev.ends_at) time += ` – ${TIME_FMT.format(new Date(ev.ends_at))}`;
  return `${date} · ${time}`;
}

function mapsUrl(ev: SharedEvent): string {
  const place = ev.place;
  if (place?.lat != null && place?.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  }
  if (ev.lat != null && ev.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${ev.lat},${ev.lng}`;
  }
  const q = [place?.name, place?.address, ev.city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const token = readToken(await searchParams);

  const ev = await getSharedEvent(id);
  if (!ev) return { title: "Event" };

  const title = ev.label;
  const description = whenLine(ev) + (ev.city ? ` · ${ev.city}` : "");
  const image = ev.place?.photo_url ?? undefined;
  const canonical = absoluteUrl(
    token ? `/event/${id}?t=${encodeURIComponent(token)}` : `/event/${id}`,
  );

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${title} · ${SITE_NAME}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function SharedEventPage({ params }: PageProps) {
  const { id } = await params;

  const ev = await getSharedEvent(id);
  if (!ev) {
    return (
      <Unavailable
        title="This event isn't available"
        message="It may have ended or been removed. If someone shared this with you, ask them for a fresh link."
      />
    );
  }

  const place = ev.place;

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Navbar position="sticky" variant="inner" />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:pt-10">
        {place?.photo_url && (
          <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-pink-100 bg-pink-50 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.photo_url}
              alt={place.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-pink-500">Event</p>
          {ev.is_past && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
              Past
            </span>
          )}
          {ev.is_dating_friendly && (
            <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-600">
              Dating-friendly
            </span>
          )}
        </div>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {ev.label}
        </h1>

        <p className="mt-3 text-base font-medium text-gray-800">{whenLine(ev)}</p>
        {ev.host_name && (
          <p className="mt-1 text-gray-500">Hosted by {ev.host_name}</p>
        )}

        {place && (
          <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Where
            </p>
            <p className="mt-1 font-semibold text-gray-900">{place.name}</p>
            {place.address && (
              <p className="mt-0.5 text-sm text-gray-500">{place.address}</p>
            )}
            <a
              href={mapsUrl(ev)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-pink-500 hover:text-pink-600"
            >
              View on map →
            </a>
          </div>
        )}

        {ev.source_url && (
          <a
            href={ev.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-pink-500 hover:text-pink-600"
          >
            View original{ev.source_platform ? ` on ${ev.source_platform}` : ""} →
          </a>
        )}

        <DownloadCTA />
      </main>

      <Footer />
    </div>
  );
}
