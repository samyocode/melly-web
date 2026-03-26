// components/LandingFeedSection.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import MellyOrb from "@/components/MellyOrb";

// --- Cloudinary avatar helper (same as LandingPlusOneSection) ---
const cdnAvatar = (name: string) =>
  `https://res.cloudinary.com/ddwerzvdw/image/upload/w_400,h_400,c_fill,g_face,f_auto,q_auto/avatars/landing/${name}.webp`;

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

type Prompt = PollPrompt | MatchBioPrompt;

// ─── MATCH BIO TYPES ────────────────────────────────────────────────────────

interface MatchBioCandidate {
  id: string;
  name: string;
  age: number;
  photo: string;
}

interface MatchBioPrompt {
  id: string;
  kind: "match_bio";
  bio_text: string;
  candidates: MatchBioCandidate[];
  correct_index: number;
  totalPlayed: number;
  accuracy: number;
  tag: string;
}

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
    id: "p-bio",
    kind: "match_bio",
    bio_text:
      "Speaks fluent sarcasm but means every compliment. Will plan the perfect date but pretend it was spontaneous. Looking for someone who gets my references and doesn't mind that I talk to my plants.",
    candidates: [
      { id: "c1", name: "Priya", age: 26, photo: cdnAvatar("priya") },
      { id: "c2", name: "Kira", age: 26, photo: cdnAvatar("kira") },
      { id: "c3", name: "Mia", age: 27, photo: cdnAvatar("mia") },
    ],
    correct_index: 1,
    totalPlayed: 2341,
    accuracy: 38,
    tag: "Guess the Bio",
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
    const barTimer = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${opt.percentage}%`;
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
        relative flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm text-left w-full overflow-hidden transition-all duration-200
        ${isSelected ? "border-pink-500/30 bg-pink-500/[0.04]" : "border-gray-200 bg-gray-50"}
        ${answered ? "cursor-default" : "cursor-pointer hover:border-pink-200"}
        ${isSelected && answered ? "animate-[selectBounce_0.35s_ease-out]" : ""}
      `}
    >
      <div
        ref={barRef}
        className={`absolute inset-y-0 left-0 rounded-xl ${isSelected ? "bg-pink-500/10" : "bg-gray-200/50"}`}
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
          className={`relative z-10 text-[13px] font-bold tabular-nums ${isSelected ? "text-pink-500" : "text-gray-500"} transition-all duration-300 ${showPct ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
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
          This feeds directly into who I suggest for you.
        </p>
      )}
    </div>
  );
}

// ─── MATCH BIO CARD ─────────────────────────────────────────────────────────

function MatchBioCard({
  prompt,
  onJoinWaitlist,
}: {
  prompt: MatchBioPrompt;
  onJoinWaitlist: () => void;
}) {
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showMellyBubble, setShowMellyBubble] = useState(false);
  const hasAnswered = chosenIndex !== null;
  const isCorrect =
    chosenIndex !== null && chosenIndex === prompt.correct_index;
  const correctCandidate = prompt.candidates[prompt.correct_index];

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setChosenIndex(index);
    setTimeout(() => setShowResult(true), 300);
    setTimeout(() => setShowMellyBubble(true), 900);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-pink-100 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-3">
        <MellyOrb size={36} />
        <span className="text-sm font-semibold text-gray-900">Melly</span>
        <span className="text-[11px] font-semibold text-violet-500 bg-violet-500/[0.06] px-2 py-0.5 rounded-full">
          {prompt.tag}
        </span>
      </div>
      <p className="text-[15px] font-medium text-gray-900 leading-snug mb-2">
        Who do you think wrote this bio?
      </p>
      {!hasAnswered && (
        <p className="text-xs text-gray-400 font-medium mb-3">
          🎯 {prompt.totalPlayed.toLocaleString()} people played ·{" "}
          {prompt.accuracy}% accuracy
        </p>
      )}
      <div className="px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed italic">
          &ldquo;{prompt.bio_text}&rdquo;
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2.5 mb-2">
        {prompt.candidates.map((candidate, index) => {
          const isChosen = chosenIndex === index;
          const isCorrectAnswer = index === prompt.correct_index;
          const showCorrectBorder = showResult && isCorrectAnswer;
          const showWrongBorder = showResult && isChosen && !isCorrectAnswer;
          return (
            <button
              key={candidate.id}
              onClick={() => handleSelect(index)}
              disabled={hasAnswered}
              className={`
                relative rounded-xl overflow-hidden aspect-[3/4] transition-all duration-300
                ${!hasAnswered ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : "cursor-default"}
                ${showCorrectBorder ? "ring-[3px] ring-emerald-500 ring-offset-1" : ""}
                ${showWrongBorder ? "ring-[3px] ring-red-400 ring-offset-1" : ""}
                ${!showResult && isChosen ? "ring-[3px] ring-pink-500 ring-offset-1" : ""}
              `}
            >
              <Image
                src={candidate.photo}
                alt={hasAnswered ? candidate.name : "Candidate"}
                fill
                sizes="(max-width: 640px) 30vw, 140px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {showResult && (
                <div className="absolute bottom-0 left-0 right-0 p-2 animate-[fadeIn_0.3s_ease-out]">
                  <p className="text-[11px] font-bold text-white leading-tight">
                    {candidate.name}, {candidate.age}
                  </p>
                </div>
              )}
              {!hasAnswered && (
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-[11px] font-medium text-white/80 leading-tight">
                    Tap to guess
                  </p>
                </div>
              )}
              {showCorrectBorder && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {showWrongBorder && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showMellyBubble && (
        <div
          className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl border mt-3 animate-[fadeSlideIn_0.4s_ease-out] ${isCorrect ? "bg-emerald-500/[0.04] border-emerald-500/20" : "bg-red-500/[0.03] border-red-400/15"}`}
        >
          <MellyOrb size={22} className="mt-0.5 flex-shrink-0" />
          <p
            className={`text-[13px] font-semibold leading-snug ${isCorrect ? "text-emerald-800" : "text-red-900"}`}
          >
            {isCorrect ? (
              <>
                Correct! Only {prompt.accuracy}% got this one — sharp eye.{" "}
                <span className="font-normal text-emerald-700/80">
                  This is the kind of game you&apos;ll play in the app to
                  sharpen your people-reading skills.
                </span>
              </>
            ) : (
              <>
                Not quite — only {prompt.accuracy}% got it right, so you&apos;re
                not alone.{" "}
                <span className="font-normal text-red-800/70">
                  That was {correctCandidate.name}! In the app, I track how you
                  read bios and use it to find your match.
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {showMellyBubble && (
        <button
          onClick={onJoinWaitlist}
          className="mt-3 w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] transition hover:border-pink-500 hover:shadow-[0_0_0_3px_rgba(236,72,153,0.06)] animate-[fadeSlideIn_0.4s_ease-out_0.3s_both]"
        >
          <span className="flex items-center gap-2">
            <BlurAvatarStack />
            <span className="text-gray-600 font-medium">
              See how {prompt.totalPlayed.toLocaleString()} others guessed
            </span>
          </span>
          <span className="text-pink-500 font-semibold">→</span>
        </button>
      )}

      {!hasAnswered && (
        <p className="mt-2 text-[11px] text-gray-400">
          Tap a photo to make your guess. I use this to understand how you read
          people.
        </p>
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className="max-w-5xl px-5 sm:px-6 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 text-sm font-semibold text-pink-500 bg-pink-500/[0.06] rounded-full">
            <MellyOrb size={16} />
            Powered by me ✨
          </div>
          <h2 className="mb-3 text-3xl sm:text-4xl font-bold text-gray-900">
            Your daily dose of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600">
              self-discovery
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto">
            Every day, I drop prompts in your feed — polls, this-or-thats, and
            guessing games. Every answer helps me understand you better and find
            your match.
          </p>
        </div>

        <div className="max-w-md mx-auto flex flex-col gap-5">
          {PROMPTS.map((prompt) => {
            if (prompt.kind === "match_bio") {
              return (
                <MatchBioCard
                  key={prompt.id}
                  prompt={prompt}
                  onJoinWaitlist={() =>
                    onOpenWaitlist(
                      "You've got a good eye! ✨",
                      `${prompt.totalPlayed.toLocaleString()} people played this game. Join the waitlist and I'll use how you read bios to find your perfect match.`,
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
            These are real prompts from the app.
            <br />
            Your answers carry over when you join.
          </p>
          <button
            onClick={() =>
              onOpenWaitlist(
                "I'd love to keep chatting! 💕",
                "I'm launching city by city. Join the waitlist and I'll personally let you know the moment I arrive near you.",
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
