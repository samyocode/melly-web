// app/privacy/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Melly",
  description:
    "Your privacy matters. Learn how Melly collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "March 13, 2026";
const EFFECTIVE_DATE = "March 13, 2026";

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
            Melly App, Inc. (&quot;Melly,&quot; &quot;we,&quot; &quot;us,&quot;
            or &quot;our&quot;) operates the Melly mobile application and
            website located at{" "}
            <a href="https://www.meetmelly.com">www.meetmelly.com</a>{" "}
            (collectively, the &quot;Service&quot;). This Privacy Policy
            describes how we collect, use, disclose, retain, and protect your
            personal information when you access or use the Service. It also
            explains the rights and choices available to you regarding your
            data.
          </p>
          <p>
            By creating an account or using any part of the Service, you
            acknowledge that you have read and understood this Privacy Policy.
            If you do not agree with the practices described herein, you must
            discontinue use of the Service immediately.
          </p>
          <p>
            For the purposes of the EU General Data Protection Regulation
            (&quot;GDPR&quot;), Melly App, Inc. is the data controller. For
            questions about this policy or our data practices, contact our Data
            Protection Officer at{" "}
            <a href="mailto:dpo@meetmelly.com">dpo@meetmelly.com</a>.
          </p>

          {/* ---- 1. DEFINITIONS ---- */}
          <h2>1. Definitions</h2>
          <p>
            <strong>&quot;Personal Data&quot;</strong> means any information
            relating to an identified or identifiable natural person, as defined
            under applicable law including the GDPR and the California Consumer
            Privacy Act (&quot;CCPA&quot;).
          </p>
          <p>
            <strong>&quot;Sensitive Personal Data&quot;</strong> means Personal
            Data that reveals racial or ethnic origin, religious or
            philosophical beliefs, sexual orientation, gender identity, or
            health information. Given the nature of a dating application, Melly
            may process certain categories of Sensitive Personal Data as
            described below.
          </p>
          <p>
            <strong>&quot;Processing&quot;</strong> means any operation
            performed on Personal Data, including collection, storage, use,
            disclosure, and deletion.
          </p>

          {/* ---- 2. INFORMATION WE COLLECT ---- */}
          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide Directly</h3>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Legal Basis (GDPR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account &amp; identity</td>
                <td>
                  Name, email address, phone number, date of birth, gender,
                  profile photographs
                </td>
                <td>Performance of contract; legitimate interest</td>
              </tr>
              <tr>
                <td>Profile &amp; preference</td>
                <td>
                  Quiz responses, bio text, relationship preferences, lifestyle
                  information, interests
                </td>
                <td>Performance of contract; consent for sensitive data</td>
              </tr>
              <tr>
                <td>User-generated content</td>
                <td>
                  Messages sent to other users, photos and media shared in
                  conversations
                </td>
                <td>Performance of contract</td>
              </tr>
              <tr>
                <td>Payment &amp; transaction</td>
                <td>
                  Purchase history, subscription tier. Full payment card details
                  are processed by our PCI-DSS-compliant payment processor and
                  are never stored on our servers.
                </td>
                <td>Performance of contract; legal obligation</td>
              </tr>
              <tr>
                <td>Support &amp; correspondence</td>
                <td>
                  Emails, in-app support tickets, feedback, and any attachments
                  you provide
                </td>
                <td>Legitimate interest; performance of contract</td>
              </tr>
              <tr>
                <td>Verification</td>
                <td>
                  Government-issued ID or selfie photos submitted for identity
                  or age verification, if applicable
                </td>
                <td>Legal obligation; consent</td>
              </tr>
            </tbody>
          </table>

          <h3>2.2 Information Collected Automatically</h3>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Legal Basis (GDPR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Device &amp; technical</td>
                <td>
                  Device model, operating system and version, unique device
                  identifiers (e.g., IDFA, GAID), app version, browser type and
                  version, IP address, mobile carrier
                </td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Usage &amp; behavioral</td>
                <td>
                  Features accessed, screens viewed, tap and scroll
                  interactions, session duration, referral source, crash logs
                </td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>
                  Approximate location derived from IP address. Precise GPS
                  location is collected only with your explicit, revocable
                  consent via your device&apos;s operating system permission
                  prompt.
                </td>
                <td>Consent (precise); legitimate interest (approximate)</td>
              </tr>
              <tr>
                <td>Cookies &amp; tracking technologies</td>
                <td>
                  Cookies, pixel tags, web beacons, local storage, and SDKs used
                  on our website and within the app
                </td>
                <td>Consent (where required); legitimate interest</td>
              </tr>
            </tbody>
          </table>

          <h3>2.3 Information from Third Parties</h3>
          <p>
            If you register or log in using a third-party authentication service
            (e.g., Apple Sign-In, Google Sign-In), we receive your name, email
            address, and profile picture as authorized by you and permitted by
            that provider&apos;s policies. We may also receive information from
            analytics partners, advertising networks, and fraud-prevention
            services to improve the Service and protect users.
          </p>

          <h3>2.4 Sensitive Personal Data</h3>
          <p>
            Because Melly is a dating application, certain information you
            choose to provide — such as sexual orientation, gender identity,
            religious beliefs, or ethnicity — may constitute Sensitive Personal
            Data under applicable law. We process this data solely to provide
            our matching and compatibility features, and only with your explicit
            consent. You may withdraw consent at any time by deleting the
            relevant information from your profile or by contacting us at{" "}
            <a href="mailto:privacy@meetmelly.com">privacy@meetmelly.com</a>.
            Withdrawal of consent does not affect the lawfulness of processing
            carried out prior to withdrawal.
          </p>

          {/* ---- 3. HOW WE USE YOUR INFORMATION ---- */}
          <h2>3. How We Use Your Information</h2>
          <p>We process your Personal Data for the following purposes:</p>
          <table>
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Legal Basis (GDPR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Providing and operating the Service, including account
                  creation, profile display, messaging, and quiz-based
                  compatibility matching
                </td>
                <td>Performance of contract</td>
              </tr>
              <tr>
                <td>
                  Generating compatibility scores and match recommendations
                  based on quiz responses and profile data
                </td>
                <td>Performance of contract; consent for sensitive data</td>
              </tr>
              <tr>
                <td>
                  Personalizing your experience, including content
                  recommendations and feature suggestions
                </td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>
                  Communicating with you regarding account activity, service
                  updates, and responding to support requests
                </td>
                <td>Performance of contract; legitimate interest</td>
              </tr>
              <tr>
                <td>
                  Sending promotional and marketing communications (only with
                  your opt-in consent where required by law)
                </td>
                <td>Consent</td>
              </tr>
              <tr>
                <td>
                  Safety, security, and fraud prevention — including detecting
                  fake accounts, preventing harassment, and enforcing our Terms
                  of Service and Community Guidelines
                </td>
                <td>Legitimate interest; legal obligation</td>
              </tr>
              <tr>
                <td>
                  Analytics and product improvement — understanding usage
                  patterns, diagnosing technical issues, and improving our
                  features
                </td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>
                  Complying with applicable laws, regulations, legal processes,
                  and enforceable governmental requests
                </td>
                <td>Legal obligation</td>
              </tr>
            </tbody>
          </table>

          {/* ---- 4. HOW WE SHARE YOUR INFORMATION ---- */}
          <h2>4. How We Share Your Information</h2>
          <p>
            <strong>We do not sell your Personal Data.</strong> For the purposes
            of the CCPA, we do not &quot;sell&quot; or &quot;share&quot; (as
            those terms are defined under Cal. Civ. Code § 1798.140) your
            Personal Data to third parties for monetary or other valuable
            consideration, nor do we share it for cross-context behavioral
            advertising.
          </p>
          <p>
            We may disclose your data to the following categories of recipients:
          </p>
          <table>
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Purpose</th>
                <th>Safeguards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Other Melly users</td>
                <td>
                  Your profile information, quiz results, compatibility scores,
                  and messages are visible to other users as part of the core
                  Service functionality
                </td>
                <td>
                  You control what you share on your profile; messaging content
                  is only visible to conversation participants
                </td>
              </tr>
              <tr>
                <td>Service providers &amp; processors</td>
                <td>
                  Cloud hosting (e.g., AWS, GCP), analytics, payment processing,
                  push notification delivery, customer support tooling, content
                  moderation
                </td>
                <td>
                  Data Processing Agreements (DPAs) with each vendor; access
                  limited to what is necessary to perform their service
                </td>
              </tr>
              <tr>
                <td>Safety &amp; moderation partners</td>
                <td>
                  Detecting and preventing fraud, spam, harassment, and illegal
                  activity
                </td>
                <td>DPAs; processing limited to safety purposes</td>
              </tr>
              <tr>
                <td>Law enforcement &amp; legal authorities</td>
                <td>
                  Responding to valid legal process including subpoenas, court
                  orders, or requests where disclosure is necessary to protect
                  the safety of any person
                </td>
                <td>
                  We review each request for legal validity and narrow scope
                  before disclosing
                </td>
              </tr>
              <tr>
                <td>Corporate transaction parties</td>
                <td>
                  In connection with a merger, acquisition, financing,
                  reorganization, bankruptcy, or sale of assets
                </td>
                <td>
                  Acquiring entity bound by this Privacy Policy or equivalent
                  protections; users notified in advance
                </td>
              </tr>
              <tr>
                <td>With your consent</td>
                <td>
                  Any additional sharing not described above requires your
                  explicit, informed consent
                </td>
                <td>Consent is freely given, specific, and revocable</td>
              </tr>
            </tbody>
          </table>

          {/* ---- 5. DATA RETENTION ---- */}
          <h2>5. Data Retention</h2>
          <p>
            We retain your Personal Data only as long as reasonably necessary
            for the purposes outlined in this policy. Specific retention periods
            are as follows:
          </p>
          <table>
            <thead>
              <tr>
                <th>Data Category</th>
                <th>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Active account data</td>
                <td>
                  Duration of your account plus 30 days following deletion
                  request (grace period for account recovery)
                </td>
              </tr>
              <tr>
                <td>Messages</td>
                <td>
                  Deleted within 90 days after both participants have deleted
                  their accounts, unless retention is required for an active
                  safety investigation or legal obligation
                </td>
              </tr>
              <tr>
                <td>Verification data (ID, selfies)</td>
                <td>
                  Deleted within 30 days after verification is complete, unless
                  required for dispute resolution
                </td>
              </tr>
              <tr>
                <td>Payment records</td>
                <td>
                  Retained for 7 years as required by applicable tax and
                  financial regulations
                </td>
              </tr>
              <tr>
                <td>Usage &amp; analytics logs</td>
                <td>Aggregated or anonymized within 24 months</td>
              </tr>
              <tr>
                <td>Safety &amp; moderation records</td>
                <td>
                  Up to 3 years following the incident, or as required by law
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            When data is no longer needed, it is irreversibly deleted or
            anonymized so that it can no longer be associated with you.
          </p>
          <p>
            To request deletion of your account and all associated data, visit
            our <a href="/delete-account">Account Deletion Request</a> page, use
            the in-app Settings &gt; Account &gt; Delete Account option, or
            email us at{" "}
            <a href="mailto:privacy@meetmelly.com">privacy@meetmelly.com</a>.
          </p>

          {/* ---- 6. DATA SECURITY ---- */}
          <h2>6. Data Security</h2>
          <p>
            We implement technical and organizational measures designed to
            protect your data against unauthorized access, alteration,
            disclosure, or destruction. These measures include, but are not
            limited to:
          </p>
          <ul>
            <li>
              Encryption of data in transit (TLS 1.2+) and at rest (AES-256).
            </li>
            <li>
              Role-based access controls ensuring employees access only the data
              necessary for their function.
            </li>
            <li>
              Regular penetration testing and vulnerability assessments by
              independent third parties.
            </li>
            <li>
              Incident response procedures with notification to affected users
              and relevant authorities within timeframes required by applicable
              law (e.g., 72 hours under the GDPR).
            </li>
          </ul>
          <p>
            No system is completely secure. While we strive to protect your
            data, we cannot guarantee absolute security. You are responsible for
            maintaining the confidentiality of your account credentials.
          </p>

          {/* ---- 7. YOUR RIGHTS ---- */}
          <h2>7. Your Rights</h2>

          <h3>7.1 Rights Under the GDPR (EEA, UK, and Switzerland)</h3>
          <p>
            If you are located in the European Economic Area, the United
            Kingdom, or Switzerland, you have the following rights under the
            GDPR (and equivalent local legislation):
          </p>
          <ul>
            <li>
              <strong>Right of access</strong> (Art. 15) — obtain confirmation
              of whether we process your data and request a copy of it.
            </li>
            <li>
              <strong>Right to rectification</strong> (Art. 16) — correct
              inaccurate or incomplete data.
            </li>
            <li>
              <strong>Right to erasure</strong> (Art. 17) — request deletion of
              your data where it is no longer necessary, you withdraw consent,
              or processing is unlawful.
            </li>
            <li>
              <strong>Right to restriction of processing</strong> (Art. 18) —
              request that we limit processing in certain circumstances.
            </li>
            <li>
              <strong>Right to data portability</strong> (Art. 20) — receive
              your data in a structured, commonly used, machine-readable format.
            </li>
            <li>
              <strong>Right to object</strong> (Art. 21) — object to processing
              based on legitimate interest, including profiling.
            </li>
            <li>
              <strong>Right to withdraw consent</strong> (Art. 7) — withdraw
              consent at any time where processing is consent-based, without
              affecting prior lawful processing.
            </li>
            <li>
              <strong>Right to lodge a complaint</strong> — file a complaint
              with your local supervisory authority.
            </li>
          </ul>

          <h3>7.2 Rights Under the CCPA / CPRA (California Residents)</h3>
          <p>
            If you are a California resident, you have the following rights
            under the California Consumer Privacy Act, as amended by the
            California Privacy Rights Act:
          </p>
          <ul>
            <li>
              <strong>Right to know</strong> — request disclosure of the
              categories and specific pieces of Personal Data we have collected,
              the sources, the business purposes, and the categories of third
              parties with whom we share it.
            </li>
            <li>
              <strong>Right to delete</strong> — request deletion of your
              Personal Data, subject to statutory exceptions.
            </li>
            <li>
              <strong>Right to correct</strong> — request correction of
              inaccurate Personal Data.
            </li>
            <li>
              <strong>Right to opt out of sale or sharing</strong> — as stated
              above, we do not sell or share your Personal Data. Should this
              change, we will provide a conspicuous &quot;Do Not Sell or Share
              My Personal Information&quot; link.
            </li>
            <li>
              <strong>Right to limit use of sensitive Personal Data</strong> —
              you may direct us to limit use of sensitive categories to what is
              necessary to provide the Service.
            </li>
            <li>
              <strong>Right to non-discrimination</strong> — we will not
              discriminate against you for exercising any of these rights.
            </li>
          </ul>
          <p>
            To exercise any right under this Section 7, contact us at{" "}
            <a href="mailto:privacy@meetmelly.com">privacy@meetmelly.com</a> or
            through the in-app Settings &gt; Privacy menu. To request account
            and data deletion specifically, you may also use our{" "}
            <a href="/delete-account">Account Deletion Request</a> page. We will
            verify your identity before processing your request and respond
            within 30 days (GDPR) or 45 days (CCPA), with extensions as
            permitted by law.
          </p>

          {/* ---- 8. INTERNATIONAL TRANSFERS ---- */}
          <h2>8. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries other
            than your country of residence, including the United States. When we
            transfer data outside the EEA, UK, or Switzerland, we rely on one or
            more of the following safeguards:
          </p>
          <ul>
            <li>
              Standard Contractual Clauses (SCCs) approved by the European
              Commission.
            </li>
            <li>
              The UK International Data Transfer Agreement or Addendum, as
              applicable.
            </li>
            <li>
              An adequacy decision by the European Commission or UK Secretary of
              State recognizing the recipient country&apos;s data protection
              standards.
            </li>
            <li>Your explicit consent, where applicable.</li>
          </ul>
          <p>
            You may request a copy of the relevant transfer mechanism by
            contacting <a href="mailto:dpo@meetmelly.com">dpo@meetmelly.com</a>.
          </p>

          {/* ---- 9. CHILDREN ---- */}
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            The Service is not directed to, and we do not knowingly collect
            Personal Data from, anyone under the age of 18 (or the age of
            majority in your jurisdiction, if higher). We implement
            age-screening measures during account creation. If we become aware
            that we have collected data from a person under the applicable
            minimum age, we will promptly delete that data and terminate the
            associated account. If you believe a minor has provided us with
            Personal Data, please contact us immediately at{" "}
            <a href="mailto:privacy@meetmelly.com">privacy@meetmelly.com</a>.
          </p>

          {/* ---- 10. AUTOMATED DECISION-MAKING ---- */}
          <h2>10. Automated Decision-Making &amp; Profiling</h2>
          <p>
            Melly uses algorithmic processing to generate compatibility scores
            and match recommendations based on your quiz responses and profile
            data. This processing constitutes profiling under the GDPR. You have
            the right to request human review of any automated decision that
            significantly affects you, to express your point of view, and to
            contest the decision by contacting us at{" "}
            <a href="mailto:privacy@meetmelly.com">privacy@meetmelly.com</a>.
          </p>

          {/* ---- 11. COOKIES ---- */}
          <h2>11. Cookies &amp; Tracking Technologies</h2>
          <p>
            Our website uses cookies and similar technologies for the following
            purposes:
          </p>
          <ul>
            <li>
              <strong>Strictly necessary cookies</strong> — required for the
              website to function (e.g., session management, security). These
              cannot be disabled.
            </li>
            <li>
              <strong>Functional cookies</strong> — remember your preferences
              and settings.
            </li>
            <li>
              <strong>Analytics cookies</strong> — help us understand how
              visitors interact with our website (e.g., Google Analytics). These
              are set only with your consent where required.
            </li>
          </ul>
          <p>
            We do not use advertising or behavioral tracking cookies. You may
            manage cookie preferences through our cookie banner or your browser
            settings. Disabling certain cookies may affect website
            functionality.
          </p>

          {/* ---- 12. THIRD-PARTY LINKS ---- */}
          <h2>12. Third-Party Links &amp; Services</h2>
          <p>
            The Service may contain links to websites or services operated by
            third parties. We are not responsible for the privacy practices or
            content of those services. We encourage you to review their privacy
            policies before providing them with any personal information.
          </p>

          {/* ---- 13. CHANGES ---- */}
          <h2>13. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, legal requirements, or for other
            operational reasons. When we make material changes, we will provide
            prominent notice through the app (e.g., an in-app notification or
            banner) and, where required by law, obtain your consent before the
            changes take effect. The &quot;Last updated&quot; date at the top of
            this page indicates when the most recent revisions were published.
            Your continued use of the Service after the effective date of any
            changes constitutes your acceptance of the revised policy.
          </p>

          {/* ---- 14. CONTACT ---- */}
          <h2>14. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy
            Policy or our data practices, you may contact us through the
            following channels:
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
                <td>Data Protection Officer</td>
                <td>
                  <a href="mailto:dpo@meetmelly.com">dpo@meetmelly.com</a>
                </td>
              </tr>
              <tr>
                <td>Privacy inquiries &amp; rights requests</td>
                <td>
                  <a href="mailto:privacy@meetmelly.com">
                    privacy@meetmelly.com
                  </a>
                </td>
              </tr>
              <tr>
                <td>General inquiries</td>
                <td>
                  <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>
                </td>
              </tr>
              <tr>
                <td>Mailing address</td>
                <td>
                  Melly App, Inc.
                  <br />
                  [Your registered business address]
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            If you are located in the EEA and are unsatisfied with our response,
            you have the right to lodge a complaint with your local data
            protection supervisory authority.
          </p>
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
