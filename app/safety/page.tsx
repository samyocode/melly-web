// app/safety/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety Tips – Melly",
  description:
    "Stay safe while dating. Melly's safety tips for online and in-person interactions.",
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-primary selection:text-white">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full py-5 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="flex items-center justify-between max-w-7xl px-8 mx-auto">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orb1"></div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Melly
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="/" className="hover:text-primary transition">
              Home
            </a>
            <a href="/#quizzes" className="hover:text-primary transition">
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

      {/* --- HERO HEADER --- */}
      <header className="relative py-20 overflow-hidden bg-[#fdf2f8]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orb1/20 via-softPinkBg to-white pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl px-6 mx-auto text-center">
          <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl">
            Safety Tips
          </h1>
          <p className="text-lg text-gray-500">
            Your safety matters to us. Follow these guidelines to protect
            yourself while meeting new people.
          </p>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="py-20">
        <div className="max-w-3xl px-6 mx-auto">
          {/* --- INTRO --- */}
          <div className="mb-16 text-base text-gray-600 leading-relaxed space-y-4">
            <p>
              Meeting new people is exciting, but it&apos;s important to stay
              cautious — whether you&apos;re chatting in the app or meeting
              someone in person. No system can guarantee the behavior of another
              person, and Melly does not conduct criminal background checks on
              users. You are ultimately responsible for your own safety, and we
              encourage you to take the following precautions seriously.
            </p>
          </div>

          {/* --- ONLINE SAFETY --- */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Protecting yourself online
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="mb-2 text-2xl">🔒</div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Guard your personal information
                </h3>
                <p className="text-sm text-gray-500">
                  Never share your home address, workplace, financial
                  information, or other sensitive details with someone you
                  haven&apos;t met in person. Keep conversations on the Melly
                  platform until you feel comfortable.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="mb-2 text-2xl">🚩</div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Watch for red flags
                </h3>
                <p className="text-sm text-gray-500">
                  Be cautious of anyone who pressures you to move off the app
                  immediately, avoids answering direct questions, asks for money
                  or financial help, or sends inconsistent information about
                  themselves.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="mb-2 text-2xl">💸</div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Never send money
                </h3>
                <p className="text-sm text-gray-500">
                  Do not send money, gift cards, cryptocurrency, or financial
                  information to anyone you&apos;ve met through the app,
                  regardless of the reason they give. This is a common scam
                  tactic.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="mb-2 text-2xl">📸</div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Be thoughtful with photos
                </h3>
                <p className="text-sm text-gray-500">
                  Avoid sharing intimate or compromising photos. Images can be
                  saved, screenshotted, or shared without your consent. Think
                  carefully before sending anything you wouldn&apos;t want made
                  public.
                </p>
              </div>
            </div>
          </section>

          {/* --- MEETING IN PERSON --- */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Meeting in person
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="mb-2 text-2xl">📍</div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Meet in public places
                </h3>
                <p className="text-sm text-gray-500">
                  Always choose a well-populated, public location for first
                  meetings — a coffee shop, restaurant, or park during the day.
                  Avoid meeting at private residences or isolated areas.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="mb-2 text-2xl">👋</div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Tell someone your plans
                </h3>
                <p className="text-sm text-gray-500">
                  Let a trusted friend or family member know where you&apos;re
                  going, who you&apos;re meeting, and when you expect to be
                  back. Share your live location with someone you trust.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="mb-2 text-2xl">🚗</div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Arrange your own transportation
                </h3>
                <p className="text-sm text-gray-500">
                  Drive yourself, use a rideshare, or take public transit. Do
                  not rely on your date for transportation, especially on a
                  first meeting, so you can leave whenever you choose.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="mb-2 text-2xl">🍹</div>
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Stay alert
                </h3>
                <p className="text-sm text-gray-500">
                  Keep an eye on your drink at all times. Don&apos;t leave food
                  or beverages unattended. If you feel uncomfortable at any
                  point, trust your instincts and leave.
                </p>
              </div>
            </div>
          </section>

          {/* --- CONSENT & RESPECT --- */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Consent &amp; respect
            </h2>
            <div className="space-y-4 text-base text-gray-600 leading-relaxed">
              <p>
                Healthy connections are built on mutual respect and clear
                communication. Remember that consent is ongoing — it can be
                given and withdrawn at any time, and it must be freely given
                without pressure or coercion.
              </p>
              <p>
                If someone says no or expresses discomfort, respect their
                boundaries. If someone is not respecting yours, you have every
                right to end the interaction and report them.
              </p>
            </div>
          </section>

          {/* --- REPORTING --- */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Reporting &amp; blocking
            </h2>
            <div className="space-y-4 text-base text-gray-600 leading-relaxed">
              <p>
                If another user makes you feel unsafe, harasses you, or violates
                our{" "}
                <a
                  href="/terms"
                  className="text-primary hover:underline font-medium"
                >
                  Terms of Service
                </a>
                , please report them immediately. You can report a user directly
                from their profile or from within a conversation. All reports
                are reviewed by our team and treated confidentially.
              </p>
              <p>
                You can also block any user at any time. Blocking prevents them
                from seeing your profile or contacting you, and they will not be
                notified that you blocked them.
              </p>
            </div>
          </section>

          {/* --- EMERGENCY --- */}
          <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
            <h3 className="mb-3 text-base font-bold text-gray-900">
              If you are in immediate danger
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you feel you are in immediate danger or are experiencing a
              life-threatening emergency, contact your local emergency services
              immediately. In the United States, call <strong>911</strong>. You
              can also reach the{" "}
              <strong>National Domestic Violence Hotline</strong> at{" "}
              <strong>1-800-799-7233</strong> or by texting{" "}
              <strong>START</strong> to <strong>88788</strong>.
            </p>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              To report safety concerns to Melly directly, email us at{" "}
              <a
                href="mailto:hello@meetmelly.com"
                className="text-primary hover:underline font-medium"
              >
                hello@meetmelly.com
              </a>{" "}
              with &quot;Safety Report&quot; in the subject line. We take all
              reports seriously and will respond promptly.
            </p>
          </div>
        </div>
      </main>

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
