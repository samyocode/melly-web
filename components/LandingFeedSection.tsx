// components/LandingFeedSection.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import MellyOrb from "@/components/MellyOrb";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface PollOption {
  id: string;
  label: string;
  emoji?: string;
  percentage: number;
  votes: number;
}

interface PollPrompt {
  id: string;
  kind: "this_or_that" | "poll_single";
  prompt_text: string;
  options: PollOption[];
  totalVotes: number;
  tag: string;
}

interface OpenTextPrompt {
  id: string;
  kind: "open_text";
  prompt_text: string;
  placeholder: string;
  sampleAnswers: string[];
  totalAnswers: number;
  tag: string;
}

type Prompt = PollPrompt | OpenTextPrompt;

// ─── DATA ───────────────────────────────────────────────────────────────────

const PROMPTS: Prompt[] = [
  {
    id: "p1",
    kind: "this_or_that",
    prompt_text: "Sunday morning energy — which one are you?",
    options: [
      {
        id: "a",
        label: "Farmers market + iced coffee",
        emoji: "🌿",
        percentage: 62,
        votes: 1847,
      },
      {
        id: "b",
        label: "Still in bed, do not disturb",
        emoji: "😴",
        percentage: 38,
        votes: 1131,
      },
    ],
    totalVotes: 2978,
    tag: "This or That",
  },
  {
    id: "p2",
    kind: "poll_single",
    prompt_text: "What's your ideal first date?",
    options: [
      {
        id: "a",
        label: "A quiet wine bar",
        emoji: "🍷",
        percentage: 34,
        votes: 892,
      },
      {
        id: "b",
        label: "A walk in the park",
        emoji: "🌳",
        percentage: 28,
        votes: 734,
      },
      {
        id: "c",
        label: "Something adventurous",
        emoji: "🎢",
        percentage: 22,
        votes: 577,
      },
      {
        id: "d",
        label: "Cooking together",
        emoji: "👩‍🍳",
        percentage: 16,
        votes: 420,
      },
    ],
    totalVotes: 2623,
    tag: "Poll",
  },
  {
    id: "p3",
    kind: "open_text",
    prompt_text: "Describe your perfect Saturday in 10 words or less.",
    placeholder: "Sleeping in, brunch, bookstore, sunset walk…",
    sampleAnswers: [
      "Sleep in, farmer's market, cook together, movie night",
      "Coffee, hike, nap, dinner with someone I like",
      "Beach, book, tacos, live music under the stars",
    ],
    totalAnswers: 1456,
    tag: "Open ended",
  },
];

// ─── BLUR AVATAR STACK ──────────────────────────────────────────────────────

