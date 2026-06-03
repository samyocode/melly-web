// app/[seg]/[id]/page.tsx
//
// Generic share fallback for every entity type whose dedicated web page isn't
// built yet (place / plan / u / event / ranked / post). Two jobs:
//   1. Keep universal links resolving — every AASA path has a web landing so
//      not-installed taps don't 404.
//   2. Validate the token (best-effort) and convert to a download.
// As each `get_shared_*` RPC + page ships, add an explicit route (like /list)
// and this stops being hit for that type.
//
// Static routes (/date-spots, /privacy, /list, …) take precedence over this
// dynamic segment; unknown segments fall through to notFound().

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DownloadCTA } from "@/components/share/DownloadCTA";
import { Unavailable } from "@/components/share/Unavailable";
import { SEGMENT_TO_TYPE, shareNoun, readToken, resolveShareToken } from "@/lib/share";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ seg: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seg } = await params;
  const type = SEGMENT_TO_TYPE[seg];
  if (!type) return {};
  const noun = shareNoun(type);
  return {
    title: `Shared ${noun}`,
    description: `Open this ${noun} in ${SITE_NAME}.`,
  };
}

export default async function GenericSharePage({ params, searchParams }: PageProps) {
  const { seg } = await params;
  const type = SEGMENT_TO_TYPE[seg];
  if (!type) notFound();

  const noun = shareNoun(type);
  const token = readToken(await searchParams);

  // Best-effort validation: if a token is present, confirm it resolves. A
  // missing/invalid token still lands on a friendly download page.
  if (token) {
    const resolved = await resolveShareToken(token);
    if (!resolved) {
      return (
        <Unavailable
          title="This link isn't available"
          message="The link may have expired or been turned off. Ask whoever shared it for a fresh one."
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Navbar position="sticky" variant="inner" />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <p className="text-sm font-semibold text-pink-500">Shared {noun}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Open this {noun} in {SITE_NAME}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-gray-500">
          {SITE_NAME} brings this {noun} to life — with everyone, everything, and
          every plan attached. Get the app to see it.
        </p>
        <DownloadCTA
          context={`See this ${noun} and do something about it — in ${SITE_NAME}.`}
        />
      </main>
      <Footer />
    </div>
  );
}
