// app/page.tsx

import Script from "next/script";
import Image from "next/image";
import Orb from "@/components/Orb";

// --- HARDCODED DATA ---
const QUIZZES = [
  {
    title: "Pick Your Power",
    description:
      "If you could have any superpower, what would it be? This fun quiz reveals your secret personality through your choice of amazing abilities.",
    cover_image_key: "power",
  },
  {
    title: "Soul Recharge",
    description:
      "When your personal battery is at zero, what plugs you back in? Discover what truly recharges your mind, body, and spirit.",
    cover_image_key: "soul_recharge",
  },
  {
    title: "Recharge Mode",
    description:
      "Discover how you recharge your energy and your ideal social setting.",
    cover_image_key: "recharge",
  },
  {
    title: "The 10-Year Plan",
    description:
      "What is the grand plan for your one precious life? This quiz uncovers your core ambitions and your vision for the future.",
    cover_image_key: "10_year",
  },
  {
    title: "All In or Play It Safe?",
    description:
      "Are you a cautious saver or a bold investor? This quiz reveals your natural comfort level with financial risk and uncertainty.",
    cover_image_key: "all_in_vs_safe",
  },
  {
    title: "Making Amends",
    description:
      "What does a sincere apology look like to you? Discover how you make amends and what you need to hear to truly forgive.",
    cover_image_key: "amends",
  },
  {
    title: "The Bill Splitter",
    description:
      "How do you approach money and financial decisions in a partnership?",
    cover_image_key: "bill_splitter",
  },
  {
    title: "Your Brain on Love",
    description:
      "Based on the research of Dr. Helen Fisher, this quiz uncovers your biological temperament and what you naturally seek in a partner.",
    cover_image_key: "brain_on_love",
  },
  {
    title: "Is It Cheating?",
    description:
      "Liking an ex's photo at 2 AM? Keeping a 'work spouse' secret? This quiz explores the grey areas of modern relationships to find your personal boundaries.",
    cover_image_key: "cheating",
  },
  {
    title: "City Slicker / Country Soul",
    description:
      "Discover the setting where you feel most at home: the city, the suburbs, the country, or always on the move.",
    cover_image_key: "city_vs_country",
  },
  {
    title: "Clingy or Cool?",
    description:
      "Discover your unique way of connecting in relationships. This quiz, based on Attachment Theory, reveals how you bond with partners.",
    cover_image_key: "clingy_vs_cool",
  },
  {
    title: "Comedy Love Language",
    description:
      "What makes you laugh out loud? Discover your unique comedic voice and who you'll share the best inside jokes with.",
    cover_image_key: "comedy",
  },
  {
    title: "Your Dating DNA",
    description:
      "Initial assessment to understand core personality and dating styles from the conversational onboarding flow.",
    cover_image_key: "dating_dna",
  },
  {
    title: "Dreamer or Realist?",
    description:
      "Are you driven by big ideas, practical realities, logical analysis, or gut feelings? Discover the mental lens you use to navigate the world.",
    cover_image_key: "dreamer_vs_realist",
  },
  {
    title: "Early Bird or Night Owl?",
    description:
      "Are you powered by the sunrise or the moonlight? This quiz uncovers your natural biological rhythm for peak energy and focus.",
    cover_image_key: "early_vs_night",
  },
  {
    title: "Fight or Flight?",
    description:
      "Discover your approach to disagreements and what you need to feel heard.",
    cover_image_key: "fight_vs_flight",
  },
  {
    title: "Fixer or Listener?",
    description:
      "When your partner is struggling, are you a problem-solver, an empathetic listener, a cheerleader, or a steady rock? Discover your support style.",
    cover_image_key: "fixer_vs_listener",
  },
  {
    title: "Foodie or Fuel?",
    description:
      "Is food an art, fuel, comfort, or convenience? Discover your personal approach to eating and who you'd share a perfect meal with.",
    cover_image_key: "foodie_vs_fuel",
  },
  {
    title: "The Glow Up Guide",
    description:
      "How do you evolve? Discover if you're a steady improver, a big leap-taker, a reflective learner, or a collaborative builder.",
    cover_image_key: "glowup",
  },
  {
    title: "The Ick Detector",
    description:
      "What do you notice first on a dating profile? This quiz, inspired by the social media trend, reveals if you're looking for red flags, green flags, or those quirky 'beige' flags.",
    cover_image_key: "ick",
  },
  {
    title: "Meet the Parents",
    description:
      "Are holidays a huge family affair or a quiet getaway? Discover your unique approach to navigating parents, siblings, and the all-important in-laws.",
    cover_image_key: "parents",
  },
  {
    title: "Passport Personality",
    description:
      "Are you a luxury lounger or a backpacker explorer? Discover how you experience the world and who you should travel it with.",
    cover_image_key: "passport",
  },
  {
    title: "Planner or Winger?",
    description:
      "Do you feel best with a detailed schedule or an open road? This quiz reveals how you approach organizing your time and making plans.",
    cover_image_key: "planner_vs_winger",
  },
  {
    title: "The Roommate Test",
    description:
      "Are you a meticulous organizer, a cozy clutter-bug, or a practical DIYer? Discover your unique approach to creating a home.",
    cover_image_key: "roommate",
  },
  {
    title: "Roots vs. Wings",
    description:
      "Do you thrive on a predictable routine and a solid home base, or are you constantly seeking freedom and new horizons?",
    cover_image_key: "roots_vs_wings",
  },
  {
    title: "Saint or Sinner?",
    description:
      "What guides your decisions when things get complicated? This quiz uncovers your core ethical principles for navigating the world.",
    cover_image_key: "saint_vs_sinner",
  },
  {
    title: "The Saturday Test",
    description:
      "What energizes you in your free time? Discover if you're a Creator, a Thinker, an Adventurer, or a Connector.",
    cover_image_key: "saturday",
  },
  {
    title: "Spender or Saver?",
    description:
      "Is money a source of anxiety, a tool for freedom, or a measure of success? This quiz uncovers your core beliefs about wealth.",
    cover_image_key: "spender_vs_saver",
  },
  {
    title: "Squad Goals",
    description:
      "Discover how you connect with others and your ideal social circle.",
    cover_image_key: "squad",
  },
  {
    title: "Twin Flame or Solo Flyer?",
    description:
      "How do you and a partner build a life together while honoring your individual selves? Discover your unique approach to growth and independence.",
    cover_image_key: "twin_vs_solo",
  },
  {
    title: "Vent or Vanish?",
    description:
      "Do you need to talk it out right now, or do you need a moment to think? Discover your natural rhythm for communication.",
    cover_image_key: "vent_vs_vanish",
  },
];

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Melly",
    applicationCategory: "DatingApplication",
    operatingSystem: "iOS, Android",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-primary selection:text-white">
      <Script
        id="app-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- NAVBAR --- */}
      <nav className="absolute top-0 left-0 z-50 w-full py-6 bg-transparent">
        <div className="flex items-center justify-between max-w-7xl px-8 mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orb1"></div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Melly
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-primary transition">
              Home
            </a>
            <a href="#quizzes" className="hover:text-primary transition">
              Quizzes
            </a>
            <a
              href="mailto:hello@meetmelly.com"
              className="hover:text-primary transition"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-gray-700 hover:text-primary transition">
              Log in
            </button>
            <button className="px-5 py-2.5 text-sm font-bold text-white rounded-full bg-primary hover:bg-primaryDark transition shadow-md shadow-primary/20">
              Download
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 overflow-hidden text-center bg-[#fdf2f8]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orb1/20 via-softPinkBg to-white pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl px-6 mx-auto">
          <h1 className="mb-8 text-6xl font-extrabold leading-none tracking-tight text-gray-900 md:text-7xl">
            Stop collecting matches
            {/* <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orb2">
              Matchmaker app
            </span> */}
          </h1>

          <p className="max-w-2xl mx-auto mb-10 text-xl text-gray-600">
            Break the endless swipe cycle & start going on dates
          </p>

          {/* App Store Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 mb-16 sm:flex-row">
            <button className="flex items-center gap-3 px-6 py-3.5 text-white transition rounded-xl bg-black hover:bg-gray-900">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.79-1.31.02-2.3-1.23-3.14-2.47-2.17-3.15-2.31-6.52-1.14-8.36 1.14-1.76 3.07-2.08 4.65-2.08 1.3 0 2.51.88 3.3.88.78 0 2.24-.92 3.79-.88 1.27.05 2.43.52 3.26 1.37-2.91 1.75-2.44 5.64.35 6.84-.62 1.62-1.47 3.23-2.22 4.46zM13 3.5c.73-.83 1.21-1.96 1.07-3.1-1.05.08-2.31.71-3.06 1.54-.71.81-1.32 2.04-1.17 3.13 1.17.09 2.38-.69 3.16-1.57z" />
              </svg>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-bold leading-none">App Store</div>
              </div>
            </button>

            <button className="flex items-center gap-3 px-6 py-3.5 text-white transition rounded-xl bg-black hover:bg-gray-900">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91,3.34,2.39,3.84,2.15L13.69,12L3.84,21.85C3.34,21.6,3,21.09,3,20.5M16.81,15.12L21.25,12.69C21.71,12.44,22,11.97,22,11.5C22,11.03,21.71,10.56,21.25,10.31L16.81,7.88L14.75,9.94L16.81,12L14.75,14.06L16.81,15.12M14.75,14.06L16.81,12L14.75,9.94L5,0.19C5.31,0.08,5.66,0.04,6,0.04C6.53,0.04,7.03,0.24,7.41,0.62L14.75,7.97V16.03L7.41,23.38C7.03,23.76,6.53,23.96,6,23.96C5.66,23.96,5.31,23.92,5,23.81L14.75,14.06Z" />
              </svg>
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-lg font-bold leading-none">
                  Google Play
                </div>
              </div>
            </button>
          </div>

          {/* Center Phone Mockup */}
          <div className="relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 scale-[1.8] opacity-40">
              <Orb />
            </div>

            <div className="relative w-[320px] h-[640px] bg-white rounded-[3.5rem] border-[10px] border-gray-900 shadow-2xl overflow-hidden z-20">
              <div className="p-6 bg-white border-b border-gray-50">
                <div className="w-10 h-10 mb-3 rounded-full bg-gradient-to-br from-primary to-orb1"></div>
                <div className="w-32 h-5 bg-gray-100 rounded-full"></div>
              </div>
              <div className="p-5 space-y-6 bg-gray-50 h-full">
                <div className="self-end p-4 ml-auto text-sm text-white shadow-sm bg-primary rounded-2xl rounded-tr-sm max-w-[85%]">
                  Have you taken the &quot;City vs Country&quot; quiz yet?
                </div>
                <div className="self-start p-4 mr-auto text-sm text-gray-800 bg-white shadow-sm rounded-2xl rounded-tl-sm max-w-[85%]">
                  Yes! I got &quot;Urban Soul&quot;. What about you?
                </div>
                <div className="self-end p-3 ml-auto text-sm font-medium border shadow-sm bg-aiAccent text-primaryDark border-softPinkBorder rounded-2xl rounded-tr-sm max-w-[85%] flex items-center gap-2">
                  <span className="text-base">✨</span> Compatibility Match: 94%
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- QUIZ CARDS SECTION --- */}
      <section id="quizzes" className="py-24 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Explore Our Quizzes
            </h2>
            <p className="text-xl text-gray-500">
              See what everyone is talking about.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {QUIZZES.map((quiz) => (
              <div
                key={quiz.title}
                className="overflow-hidden transition duration-300 transform bg-white border border-gray-100 shadow-sm group rounded-3xl hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="relative w-full h-56 overflow-hidden bg-gray-100">
                  <Image
                    src={`/quizzes/${quiz.cover_image_key}.jpg`}
                    alt={quiz.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 opacity-50 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <h3 className="absolute bottom-5 left-5 text-2xl font-bold text-white shadow-sm">
                    {quiz.title}
                  </h3>
                </div>

                <div className="p-6">
                  <p className="mb-6 text-base leading-relaxed text-gray-600 line-clamp-4">
                    {quiz.description}
                  </p>
                  <div className="flex items-center text-base font-bold text-primary">
                    <span>Take Quiz in App</span>
                    <svg
                      className="w-5 h-5 ml-2 transition transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center bg-gray-50 border-t border-gray-100">
        <p className="mb-2 text-gray-500">© 2026 Melly. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <a
            href="/privacy"
            className="text-primary hover:text-primaryDark transition font-medium"
          >
            Privacy Policy
          </a>
          <span className="text-gray-300">·</span>
          <a
            href="/terms"
            className="text-primary hover:text-primaryDark transition font-medium"
          >
            Terms of Service
          </a>
          <span className="text-gray-300">·</span>
          <a
            href="mailto:hello@meetmelly.com"
            className="text-primary hover:text-primaryDark transition"
          >
            hello@meetmelly.com
          </a>
        </div>
      </footer>
    </div>
  );
}
