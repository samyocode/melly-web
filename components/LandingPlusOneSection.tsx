// components/LandingPlusOneSection.tsx

"use client";

import React, { useState, useCallback } from "react";
import AvatarWithCharmsWeb from "@/components/AvatarWithCharmsWeb";
import type { CharmIndex } from "@/components/AvatarWithCharmsWeb";

// ─── APP DOWNLOAD LINKS (replace when submitted) ───────────────────────────
const APP_LINKS = {
  ios: "#ios",
  android: "#android",
};

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface FakeEvent {
  id: string;
  title: string;
  category: string;
  hostName: string;
  hostAge: number;
  hostPhoto: string;
  lat: number;
  lng: number;
  location: string;
  dateLabel: string;
  seats: number;
  tag: string;
  tagColor: string;
  charms: CharmIndex[];
}

// ─── DATA ───────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  coffee: "☕",
  dinner: "🍷",
  gallery: "🎨",
  fitness: "💪",
  gaming: "🎮",
  picnic: "🧺",
  brunch: "🥐",
  yoga: "🧘",
};

const cdnAvatar = (name: string) =>
  `https://res.cloudinary.com/ddwerzvdw/image/upload/w_400,h_400,c_fill,g_face,f_auto,q_auto/avatars/landing/${name}.webp`;

const FAKE_EVENTS: FakeEvent[] = [
  {
    id: "1",
    title: "Sunset rooftop drinks",
    category: "dinner",
    hostName: "Mia",
    hostAge: 27,
    hostPhoto: cdnAvatar("mia"),
    lat: 40.7268,
    lng: -73.9855,
    location: "East Village",
    dateLabel: "Fri · 7 PM",
    seats: 1,
    tag: "Date-friendly",
    tagColor: "#EC4899",
    charms: [0, 3],
  },
  {
    id: "2",
    title: "Morning trail run + coffee",
    category: "fitness",
    hostName: "Jordan",
    hostAge: 30,
    hostPhoto: cdnAvatar("jordan"),
    lat: 40.6602,
    lng: -73.969,
    location: "Prospect Park",
    dateLabel: "Sat · 8 AM",
    seats: 3,
    tag: "Group",
    tagColor: "#8B5CF6",
    charms: [1, 6],
  },
  {
    id: "3",
    title: "Gallery hop + wine",
    category: "gallery",
    hostName: "Priya",
    hostAge: 26,
    hostPhoto: cdnAvatar("priya"),
    lat: 40.7465,
    lng: -74.0014,
    location: "Chelsea",
    dateLabel: "Sun · 3 PM",
    seats: 1,
    tag: "Date-friendly",
    tagColor: "#EC4899",
    charms: [7, 4],
  },
  {
    id: "4",
    title: "Board game night",
    category: "gaming",
    hostName: "Alex",
    hostAge: 29,
    hostPhoto: cdnAvatar("alex"),
    lat: 40.7081,
    lng: -73.9571,
    location: "Williamsburg",
    dateLabel: "Fri · 8 PM",
    seats: 5,
    tag: "Group",
    tagColor: "#8B5CF6",
    charms: [2, 8],
  },
  {
    id: "5",
    title: "Coffee & people-watching",
    category: "coffee",
    hostName: "Sam",
    hostAge: 25,
    hostPhoto: cdnAvatar("sam"),
    lat: 40.7233,
    lng: -73.9985,
    location: "SoHo",
    dateLabel: "Sat · 11 AM",
    seats: 1,
    tag: "Chill",
    tagColor: "#10B981",
    charms: [5, 9],
  },
  {
    id: "6",
    title: "Picnic in the park",
    category: "picnic",
    hostName: "Lena",
    hostAge: 28,
    hostPhoto: cdnAvatar("lena"),
    lat: 40.7829,
    lng: -73.9654,
    location: "Central Park",
    dateLabel: "Sun · 12 PM",
    seats: 4,
    tag: "Group",
    tagColor: "#8B5CF6",
    charms: [10, 11],
  },
];

