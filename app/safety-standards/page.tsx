// app/safety-standards/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety Standards – Melly",
  description:
    "Learn how Melly prevents and addresses child sexual abuse and exploitation (CSAE) to keep our community safe.",
};

const LAST_UPDATED = "March 19, 2026";
const EFFECTIVE_DATE = "March 19, 2026";

export default function SafetyStandardsPage() {
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
            Safety Standards
          </h1>
          <p className="text-lg text-gray-500">
            Effective: {EFFECTIVE_DATE} · Last updated: {LAST_UPDATED}
          </p>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="py-20">
        <article className="max-w-3xl px-6 mx-auto prose prose-lg prose-gray prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          {/* ---- INTRODUCTION ---- */}
          <p>
            Escondido Development LLC (&quot;Melly,&quot; &quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;) is committed to creating a safe
            environment for all users. As a dating platform restricted to adults
            aged 18 and older, we have zero tolerance for child sexual abuse and
            exploitation (&quot;CSAE&quot;) in any form. This page describes the
            standards, policies, and practices we maintain to prevent, detect,
            and respond to CSAE on our platform.
          </p>

          {/* ---- 1. ZERO TOLERANCE POLICY ---- */}
          <h2>1. Zero Tolerance Policy</h2>
          <p>
            Melly maintains a strict zero-tolerance policy toward any form of
            child sexual abuse and exploitation. This includes, but is not
            limited to:
          </p>
          <ul>
            <li>
              Child sexual abuse material (CSAM), including images, videos, or
              any visual depiction of sexually explicit conduct involving a
              minor.
            </li>
            <li>
              Solicitation, grooming, or enticement of minors for sexual
              purposes.
            </li>
            <li>
              Sex trafficking or commercial sexual exploitation of children.
            </li>
            <li>
              Any content or behavior that sexualizes, exploits, or endangers
              minors.
            </li>
          </ul>
          <p>
            Any user found to be engaging in or promoting CSAE will be
            immediately and permanently banned from the platform, their content
            will be removed, and the incident will be reported to the
            appropriate authorities.
          </p>

          {/* ---- 2. AGE VERIFICATION & ENFORCEMENT ---- */}
          <h2>2. Age Verification &amp; Enforcement</h2>
          <p>
            Melly is exclusively available to users aged 18 and older. We
            enforce this through the following measures:
          </p>
          <ul>
            <li>
              <strong>Age gate at registration</strong> — All users must provide
              their date of birth during account creation. Users under 18 are
              blocked from creating an account.
            </li>
            <li>
              <strong>Authentication provider verification</strong> — We use
              Apple Sign-In and Google Sign-In, which require users to have
              accounts that meet each provider&apos;s age requirements.
            </li>
            <li>
              <strong>Ongoing monitoring</strong> — If at any point we discover
              or reasonably suspect that a user is under 18, we will immediately
              suspend the account, remove associated content, and delete
              personal data in accordance with applicable law.
            </li>
          </ul>

          {/* ---- 3. DETECTION & PREVENTION ---- */}
          <h2>3. Detection &amp; Prevention</h2>
          <p>
            We employ a combination of technology and human oversight to detect
            and prevent CSAE on our platform:
          </p>
          <ul>
            <li>
              <strong>Content moderation</strong> — User-uploaded photos and
              media are subject to review. We use a combination of automated
              systems and human moderators to identify and remove prohibited
              content, including CSAM.
            </li>
            <li>
              <strong>Behavioral signals</strong> — We monitor for patterns of
              behavior that may indicate grooming, solicitation, or other
              exploitation attempts.
            </li>
            <li>
              <strong>Profile review</strong> — Profiles that exhibit suspicious
              characteristics are flagged for manual review by our trust and
              safety team.
            </li>
            <li>
              <strong>Keyword and pattern detection</strong> — Our systems scan
              for language and behavioral patterns commonly associated with
              CSAE.
            </li>
          </ul>

          {/* ---- 4. IN-APP REPORTING ---- */}
          <h2>4. In-App Reporting</h2>
          <p>
            Melly provides accessible tools for users to report CSAE and other
            safety concerns directly within the app:
          </p>
          <ul>
            <li>
              <strong>Report button</strong> — Every user profile and
              conversation includes a clearly visible &quot;Report&quot; button
              that allows users to flag concerning content or behavior.
            </li>
            <li>
              <strong>Dedicated reporting categories</strong> — Our reporting
              flow includes specific categories for underage users, CSAM, and
              exploitation, ensuring that these reports are prioritized and
              escalated immediately.
            </li>
            <li>
              <strong>Anonymous reporting</strong> — Users can submit reports
              without the reported party being notified of the reporter&apos;s
              identity.
            </li>
            <li>
              <strong>Rapid response</strong> — Reports related to child safety
              are treated as highest priority and are reviewed by our trust and
              safety team promptly.
            </li>
          </ul>
          <p>
            Users can also report concerns via email at{" "}
            <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>.
          </p>

          {/* ---- 5. REPORTING TO AUTHORITIES ---- */}
          <h2>5. Reporting to Authorities</h2>
          <p>
            Melly complies with all applicable laws regarding the reporting of
            CSAE. Our reporting practices include:
          </p>
          <ul>
            <li>
              <strong>NCMEC reporting</strong> — We report all identified or
              suspected instances of CSAM to the National Center for Missing
              &amp; Exploited Children (NCMEC) via the CyberTipline, as required
              by U.S. federal law (18 U.S.C. § 2258A).
            </li>
            <li>
              <strong>Law enforcement cooperation</strong> — We cooperate fully
              with law enforcement agencies investigating CSAE. We respond to
              valid legal process and may proactively refer cases involving
              imminent threats to child safety.
            </li>
            <li>
              <strong>International authorities</strong> — Where applicable, we
              report to relevant regional and national authorities in accordance
              with local laws and regulations.
            </li>
            <li>
              <strong>Evidence preservation</strong> — When CSAE is identified
              or reported, we preserve relevant evidence and account data as
              required by law and to support investigations by authorities.
            </li>
          </ul>

          {/* ---- 6. STAFF TRAINING & ACCOUNTABILITY ---- */}
          <h2>6. Staff Training &amp; Accountability</h2>
          <p>
            All team members involved in content moderation, trust and safety,
            and user support receive training on:
          </p>
          <ul>
            <li>Identifying CSAE and CSAM.</li>
            <li>Proper handling and escalation of CSAE reports.</li>
            <li>
              Legal obligations related to mandatory reporting and evidence
              preservation.
            </li>
            <li>
              Trauma-informed approaches to handling sensitive content and
              interacting with affected users.
            </li>
          </ul>

          {/* ---- 7. POLICY UPDATES ---- */}
          <h2>7. Policy Updates</h2>
          <p>
            We regularly review and update our safety standards to reflect
            evolving best practices, emerging threats, and changes in applicable
            law. Material updates to this page will be reflected in the
            &quot;Last updated&quot; date above. We are committed to continuous
            improvement in our efforts to protect children and maintain a safe
            platform.
          </p>

          {/* ---- 8. CONTACT ---- */}
          <h2>8. Contact Us</h2>
          <p>
            If you have questions about our safety standards, wish to report a
            concern related to child safety, or need to reach our designated
            point of contact for CSAM prevention and compliance, please contact
            us:
          </p>
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Safety &amp; compliance inquiries</td>
                <td>
                  <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>
                </td>
              </tr>
              <tr>
                <td>In-app reporting</td>
                <td>
                  Use the &quot;Report&quot; button on any profile or
                  conversation
                </td>
              </tr>
              <tr>
                <td>NCMEC CyberTipline</td>
                <td>
                  <a
                    href="https://www.missingkids.org/gethelpnow/cybertipline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.missingkids.org/gethelpnow/cybertipline
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
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
            href="/safety-standards"
            className="text-primary hover:text-primaryDark transition font-medium"
          >
            Safety Standards
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