function BlurAvatarStack() {
  const pairs = [
    ["#FCE7F3", "#FBCFE8"],
    ["#DBEAFE", "#BFDBFE"],
    ["#EDE9FE", "#DDD6FE"],
  ];
  return (
    <div className="flex">
      {pairs.map(([a, b], i) => (
        <div
          key={i}
          className="w-6 h-6 rounded-full border-2 border-white"
          style={{
            background: `linear-gradient(135deg, ${a}, ${b})`,
            marginLeft: i > 0 ? -8 : 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── ANIMATED POLL OPTION ───────────────────────────────────────────────────

function AnimatedPollOption({
  opt,
  isSelected,
  answered,
  disabled,
  delay,
  onSelect,
}: {
  opt: PollOption;
  isSelected: boolean;
  answered: boolean;
  disabled: boolean;
  delay: number;
  onSelect: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [showPct, setShowPct] = useState(false);

  useEffect(() => {
    if (!answered) {
      setShowPct(false);
      return;
    }
    // Staggered animation: bar fills, then percentage fades in
    const barTimer = setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.width = `${opt.percentage}%`;
      }
    }, delay);
    const pctTimer = setTimeout(() => setShowPct(true), delay + 500);
    return () => {
      clearTimeout(barTimer);
      clearTimeout(pctTimer);
    };
  }, [answered, opt.percentage, delay]);

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`
        relative flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm text-left w-full overflow-hidden
        transition-all duration-200
        ${isSelected ? "border-pink-500/30 bg-pink-500/[0.04]" : "border-gray-200 bg-gray-50"}
        ${answered ? "cursor-default" : "cursor-pointer hover:border-pink-200"}
        ${isSelected && answered ? "animate-[selectBounce_0.35s_ease-out]" : ""}
      `}
    >
      {/* Fill bar */}
      <div
        ref={barRef}
        className={`absolute inset-y-0 left-0 rounded-xl ${
          isSelected ? "bg-pink-500/10" : "bg-gray-200/50"
        }`}
        style={{
          width: "0%",
          transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      <span className="relative z-10 flex items-center gap-2">
        {opt.emoji && <span className="text-base">{opt.emoji}</span>}
        <span
          className={`${isSelected ? "font-semibold text-pink-600" : "font-medium text-gray-700"}`}
        >
          {opt.label}
        </span>
      </span>

      {answered && (
        <span
          className={`
            relative z-10 text-[13px] font-bold tabular-nums
            ${isSelected ? "text-pink-500" : "text-gray-500"}
            transition-all duration-300
            ${showPct ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
          `}
        >
          {opt.percentage}%
        </span>
      )}
    </button>
  );
}

// ─── POLL CARD ──────────────────────────────────────────────────────────────

function PollCard({
  prompt,
  onSeeVotes,
}: {
  prompt: PollPrompt;
  onSeeVotes: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-pink-100 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-3">
        <MellyOrb size={36} />
        <span className="text-sm font-semibold text-gray-900">Melly</span>
        <span className="text-[11px] font-semibold text-pink-500 bg-pink-500/[0.06] px-2 py-0.5 rounded-full">
          {prompt.tag}
        </span>
      </div>

      <p className="text-[15px] font-medium text-gray-900 leading-snug mb-3.5">
        {prompt.prompt_text}
      </p>

      {!answered && (
        <p className="text-xs text-gray-400 font-medium mb-2.5">
          🔥 {prompt.totalVotes.toLocaleString()} people answered
        </p>
      )}

      <div className="flex flex-col gap-2">
        {prompt.options.map((opt, idx) => (
          <AnimatedPollOption
            key={opt.id}
            opt={opt}
            isSelected={selected === opt.id}
            answered={answered}
            disabled={answered}
            delay={idx * 80}
            onSelect={() => !answered && setSelected(opt.id)}
          />
        ))}
      </div>

      {/* Post-answer: see votes CTA */}
      {answered && (
        <button
          onClick={onSeeVotes}
          className="mt-3.5 w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] transition hover:border-pink-500 hover:shadow-[0_0_0_3px_rgba(236,72,153,0.06)] animate-[fadeSlideIn_0.4s_ease-out_0.6s_both]"
        >
          <span className="flex items-center gap-2">
            <BlurAvatarStack />
            <span className="text-gray-600 font-medium">
              See how {prompt.totalVotes.toLocaleString()} people voted
            </span>
          </span>
          <span className="text-pink-500 font-semibold">→</span>
        </button>
      )}

      {!answered && (
        <p className="mt-2.5 text-[11px] text-gray-400">
          This feeds directly into who Melly suggests for you.
        </p>
      )}
    </div>
  );
}

// ─── OPEN TEXT CARD ─────────────────────────────────────────────────────────

function OpenTextCard({
  prompt,
  onSeeAnswers,
}: {
  prompt: OpenTextPrompt;
  onSeeAnswers: () => void;
}) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sampleIdx, setSampleIdx] = useState(0);

  useEffect(() => {
    if (submitted) return;
    const iv = setInterval(
      () => setSampleIdx((s) => (s + 1) % prompt.sampleAnswers.length),
      3500,
    );
    return () => clearInterval(iv);
  }, [submitted, prompt.sampleAnswers.length]);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-pink-100 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-3">
        <MellyOrb size={36} />
        <span className="text-sm font-semibold text-gray-900">Melly</span>
        <span className="text-[11px] font-semibold text-violet-500 bg-violet-500/[0.06] px-2 py-0.5 rounded-full">
          {prompt.tag}
        </span>
      </div>

      <p className="text-[15px] font-medium text-gray-900 leading-snug mb-2.5">
        {prompt.prompt_text}
      </p>

      {!submitted && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 font-medium mb-1.5">
            {prompt.totalAnswers.toLocaleString()} people answered
          </p>
          <p className="text-[13px] text-gray-500 italic leading-snug">
            &ldquo;{prompt.sampleAnswers[sampleIdx]}&rdquo;
          </p>
        </div>
      )}

      {!submitted ? (
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={prompt.placeholder}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 resize-none outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-gray-400">{text.length}/280</span>
            <button
              onClick={() => text.trim() && setSubmitted(true)}
              disabled={!text.trim()}
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold transition disabled:opacity-40 bg-pink-500 text-white hover:bg-pink-600 disabled:hover:bg-pink-500"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <div className="px-3.5 py-2.5 rounded-xl bg-gray-50">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-green-500 text-sm">✓</span>
              <span className="text-xs font-medium text-gray-500">
                Your answer
              </span>
            </div>
            <p className="text-sm text-gray-900 leading-snug">{text}</p>
          </div>

          <button
            onClick={onSeeAnswers}
            className="mt-2.5 w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] transition hover:border-pink-500 hover:shadow-[0_0_0_3px_rgba(236,72,153,0.06)] animate-[fadeSlideIn_0.4s_ease-out_0.3s_both]"
          >
            <span className="flex items-center gap-2">
              <BlurAvatarStack />
              <span className="text-gray-600 font-medium">
                See how {prompt.totalAnswers.toLocaleString()} others answered
              </span>
            </span>
            <span className="text-pink-500 font-semibold">→</span>
          </button>

          <p className="mt-2 text-[11px] text-gray-400">
            Saved — Melly just got a little smarter about you.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── MAIN SECTION ───────────────────────────────────────────────────────────

interface LandingFeedSectionProps {
  onOpenWaitlist: (headline: string, subtext: string) => void;
}

export default function LandingFeedSection({
  onOpenWaitlist,
}: LandingFeedSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-pink-50/60 relative overflow-hidden">
      <div className="absolute -top-32 -right-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Custom keyframes for poll animations */}
      <style jsx global>{`
        @keyframes selectBounce {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.02);
          }
          60% {
            transform: scale(0.99);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="max-w-5xl px-5 sm:px-6 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 text-sm font-semibold text-pink-500 bg-pink-500/[0.06] rounded-full">
            <MellyOrb size={16} />
            Powered by Melly
          </div>
          <h2 className="mb-3 text-3xl sm:text-4xl font-bold text-gray-900">
            Your daily dose of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600">
              self-discovery
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto">
            Melly drops prompts in your feed — polls, this-or-thats, and open
            questions. Every answer helps her understand you better and find
            your match.
          </p>
        </div>

        <div className="max-w-md mx-auto flex flex-col gap-5">
          {PROMPTS.map((prompt) => {
            if (prompt.kind === "open_text") {
              return (
                <OpenTextCard
                  key={prompt.id}
                  prompt={prompt}
                  onSeeAnswers={() =>
                    onOpenWaitlist(
                      "I was hoping you'd want to see! ✨",
                      "Join the waitlist and I'll unlock what other singles said — and more importantly, help you find the ones who think like you.",
                    )
                  }
                />
              );
            }
            return (
              <PollCard
                key={prompt.id}
                prompt={prompt as PollPrompt}
                onSeeVotes={() =>
                  onOpenWaitlist(
                    "Okay, I love that you're curious! ✨",
                    `${prompt.totalVotes.toLocaleString()} people voted on this prompt. Join the waitlist and I'll show you the full breakdown — plus who voted like you. That's where the magic happens.`,
                  )
                }
              />
            );
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-gray-500 mb-4">
            These are real prompts from the Melly app.
            <br />
            Your answers carry over when you join.
          </p>
          <button
            onClick={() =>
              onOpenWaitlist(
                "I'd love to keep chatting! 💕",
                "Melly is launching city by city. Join the waitlist and I'll personally let you know the moment we arrive near you.",
              )
            }
            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white text-base font-bold shadow-lg shadow-pink-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/30 active:scale-[0.98]"
          >
            Join the Waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
