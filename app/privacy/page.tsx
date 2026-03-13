// app/privacy/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Melly",
  description:
    "Your privacy matters. Learn how Melly collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "March 13, 2026";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500">Last updated: {LAST_UPDATED}</p>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="py-20">
        <article className="max-w-3xl px-6 mx-auto prose prose-lg prose-gray prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          <p>
            Welcome to Melly (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;). We are committed to protecting your privacy and
            being transparent about how we handle your personal information.
            This Privacy Policy explains what data we collect, why we collect
            it, how we use and protect it, and your rights regarding that data.
          </p>
          <p>
            By using Melly, you agree to the practices described in this policy.
            If you do not agree, please do not use our services.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Information You Provide</h3>
          <p>
            When you create an account or use Melly, you may provide us with:
          </p>
          <ul>
            <li>
              <strong>Account information</strong> — your name, email address,
              date of birth, gender, and profile photos.
            </li>
            <li>
              <strong>Profile content</strong> — quiz responses, bio text,
              preferences, and any other content you choose to share on your
              profile.
            </li>
            <li>
              <strong>Communications</strong> — messages you send to other users
              through the app, as well as any correspondence with our support
              team.
            </li>
            <li>
              <strong>Payment information</strong> — if you purchase a
              subscription or other paid feature, our payment processor collects
              billing details on our behalf. We do not store full payment card
              numbers.
            </li>
          </ul>

          <h3>1.2 Information Collected Automatically</h3>
          <p>When you use Melly, we automatically collect:</p>
          <ul>
            <li>
              <strong>Device &amp; usage data</strong> — device type, operating
              system, app version, browser type, IP address, and usage patterns
              such as features accessed and session duration.
            </li>
            <li>
              <strong>Location data</strong> — approximate location based on
              your IP address. We will only access precise GPS location with
              your explicit consent.
            </li>
            <li>
              <strong>Cookies &amp; similar technologies</strong> — we use
              cookies, pixel tags, and local storage on our website to improve
              your experience and understand usage trends.
            </li>
          </ul>

          <h3>1.3 Information from Third Parties</h3>
          <p>
            If you sign up using a third-party service (e.g., Apple Sign-In or
            Google), we may receive your name, email, and profile picture as
            permitted by that service and your privacy settings.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>
              Provide, operate, and improve Melly&apos;s features and services.
            </li>
            <li>
              Generate compatibility insights by analyzing quiz responses and
              profile data.
            </li>
            <li>
              Personalize your experience, including match recommendations.
            </li>
            <li>
              Communicate with you about updates, promotions, and support
              inquiries.
            </li>
            <li>
              Ensure safety and integrity by detecting, investigating, and
              preventing fraud, abuse, and policy violations.
            </li>
            <li>
              Comply with legal obligations and enforce our Terms of Service.
            </li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>
            We do not sell your personal information. We may share your data in
            the following circumstances:
          </p>
          <ul>
            <li>
              <strong>With other users</strong> — your profile information, quiz
              results, and compatibility scores are visible to other Melly users
              as part of the core service.
            </li>
            <li>
              <strong>Service providers</strong> — we work with trusted
              third-party vendors for hosting, analytics, payment processing,
              customer support, and push notifications. These providers only
              access the data needed to perform their services.
            </li>
            <li>
              <strong>Legal requirements</strong> — we may disclose information
              if required by law, regulation, legal process, or governmental
              request.
            </li>
            <li>
              <strong>Business transfers</strong> — in the event of a merger,
              acquisition, or sale of assets, your information may be
              transferred as part of that transaction.
            </li>
            <li>
              <strong>With your consent</strong> — we may share data for
              purposes not described here with your explicit permission.
            </li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is
            active or as needed to provide services to you. If you delete your
            account, we will delete or anonymize your data within 90 days,
            except where retention is required by law or for legitimate business
            purposes (e.g., resolving disputes or enforcing our agreements).
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard technical and organizational measures
            to protect your data, including encryption in transit and at rest,
            access controls, and regular security assessments. However, no
            method of transmission or storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>

          <h2>6. Your Rights &amp; Choices</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>
              <strong>Access</strong> — request a copy of the personal data we
              hold about you.
            </li>
            <li>
              <strong>Correction</strong> — update or correct inaccurate
              information.
            </li>
            <li>
              <strong>Deletion</strong> — request deletion of your personal
              data, subject to legal obligations.
            </li>
            <li>
              <strong>Portability</strong> — receive your data in a structured,
              commonly used format.
            </li>
            <li>
              <strong>Opt-out</strong> — unsubscribe from marketing
              communications at any time via in-app settings or the unsubscribe
              link in our emails.
            </li>
            <li>
              <strong>Withdraw consent</strong> — where processing is based on
              consent, you may withdraw it at any time.
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:privacy@meetmelly.com">privacy@meetmelly.com</a>.
          </p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Melly is not intended for anyone under the age of 18. We do not
            knowingly collect personal information from children. If we learn
            that we have collected data from a child under 18, we will delete it
            promptly. If you believe a child has provided us with personal
            information, please contact us.
          </p>

          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries
            other than your own. We ensure appropriate safeguards are in place,
            including standard contractual clauses approved by relevant
            authorities, to protect your data during such transfers.
          </p>

          <h2>9. Third-Party Links</h2>
          <p>
            Melly may contain links to third-party websites or services. We are
            not responsible for their privacy practices. We encourage you to
            review the privacy policies of any third-party services you visit.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we make
            material changes, we will notify you through the app or by email.
            Your continued use of Melly after such changes constitutes
            acceptance of the updated policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please reach out:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:privacy@meetmelly.com">privacy@meetmelly.com</a>
            </li>
            <li>
              <strong>General inquiries:</strong>{" "}
              <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>
            </li>
          </ul>
        </article>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center bg-gray-50 border-t border-gray-100">
        <p className="mb-2 text-gray-500">
          © 2026 Melly App. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <a
            href="/privacy"
            className="text-primary hover:text-primaryDark transition font-medium"
          >
            Privacy Policy
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