// Extra events for the marquee (extends the visual variety)
const MARQUEE_EXTRA_EVENTS: FakeEvent[] = [
  {
    id: "m1",
    title: "Brunch & mimosas",
    category: "brunch",
    hostName: "Kira",
    hostAge: 26,
    hostPhoto: cdnAvatar("kira"),
    lat: 0,
    lng: 0,
    location: "West Village",
    dateLabel: "Sun · 11 AM",
    seats: 2,
    tag: "Date-friendly",
    tagColor: "#EC4899",
    charms: [0, 7],
  },
  {
    id: "m2",
    title: "Sunset yoga in the park",
    category: "yoga",
    hostName: "Dani",
    hostAge: 31,
    hostPhoto: cdnAvatar("dani"),
    lat: 0,
    lng: 0,
    location: "Bryant Park",
    dateLabel: "Sat · 6 PM",
    seats: 6,
    tag: "Group",
    tagColor: "#8B5CF6",
    charms: [4, 10],
  },
  {
    id: "m3",
    title: "Live jazz + cocktails",
    category: "dinner",
    hostName: "Marcus",
    hostAge: 28,
    hostPhoto: cdnAvatar("marcus"),
    lat: 0,
    lng: 0,
    location: "Harlem",
    dateLabel: "Fri · 9 PM",
    seats: 1,
    tag: "Date-friendly",
    tagColor: "#EC4899",
    charms: [6, 11],
  },
  {
    id: "m4",
    title: "Museum hop + coffee",
    category: "gallery",
    hostName: "Ava",
    hostAge: 24,
    hostPhoto: cdnAvatar("ava"),
    lat: 0,
    lng: 0,
    location: "Upper East Side",
    dateLabel: "Sat · 2 PM",
    seats: 1,
    tag: "Chill",
    tagColor: "#10B981",
    charms: [3, 5],
  },
];

const ALL_MARQUEE_EVENTS = [...FAKE_EVENTS, ...MARQUEE_EXTRA_EVENTS];

const MAP_BOUNDS = {
  minLat: 40.64,
  maxLat: 40.8,
  minLng: -74.02,
  maxLng: -73.94,
};

// How many pixels to shift all pins up when card is open
const PIN_SHIFT_PX = 60;

// ─── MAP BACKGROUND ────────────────────────────────────────────────────────

function StyledMapBg() {
  return (
    <svg
      viewBox="0 0 720 514"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="720" height="514" fill="#E8ECF1" />
      <path
        d="M0 0 L85 0 L65 120 L42 260 L55 400 L32 514 L0 514 Z"
        fill="#B8D4F0"
        opacity="0.7"
      />
      <path
        d="M615 0 L720 0 L720 514 L635 514 L655 380 L645 200 L665 80 Z"
        fill="#B8D4F0"
        opacity="0.7"
      />
      <path
        d="M0 514 L220 514 L190 475 L110 455 L35 485 Z"
        fill="#B8D4F0"
        opacity="0.55"
      />
      <rect
        x="255"
        y="28"
        width="75"
        height="145"
        rx="10"
        fill="#A8D5A0"
        opacity="0.55"
      />
      <ellipse cx="275" cy="418" rx="48" ry="38" fill="#A8D5A0" opacity="0.5" />
      {[
        { x: 140, y: 150, w: 30, h: 20 },
        { x: 185, y: 170, w: 25, h: 18 },
        { x: 340, y: 180, w: 35, h: 22 },
        { x: 380, y: 200, w: 28, h: 16 },
        { x: 300, y: 250, w: 32, h: 20 },
        { x: 350, y: 270, w: 24, h: 18 },
        { x: 200, y: 290, w: 30, h: 22 },
        { x: 250, y: 310, w: 26, h: 16 },
        { x: 160, y: 340, w: 34, h: 20 },
        { x: 420, y: 220, w: 28, h: 18 },
        { x: 460, y: 240, w: 22, h: 16 },
        { x: 500, y: 200, w: 30, h: 20 },
      ].map((b, i) => (
        <rect
          key={`b-${i}`}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="2"
          fill="#D5DAE0"
          opacity="0.5"
        />
      ))}
      {[95, 155, 215, 275, 340, 400].map((y) => (
        <line
          key={`h-${y}`}
          x1="85"
          y1={y}
          x2="615"
          y2={y}
          stroke="#C8CED6"
          strokeWidth="1.5"
          opacity="0.6"
        />
      ))}
      {[155, 235, 315, 395, 475, 555].map((x) => (
        <line
          key={`v-${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="514"
          stroke="#C8CED6"
          strokeWidth="1.5"
          opacity="0.6"
        />
      ))}
      <line
        x1="195"
        y1="0"
        x2="375"
        y2="514"
        stroke="#C0C7CF"
        strokeWidth="2"
        opacity="0.5"
      />
      <line
        x1="575"
        y1="175"
        x2="645"
        y2="155"
        stroke="#B0B8C2"
        strokeWidth="2.5"
        opacity="0.5"
      />
      <line
        x1="555"
        y1="295"
        x2="645"
        y2="275"
        stroke="#B0B8C2"
        strokeWidth="2.5"
        opacity="0.5"
      />
      <line
        x1="540"
        y1="380"
        x2="640"
        y2="365"
        stroke="#B0B8C2"
        strokeWidth="2"
        opacity="0.4"
      />
      <text
        x="295"
        y="195"
        fill="#8B95A3"
        fontSize="12"
        fontWeight="600"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Midtown
      </text>
      <text
        x="315"
        y="305"
        fill="#8B95A3"
        fontSize="12"
        fontWeight="600"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        SoHo
      </text>
      <text
        x="495"
        y="275"
        fill="#8B95A3"
        fontSize="12"
        fontWeight="600"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Williamsburg
      </text>
      <text
        x="285"
        y="98"
        fill="#7A8696"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Central Park
      </text>
      <text
        x="275"
        y="448"
        fill="#7A8696"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Prospect Park
      </text>
      <text
        x="195"
        y="245"
        fill="#8B95A3"
        fontSize="12"
        fontWeight="600"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        Chelsea
      </text>
      <text
        x="380"
        y="340"
        fill="#8B95A3"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui"
        textAnchor="middle"
      >
        East Village
      </text>
    </svg>
  );
}

// ─── MAP PIN ────────────────────────────────────────────────────────────────

function MapPin({
  event,
  isSelected,
  cardOpen,
  onSelect,
}: {
  event: FakeEvent;
  isSelected: boolean;
  cardOpen: boolean;
  onSelect: (event: FakeEvent) => void;
}) {
  const xPct =
    ((event.lng - MAP_BOUNDS.minLng) /
      (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
    100;
  const yPct =
    ((MAP_BOUNDS.maxLat - event.lat) /
      (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
    100;

  // When card is open, shift all pins up by a fixed pixel amount
  // so the selected pin doesn't get hidden behind the card
  const yOffset = cardOpen ? -PIN_SHIFT_PX : 0;

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${xPct}%`,
        top: `calc(${yPct}% + ${yOffset}px)`,
        transform: "translate(-50%, -50%)",
        transition: "top 0.5s cubic-bezier(0.22, 1, 0.36, 1), filter 0.3s ease",
        zIndex: isSelected ? 50 : 10,
        filter: isSelected
          ? "drop-shadow(0 4px 14px rgba(236,72,153,0.4))"
          : "drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(event);
      }}
    >
      <div
        style={{
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: isSelected ? "scale(1.25)" : "scale(1)",
        }}
      >
        <AvatarWithCharmsWeb
          imageUrl={event.hostPhoto}
          charmIndices={event.charms}
          size={isSelected ? 62 : 52}
        />
      </div>
      <div
        className="mx-auto -mt-1 transition-colors duration-300"
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `7px solid ${isSelected ? "#EC4899" : "rgba(225,29,72,0.3)"}`,
        }}
      />
    </div>
  );
}

