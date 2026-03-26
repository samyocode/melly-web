// app/page.tsx

"use client";

import { useState } from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import MellyOrb from "@/components/MellyOrb";
import OrbButton from "@/components/OrbButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingPlusOneSection from "@/components/LandingPlusOneSection";
import LandingFeedSection from "@/components/LandingFeedSection";
import { WaitlistModal } from "@/components/WaitlistModal";

// --- Cloudinary optimized base URL ---
const CLD =
  "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/quizzes";

// --- FEATURED QUIZZES (funnel-optimized order) ---
const FEATURED_QUIZZES = [
  {
    title: "Clingy or Cool?",
    description:
      "Based on Attachment Theory, discover how you bond with partners.",
    cover_image_key: "clingy_vs_cool",
    slug: "clingy-or-cool",
    tag: "Most Popular",
  },
  {
    title: "Your Brain on Love",
    description:
      "Based on Dr. Helen Fisher's research, uncover your biological love temperament.",
    cover_image_key: "brain_on_love",
    slug: "your-brain-on-love",
    tag: "Science-Backed",
  },
  {
    title: "Is It Cheating?",
    description:
      "Liking an ex's photo at 2 AM? Explore the grey areas of modern relationships.",
    cover_image_key: "cheating",
    slug: "is-it-cheating",
    tag: "Trending",
  },
  {
    title: "Comedy Love Language",
    description:
      "What makes you laugh? Discover your comedic voice and who you'll vibe with.",
    cover_image_key: "comedy",
    slug: "comedy-love-language",
    tag: "Fun",
  },
  {
    title: "The Ick Detector",
    description:
      "Red flags, green flags, or beige flags — what does your radar pick up first?",
    cover_image_key: "ick",
    slug: "the-ick-detector",
    tag: "Viral",
  },
  {
    title: "Fixer or Listener?",
    description:
      "When your partner is struggling, what's your instinct? Discover your support style.",
    cover_image_key: "fixer_vs_listener",
    slug: "fixer-or-listener",
    tag: "Relationship",
  },
];

