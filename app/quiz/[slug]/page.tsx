// app/quiz/[slug]/page.tsx

"use client";

import { useState, useCallback, useRef, useEffect, use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import MellyOrb from "@/components/MellyOrb";
import { SparklesBurst } from "@/components/SparklesBurst";
import { createClient } from "@supabase/supabase-js";
import { CITIES } from "@/lib/cities";
import {
  QUIZ_REGISTRY,
  QUIZ_PREVIEWS,
  NEXT_QUIZZES,
  DEFAULT_NEXT_QUIZZES,
  calculateDominantTrait,
} from "@/lib/quiz-data";
import type { QuizOption, QuizData, QuizResult } from "@/lib/quiz-data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─── LOCAL TYPES ─────────────────────────────────────────────────────────────
type MessageType =
  | "welcome"
  | "question"
  | "thinking"
  | "result"
  | "discussion"
  | "user";
interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  type: MessageType;
  content: string;
  options?: QuizOption[];
  optionsDisabled?: boolean;
}

// ─── MELLY'S VOICE ──────────────────────────────────────────────────────────

const MELLY_THINKING_LINES = [
  "Give me a second to read through your answers properly...",
  "Okay, I'm running your answers through my little matchmaker brain...",
  "One sec — I'm weighing your responses and seeing what patterns pop out.",
  "Love how thoughtful your answers were. Let me connect the dots for a moment...",
];
const MELLY_RESULT_INTROS = [
  "Okay, so here's what I'm seeing...",
  "Alright, I've been thinking about this and I have to share...",
  "Here's the thing...",
  "I have a really good feeling about this one.",
];
const MELLY_DISCUSSION_PROMPTS = [
  "What does this result mean for your dating life? Feel free to ask me anything!",
  "Curious what this means for you? I'd love to dig deeper — ask me anything.",
  "This is just the beginning. Want to know how this plays out in real relationships? Ask away!",
];
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

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

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function MellyAvatar() {
  return <MellyOrb size={32} />;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 px-4 sm:px-6">
      <MellyAvatar />
      <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  message,
  onOptionSelect,
}: {
  message: ChatMessage;
  onOptionSelect?: (text: string, value: number) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end px-4 sm:px-6 animate-[fadeIn_0.25s_ease-out]">
        <div className="px-4 py-3 bg-primary text-white rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] sm:max-w-[70%]">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5 px-4 sm:px-6 animate-[fadeIn_0.3s_ease-out]">
      <MellyAvatar />
      <div className="flex flex-col gap-2 max-w-[85%] sm:max-w-[70%]">
        <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {message.content}
          </p>
        </div>
        {message.options && message.options.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {message.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() =>
                  !message.optionsDisabled &&
                  onOptionSelect?.(opt.text, opt.value)
                }
                disabled={message.optionsDisabled}
                className={`text-left px-4 py-3 rounded-2xl border text-sm leading-relaxed transition-all duration-200 ${message.optionsDisabled ? "border-gray-100 bg-gray-50 text-gray-400 cursor-default" : "border-primary/20 bg-primary/[0.03] text-gray-700 hover:bg-primary/[0.08] hover:border-primary/40 active:scale-[0.98]"}`}
              >
                <span className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${message.optionsDisabled ? "border-gray-200 text-gray-300" : "border-primary/30 text-primary/60"}`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt.text}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GatedChatInput({ onTap }: { onTap: () => void }) {
  return (
    <div className="sticky bottom-0 z-40 bg-white/80 backdrop-blur-lg border-t border-softPinkBorder">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <button
          onClick={onTap}
          className="w-full flex items-center gap-3 px-4 py-3 bg-softPinkBg rounded-full border border-gray-200 text-left transition hover:border-primary/30 group"
        >
          <span className="flex-1 text-sm text-gray-400 group-hover:text-gray-500 transition">
            Ask Melly about your result...
          </span>
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-primary/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </span>
        </button>
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-white/80" />
    </div>
  );
}

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

// ─── SIGNUP MODAL ────────────────────────────────────────────────────────────

type ModalStep = "city" | "email" | "celebrate" | "done";

function SignupModal({
  visible,
  onClose,
  onSignupComplete,
  resultCode,
}: {
  visible: boolean;
  onClose: () => void;
  onSignupComplete: () => void;
  resultCode: string | null;
}) {
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
      quiz_result_code: resultCode,
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

      {/* Modal — max-h with scroll for small screens */}
      <div className="relative w-full max-w-md mx-4 mb-0 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1.5 flex-shrink-0 bg-gradient-to-r from-primary via-orb1 to-orb2" />

        {/* Sparkle burst on successful signup */}
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
                  I&apos;d love to keep chatting! 💕
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  Melly is launching city by city. Where are you based?
                  I&apos;ll make sure you&apos;re one of the first to know when
                  we arrive.
                </p>

                <div className="mb-4">
                  <CityPicker value={city} onChange={setCity} />
                </div>

                {/* GPS option */}
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

            {/* ── STEP 3: Celebrate — sparkle burst + what to expect ── */}
            {step === "celebrate" && (
              <div className="relative py-4">
                {/* Sparkle burst — centered and large */}
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

                {/* What to expect */}
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

            {/* ── STEP 4: Done — charms preview + next actions ── */}
            {step === "done" && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  One more thing... ✨
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  While you wait for launch, check out Charms — personality
                  badges you can wear on your profile. Here&apos;s a sneak peek:
                </p>

                {/* Charms teaser */}
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

// ─── RESULT CARD ─────────────────────────────────────────────────────────────

function ResultCard({
  result,
  quiz,
  slug,
  onSignup,
  waitlistSubmitted,
}: {
  result: QuizResult;
  quiz: QuizData;
  slug: string;
  onSignup: () => void;
  waitlistSubmitted: boolean;
}) {
  const nextQuizzes = NEXT_QUIZZES[slug] || DEFAULT_NEXT_QUIZZES;
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const shareData = {
      title: `I got "${result.name}" on the ${quiz.title} quiz!`,
      text: `${result.tagline} — Take the quiz yourself:`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(
        `I got "${result.name}" on the ${quiz.title} quiz! ${result.tagline}\n\nTake it yourself: ${window.location.href}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", window.location.href);
    }
  };

  return (
    <div className="px-4 sm:px-6 animate-[fadeSlideIn_0.4s_ease-out]">
      <div className="ml-10 sm:ml-[42px]">
        <div className="relative p-5 sm:p-6 rounded-2xl bg-white border border-softPinkBorder shadow-lg shadow-primary/5 mb-4 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-orb1 to-orb2" />
          <div className="pt-1">
            <p className="text-[11px] font-bold text-primary tracking-widest uppercase mb-1">
              Your Result
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
              {result.name}
            </h3>
            <p className="text-sm text-gray-500 italic mb-4">
              &ldquo;{result.tagline}&rdquo;
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {result.traits.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-medium text-primaryDark bg-softPinkBg border border-softPinkBorder rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.description}
            </p>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-lightPurpleBg border border-softPinkBorder mb-4">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-700">Remember:</span> This
            is a starting point for self-awareness, not a verdict. The best
            relationships are built by people who understand their patterns and
            choose to grow.
          </p>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleShare}
            className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-bold text-primary bg-white border border-primary/20 rounded-full hover:bg-primary/5 transition text-center"
          >
            {copied ? "Copied! ✓" : "Share Result"}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition text-center"
          >
            Retake
          </button>
        </div>
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-softPinkBg to-lightPurpleBg border border-softPinkBorder mb-4">
          <div className="text-center">
            <div className="text-2xl mb-2">💕</div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">
              See who you&apos;re compatible with
            </h4>
            <p className="text-sm text-gray-600 mb-4 max-w-xs mx-auto">
              Save your result and get matched with people who complement your
              attachment style when Melly launches.
            </p>
            {waitlistSubmitted ? (
              <div className="p-3 rounded-xl bg-white border border-softPinkBorder">
                <p className="text-sm font-bold text-primary mb-0.5">
                  You&apos;re on the list! 🎉
                </p>
                <p className="text-xs text-gray-500">
                  We&apos;ll let you know when Melly is ready.
                </p>
              </div>
            ) : (
              <button
                onClick={onSignup}
                className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white rounded-full bg-primary hover:bg-primaryDark transition shadow-md shadow-primary/20"
              >
                Join Waitlist
              </button>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 mb-3 text-center">
            Keep exploring
          </p>
          <div className="grid grid-cols-3 gap-2">
            {nextQuizzes.map((nq) => (
              <Link
                key={nq.slug}
                href={`/quiz/${nq.slug}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <Image
                  src={`/quizzes/${nq.cover}.jpg`}
                  alt={nq.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <p className="text-[10px] sm:text-xs font-bold text-white leading-tight">
                    {nq.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE + QUIZ CHAT ──────────────────────────────────────────────────

export default function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const quiz = QUIZ_REGISTRY[slug];
  if (!quiz) {
    const preview = QUIZ_PREVIEWS[slug];
    return <ComingSoonPage slug={slug} preview={preview} />;
  }
  return <QuizChat quiz={quiz} slug={slug} />;
}

// ─── COMING SOON PAGE ────────────────────────────────────────────────────────

function ComingSoonPage({
  slug,
  preview,
}: {
  slug: string;
  preview?: {
    title: string;
    description: string;
    cover_image_key: string;
    questionCount: number;
  };
}) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const title =
    preview?.title ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description =
    preview?.description ??
    "This quiz isn't available on the web yet, but it's waiting for you in the app!";
  const coverKey = preview?.cover_image_key;
  const questionCount = preview?.questionCount ?? 7;

  return (
    <div className="min-h-screen flex flex-col bg-softPinkBg font-sans text-gray-900">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-softPinkBorder">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <MellyOrb size={28} />
            <span className="text-lg font-bold tracking-tight">Melly</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-primary transition"
          >
            All Quizzes
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-lg mx-auto px-5 py-8 sm:py-16">
        {/* Cover image */}
        {coverKey && (
          <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden mb-6 shadow-lg">
            <Image
              src={`/quizzes/${coverKey}.jpg`}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {title}
              </h1>
            </div>
          </div>
        )}

        {!coverKey && (
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            {title}
          </h1>
        )}

        {/* Quiz info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            2 min
          </span>
          <span>•</span>
          <span>{questionCount} questions</span>
        </div>

        <p className="text-base text-gray-600 leading-relaxed mb-8">
          {description}
        </p>

        {/* Melly message */}
        <div className="flex items-start gap-2.5 mb-8">
          <MellyOrb size={32} />
          <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 max-w-[85%]">
            <p className="text-sm text-gray-700 leading-relaxed">
              This quiz isn&apos;t on the web yet — but it&apos;s waiting for
              you in the app! Join the waitlist and you&apos;ll be one of the
              first to take it when Melly launches. 💕
            </p>
          </div>
        </div>

        {/* CTA */}
        {waitlistSubmitted ? (
          <div className="p-5 rounded-2xl bg-white border border-softPinkBorder text-center mb-6">
            <p className="text-base font-bold text-primary mb-1">
              You&apos;re on the list! 🎉
            </p>
            <p className="text-sm text-gray-500">
              We&apos;ll let you know when this quiz goes live.
            </p>
          </div>
        ) : (
          <button
            onClick={() => setShowSignupModal(true)}
            className="w-full px-8 py-4 text-base font-bold text-white rounded-full bg-primary hover:bg-primaryDark transition shadow-lg shadow-primary/25 mb-6"
          >
            Join the Waitlist
          </button>
        )}

        {/* Try a live quiz instead */}
        <div>
          <p className="text-sm font-bold text-gray-900 mb-3 text-center">
            Or try a quiz you can take right now
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEFAULT_NEXT_QUIZZES.map((nq) => (
              <Link
                key={nq.slug}
                href={`/quiz/${nq.slug}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <Image
                  src={`/quizzes/${nq.cover}.jpg`}
                  alt={nq.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <p className="text-[10px] sm:text-xs font-bold text-white leading-tight">
                    {nq.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Reuse the same signup modal */}
      <SignupModal
        visible={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSignupComplete={() => {
          setWaitlistSubmitted(true);
          setShowSignupModal(false);
        }}
        resultCode={null}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
    </div>
  );
}

function QuizChat({ quiz, slug }: { quiz: QuizData; slug: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<
    "intro" | "questions" | "thinking" | "result"
  >("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(
      () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  }, []);
  const addMellyMessage = useCallback(
    (msg: Omit<ChatMessage, "id">, delay = 800) => {
      return new Promise<void>((resolve) => {
        setIsTyping(true);
        scrollToBottom();
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { ...msg, id: `${Date.now()}-${Math.random()}` },
          ]);
          scrollToBottom();
          resolve();
        }, delay);
      });
    },
    [scrollToBottom],
  );
  const addUserMessage = useCallback(
    (content: string) => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-user`, role: "user", type: "user", content },
      ]);
      scrollToBottom();
    },
    [scrollToBottom],
  );
  const disableLastOptions = useCallback(() => {
    setMessages((prev) =>
      prev.map((m, i) =>
        i === prev.length - 1 && m.options
          ? { ...m, optionsDisabled: true }
          : m,
      ),
    );
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    addMellyMessage(
      {
        role: "assistant",
        type: "welcome",
        content: `Hey! I'm Melly ✨ Ready to take the "${quiz.title}" quiz? It's only ${quiz.questions.length} questions and I'll be right here to walk you through your results.`,
        options: [{ text: "Let's do this!", value: 1 }],
      },
      600,
    );
  }, [quiz, addMellyMessage]);

  const handleWelcome = useCallback(
    async (text: string) => {
      disableLastOptions();
      addUserMessage(text);
      setPhase("questions");
      await addMellyMessage(
        {
          role: "assistant",
          type: "question",
          content: quiz.questions[0].text,
          options: quiz.questions[0].options,
        },
        700,
      );
    },
    [quiz, disableLastOptions, addUserMessage, addMellyMessage],
  );

  const handleAnswer = useCallback(
    async (text: string, value: number) => {
      disableLastOptions();
      addUserMessage(text);
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);
      const nextIdx = currentQ + 1;
      if (nextIdx >= quiz.questions.length) {
        setPhase("thinking");
        await addMellyMessage(
          {
            role: "assistant",
            type: "thinking",
            content: pick(MELLY_THINKING_LINES),
          },
          900,
        );
        const calcResult = calculateDominantTrait(newAnswers, quiz.results);
        setResult(calcResult);
        await addMellyMessage(
          {
            role: "assistant",
            type: "result",
            content: `${pick(MELLY_RESULT_INTROS)}\n\nBased on your answers, your result is: ${calcResult.name}`,
          },
          1200,
        );
        setPhase("result");
        setTimeout(async () => {
          await addMellyMessage(
            {
              role: "assistant",
              type: "discussion",
              content: pick(MELLY_DISCUSSION_PROMPTS),
            },
            600,
          );
        }, 800);
      } else {
        setCurrentQ(nextIdx);
        await addMellyMessage(
          {
            role: "assistant",
            type: "question",
            content: quiz.questions[nextIdx].text,
            options: quiz.questions[nextIdx].options,
          },
          600,
        );
      }
    },
    [
      answers,
      currentQ,
      quiz,
      disableLastOptions,
      addUserMessage,
      addMellyMessage,
    ],
  );

  const handleOptionSelect = useCallback(
    (text: string, value: number) => {
      if (phase === "intro") handleWelcome(text);
      else if (phase === "questions") handleAnswer(text, value);
    },
    [phase, handleWelcome, handleAnswer],
  );

  const progress =
    phase === "questions" || phase === "thinking"
      ? ((currentQ + (phase === "thinking" ? 1 : 0)) / quiz.questions.length) *
        100
      : phase === "result"
        ? 100
        : 0;

  return (
    <div className="min-h-screen flex flex-col bg-softPinkBg font-sans text-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-softPinkBorder">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <MellyOrb size={28} />
            <span className="text-lg font-bold tracking-tight">Melly</span>
          </Link>
          <span className="text-sm font-medium text-gray-900 truncate max-w-[50%]">
            {quiz.title}
          </span>
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-primary transition"
          >
            All Quizzes
          </Link>
        </div>
        {progress > 0 && (
          <div className="h-1 bg-softPinkBorder">
            <div
              className="h-full bg-gradient-to-r from-primary to-orb2 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </nav>
      <main
        className={`flex-1 max-w-2xl w-full mx-auto py-4 sm:py-6 space-y-4 overflow-y-auto ${phase === "result" ? "pb-24" : ""}`}
      >
        {messages.map((msg) => {
          if (msg.type === "result" && result && phase === "result") {
            return (
              <div key={msg.id} className="space-y-4">
                <ChatBubble message={msg} onOptionSelect={handleOptionSelect} />
                <ResultCard
                  result={result}
                  quiz={quiz}
                  slug={slug}
                  onSignup={() => setShowSignupModal(true)}
                  waitlistSubmitted={waitlistSubmitted}
                />
              </div>
            );
          }
          return (
            <ChatBubble
              key={msg.id}
              message={msg}
              onOptionSelect={handleOptionSelect}
            />
          );
        })}
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </main>
      {phase === "result" && (
        <GatedChatInput onTap={() => setShowSignupModal(true)} />
      )}
      <SignupModal
        visible={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSignupComplete={() => {
          setWaitlistSubmitted(true);
          setShowSignupModal(false);
        }}
        resultCode={result?.code ?? null}
      />
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
    </div>
  );
}
