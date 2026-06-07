// components/share/PlaceCard.tsx

import { categoryLabel, type SharedItem } from "@/lib/share";
import { AvatarStack } from "@/components/share/Avatar";

function metaLine(item: SharedItem): string {
  return [item.city, categoryLabel(item.category)].filter(Boolean).join(" · ");
}

export function PlaceCard({ item }: { item: SharedItem }) {
  const wantLabel =
    item.contributor_count > 1
      ? `${item.contributor_count} want to go`
      : "Want to go";

  return (
    <article className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-pink-50">
        {item.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.photo_url}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm text-gray-400">
            No photo
          </div>
        )}
        {item.is_overlap && (
          <span className="absolute left-3 top-3 rounded-full bg-pink-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Overlap
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-bold tracking-tight text-gray-900">
          {item.name}
        </h3>
        {metaLine(item) && (
          <p className="mt-0.5 text-sm text-gray-500">{metaLine(item)}</p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-500">{wantLabel}</span>
          {item.contributors?.length > 0 && (
            <AvatarStack people={item.contributors} size={24} max={4} />
          )}
        </div>
      </div>
    </article>
  );
}
