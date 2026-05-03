// components/MellyListSeal.tsx
//
// Inclusion mark for venues that made The Melly List. Inspired by
// Michelin's recommended seal — small, recognizable, repeatable.

import MellyOrb from "./MellyOrb";

type Variant = "compact" | "default" | "hero";

const sizes: Record<Variant, { orb: number; text: string; padding: string }> = {
  compact: { orb: 14, text: "text-[10px]", padding: "px-2 py-1" },
  default: { orb: 16, text: "text-xs", padding: "px-2.5 py-1.5" },
  hero: { orb: 20, text: "text-sm", padding: "px-3 py-1.5" },
};

export default function MellyListSeal({
  variant = "default",
}: {
  variant?: Variant;
}) {
  const s = sizes[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gray-900 text-white font-bold tracking-[0.1em] uppercase ${s.padding} ${s.text}`}
      aria-label="On The Melly List"
    >
      <MellyOrb size={s.orb} />
      On The List
    </span>
  );
}
