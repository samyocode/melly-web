// app/safety/page.tsx

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Safety Tips – Melly",
  description:
    "Stay safe while dating. Melly's safety tips for online and in-person interactions.",
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-pink-500 selection:text-white">
      <Navbar />
      <PageHeader
        title="Safety Tips"
        subtitle="Your safety matters to us. Follow these guidelines to protect yourself while meeting new people."
      />

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
              <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100">
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
              <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100">
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
              <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100">
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
              <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100">
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
              <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100">
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
              <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100">
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
              <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100">
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
              <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100">
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
                  className="text-pink-500 hover:underline font-medium"
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
                className="text-pink-500 hover:underline font-medium"
              >
                hello@meetmelly.com
              </a>{" "}
              with &quot;Safety Report&quot; in the subject line. We take all
              reports seriously and will respond promptly.
            </p>
          </div>
        </div>
      </main>

      <Footer currentPage="safety" />
    </div>
  );
}
