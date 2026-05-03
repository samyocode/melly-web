// components/AppTeases.tsx
//
// Three small contextual CTAs that appear at different points in the
// venue page. The principle: pitch the app at the moment of intent,
// not as a generic interruption.
//
// 1. SaveThisTease — appears under the venue title. The moment someone is
//    deciding "is this a place I'd save?" — that's the moment to offer them
//    a way to save it.
//
// 2. MatchesSavedThisTease — appears in the proof strip area. Implies
//    network effect: people are here, you're missing them.
//
// 3. PlanThisTease — appears under the itinerary section (or on its own if
//    no itinerary built). Pitches the planning feature specifically, which
//    is what the website's content has just primed the user to want.

import Link from "next/link";

const APP_DEEP_LINK = "#download"; // replace with deep link or store URL when ready

export function SaveThisTease({ venueName }: { venueName: string }) {
  return (
    <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs">
      <span className="text-pink-600 font-medium">
        Save {venueName} to plan with someone?
      </span>
      <Link
        href={APP_DEEP_LINK}
        className="text-pink-700 font-bold hover:text-pink-800 underline underline-offset-2"
      >
        Open in Melly
      </Link>
    </div>
  );
}

export function MatchesSavedThisTease({
  cityName,
  saveCount,
}: {
  cityName: string;
  saveCount: number;
}) {
  // Only show if there's enough community signal to make this credible.
  // Below 3 saves the framing falls flat.
  if (saveCount < 3) return null;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-white border border-gray-200">
      <div className="flex items-center gap-3">
        {/* Blurred avatar stack for social proof. Real product would
            populate from public_profiles, but visual implication is enough. */}
        <div className="flex -space-x-2 flex-shrink-0">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white"
              style={{
                backgroundImage: `linear-gradient(135deg, hsl(${330 + i * 15}, 70%, 80%) 0%, hsl(${340 + i * 15}, 65%, 65%) 100%)`,
                filter: "blur(0.5px)",
              }}
              aria-hidden
            />
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">
            {saveCount}{" "}
            {saveCount === 1 ? "person" : "people"} in {cityName} saved this
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            See who you&apos;d vibe with based on quiz results
          </p>
        </div>
        <Link
          href={APP_DEEP_LINK}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-bold text-white bg-pink-500 rounded-full hover:bg-pink-600 transition"
        >
          Open Melly
        </Link>
      </div>
    </div>
  );
}

export function PlanThisTease({
  venueName,
  hasItinerary,
}: {
  venueName: string;
  hasItinerary: boolean;
}) {
  // Different copy depending on whether the user just saw an itinerary card
  // (in which case the pitch is "build your own") vs. didn't (in which case
  // the pitch is "Melly does this for you").
  const copy = hasItinerary
    ? `Build a custom date plan around ${venueName}`
    : `Plan a date around ${venueName} — Melly handles the rest`;

  return (
    <div className="mb-6 p-4 rounded-2xl bg-stone-50 border border-gray-200 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex-shrink-0 flex items-center justify-center text-white text-base">
          ✨
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{copy}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Drag, drop, share with your match
          </p>
        </div>
      </div>
      <Link
        href={APP_DEEP_LINK}
        className="flex-shrink-0 px-3 py-1.5 text-xs font-bold text-pink-600 hover:text-pink-700"
      >
        Open Melly →
      </Link>
    </div>
  );
}
