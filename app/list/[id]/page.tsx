// app/list/[id]/page.tsx
//
// Public, read-only shared-list page. Token-gated (?t=<token>); the token is the
// access grant. See SHARE_SYSTEM_SPEC.md (social-app repo).

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DownloadCTA } from "@/components/share/DownloadCTA";
import { PlaceCard } from "@/components/share/PlaceCard";
import { AvatarStack } from "@/components/share/Avatar";
import { Unavailable } from "@/components/share/Unavailable";
import { getSharedList, readToken, type SharedList } from "@/lib/share";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic"; // token-gated, per-request reads

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** "saved by Maya +2" style attribution from the member list. */
function bylineFrom(data: SharedList): string {
  const owner = data.members.find((m) => m.role === "owner") ?? data.members[0];
  const ownerName = owner?.display_name || owner?.handle || "someone";
  const others = Math.max(0, data.members.length - 1);
  return others > 0 ? `${ownerName} +${others}` : ownerName;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const token = readToken(await searchParams);
  if (!token) return { title: "Shared list" };

  const data = await getSharedList(token);
  if (!data) return { title: "Shared list" };

  const count = data.items.length;
  const title = data.list.name;
  const description =
    data.list.description?.trim() ||
    `${count} ${count === 1 ? "place" : "places"} · saved by ${bylineFrom(data)}`;
  const image = data.items.find((i) => i.photo_url)?.photo_url ?? undefined;
  const canonical = absoluteUrl(`/list/${id}?t=${encodeURIComponent(token)}`);

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

export default async function SharedListPage({ params, searchParams }: PageProps) {
  await params; // id is carried in the URL; the token is the access grant
  const token = readToken(await searchParams);
  if (!token) return <Unavailable />;

  const data = await getSharedList(token);
  if (!data) return <Unavailable />;

  const { list, members, items } = data;
  const count = items.length;

  return (
    <div className="min-h-screen bg-pink-50/30">
      <Navbar position="sticky" variant="inner" />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:pt-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-500">Shared list</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {list.name}
          </h1>
          {list.description && (
            <p className="mt-2 max-w-2xl text-gray-500">{list.description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {members.length > 0 && (
              <div className="flex items-center gap-2">
                <AvatarStack
                  people={members.map((m) => ({
                    display_name: m.display_name,
                    handle: m.handle,
                    photo_path: m.photo_path,
                  }))}
                  size={28}
                />
                <span className="text-sm text-gray-500">{bylineFrom(data)}</span>
              </div>
            )}
            <span className="text-sm text-gray-400">
              {count} {count === 1 ? "place" : "places"}
            </span>
          </div>
        </div>

        {count > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PlaceCard key={item.place_id} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-pink-100 bg-white p-8 text-center text-gray-500">
            This list doesn&apos;t have any places yet.
          </p>
        )}

        <DownloadCTA
          context={`Save these ${count > 0 ? count + " " : ""}places, add your own, and plan something with friends — all in ${SITE_NAME}.`}
        />
      </main>

      <Footer />
    </div>
  );
}
