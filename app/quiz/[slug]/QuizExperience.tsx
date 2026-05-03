// app/quiz/[slug]/QuizExperience.tsx
//
// Client islands for the quiz route. The server `page.tsx` is responsible
// for SEO (metadata, JSON-LD, sr-only content) and picks which of these to
// render based on whether the slug is in QUIZ_REGISTRY or QUIZ_PREVIEWS.

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MellyOrb from "@/components/MellyOrb";
import {
  NEXT_QUIZZES,
  DEFAULT_NEXT_QUIZZES,
  calculateDominantTrait,
} from "@/lib/quiz-data";
import type { QuizOption, QuizData, QuizResult } from "@/lib/quiz-data";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";

function getDevicePlatform(): "ios" | "android" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

const CLD =
  "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/quizzes";

// ─── LOCAL TYPES ─────────────────────────────────────────────────────────────
type MessageType =
  | "welcome"
  | "question"
  | "thinking"
  | "result"
  | "post-result-menu"
  | "dating-insight"
  | "follow-up"
  | "user";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  type: MessageType;
  content: string;
  options?: QuizOption[];
  optionsDisabled?: boolean;
  selectedValue?: number;
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

const MELLY_POST_RESULT_PROMPTS = [
  "Love your result! What would you like to do next?",
  "So, what are you thinking? Here's what we can do from here:",
  "Your result is in! What sounds good?",
];

