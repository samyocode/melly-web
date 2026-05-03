// components/OpenStatus.tsx
//
// Derives "Open now" / "Closed" / "Opens at X" from a venue's opening_hours
// data. Renders as a small status badge with a colored dot.
//
// The opening_hours format from Google Places (stored in places_catalog):
//   {
//     periods: [
//       { open: { day: 0, hour: 11, minute: 30 }, close: { day: 1, hour: 1, minute: 0 } },
//       ...
//     ],
//     weekdayDescriptions: [...]
//   }
// where day is 0=Sunday..6=Saturday in the venue's local time.
//
// This is a Server Component — the status is computed at request time on
// the server. That means it'll be off by ~1 hour due to revalidation
// (acceptable; we cache page renders for 1 hour).
//
// IMPORTANT — timezone caveat: the periods are in venue-local time, but
// we don't know the venue's timezone. We approximate by using the user's
// browser-equivalent (UTC on server, since this is SSR). For a Bangkok
// venue viewed by a Bangkok user, this is fine. For cross-timezone use
// it'll drift. Good enough for v1; revisit if you add many international
// venues.

type Period = {
  open?: { day?: number; hour?: number; minute?: number; time?: string };
  close?: { day?: number; hour?: number; minute?: number; time?: string };
};

type OpeningHours = {
  periods?: Period[];
  weekday_text?: string[];
  weekdayDescriptions?: string[];
};

type Status =
  | { kind: "open"; closesAt: string }
  | { kind: "closed_today" }
  | { kind: "closed_now"; opensAt: string; opensDay?: string }
  | { kind: "closed_tomorrow"; opensAt: string }
  | { kind: "unknown" };

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

const SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function periodToMinutes(
  day: number | undefined,
  hour: number | undefined,
  minute: number | undefined,
): number | null {
  if (day == null || hour == null) return null;
  return day * 24 * 60 + hour * 60 + (minute ?? 0);
}

function formatHM(hour: number, minute: number): string {
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? "AM" : "PM";
  const m = minute.toString().padStart(2, "0");
  return `${h12}:${m} ${ampm}`;
}

function computeStatus(raw: unknown, now: Date): Status {
  if (!raw || typeof raw !== "object") return { kind: "unknown" };
  const oh = raw as OpeningHours;
  if (!oh.periods || oh.periods.length === 0) return { kind: "unknown" };

  // Special case: 24-hour venues encode as a single period { open: { day: 0, hour: 0 } }
  // with no close. Treat as always open.
  if (
    oh.periods.length === 1 &&
    oh.periods[0].open?.day === 0 &&
    oh.periods[0].open?.hour === 0 &&
    !oh.periods[0].close
  ) {
    return { kind: "open", closesAt: "open 24h" };
  }

  const nowDay = now.getUTCDay();
  const nowMin = nowDay * 24 * 60 + now.getUTCHours() * 60 + now.getUTCMinutes();

  // Build absolute-minute ranges within the week. Periods that cross midnight
  // (close.day != open.day) are handled by their natural [open, close] range
  // since close minutes will be > open minutes.
  type Range = { start: number; end: number; openHour: number; openMin: number; openDay: number; closeHour: number; closeMin: number };
  const ranges: Range[] = [];
  for (const p of oh.periods) {
    const start = periodToMinutes(p.open?.day, p.open?.hour, p.open?.minute);
    if (start == null) continue;
    const closeDay = p.close?.day ?? p.open!.day!;
    const closeHour = p.close?.hour ?? 23;
    const closeMin = p.close?.minute ?? 59;
    const end = periodToMinutes(closeDay, closeHour, closeMin) ?? start;
    // If period crosses midnight into next week (e.g. Sat night -> Sun morning),
    // wrap the end past day 7.
    const adjustedEnd = end <= start ? end + 7 * 24 * 60 : end;
    ranges.push({
      start,
      end: adjustedEnd,
      openHour: p.open!.hour!,
      openMin: p.open!.minute ?? 0,
      openDay: p.open!.day!,
      closeHour,
      closeMin,
    });
  }

  if (ranges.length === 0) return { kind: "unknown" };

  // Check if any range contains nowMin (or nowMin + 7*24*60 for wrap cases).
  const nowMinExtended = nowMin + 7 * 24 * 60;
  for (const r of ranges) {
    if ((nowMin >= r.start && nowMin < r.end) ||
        (nowMinExtended >= r.start && nowMinExtended < r.end)) {
      return {
        kind: "open",
        closesAt: formatHM(r.closeHour, r.closeMin),
      };
    }
  }

  // Closed. Find the next open time.
  const futureRanges = ranges
    .map((r) => {
      let delta = r.start - nowMin;
      if (delta < 0) delta += 7 * 24 * 60;
      return { ...r, delta };
    })
    .sort((a, b) => a.delta - b.delta);

  const next = futureRanges[0];
  if (!next) return { kind: "unknown" };

  const opensAt = formatHM(next.openHour, next.openMin);

  // Same day = "Opens at 5:00 PM"
  if (next.delta < (24 * 60 - now.getUTCHours() * 60 - now.getUTCMinutes())) {
    return { kind: "closed_now", opensAt };
  }
  // Tomorrow
  const oneDay = 24 * 60;
  const minsLeftToday = oneDay - (now.getUTCHours() * 60 + now.getUTCMinutes());
  if (next.delta < minsLeftToday + oneDay) {
    return { kind: "closed_tomorrow", opensAt };
  }
  // Later this week
  return {
    kind: "closed_now",
    opensAt,
    opensDay: SHORT_DAY_NAMES[next.openDay],
  };
}

export default function OpenStatus({
  openingHours,
  className = "",
}: {
  openingHours: unknown;
  className?: string;
}) {
  const status = computeStatus(openingHours, new Date());

  if (status.kind === "unknown") return null;

  const { dotClass, label, suffix } = renderParts(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} aria-hidden />
      <span className="text-gray-700 font-bold">{label}</span>
      {suffix && <span className="text-gray-400">{suffix}</span>}
    </span>
  );
}

function renderParts(status: Status): { dotClass: string; label: string; suffix?: string } {
  switch (status.kind) {
    case "open":
      return {
        dotClass: "bg-emerald-500",
        label: "Open now",
        suffix: status.closesAt === "open 24h" ? "· 24 hours" : `· closes ${status.closesAt}`,
      };
    case "closed_now":
      return {
        dotClass: "bg-amber-500",
        label: "Closed",
        suffix: status.opensDay
          ? `· opens ${status.opensDay} ${status.opensAt}`
          : `· opens ${status.opensAt}`,
      };
    case "closed_tomorrow":
      return {
        dotClass: "bg-amber-500",
        label: "Closed",
        suffix: `· opens tomorrow ${status.opensAt}`,
      };
    case "closed_today":
      return {
        dotClass: "bg-gray-400",
        label: "Closed today",
      };
    default:
      return { dotClass: "bg-gray-300", label: "Hours unknown" };
  }
}

// Export the computeStatus function too so it can be used in metadata
// or other server-side contexts (e.g., FAQ generation).
export { computeStatus, DAY_NAMES };
