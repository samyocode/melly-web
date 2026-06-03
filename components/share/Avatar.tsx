// components/share/Avatar.tsx

import { mediaUrl } from "@/lib/share";

function initials(name: string | null, handle: string | null): string {
  const source = name?.trim() || handle?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function Avatar({
  photoPath,
  name,
  handle,
  size = 32,
}: {
  photoPath: string | null;
  name: string | null;
  handle: string | null;
  size?: number;
}) {
  const url = mediaUrl(photoPath);
  return (
    <span
      className="inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-pink-100 bg-pink-50 text-pink-500"
      style={{ width: size, height: size }}
      title={name ?? handle ?? undefined}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name ?? handle ?? "avatar"}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        <span style={{ fontSize: size * 0.36 }} className="font-semibold">
          {initials(name, handle)}
        </span>
      )}
    </span>
  );
}

/** Overlapping avatar stack for contributor rows. */
export function AvatarStack({
  people,
  max = 5,
  size = 28,
}: {
  people: {
    display_name: string | null;
    handle: string | null;
    photo_path: string | null;
  }[];
  max?: number;
  size?: number;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className="flex items-center">
      {shown.map((p, i) => (
        <span
          key={`${p.handle ?? p.display_name ?? "p"}-${i}`}
          style={{ marginLeft: i === 0 ? 0 : -size * 0.3 }}
        >
          <Avatar
            photoPath={p.photo_path}
            name={p.display_name}
            handle={p.handle}
            size={size}
          />
        </span>
      ))}
      {extra > 0 && (
        <span
          className="inline-grid place-items-center rounded-full border border-pink-100 bg-pink-50 text-xs font-semibold text-pink-500"
          style={{ width: size, height: size, marginLeft: -size * 0.3 }}
        >
          +{extra}
        </span>
      )}
    </span>
  );
}
