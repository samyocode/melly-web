// components/AvatarWithCharmsWeb.tsx
//
// Web port of the React Native AvatarWithCharms component.
// Uses the same slot-angle orbit math and die-cut sticker positioning
// from components/Charms/AvatarWithCharms.tsx.
//
// Slot layout (up to 3 charms):
//   Slot 0 → top-right (45°)
//   Slot 1 → bottom-left (225°)
//   Slot 2 → bottom-right (315°)
//
// Most profiles only equip 2 charms, so slot 2 is rarely used.

"use client";

import React from "react";

// Charm catalog — personality charms with real Cloudinary sticker URLs
const CHARMS = [
  {
    slug: "golden-retriever",
    name: "Golden Retriever",
    desc: "Will double-text and feel nothing",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/golden-retriever.webp",
  },
  {
    slug: "overthinker",
    name: "Overthinker",
    desc: "Already rehearsed the breakup speech for a relationship that doesn't exist",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/overthinker.webp",
  },
  {
    slug: "black-cat",
    name: "Black Cat",
    desc: "Will stare at your message for 4 hours then reply 'lol'",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/black-cat.webp",
  },
  {
    slug: "delulu",
    name: "Delulu",
    desc: "Made eye contact once. Currently picking wedding fonts.",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/delulu.webp",
  },
  {
    slug: "old-soul",
    name: "Old Soul",
    desc: "Will suggest a jazz bar then fall asleep by 10",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/old-soul.webp",
  },
  {
    slug: "down-bad",
    name: "Down Bad",
    desc: "Learned your middle name from a tagged photo from 2019",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/down-bad.webp",
  },
  {
    slug: "main-character",
    name: "Main Character",
    desc: "Has a soundtrack playing in their head at all times",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/main-character.webp",
  },
  {
    slug: "hopeless-romantic",
    name: "Hopeless Case",
    desc: "Still believes in 'the spark' despite all available evidence",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/hopeless-romantic.webp",
  },
  {
    slug: "chaotic-good",
    name: "Chaotic Good",
    desc: "Planned a nice dinner. Somehow you're both on a ferry now.",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/chaotic-good.webp",
  },
  {
    slug: "the-spiral",
    name: "The Spiral",
    desc: "Read receipt is on and it's been 7 minutes. Is this over?",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/the-spiral.webp",
  },
  {
    slug: "hot-mess",
    name: "Hot Mess",
    desc: "Phone at 3%, late to everything, somehow still charming",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/hot-mess.webp",
  },
  {
    slug: "night-owl",
    name: "Night Owl",
    desc: "Will send a thesis on vulnerability at 2:47am then vanish until Thursday",
    icon_url:
      "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/night-owl.webp",
  },
] as const;

export type CharmIndex = number;

// Angles in standard math convention (counter-clockwise from right, Y-up).
// The rendering formula flips Y for screen coords (Y-down), so:
//   45°  → top-right on screen
//   225° → bottom-left on screen
//   315° → bottom-right on screen
const SLOT_ANGLES_DEG = [45, 225, 315];

interface AvatarWithCharmsWebProps {
  imageUrl: string | null | undefined;
  charmIndices?: CharmIndex[];
  size?: number;
  className?: string;
}

export default function AvatarWithCharmsWeb({
  imageUrl,
  charmIndices = [],
  size = 48,
  className,
}: AvatarWithCharmsWebProps) {
  const charmSize = Math.round(size * 0.38);
  const halfCharm = charmSize / 2;
  // Place charm centers on the avatar edge (radius = half avatar + half charm)
  const orbitRadius = size / 2 + halfCharm * 0.45;
  const padding = halfCharm + 4;
  const containerSize = size + padding * 2;

  const positions = charmIndices
    .slice(0, 3)
    .map((ci, idx) => {
      const charm = CHARMS[ci];
      if (!charm) return null;
      const rad = (SLOT_ANGLES_DEG[idx] * Math.PI) / 180;
      return {
        charm,
        // cos gives horizontal offset (positive = right)
        left: containerSize / 2 + orbitRadius * Math.cos(rad) - halfCharm,
        // -sin flips Y from math coords (Y-up) to screen coords (Y-down)
        top: containerSize / 2 - orbitRadius * Math.sin(rad) - halfCharm,
      };
    })
    .filter(Boolean) as {
    charm: (typeof CHARMS)[number];
    left: number;
    top: number;
  }[];

  return (
    <div
      className={className}
      style={{
        width: containerSize,
        height: containerSize,
        position: "relative",
        flexShrink: 0,
        overflow: "visible",
      }}
    >
      {/* Subtle ring when charms are equipped */}
      {positions.length > 0 && (
        <div
          className="absolute rounded-full"
          style={{
            top: (containerSize - size - 6) / 2,
            left: (containerSize - size - 6) / 2,
            width: size + 6,
            height: size + 6,
            border: "1.5px solid rgba(225,29,72,0.18)",
          }}
        />
      )}

      {/* Avatar */}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="absolute rounded-full bg-gray-100 object-cover"
          style={{ top: padding, left: padding, width: size, height: size }}
        />
      ) : (
        <div
          className="absolute rounded-full bg-gray-100 flex items-center justify-center text-gray-400"
          style={{
            top: padding,
            left: padding,
            width: size,
            height: size,
            fontSize: size * 0.4,
          }}
        >
          ?
        </div>
      )}

      {/* Charm stickers */}
      {positions.map(({ charm, left, top }, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={charm.slug + i}
          src={charm.icon_url}
          alt={charm.name}
          title={`${charm.name}: ${charm.desc}`}
          className="absolute z-10 pointer-events-none"
          style={{
            left,
            top,
            width: charmSize,
            height: charmSize,
            filter: "drop-shadow(0 1px 2.5px rgba(0,0,0,0.15))",
          }}
        />
      ))}
    </div>
  );
}

export { CHARMS };
