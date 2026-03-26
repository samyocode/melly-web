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

// --- Cloudinary optimized base URL ---
const CLD =
  "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/quizzes";

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

const WAITLIST_PITCHES = [
  "I already know so much about you from this one quiz. Imagine what I could do with all 31. Join the waitlist and I'll use your results to find people who genuinely complement you.",
  "This is just the beginning of your story. Join the waitlist and I'll use everything I learn about you to find someone who truly gets you.",
  "You'd be amazed how much I can read from these answers. Join the waitlist and let me put all this insight to work finding your person.",
  "I'm already building a picture of who you are — and honestly, I love what I see. Join the waitlist and I'll match you with people who'll love it too.",
  "One quiz down, and I'm already excited about your potential matches. Join the waitlist and I'll keep sharpening your compatibility profile.",
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

// ─── GATED CHAT INPUT (honest — no bait-and-switch) ─────────────────────────

function GatedChatInput({ onTap }: { onTap: () => void }) {
  return (
    <div className="sticky bottom-0 z-40 bg-white/80 backdrop-blur-lg border-t border-softPinkBorder">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <button
          onClick={onTap}
          className="w-full flex items-center gap-3 px-4 py-3 bg-softPinkBg rounded-full border border-gray-200 text-left transition hover:border-primary/30 group"
        >
          <MellyOrb size={24} className="flex-shrink-0" />
          <span className="flex-1 text-sm text-gray-400 group-hover:text-gray-500 transition">
            Want to dig deeper? Chat with Melly in the app...
          </span>
          <span className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r from-pink-400 to-primary">
            Coming soon
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

// ─── SHARE SHEET ────────────────────────────────────────────────────────────

function ShareSheet({ result, quiz }: { result: QuizResult; quiz: QuizData }) {
  const [copied, setCopied] = useState(false);

  const shareText = `I got "${result.name}" on the ${quiz.title} quiz! ${result.tagline}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I got "${result.name}" on the ${quiz.title} quiz!`,
          text: `${result.tagline} — Take the quiz yourself:`,
          url: shareUrl,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${shareText}\n\nTake it yourself: ${shareUrl}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  const channels = [
    {
      name: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      color: "#E4405F",
      action: handleNativeShare,
    },
    {
      name: "X",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "#000000",
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
        ),
    },
    {
      name: "WhatsApp",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      color: "#25D366",
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
          "_blank",
        ),
    },
    {
      name: "Copy",
      icon: copied ? (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      color: "#6B7280",
      action: handleCopy,
    },
  ];

  return (
    <div className="rounded-2xl bg-white border border-softPinkBorder overflow-hidden animate-[fadeSlideIn_0.35s_ease-out_0.1s_both]">
      <div className="px-5 pt-4 pb-2.5 text-center bg-gradient-to-b from-softPinkBg to-transparent">
        <p className="text-sm font-bold text-gray-900 mb-0.5">
          Share your result
        </p>
        <p className="text-xs text-gray-400">
          See if your friends get the same — or start a debate
        </p>
      </div>
      <div className="px-5 pb-4 flex justify-center gap-5">
        {channels.map((ch) => (
          <button
            key={ch.name}
            onClick={ch.action}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95"
              style={{
                backgroundColor: ch.name === "Copy" ? "#F3F4F6" : ch.color,
              }}
            >
              <span style={{ color: ch.name === "Copy" ? "#6B7280" : "#fff" }}>
                {ch.icon}
              </span>
            </div>
            <span className="text-[10px] font-medium text-gray-500">
              {ch.name === "Copy" && copied ? "Copied!" : ch.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SOCIAL PROOF BRIDGE ────────────────────────────────────────────────────

function SocialProofBridge({ quizTitle }: { quizTitle: string }) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-softPinkBg/50 border border-softPinkBorder animate-[fadeSlideIn_0.4s_ease-out_0.4s_both]">
      <div className="flex -space-x-2 flex-shrink-0">
        {["#FCE7F3", "#DBEAFE", "#EDE9FE", "#D1FAE5"].map((bg, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-white"
            style={{
              background: `linear-gradient(135deg, ${bg}, ${bg}dd)`,
              zIndex: 4 - i,
            }}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 leading-snug">
        <span className="font-semibold text-gray-700">Thousands of people</span>{" "}
        took the {quizTitle} quiz.{" "}
        <span className="text-gray-400">
          Your answers carry over when you join.
        </span>
      </p>
    </div>
  );
}

// ─── WAITLIST PITCH (Mel's voice) ───────────────────────────────────────────

function WaitlistPitch({
  onSignup,
  waitlistSubmitted,
}: {
  onSignup: () => void;
  waitlistSubmitted: boolean;
}) {
  const [pitchText] = useState(() => pick(WAITLIST_PITCHES));

  if (waitlistSubmitted) {
    return (
      <div className="p-4 rounded-2xl bg-softPinkBg border border-softPinkBorder text-center animate-[fadeSlideIn_0.3s_ease-out]">
        <p className="text-sm font-bold text-primary mb-0.5">
          You&apos;re on the list! 🎉
        </p>
        <p className="text-xs text-gray-500">
          We&apos;ll let you know when Melly is ready.
        </p>
      </div>
    );
  }

  return (
    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-softPinkBg to-lightPurpleBg border border-softPinkBorder animate-[fadeSlideIn_0.4s_ease-out_0.5s_both]">
      <div className="flex items-start gap-2.5">
        <MellyOrb size={32} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {pitchText}
          </p>
          <button
            onClick={onSignup}
            className="w-full py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-pink-400 via-primary to-primaryDark shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          >
            Join Waitlist — It&apos;s Free
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            No spam. Just a heads-up when we launch in your city.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── NEXT QUIZZES (list format) ─────────────────────────────────────────────

function NextQuizzesList({ slug }: { slug: string }) {
  const nextQuizzes = NEXT_QUIZZES[slug] || DEFAULT_NEXT_QUIZZES;

  return (
    <div className="animate-[fadeSlideIn_0.4s_ease-out_0.6s_both]">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-softPinkBorder" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Keep exploring
        </p>
        <div className="flex-1 h-px bg-softPinkBorder" />
      </div>
      <div className="flex flex-col gap-2">
        {nextQuizzes.map((nq) => (
          <Link
            key={nq.slug}
            href={`/quiz/${nq.slug}`}
            className="group flex items-center gap-3 p-2.5 rounded-xl bg-white border border-softPinkBorder transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={`${CLD}/${nq.cover}.webp`}
                alt={nq.title}
                fill
                sizes="56px"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                {nq.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                2 min · Chat with Melly
              </p>
            </div>
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-primary/60 transition-all group-hover:translate-x-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── RESULT CARD (redesigned) ───────────────────────────────────────────────
//
// Flow: Result reveal → Share (primary) → Social proof → Waitlist pitch → Next quizzes
//

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
  return (
    <div className="px-4 sm:px-6 animate-[fadeSlideIn_0.4s_ease-out]">
      <div className="ml-10 sm:ml-[42px] space-y-3">
        {/* ═══ 1. THE RESULT (let the dopamine land) ═══ */}
        <div className="relative p-5 sm:p-6 rounded-2xl bg-white border border-softPinkBorder shadow-lg shadow-primary/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-orb1 to-orb2" />
          <div className="pt-1">
            <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase mb-1.5">
              Your Result
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 leading-tight">
              {result.name}
            </h3>
            <p className="text-sm text-gray-500 italic mb-4">
              &ldquo;{result.tagline}&rdquo;
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {result.traits.map((t, i) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-medium text-primaryDark bg-softPinkBg border border-softPinkBorder rounded-full"
                  style={{
                    animation: `fadeSlideIn 0.3s ease-out ${300 + i * 100}ms both`,
                  }}
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

        {/* Disclaimer */}
        <p className="text-[11px] text-gray-400 leading-relaxed px-1">
          This is a starting point for self-awareness, not a verdict. The best
          relationships are built by people who understand their patterns and
          choose to grow.
        </p>

        {/* ═══ 2. SHARE (primary CTA — the growth mechanic) ═══ */}
        <ShareSheet result={result} quiz={quiz} />

        {/* ═══ 3. SOCIAL PROOF BRIDGE ═══ */}
        <SocialProofBridge quizTitle={quiz.title} />

        {/* ═══ 4. WAITLIST PITCH (Mel's voice) ═══ */}
        <WaitlistPitch
          onSignup={onSignup}
          waitlistSubmitted={waitlistSubmitted}
        />

        {/* ═══ 5. NEXT QUIZZES (list format) ═══ */}
        <NextQuizzesList slug={slug} />
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
              src={`${CLD}/${coverKey}.webp`}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
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
                  src={`${CLD}/${nq.cover}.webp`}
                  alt={nq.title}
                  fill
                  sizes="(max-width: 640px) 33vw, 200px"
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

// ─── QUIZ CHAT ──────────────────────────────────────────────────────────────

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