// Option values: 1 = dating insight, 2 = see matches
const POST_RESULT_OPTIONS: QuizOption[] = [
  { text: "💕 What does this mean for my dating life?", value: 1 },
  { text: "✨ See who I match with", value: 2 },
];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

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
        <div className="px-4 py-3 bg-pink-500 text-white rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] sm:max-w-[70%]">
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
            {message.options.map((opt, idx) => {
              const showLetter =
                message.type === "question" || message.type === "welcome";
              const isSelected =
                message.optionsDisabled && message.selectedValue === opt.value;
              const isDisabledUnselected =
                message.optionsDisabled && !isSelected;
              return (
                <button
                  key={idx}
                  onClick={() =>
                    !message.optionsDisabled &&
                    onOptionSelect?.(opt.text, opt.value)
                  }
                  disabled={message.optionsDisabled}
                  className={`text-left px-4 py-3 rounded-2xl border text-sm leading-relaxed transition-all duration-200 ${
                    isSelected
                      ? "border-pink-200 bg-pink-50 text-pink-700 cursor-default"
                      : isDisabledUnselected
                        ? "border-gray-100 bg-gray-50/50 text-gray-300 cursor-default"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-stone-50 hover:border-gray-300 active:scale-[0.98]"
                  }`}
                >
                  {showLetter ? (
                    <span className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                          isSelected
                            ? "border-pink-300 text-pink-500 bg-pink-100"
                            : isDisabledUnselected
                              ? "border-gray-200 text-gray-300"
                              : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt.text}</span>
                    </span>
                  ) : (
                    opt.text
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function GatedChatInput({ onTap }: { onTap: () => void }) {
  return (
    <div className="sticky bottom-0 z-40 bg-white/80 backdrop-blur-lg border-t border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <button
          onClick={onTap}
          className="w-full flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-full border border-gray-200 text-left transition hover:border-gray-300 group"
        >
          <MellyOrb size={24} className="flex-shrink-0" />
          <span className="flex-1 text-sm text-gray-400 group-hover:text-gray-500 transition">
            Download the app to see your matches...
          </span>
          <span className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-pink-500">
            Get App
          </span>
        </button>
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-white/80" />
    </div>
  );
}

// ─── DOWNLOAD MODAL (single screen — platform-aware) ────────────────────────

function DownloadModal({
  visible,
  onClose,
  resultName,
}: {
  visible: boolean;
  onClose: () => void;
  resultName: string | null;
}) {
  if (!visible) return null;
  const platform = getDevicePlatform();

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4 mb-0 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1 flex-shrink-0 bg-gradient-to-r from-pink-400 to-pink-500" />
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
            <div className="flex justify-center mb-5">
              <MellyOrb size={56} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {resultName
                ? `I know who'd complement your "${resultName}" result 💕`
                : "I'm ready to find your matches 💕"}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Download Melly to see who I&apos;d match you with. Your quiz
              results will be waiting for you inside.
            </p>

            {/* On mobile, show the relevant store button prominently */}
            {platform === "ios" && (
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 text-base font-bold text-white bg-black rounded-full hover:bg-gray-800 transition shadow-lg shadow-black/10 mb-3"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Download on the App Store
              </a>
            )}

            {platform === "android" && (
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 text-base font-bold text-white bg-black rounded-full hover:bg-gray-800 transition shadow-lg shadow-black/10 mb-3"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.834 1.639a1 1 0 010 1.708l-2.834 1.639-2.532-2.532 2.532-2.454zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" />
                </svg>
                Download on Google Play
              </a>
            )}

            {/* On desktop, show both buttons side by side */}
            {platform === "desktop" && (
              <div className="flex gap-2.5 mb-3">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white bg-black rounded-full hover:bg-gray-800 transition"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  App Store
                </a>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white bg-black rounded-full hover:bg-gray-800 transition"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.834 1.639a1 1 0 010 1.708l-2.834 1.639-2.532-2.532 2.532-2.454zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" />
                  </svg>
                  Google Play
                </a>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full px-5 py-3 text-sm font-medium text-gray-500 rounded-full hover:bg-gray-100 transition"
            >
              Maybe later
            </button>
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-white flex-shrink-0 sm:hidden" />
      </div>
    </div>
  );
}

// ─── COMPACT SHARE BAR ──────────────────────────────────────────────────────

function CompactShareBar({
  result,
  quiz,
}: {
  result: QuizResult;
  quiz: QuizData;
}) {
  const [copied, setCopied] = useState(false);
  const shareText = `I got "${result.name}" on the ${quiz.title} quiz! ${result.tagline}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I got "${result.name}"!`,
          text: `${result.tagline} — Take the quiz yourself:`,
          url: shareUrl,
        });
      } catch {
        /* cancelled */
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

  return (
    <div className="flex items-center gap-2 animate-[fadeSlideIn_0.3s_ease-out_0.2s_both]">
      <span className="text-xs text-gray-400 font-medium mr-1">Share:</span>
      <button
        onClick={handleNativeShare}
        className="w-9 h-9 rounded-full bg-[#E4405F] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </button>
      <button
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            "_blank",
          )
        }
        className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        onClick={() =>
          window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
            "_blank",
          )
        }
        className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
      <button
        onClick={handleCopy}
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        {copied ? (
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-green-500"
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
            className="w-4 h-4 text-gray-500"
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
        )}
      </button>
    </div>
  );
}

// ─── NEXT QUIZZES INLINE ────────────────────────────────────────────────────

function NextQuizzesInline({ slug }: { slug: string }) {
  const nextQuizzes = NEXT_QUIZZES[slug] || DEFAULT_NEXT_QUIZZES;
  return (
    <div className="px-4 sm:px-6 animate-[fadeSlideIn_0.4s_ease-out]">
      <div className="ml-10 sm:ml-[42px] flex flex-col gap-2">
        {nextQuizzes.map((nq) => (
          <Link
            key={nq.slug}
            href={`/quiz/${nq.slug}`}
            className="group flex items-center gap-3 p-2.5 rounded-xl bg-white border border-gray-200 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={`${CLD}/${nq.cover}.webp`}
                alt={nq.title}
                fill
                sizes="48px"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-pink-500 transition-colors">
                {nq.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                2 min · Sharpens your profile
              </p>
            </div>
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-pink-400 transition-all group-hover:translate-x-0.5 flex-shrink-0"
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

// ─── RESULT CARD ────────────────────────────────────────────────────────────

function ResultCard({ result, quiz }: { result: QuizResult; quiz: QuizData }) {
  return (
    <div className="px-4 sm:px-6 animate-[fadeSlideIn_0.4s_ease-out]">
      <div className="ml-10 sm:ml-[42px]">
        <div className="relative p-5 rounded-2xl bg-white border border-gray-200 shadow-lg shadow-black/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-pink-500" />
          <div className="pt-1">
            <p className="text-[10px] font-bold text-pink-500 tracking-[0.15em] uppercase mb-1">
              Your Result
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-1 leading-tight">
              {result.name}
            </h3>
            <p className="text-sm text-gray-400 italic mb-3">
              &ldquo;{result.tagline}&rdquo;
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {result.traits.map((t, i) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-stone-100 border border-gray-200 rounded-full"
                  style={{
                    animation: `fadeSlideIn 0.3s ease-out ${300 + i * 100}ms both`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              {result.description}
            </p>
            <CompactShareBar result={result} quiz={quiz} />
          </div>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed px-1 mt-2 text-center">
          For self-awareness, not a verdict. The best relationships are built by
          people who understand their patterns and choose to grow.
        </p>
      </div>
    </div>
  );
}

// ─── COMING SOON PAGE ───────────────────────────────────────────────────────

export function ComingSoonPage({
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
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const title =
    preview?.title ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description =
    preview?.description ??
    "This quiz isn't available on the web yet, but it's waiting for you in the app!";
  const coverKey = preview?.cover_image_key;
  const questionCount = preview?.questionCount ?? 7;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <MellyOrb size={28} />
            <span className="text-lg font-bold tracking-tight">Melly</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-pink-500 transition"
          >
            All Quizzes
          </Link>
        </div>
      </nav>
      <main className="flex-1 max-w-lg mx-auto px-5 py-8 sm:py-16">
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
        <p className="text-base text-gray-500 leading-relaxed mb-8">
          {description}
        </p>
        <div className="flex items-start gap-2.5 mb-8">
          <MellyOrb size={32} />
          <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 max-w-[85%]">
            <p className="text-sm text-gray-700 leading-relaxed">
              This quiz isn&apos;t on the web yet — but it&apos;s waiting for
              you in the app! Download Melly and you&apos;ll be one of the first
              to take it. 💕
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDownloadModal(true)}
          className="w-full px-8 py-4 text-base font-bold text-white rounded-full bg-pink-500 hover:bg-pink-600 transition shadow-lg shadow-pink-500/25 mb-6"
        >
          Download the App
        </button>
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
      <DownloadModal
        visible={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        resultName={null}
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
//
// Simplified post-result flow:
// 1. Result card (compact, with inline share)
// 2. ONE Melly message with 4 tappable options (user drives)
// 3. Sticky bottom bar also triggers sign-in
//

export function QuizChat({ quiz, slug }: { quiz: QuizData; slug: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<
    "intro" | "questions" | "thinking" | "result"
  >("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showNextQuizzes, setShowNextQuizzes] = useState(false);
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
  const disableLastOptions = useCallback((selectedValue?: number) => {
    setMessages((prev) =>
      prev.map((m, i) =>
        i === prev.length - 1 && m.options
          ? { ...m, optionsDisabled: true, selectedValue }
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
      disableLastOptions(1);
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
      disableLastOptions(value);
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
          1500,
        );
        const calcResult = calculateDominantTrait(newAnswers, quiz.results);
        setResult(calcResult);
        await addMellyMessage(
          {
            role: "assistant",
            type: "result",
            content: `${pick(MELLY_RESULT_INTROS)}\n\nBased on your answers, your result is: ${calcResult.name}`,
          },
          2000,
        );
        setPhase("result");

        // ONE follow-up with 2 tappable options — user decides what's next
        setTimeout(async () => {
          await addMellyMessage(
            {
              role: "assistant",
              type: "post-result-menu",
              content: pick(MELLY_POST_RESULT_PROMPTS),
              options: POST_RESULT_OPTIONS,
            },
            1200,
          );
        }, 1800);
      } else {
        setCurrentQ(nextIdx);
        await addMellyMessage(
          {
            role: "assistant",
            type: "question",
            content: quiz.questions[nextIdx].text,
            options: quiz.questions[nextIdx].options,
          },
          900,
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

  const handlePostResultChoice = useCallback(
    async (text: string, value: number) => {
      disableLastOptions(value);
      addUserMessage(text);

      switch (value) {
        case 1: {
          // Dating insight — pool of Melly-voice variations
          const insightVariations = [
            `Your "${result?.name}" result on the ${quiz.title} quiz says a lot about how you move in relationships. You've got patterns — we all do — and yours shape who you're drawn to and who actually sticks around. The cool part? Now that you see them, you can use them.`,
            `Here's what I love about getting "${result?.name}" on ${quiz.title} — it tells me how you connect when it counts. Not the first-date version of you, but the real one. The one who shows up at month three. That's the version I'd match you on.`,
            `So "${result?.name}" on the ${quiz.title} quiz — this isn't just a label. It's how you handle closeness, conflict, and everything in between. I've seen this pattern before, and I already know the kind of person who'd balance you out perfectly.`,
            `Your "${result?.name}" result from ${quiz.title} is basically your relationship fingerprint. It tells me what you need, what you give, and where things tend to get tricky. Most people don't know this about themselves — you're already ahead.`,
            `"${result?.name}" on ${quiz.title} — okay, I'm not going to sugarcoat this. This result tells me exactly how you show up when things get real in a relationship. The good news? Knowing your patterns is literally the cheat code to finding someone who gets you.`,
            `What I find interesting about getting "${result?.name}" on the ${quiz.title} quiz is that it's not about who you think you want — it's about who you'd actually thrive with. Those are often two very different people. That's where I come in.`,
          ];
          const insight =
            (result as QuizResult & { datingInsight?: string })
              ?.datingInsight || pick(insightVariations);
          await addMellyMessage(
            { role: "assistant", type: "dating-insight", content: insight },
            1400,
          );
          setTimeout(async () => {
            await addMellyMessage(
              {
                role: "assistant",
                type: "follow-up",
                content:
                  "I already have a pretty clear picture of who'd complement you. Want me to find them?",
                options: [
                  { text: "✨ See who I match with", value: 2 },
                  { text: "🧠 Take another quiz", value: 3 },
                ],
              },
              1200,
            );
          }, 1500);
          break;
        }
        case 2: {
          setShowDownloadModal(true);
          break;
        }
        case 3: {
          setShowNextQuizzes(true);
          scrollToBottom();
          break;
        }
      }
    },
    [
      result,
      quiz,
      disableLastOptions,
      addUserMessage,
      addMellyMessage,
      scrollToBottom,
    ],
  );

  const handleOptionSelect = useCallback(
    (text: string, value: number) => {
      if (phase === "intro") handleWelcome(text);
      else if (phase === "questions") handleAnswer(text, value);
      else if (phase === "result") handlePostResultChoice(text, value);
    },
    [phase, handleWelcome, handleAnswer, handlePostResultChoice],
  );

  const progress =
    phase === "questions" || phase === "thinking"
      ? ((currentQ + (phase === "thinking" ? 1 : 0)) / quiz.questions.length) *
        100
      : phase === "result"
        ? 100
        : 0;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
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
            className="text-sm font-medium text-gray-500 hover:text-pink-500 transition"
          >
            All Quizzes
          </Link>
        </div>
        {progress > 0 && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-pink-500 transition-all duration-500 ease-out"
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
                <ResultCard result={result} quiz={quiz} />
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
        {showNextQuizzes && <NextQuizzesInline slug={slug} />}
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </main>

      {phase === "result" && (
        <GatedChatInput onTap={() => setShowDownloadModal(true)} />
      )}
      <DownloadModal
        visible={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        resultName={result?.name ?? null}
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
