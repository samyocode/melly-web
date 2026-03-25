// components/WaitlistModal.tsx
//
// Shared waitlist modal — extracted from app/quiz/[slug]/page.tsx
// so it can be reused on the landing page sections (Plus One, Feed cards)
// as well as any quiz page.
//
// Usage:
//   import { WaitlistModal } from "@/components/WaitlistModal";
//   <WaitlistModal
//     visible={showModal}
//     onClose={() => setShowModal(false)}
//     onSignupComplete={() => { ... }}
//     resultCode={result?.code ?? null}    // optional — quiz result code
//     headline="I'd love to keep chatting! 💕"  // optional override
//     subtext="..."                              // optional override
//   />

"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import MellyOrb from "@/components/MellyOrb";
import { SparklesBurst } from "@/components/SparklesBurst";
import { createClient } from "@supabase/supabase-js";
import { CITIES } from "@/lib/cities";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─── FEATURED CHARMS (personality category, have icon_url) ──────────────────

const FEATURED_CHARMS = [
  {
    name: "Golden Retriever",
    desc: "Will double-text and feel nothing",
    icon: "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/golden-retriever.webp",
  },
  {
    name: "Black Cat",
    desc: "Will stare at your message for 4 hours then reply 'lol'",
    icon: "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/black-cat.webp",
  },
  {
    name: "Overthinker",
    desc: "Already rehearsed the breakup speech for a relationship that doesn't exist",
    icon: "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/overthinker.webp",
  },
  {
    name: "Down Bad",
    desc: "Learned your middle name from a tagged photo from 2019",
    icon: "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/down-bad.webp",
  },
  {
    name: "Main Character",
    desc: "Has a soundtrack playing in their head at all times",
    icon: "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/main-character.webp",
  },
  {
    name: "Delulu",
    desc: "Made eye contact once. Currently picking wedding fonts.",
    icon: "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/charms/delulu.webp",
  },
];

// ─── SEARCHABLE CITY PICKER ─────────────────────────────────────────────────

function CityPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (city: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return CITIES.slice(0, 15);
    const q = search.toLowerCase();
    return CITIES.filter((c) => c.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (city: string) => {
    onChange(city);
    setSearch(city);
    setIsOpen(false);
    setShowCustom(false);
  };
  const handleCustomSubmit = () => {
    if (customCity.trim()) {
      onChange(customCity.trim());
      setSearch(customCity.trim());
      setShowCustom(false);
      setIsOpen(false);
    }
  };

  if (showCustom) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={customCity}
          onChange={(e) => setCustomCity(e.target.value)}
          placeholder="Type your city..."
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
          className="w-full px-5 py-3 text-sm rounded-full border border-gray-200 bg-softPinkBg focus:bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
        />
        <div className="flex gap-2">
          <button
            onClick={handleCustomSubmit}
            disabled={!customCity.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-full bg-primary hover:bg-primaryDark transition disabled:opacity-40"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              setShowCustom(false);
              setCustomCity("");
            }}
            className="px-4 py-2.5 text-sm font-medium text-gray-500 rounded-full hover:bg-gray-100 transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            onChange("");
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for your city..."
          className="w-full pl-11 pr-5 py-3 text-sm rounded-full border border-gray-200 bg-softPinkBg focus:bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
        />
        {value && (
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full max-h-44 overflow-y-auto bg-white rounded-2xl border border-gray-200 shadow-xl">
          {filtered.length > 0 ? (
            filtered.map((city) => (
              <button
                key={city}
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-softPinkBg hover:text-primary transition first:rounded-t-2xl"
              >
                {city}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              No cities match &ldquo;{search}&rdquo;
            </div>
          )}
          <button
            onClick={() => {
              setShowCustom(true);
              setCustomCity(search);
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-primary bg-softPinkBg hover:bg-primary/10 transition border-t border-gray-100 rounded-b-2xl"
          >
            🌍 My city isn&apos;t listed
          </button>
        </div>
      )}
    </div>
  );
}

// ─── MODAL ──────────────────────────────────────────────────────────────────

type ModalStep = "city" | "email" | "celebrate" | "done";

interface WaitlistModalProps {
  visible: boolean;
  onClose: () => void;
  onSignupComplete: () => void;
  /** Quiz result code — null when opened from non-quiz context */
  resultCode?: string | null;
  /** Override the city-step headline (Melly voice) */
  headline?: string;
  /** Override the city-step subtext */
  subtext?: string;
}

export function WaitlistModal({
  visible,
  onClose,
  onSignupComplete,
  resultCode = null,
  headline,
  subtext,
}: WaitlistModalProps) {
  const [step, setStep] = useState<ModalStep>("city");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoSuccess, setGeoSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showSparkles, setShowSparkles] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      // Small delay so exit animation can play
      const t = setTimeout(() => {
        setStep("city");
        setCity("");
        setEmail("");
        setLatitude(null);
        setLongitude(null);
        setLoading(false);
        setGeoLoading(false);
        setGeoSuccess(false);
        setError("");
        setShowSparkles(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const saveToWaitlist = useCallback(
    async (data: {
      email: string;
      quiz_result_code: string | null;
      city?: string;
      latitude?: number | null;
      longitude?: number | null;
    }) => {
      try {
        const { error: dbError } = await supabase.from("waitlist").insert({
          email: data.email.trim().toLowerCase(),
          quiz_result_code: data.quiz_result_code,
          city: data.city || null,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          created_at: new Date().toISOString(),
        });
        if (dbError && dbError.code !== "23505") {
          console.error("Waitlist insert error:", dbError);
          return false;
        }
        return true;
      } catch (err) {
        console.error("Waitlist save failed:", err);
        return false;
      }
    },
    [],
  );

  const handleShareLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGeoSuccess(true);
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const handleCityNext = () => {
    if (city.trim() || geoSuccess) setStep("email");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError("");
    const success = await saveToWaitlist({
      email,
      quiz_result_code: resultCode ?? null,
      city,
      latitude,
      longitude,
    });
    setLoading(false);
    if (success) {
      setShowSparkles(true);
      setStep("celebrate");
    } else setError("Something went wrong. Please try again.");
  };

  if (!visible) return null;

  const shortCity = city.split(",")[0].trim();

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md mx-4 mb-0 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1.5 flex-shrink-0 bg-gradient-to-r from-primary via-orb1 to-orb2" />

        <SparklesBurst
          trigger={showSparkles}
          onComplete={() => setShowSparkles(false)}
        />

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500 z-10"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="text-center">
            {(step === "city" || step === "email") && (
              <div className="flex justify-center mb-4">
                <MellyOrb size={48} />
              </div>
            )}

            {/* ── STEP 1: City + optional GPS ── */}
            {step === "city" && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {headline || "I'd love to keep chatting! 💕"}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  {subtext ||
                    "Melly is launching city by city. Where are you based? I'll make sure you're one of the first to know when we arrive."}
                </p>

                <div className="mb-4">
                  <CityPicker value={city} onChange={setCity} />
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button
                  onClick={handleShareLocation}
                  disabled={geoLoading || geoSuccess}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-full transition mb-4
                    ${
                      geoSuccess
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary"
                    } disabled:opacity-70`}
                >
                  {geoLoading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>{" "}
                      Finding you...
                    </>
                  ) : geoSuccess ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>{" "}
                      Location detected!
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>{" "}
                      Detect my location
                    </>
                  )}
                </button>

                <button
                  onClick={handleCityNext}
                  disabled={!city.trim() && !geoSuccess}
                  className="w-full px-6 py-3.5 text-base font-bold text-white rounded-full bg-primary hover:bg-primaryDark transition shadow-md shadow-primary/20 disabled:opacity-40 disabled:hover:bg-primary"
                >
                  Next
                </button>
              </>
            )}

            {/* ── STEP 2: Email ── */}
            {step === "email" && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {shortCity
                    ? `Love that you're in ${shortCity}! ✨`
                    : "Almost there! ✨"}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  Drop your email and I&apos;ll let you know the moment Melly
                  launches{shortCity ? ` in ${shortCity}` : " near you"}.
                  You&apos;ll be one of the first to meet singles in your area.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoFocus
                    className="w-full px-5 py-3.5 text-base rounded-full border border-gray-200 bg-softPinkBg focus:bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 text-base font-bold text-white rounded-full bg-primary hover:bg-primaryDark transition shadow-md shadow-primary/20 disabled:opacity-60"
                  >
                    {loading ? "Joining..." : "Join Waitlist"}
                  </button>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
                <p className="mt-4 text-xs text-gray-400">
                  No spam, ever. Just a heads-up when we launch.
                </p>
              </>
            )}

            {/* ── STEP 3: Celebrate ── */}
            {step === "celebrate" && (
              <div className="relative py-4">
                <div className="relative h-48 flex items-center justify-center mb-4">
                  <SparklesBurst
                    trigger={showSparkles}
                    onComplete={() => setShowSparkles(false)}
                  />
                  <div className="relative z-10 animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                    <MellyOrb size={72} />
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold text-gray-900 mb-2 animate-[fadeIn_0.4s_ease-out_0.4s_both]">
                  You&apos;re in! 🎉
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 animate-[fadeIn_0.4s_ease-out_0.6s_both]">
                  {shortCity
                    ? `I'll personally let you know the moment Melly launches in ${shortCity}.`
                    : "I'll personally let you know the moment Melly launches near you."}{" "}
                  In the meantime, your quiz results are saved and ready for
                  matching day.
                </p>

                <div className="text-left space-y-3 mb-6 animate-[fadeIn_0.4s_ease-out_0.8s_both]">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                    What happens next
                  </p>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-softPinkBg border border-softPinkBorder flex items-center justify-center text-xs">
                      📊
                    </span>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">
                        Take more quizzes
                      </span>{" "}
                      — each one sharpens your compatibility profile
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-softPinkBg border border-softPinkBorder flex items-center justify-center text-xs">
                      💌
                    </span>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">
                        Launch notification
                      </span>{" "}
                      — you&apos;ll be first to know when we go live
                      {shortCity ? ` in ${shortCity}` : ""}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-softPinkBg border border-softPinkBorder flex items-center justify-center text-xs">
                      ✨
                    </span>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">
                        Early access perks
                      </span>{" "}
                      — OG badge, priority matching, and more
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStep("done");
                    onSignupComplete();
                  }}
                  className="w-full px-6 py-3.5 text-base font-bold text-white rounded-full bg-primary hover:bg-primaryDark transition shadow-md shadow-primary/20 animate-[fadeIn_0.4s_ease-out_1s_both]"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ── STEP 4: Done — charms preview ── */}
            {step === "done" && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  One more thing... ✨
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  While you wait for launch, check out Charms — personality
                  badges you can wear on your profile. Here&apos;s a sneak peek:
                </p>

                <div className="p-4 rounded-2xl bg-softPinkBg border border-softPinkBorder mb-5">
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {FEATURED_CHARMS.map((charm) => (
                      <div
                        key={charm.name}
                        className="flex-shrink-0 w-20 text-center"
                      >
                        <div className="w-16 h-16 mx-auto mb-1.5 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={charm.icon}
                            alt={charm.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-gray-800 leading-tight">
                          {charm.name}
                        </p>
                        <p className="text-[9px] text-gray-400 leading-tight mt-0.5 line-clamp-2">
                          {charm.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3.5 text-base font-bold text-white rounded-full bg-primary hover:bg-primaryDark transition shadow-md shadow-primary/20"
                  >
                    Take Another Quiz
                  </button>
                  <Link
                    href="/"
                    className="w-full px-6 py-3 text-sm font-medium text-gray-500 rounded-full hover:bg-gray-100 transition text-center"
                  >
                    Browse All Quizzes
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="h-[env(safe-area-inset-bottom)] bg-white flex-shrink-0 sm:hidden" />
      </div>
    </div>
  );
}

export default WaitlistModal;