export default function LandingPage() {
  // --- Waitlist modal state ---
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistHeadline, setWaitlistHeadline] = useState("");
  const [waitlistSubtext, setWaitlistSubtext] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);

  const openWaitlist = (headline: string, subtext: string) => {
    setWaitlistHeadline(headline);
    setWaitlistSubtext(subtext);
    setShowWaitlist(true);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Melly",
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "iOS, Android",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-pink-500 selection:text-white">
      <Script
        id="app-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- NAVBAR --- */}
      <Navbar position="fixed" variant="landing" />

      {/* --- HERO --- */}
      <header className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden bg-pink-50/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-pink-200/30 via-pink-50/60 to-white pointer-events-none" />
        <div className="relative z-10 max-w-4xl px-5 sm:px-6 mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-6 sm:mb-8 text-sm font-medium text-pink-700 bg-white rounded-full border border-pink-100 shadow-sm">
            <span className="flex -space-x-1.5">
              <MellyOrb size={20} />
              <MellyOrb size={20} />
              <MellyOrb size={20} />
            </span>
            Join 2,000+ singles on the waitlist
          </div>
          <h1 className="mb-5 sm:mb-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Where singles{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #f472b6 0%, #ec4899 40%, #db2777 100%)",
              }}
            >
              mingle
            </span>
          </h1>
          <p className="max-w-xl mx-auto mb-8 sm:mb-10 text-lg sm:text-xl text-gray-600 leading-relaxed">
            I&apos;m Melly, and I genuinely can&apos;t wait to find your person.
            I&apos;ll learn who you really are, handpick people you&apos;ll
            click with, and set up real ways to meet them. No swiping — just me,
            doing what I do best.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
            <OrbButton href="#quizzes" size="lg" fullWidthMobile>
              Try a Free Quiz
            </OrbButton>
            <a
              href="#waitlist"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-700 rounded-full bg-white border border-gray-200 hover:border-pink-300 hover:text-pink-500 transition text-center"
            >
              Join the Waitlist
            </a>
          </div>
          <p className="text-sm text-gray-400">
            No sign-up required to take a quiz. Instant results.
          </p>
        </div>
      </header>

      {/* --- MEET MELLY --- */}
      <section id="meet-melly" className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl px-5 sm:px-6 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <MellyOrb
              size={56}
              className="mx-auto mb-5 shadow-lg shadow-pink-500/20"
            />
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-gray-900">
              A little about me ✨
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              I&apos;m not a chatbot — I&apos;m more like that friend who&apos;s
              annoyingly good at setting people up. Witty, observant, and
              genuinely invested in your love life. Here&apos;s what it looks
              like when I&apos;m in my element:
            </p>
          </div>

          {/* Chat preview */}
          <div className="max-w-md mx-auto mb-12 sm:mb-16">
            <div className="rounded-3xl bg-pink-50/60 border border-pink-100 p-4 sm:p-5 space-y-3">
              <div className="flex items-start gap-2.5">
                <MellyOrb size={32} className="mt-0.5" />
                <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Okay, not to play favorites, but I&apos;m really smiling at
                    this story... You and Alex both got &quot;Secure
                    Anchor&quot; on the attachment quiz. I have a really good
                    feeling about this one.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="px-4 py-3 bg-pink-500 text-white rounded-2xl rounded-tr-sm shadow-sm max-w-[85%]">
                  <p className="text-sm leading-relaxed">
                    Okay wait, that&apos;s actually cool. What does that mean
                    for us?
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MellyOrb size={32} className="mt-0.5" />
                <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    It means you both navigate intimacy with a steady heart. I
                    can just picture you two... comfortable silence on a Sunday
                    morning, zero anxiety. ✨
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5">
            {[
              {
                emoji: "🧠",
                title: "31 personality quizzes",
                desc: "Attachment style, conflict style, humor type, money mindset — I use them all to understand who you really are.",
              },
              {
                emoji: "💕",
                title: "AI-powered matching",
                desc: "Not just swiping. I study your quiz results, values, and patterns to introduce you to people who truly complement you.",
              },
              {
                emoji: "🎉",
                title: "Events & meetups",
                desc: "Real-life connections. I help you find events, bring a plus-one, and meet people in a low-pressure social setting.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 sm:p-7 rounded-3xl bg-pink-50/60 border border-pink-100"
              >
                <div className="text-3xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- QUIZZES (shortened — featured 6 only) --- */}
      <section id="quizzes" className="py-16 sm:py-24 bg-pink-50/60">
        <div className="px-5 sm:px-6 mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-14 text-center">
            <h2 className="mb-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Let&apos;s start here
            </h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto">
              Take a 2-minute quiz and I&apos;ll walk you through your results.
              No sign-up, no paywall — just genuine self-discovery. I&apos;ll be
              right here the whole time.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8">
            {FEATURED_QUIZZES.map((quiz) => (
              <Link
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className="group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl border border-pink-100/80 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={`${CLD}/${quiz.cover_image_key}.webp`}
                    alt={quiz.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="px-2.5 py-1 text-xs font-bold text-white bg-pink-500/90 backdrop-blur-sm rounded-full">
                      {quiz.tag}
                    </span>
                  </div>
                  <h3 className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-xl sm:text-2xl font-bold text-white leading-tight">
                    {quiz.title}
                  </h3>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 line-clamp-2">
                    {quiz.description}
                  </p>
                  <div className="flex items-center text-sm font-bold text-pink-500">
                    <span>Chat with me</span>
                    <svg
                      className="w-4 h-4 ml-1.5 transition transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* See all quizzes link */}
          <div className="text-center">
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-pink-500 bg-white rounded-full border border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition"
            >
              See all 31 quizzes
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* --- PLUS ONE EVENTS --- */}
      <LandingPlusOneSection onOpenWaitlist={openWaitlist} />

      {/* --- MEL INTERACTIVE FEED --- */}
      <LandingFeedSection onOpenWaitlist={openWaitlist} />

      {/* --- HOW MELLY WORKS (first person, journey-focused) --- */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl px-5 sm:px-6 mx-auto">
          <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-center text-gray-900">
            Here&apos;s how I find your person
          </h2>
          <p className="max-w-lg mx-auto mb-12 sm:mb-16 text-center text-gray-500 text-base sm:text-lg">
            I&apos;ve got three ways to connect you with people who actually get
            you — and I&apos;m learning more about you with every single one.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5">
            {[
              {
                step: "01",
                title: "I introduce you",
                desc: "I study your personality, values, and patterns across 31 quizzes — then I handpick people who genuinely complement you. No swiping, no guesswork. Just me, doing my thing.",
                emoji: "💕",
                label: "AI Matchmaker",
                labelColor: "text-pink-500 bg-pink-500/[0.06]",
              },
              {
                step: "02",
                title: "I set up real meetups",
                desc: "I help you find Plus One events hosted by other singles near you — rooftop drinks, trail runs, gallery hops. You request to join and show up as yourself. I handle the rest.",
                emoji: "🎉",
                label: "Events & Meetups",
                labelColor: "text-violet-600 bg-violet-50",
              },
              {
                step: "03",
                title: "I spark conversations",
                desc: "Every day, I drop prompts in your feed — polls, this-or-thats, and guessing games. Every answer helps me understand you better and connects you with people who think like you.",
                emoji: "✨",
                label: "Feed & Prompts",
                labelColor: "text-amber-600 bg-amber-50",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-pink-50/60 border border-pink-100"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-2xl">{item.emoji}</span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.labelColor}`}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="text-xs font-bold text-pink-500 mb-1.5 tracking-widest uppercase">
                  Step {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="max-w-md mx-auto mt-8 text-center text-sm text-gray-400 leading-relaxed">
            Every quiz you take, prompt you answer, and event you join makes me
            smarter about who you are — and who you&apos;ll click with. You
            always have agency in who you connect with.
          </p>
        </div>
      </section>

      {/* --- WAITLIST CTA --- */}
      <section id="waitlist" className="py-16 sm:py-24 bg-pink-50/60">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-pink-100 shadow-xl shadow-pink-500/5">
            <MellyOrb
              size={48}
              className="mx-auto mb-5 shadow-lg shadow-pink-500/20"
            />
            <h2 className="mb-3 text-2xl sm:text-3xl font-bold text-gray-900">
              I&apos;m almost ready for you
            </h2>
            <p className="mb-8 text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              I&apos;m launching soon, city by city. Join the waitlist and
              I&apos;ll save your quiz results, start building your
              compatibility profile, and let you know the moment I arrive in
              your area. I genuinely can&apos;t wait.
            </p>
            {waitlistDone ? (
              <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
                <p className="text-base font-bold text-pink-500 mb-0.5">
                  You&apos;re on the list! 🎉
                </p>
                <p className="text-sm text-gray-500">
                  I&apos;ll let you know when I&apos;m ready for you.
                </p>
              </div>
            ) : (
              <OrbButton
                onClick={() =>
                  openWaitlist(
                    "I'd love to keep chatting! 💕",
                    "I'm launching city by city. Where are you based? I'll make sure you're one of the first to know when I arrive.",
                  )
                }
                className="whitespace-nowrap"
              >
                Join Waitlist
              </OrbButton>
            )}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

      {/* --- SHARED WAITLIST MODAL --- */}
      <WaitlistModal
        visible={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        onSignupComplete={() => {
          setWaitlistDone(true);
          setShowWaitlist(false);
        }}
        headline={waitlistHeadline}
        subtext={waitlistSubtext}
      />
    </div>
  );
}
