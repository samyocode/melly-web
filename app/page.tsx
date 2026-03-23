// app/page.tsx

import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import MellyOrb from "@/components/MellyOrb";
import OrbButton from "@/components/OrbButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const ALL_QUIZZES = [
  {
    title: "Clingy or Cool?",
    cover_image_key: "clingy_vs_cool",
    slug: "clingy-or-cool",
  },
  {
    title: "Your Brain on Love",
    cover_image_key: "brain_on_love",
    slug: "your-brain-on-love",
  },
  {
    title: "Is It Cheating?",
    cover_image_key: "cheating",
    slug: "is-it-cheating",
  },
  {
    title: "Comedy Love Language",
    cover_image_key: "comedy",
    slug: "comedy-love-language",
  },
  {
    title: "The Ick Detector",
    cover_image_key: "ick",
    slug: "the-ick-detector",
  },
  {
    title: "Fixer or Listener?",
    cover_image_key: "fixer_vs_listener",
    slug: "fixer-or-listener",
  },
  {
    title: "Vent or Vanish?",
    cover_image_key: "vent_vs_vanish",
    slug: "vent-or-vanish",
  },
  {
    title: "Fight or Flight?",
    cover_image_key: "fight_vs_flight",
    slug: "fight-or-flight",
  },
  {
    title: "Dreamer or Realist?",
    cover_image_key: "dreamer_vs_realist",
    slug: "dreamer-or-realist",
  },
  {
    title: "Roots vs. Wings",
    cover_image_key: "roots_vs_wings",
    slug: "roots-vs-wings",
  },
  {
    title: "Your Dating DNA",
    cover_image_key: "dating_dna",
    slug: "your-dating-dna",
  },
  {
    title: "The 10-Year Plan",
    cover_image_key: "10_year",
    slug: "the-10-year-plan",
  },
  {
    title: "Twin Flame or Solo Flyer?",
    cover_image_key: "twin_vs_solo",
    slug: "twin-flame-or-solo-flyer",
  },
  { title: "Making Amends", cover_image_key: "amends", slug: "making-amends" },
  {
    title: "Early Bird or Night Owl?",
    cover_image_key: "early_vs_night",
    slug: "early-bird-or-night-owl",
  },
  {
    title: "Spender or Saver?",
    cover_image_key: "spender_vs_saver",
    slug: "spender-or-saver",
  },
  {
    title: "All In or Play It Safe?",
    cover_image_key: "all_in_vs_safe",
    slug: "all-in-or-play-it-safe",
  },
  {
    title: "The Bill Splitter",
    cover_image_key: "bill_splitter",
    slug: "the-bill-splitter",
  },
  {
    title: "Passport Personality",
    cover_image_key: "passport",
    slug: "passport-personality",
  },
  {
    title: "Planner or Winger?",
    cover_image_key: "planner_vs_winger",
    slug: "planner-or-winger",
  },
  {
    title: "Foodie or Fuel?",
    cover_image_key: "foodie_vs_fuel",
    slug: "foodie-or-fuel",
  },
  {
    title: "The Saturday Test",
    cover_image_key: "saturday",
    slug: "the-saturday-test",
  },
  {
    title: "The Glow Up Guide",
    cover_image_key: "glowup",
    slug: "the-glow-up-guide",
  },
  {
    title: "Soul Recharge",
    cover_image_key: "soul_recharge",
    slug: "soul-recharge",
  },
  {
    title: "Pick Your Power",
    cover_image_key: "power",
    slug: "pick-your-power",
  },
  {
    title: "Saint or Sinner?",
    cover_image_key: "saint_vs_sinner",
    slug: "saint-or-sinner",
  },
  {
    title: "Meet the Parents",
    cover_image_key: "parents",
    slug: "meet-the-parents",
  },
  {
    title: "The Roommate Test",
    cover_image_key: "roommate",
    slug: "the-roommate-test",
  },
  {
    title: "City Slicker / Country Soul",
    cover_image_key: "city_vs_country",
    slug: "city-slicker-country-soul",
  },
  { title: "Squad Goals", cover_image_key: "squad", slug: "squad-goals" },
  {
    title: "Recharge Mode",
    cover_image_key: "recharge",
    slug: "recharge-mode",
  },
];

export default function LandingPage() {
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
            A social network for singles — powered by Melly, your AI matchmaker.
            Dating, meetups, events, and quizzes that actually help you find
            your person.
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
              Meet Melly, your AI matchmaker
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              She&apos;s not a chatbot. She&apos;s more like that friend
              who&apos;s annoyingly good at setting people up — witty,
              observant, and genuinely invested in your love life.
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
                desc: "Attachment style, conflict style, humor type, money mindset — Melly uses them all to understand who you really are.",
              },
              {
                emoji: "💕",
                title: "AI-powered matching",
                desc: "Not just swiping. Melly studies your quiz results, values, and patterns to introduce you to people who truly complement you.",
              },
              {
                emoji: "🎉",
                title: "Events & meetups",
                desc: "Real-life connections. Join events, bring a plus-one, and meet people in a low-pressure social setting.",
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

      {/* --- QUIZZES --- */}
      <section id="quizzes" className="py-16 sm:py-24 bg-pink-50/60">
        <div className="px-5 sm:px-6 mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-14 text-center">
            <h2 className="mb-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Start with a Quiz
            </h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto">
              Take a 2-minute quiz and chat with Melly about your results. No
              sign-up, no paywall — just genuine self-discovery.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
            {FEATURED_QUIZZES.map((quiz) => (
              <Link
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className="group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl border border-pink-100/80 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={`/quizzes/${quiz.cover_image_key}.jpg`}
                    alt={quiz.title}
                    fill
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
                    <span>Chat with Melly</span>
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

          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              All 31 Quizzes
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {ALL_QUIZZES.map((quiz) => (
              <Link
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
              >
                <Image
                  src={`/quizzes/${quiz.cover_image_key}.jpg`}
                  alt={quiz.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {quiz.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl px-5 sm:px-6 mx-auto">
          <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-center text-gray-900">
            How Melly Works
          </h2>
          <p className="max-w-lg mx-auto mb-12 sm:mb-16 text-center text-gray-500 text-base sm:text-lg">
            Quizzes aren&apos;t destiny — they&apos;re a starting point. You
            always have agency in who you connect with.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-4">
            {[
              {
                step: "01",
                title: "Take a quiz",
                desc: "2 minutes, no sign-up. Melly walks you through it like a conversation.",
                emoji: "💬",
              },
              {
                step: "02",
                title: "Get your result",
                desc: "Discover your patterns — attachment, humor, conflict, money, and more.",
                emoji: "🪞",
              },
              {
                step: "03",
                title: "Chat with Melly",
                desc: "Ask her what your result means, how it affects dating, and what to watch for.",
                emoji: "✨",
              },
              {
                step: "04",
                title: "Meet your people",
                desc: "Join the app. Melly uses your insights to match you with compatible singles.",
                emoji: "💕",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-pink-50/60 border border-pink-100 text-center"
              >
                <div className="text-2xl mb-3">{item.emoji}</div>
                <div className="text-xs font-bold text-pink-500 mb-1.5 tracking-widest uppercase">
                  Step {item.step}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
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
              Be first in line
            </h2>
            <p className="mb-8 text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Melly is launching soon. Join the waitlist to save your quiz
              results, get your full compatibility profile, and be the first to
              meet your people.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 text-base rounded-full border border-gray-200 bg-pink-50/60 focus:bg-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition"
              />
              <OrbButton type="submit" className="whitespace-nowrap">
                Join Waitlist
              </OrbButton>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}
