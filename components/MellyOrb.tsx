// components/MellyOrb.tsx
//
// A pure-CSS recreation of the React Native Orb component.
// Uses the exact 6-stop gradient from palette.orb.gradient.
// Drop-in replacement anywhere you need Melly's avatar.

"use client";

interface MellyOrbProps {
  size?: number;
  className?: string;
}

export default function MellyOrb({ size = 32, className = "" }: MellyOrbProps) {
  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(
            135deg,
            #fff1f7 0%,
            #fce7f3 25%,
            #f9a8d4 50%,
            #f472b6 70%,
            #ec4899 85%,
            #db2777 100%
          )`,
          boxShadow: "0 1px 4px rgba(233, 30, 99, 0.15)",
        }}
      />
      {/* Subtle inner highlight for depth */}
      <div
        className="absolute rounded-full"
        style={{
          top: "10%",
          left: "10%",
          width: "35%",
          height: "35%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
    </div>
  );
}
