// lib/date-itinerary.ts
//
// Build "Make a night of it" itinerary suggestions: 2-3 venue sequences
// that flow naturally for a date (drinks -> dinner -> dessert/nightcap).
//
// Inputs:
//   - The focal venue (the one being viewed)
//   - A list of nearby venues (already filtered to walking distance by
//     the caller — we don't refetch)
//   - Optional: paired venues from venue_pair_affinity (preferred when present)
//
// Output: 0-3 sequences, each 2-3 stops, ordered by quality.

import type { Venue } from "./date-spots-display";
import { distanceMeters, walkingMinutes } from "./google-maps";

export type ItineraryStop = {
  venue: Venue;
  role: "drinks" | "dinner" | "dessert" | "coffee" | "activity";
  walkMinutesFromPrev?: number;
};

export type Itinerary = {
  id: string;
  title: string;
  blurb: string;
  stops: ItineraryStop[];
  totalWalkMinutes: number;
};

// Categorize a venue into a "role" in a date sequence based on what it serves
// + its place_types + time_of_day_fit. This is heuristic and intentionally
// loose — most venues can play multiple roles. We pick the strongest signal.
function detectRole(v: Venue): ItineraryStop["role"] {
  const types = (v.place_types ?? []).join(" ").toLowerCase();
  const cat = (v.primary_category ?? "").toLowerCase();
  const time = v.time_of_day_fit ?? [];

  // Cafe / bakery / coffee = "coffee" role
  if (/cafe|coffee|bakery|patisserie/i.test(types + cat)) {
    return "coffee";
  }

  // Cocktail bar / wine bar / lounge = "drinks"
  if (/cocktail|wine_bar|lounge|night_club/i.test(types + cat)) {
    return "drinks";
  }

  // Restaurants = "dinner" if they serve dinner, otherwise based on time
  if (/restaurant|izakaya|bistro/i.test(types + cat)) {
    if (v.serves_dinner === true) return "dinner";
    if (v.serves_brunch === true) return "coffee"; // daytime
    return "dinner";
  }

  // Bars that serve food = could be either drinks or dinner; default drinks
  if (/^bar$|brewery|tavern|pub/i.test(types + cat)) return "drinks";

  // Anything else with serves_dinner = dinner
  if (v.serves_dinner === true) return "dinner";

  // Time-based fallback
  if (time.includes("evening")) return "drinks";
  if (time.includes("morning") || time.includes("day")) return "coffee";

  return "activity";
}

// Walking-distance threshold for itinerary stops. Beyond this, the
// "walk between" framing breaks down.
const MAX_WALK_METERS = 1200; // ~15 min walk

const SEQUENCE_PATTERNS: Array<{
  pattern: ItineraryStop["role"][];
  title: string;
  blurb: string;
}> = [
  {
    pattern: ["drinks", "dinner"],
    title: "Cocktails, then dinner",
    blurb:
      "Start with a drink to take the edge off, then sit down for the meal.",
  },
  {
    pattern: ["dinner", "drinks"],
    title: "Dinner, then a nightcap",
    blurb: "Eat first while you're hungry, end the night somewhere quieter.",
  },
  {
    pattern: ["coffee", "activity"],
    title: "Coffee and a wander",
    blurb: "Daytime date — coffee to start, somewhere to walk together after.",
  },
  {
    pattern: ["drinks", "dinner", "drinks"],
    title: "The full evening",
    blurb: "Drinks, dinner, and one more round somewhere new.",
  },
  {
    pattern: ["coffee", "drinks"],
    title: "Afternoon into evening",
    blurb: "Coffee in the late afternoon, drinks once the sun's down.",
  },
];

export function buildItineraries(opts: {
  focal: Venue;
  candidates: Venue[];
  maxItineraries?: number;
}): Itinerary[] {
  const { focal, candidates, maxItineraries = 3 } = opts;

  // Annotate each candidate with role + distance from focal.
  const focalRole = detectRole(focal);
  const annotated = candidates
    .filter((c) => c.id !== focal.id)
    .map((c) => ({
      venue: c,
      role: detectRole(c),
      meters: distanceMeters(
        { lat: focal.lat, lng: focal.lng },
        { lat: c.lat, lng: c.lng },
      ),
    }))
    .filter((c) => c.meters <= MAX_WALK_METERS)
    .sort((a, b) => a.meters - b.meters);

  if (annotated.length === 0) return [];

  // For each pattern, see if focal + candidates can fill it.
  const built: Itinerary[] = [];
  let idCounter = 0;

  for (const { pattern, title, blurb } of SEQUENCE_PATTERNS) {
    // The focal venue must occupy one of the pattern slots.
    const focalSlots = pattern
      .map((role, idx) => ({ role, idx }))
      .filter((s) => s.role === focalRole);

    if (focalSlots.length === 0) continue;

    for (const { idx: focalIdx } of focalSlots) {
      // Pick candidates for the other slots.
      const stopsByIdx: Array<ItineraryStop | null> = pattern.map(() => null);
      stopsByIdx[focalIdx] = { venue: focal, role: focalRole };

      const usedIds = new Set<string>([focal.id]);

      let canFill = true;
      for (let i = 0; i < pattern.length; i++) {
        if (stopsByIdx[i]) continue;
        const needed = pattern[i];
        const pick = annotated.find(
          (c) => c.role === needed && !usedIds.has(c.venue.id),
        );
        if (!pick) {
          canFill = false;
          break;
        }
        stopsByIdx[i] = { venue: pick.venue, role: pick.role };
        usedIds.add(pick.venue.id);
      }

      if (!canFill) continue;

      // Compute walking minutes between consecutive stops.
      const stops = stopsByIdx.filter((s): s is ItineraryStop => s !== null);
      let totalWalk = 0;
      for (let i = 1; i < stops.length; i++) {
        const m = distanceMeters(
          { lat: stops[i - 1].venue.lat, lng: stops[i - 1].venue.lng },
          { lat: stops[i].venue.lat, lng: stops[i].venue.lng },
        );
        const mins = walkingMinutes(m);
        stops[i].walkMinutesFromPrev = mins;
        totalWalk += mins;
      }

      built.push({
        id: `itin-${idCounter++}`,
        title,
        blurb,
        stops,
        totalWalkMinutes: totalWalk,
      });
    }
  }

  // Dedupe by stop sequence (some patterns produce duplicate sequences).
  const seen = new Set<string>();
  const unique = built.filter((it) => {
    const key = it.stops.map((s) => s.venue.id).join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Rank: shorter walk = better, more stops = slightly better.
  unique.sort((a, b) => {
    const scoreA = a.stops.length * 10 - a.totalWalkMinutes;
    const scoreB = b.stops.length * 10 - b.totalWalkMinutes;
    return scoreB - scoreA;
  });

  return unique.slice(0, maxItineraries);
}

export function roleLabel(role: ItineraryStop["role"]): string {
  switch (role) {
    case "drinks":
      return "Drinks";
    case "dinner":
      return "Dinner";
    case "dessert":
      return "Dessert";
    case "coffee":
      return "Coffee";
    case "activity":
      return "Wander";
  }
}

export function roleEmoji(role: ItineraryStop["role"]): string {
  switch (role) {
    case "drinks":
      return "🍸";
    case "dinner":
      return "🍽️";
    case "dessert":
      return "🍰";
    case "coffee":
      return "☕";
    case "activity":
      return "🚶";
  }
}
