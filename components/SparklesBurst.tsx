// components/SparklesBurst.tsx
//
// CSS-only sparkle burst effect for web.
// Matches the React Native SparklesBurst: 24 emoji particles burst outward
// from center with staggered delays, rotation, and fade-out.

"use client";

import { useEffect, useState } from "react";

const SPARKLE_COUNT = 24;
const SPARKLE_EMOJIS = [
  "✨",
  "⭐",
  "💘",
  "💫",
  "🎉",
  "💖",
  "🪄",
  "🌟",
  "💝",
  "⚡",
  "🩷",
  "🎊",
];

interface Particle {
  id: number;
  emoji: string;
  angle: number;
  distance: number;
  delay: number;
  size: number;
  rotDir: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
    id: i,
    emoji: SPARKLE_EMOJIS[i % SPARKLE_EMOJIS.length],
    angle: (i / SPARKLE_COUNT) * 360 + (Math.random() - 0.5) * 20,
    distance: 80 + Math.random() * 140,
    delay: i * 18,
    size: 18 + Math.random() * 14,
    rotDir: Math.random() > 0.5 ? 1 : -1,
  }));
}

export function SparklesBurst({
  trigger,
  onComplete,
}: {
  trigger: boolean;
  onComplete?: () => void;
}) {
  const [particles] = useState<Particle[]>(() => generateParticles());

  useEffect(() => {
    if (!trigger || !onComplete) return;
    const t = setTimeout(onComplete, 1500);
    return () => clearTimeout(t);
  }, [trigger, onComplete]);

  if (!trigger) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <div className="relative w-full h-full flex items-center justify-center">
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.distance;
          const ty = Math.sin(rad) * p.distance;

          return (
            <span
              key={p.id}
              className="absolute"
              style={{
                fontSize: p.size,
                animation: `sparkleBurst 850ms ${p.delay}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                ["--tx" as string]: `${tx}px`,
                ["--ty" as string]: `${ty}px`,
                ["--rot" as string]: `${p.rotDir * 360}deg`,
                opacity: 0,
              }}
            >
              {p.emoji}
            </span>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes sparkleBurst {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0) rotate(0deg);
          }
          12% {
            opacity: 1;
            transform: translate(calc(var(--tx) * 0.15), calc(var(--ty) * 0.15))
              scale(1.3) rotate(0deg);
          }
          55% {
            opacity: 1;
            transform: translate(calc(var(--tx) * 0.75), calc(var(--ty) * 0.75))
              scale(1) rotate(calc(var(--rot) * 0.6));
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0.2)
              rotate(var(--rot));
          }
        }
      `}</style>
    </div>
  );
}