// ─── EVENT DETAIL CARD ──────────────────────────────────────────────────────

function EventDetailCard({
  event,
  onClose,
  onJoin,
}: {
  event: FakeEvent;
  onClose: () => void;
  onJoin: () => void;
}) {
  const icon = CATEGORY_ICONS[event.category] || "📍";
  const isPink = event.tagColor === "#EC4899";
  const isPurple = event.tagColor === "#8B5CF6";

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl border border-pink-100 shadow-xl p-4 z-[60] animate-[slideUp_0.3s_ease-out]">
      <button
        onClick={onClose}
        className="absolute top-2.5 right-3 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-200 transition"
      >
        ×
      </button>
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
          style={{
            color: event.tagColor,
            backgroundColor: isPink
              ? "rgba(236,72,153,0.08)"
              : isPurple
                ? "rgba(139,92,246,0.08)"
                : "rgba(16,185,129,0.08)",
          }}
        >
          {event.tag}
        </span>
        <span className="text-[11px] text-gray-400">
          {event.seats === 1 ? "1 spot left" : `${event.seats} spots`}
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <AvatarWithCharmsWeb
          imageUrl={event.hostPhoto}
          charmIndices={event.charms}
          size={48}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-gray-900 leading-tight">
            {event.title}
          </h4>
          <p className="text-[13px] text-gray-500 font-medium mt-0.5">
            {event.hostName}, {event.hostAge} · {icon} {event.location}
          </p>
          <span className="text-xs text-gray-600">🕐 {event.dateLabel}</span>
        </div>
      </div>
      <button
        onClick={onJoin}
        className="mt-3.5 w-full py-3 rounded-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white text-sm font-bold transition active:scale-[0.97]"
      >
        Request to join
      </button>
      <div className="mt-2.5 flex items-center justify-center gap-1.5">
        <span className="text-[10px] text-gray-400">Available soon on</span>
        <a
          href={APP_LINKS.ios}
          className="text-[10px] font-semibold text-gray-500 hover:text-pink-500 transition"
          onClick={(e) => {
            if (APP_LINKS.ios === "#ios") {
              e.preventDefault();
              onJoin();
            }
          }}
        >
          iOS
        </a>
        <span className="text-[10px] text-gray-300">&</span>
        <a
          href={APP_LINKS.android}
          className="text-[10px] font-semibold text-gray-500 hover:text-pink-500 transition"
          onClick={(e) => {
            if (APP_LINKS.android === "#android") {
              e.preventDefault();
              onJoin();
            }
          }}
        >
          Android
        </a>
      </div>
    </div>
  );
}

