// app/quizzes/page.tsx

import Image from "next/image";
import Link from "next/link";
import MellyOrb from "@/components/MellyOrb";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ALL_QUIZZES = [
  {
    title: "Clingy or Cool?",
    cover_image_key: "clingy_vs_cool",
    slug: "clingy-or-cool",
    tag: "Most Popular",
  },
  {
    title: "Your Brain on Love",
    cover_image_key: "brain_on_love",
    slug: "your-brain-on-love",
    tag: "Science-Backed",
  },
  {
    title: "Is It Cheating?",
    cover_image_key: "cheating",
    slug: "is-it-cheating",
    tag: "Trending",
  },
  {
    title: "Comedy Love Language",
    cover_image_key: "comedy",
    slug: "comedy-love-language",
    tag: "Fun",
  },
  {
    title: "The Ick Detector",
    cover_image_key: "ick",
    slug: "the-ick-detector",
    tag: "Viral",
  },
  {
    title: "Fixer or Listener?",
    cover_image_key: "fixer_vs_listener",
    slug: "fixer-or-listener",
    tag: "Relationship",
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

export default function QuizzesPage() {
  return (
    <div className="min-h-screen font-sans text-gray-900 bg-pink-50/60 selection:bg-pink-500 selection:text-white">
      <Navbar position="sticky" variant="landing" />

      <main className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <MellyOrb
            size={48}
            className="mx-auto mb-4 shadow-lg shadow-pink-500/20"
          />
          <h1 className="mb-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
            All 31 Quizzes
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto">
            Each quiz takes about 2 minutes. Melly walks you through your
            results and what they mean for your dating life. No sign-up
            required.
          </p>
        </div>

        {/* Quiz grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {ALL_QUIZZES.map((quiz) => (
            <Link
              key={quiz.slug}
              href={`/quiz/${quiz.slug}`}
              className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Image
                src={`/quizzes/${quiz.cover_image_key}.jpg`}
                alt={quiz.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Tag badge (only for featured quizzes that have one) */}
              {"tag" in quiz && quiz.tag && (
                <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-pink-500/85 backdrop-blur-sm rounded-full">
                    {quiz.tag}
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {quiz.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>

        {/* Back to home */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-pink-500 transition"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