// ─── MARQUEE EVENT CHIP ─────────────────────────────────────────────────────

function MarqueeChip({
  event,
  onTap,
}: {
  event: FakeEvent;
  onTap: () => void;
}) {
  const icon = CATEGORY_ICONS[event.category] || "📍";
  return (
    <button
      onClick={onTap}
      className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:border-pink-300 hover:shadow-md transition-all duration-200 group"
    >
      <AvatarWithCharmsWeb
        imageUrl={event.hostPhoto}
        charmIndices={event.charms}
        size={46}
      />
      <div className="text-left pr-2">
        <p className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-pink-600 transition-colors">
          {event.title}
        </p>
        <p className="text-xs text-gray-400 leading-tight mt-0.5">
          {event.hostName} · {icon} {event.location} · {event.dateLabel}
        </p>
      </div>
    </button>
  );
}

// ─── MAIN SECTION ───────────────────────────────────────────────────────────

interface LandingPlusOneSectionProps {
  onOpenWaitlist: (headline: string, subtext: string) => void;
}

export default function LandingPlusOneSection({
  onOpenWaitlist,
}: LandingPlusOneSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<FakeEvent | null>(null);

  const handleJoin = useCallback(() => {
    if (!selectedEvent) return;
    const ev = selectedEvent;
    setSelectedEvent(null);
    onOpenWaitlist(
      "I'd love to get you in on this one! 💕",
      `"${ev.title}" with ${ev.hostName} is exactly the kind of thing I live for. Join the waitlist and I'll make sure you're one of the first to browse real Plus Ones near you.`,
    );
  }, [selectedEvent, onOpenWaitlist]);

  const handleMarqueeTap = useCallback(
    (event: FakeEvent) => {
      onOpenWaitlist(
        "I'd love to get you in on this one! 💕",
        `"${event.title}" with ${event.hostName} caught your eye — I love that. Join the waitlist and I'll make sure you're one of the first to browse Plus Ones near you.`,
      );
    },
    [onOpenWaitlist],
  );

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      {/* Marquee keyframes */}
      <style jsx global>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="max-w-5xl px-5 sm:px-6 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 text-sm font-semibold text-violet-600 bg-violet-50 rounded-full">
            <span>🎉</span> Real-world meetups
          </div>
          <h2 className="mb-3 text-3xl sm:text-4xl font-bold text-gray-900">
            Find your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600">
              plus one
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto">
            Browse real plans from singles near you. Tap a pin to see who&apos;s
            hosting — and request to join.
          </p>
        </div>

        {/* Map */}
        <div className="relative w-full max-w-[720px] mx-auto rounded-3xl overflow-hidden border border-gray-200 shadow-sm aspect-[3/4] sm:aspect-[720/514]">
          <StyledMapBg />
          <div
            className="absolute inset-0 z-[5]"
            onClick={() => setSelectedEvent(null)}
          />
          <div className="absolute inset-0 z-10">
            {FAKE_EVENTS.map((ev) => (
              <MapPin
                key={ev.id}
                event={ev}
                isSelected={selectedEvent?.id === ev.id}
                cardOpen={selectedEvent !== null}
                onSelect={setSelectedEvent}
              />
            ))}
          </div>
          {selectedEvent && (
            <EventDetailCard
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
              onJoin={handleJoin}
            />
          )}
          {!selectedEvent && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-gray-900/75 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-1.5 animate-[fadeIn_0.6s_ease-out_0.5s_both]">
              <span className="text-xs text-white/50">👆</span>
              <span className="text-xs text-white font-medium">
                Tap a pin to see who&apos;s hosting
              </span>
            </div>
          )}
        </div>

        <p className="text-center mt-5 text-xs text-gray-400">
          Preview — real events from singles in your city, coming soon.
        </p>
      </div>

      {/* ── Event Marquee ── */}
      <div className="mt-10 relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div
            className="flex gap-3 w-max"
            style={{
              animation: "marqueeScroll 35s linear infinite",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.animationPlayState =
                "paused";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.animationPlayState =
                "running";
            }}
          >
            {/* Duplicate the list for seamless loop */}
            {[...ALL_MARQUEE_EVENTS, ...ALL_MARQUEE_EVENTS].map((ev, i) => (
              <MarqueeChip
                key={`${ev.id}-${i}`}
                event={ev}
                onTap={() => handleMarqueeTap(ev)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
