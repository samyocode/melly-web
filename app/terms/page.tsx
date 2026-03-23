// app/terms/page.tsx

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service – Melly",
  description:
    "Read the terms and conditions governing your use of the Melly dating application and website.",
};

const LAST_UPDATED = "March 13, 2026";
const EFFECTIVE_DATE = "March 13, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-pink-500 selection:text-white">
      <Navbar />
      <PageHeader
        title="Terms of Service"
        subtitle={`Effective: ${EFFECTIVE_DATE} · Last updated: ${LAST_UPDATED}`}
      />

      {/* --- CONTENT --- */}
      <main className="py-20">
        <article className="max-w-3xl px-6 mx-auto prose prose-lg prose-gray prose-headings:font-bold prose-headings:tracking-tight prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline">
          {/* ---- INTRODUCTION ---- */}
          <p>
            Welcome to Melly. These Terms of Service (&quot;Terms&quot;)
            constitute a legally binding agreement between you (&quot;you,&quot;
            &quot;your,&quot; or &quot;User&quot;) and Escondido Development LLC
            (&quot;Melly,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;), governing your access to and use of the Melly
            mobile application, the website located at{" "}
            <a href="https://www.meetmelly.com">www.meetmelly.com</a>, and all
            related services, features, and content (collectively, the
            &quot;Service&quot;).
          </p>
          <p>
            <strong>
              By creating an account, accessing, or using any part of the
              Service, you acknowledge that you have read, understood, and agree
              to be bound by these Terms and our{" "}
              <a href="/privacy">Privacy Policy</a>, which is incorporated
              herein by reference.
            </strong>{" "}
            If you do not agree to these Terms, do not use the Service.
          </p>
          <p>
            We reserve the right to modify these Terms at any time. Material
            changes will be communicated via in-app notification or email at
            least 30 days before they take effect. Your continued use of the
            Service after the effective date of any modification constitutes
            acceptance of the updated Terms.
          </p>

          <h2>1. Eligibility</h2>
          <p>To use the Service, you must:</p>
          <ul>
            <li>
              Be at least 18 years of age (or the age of majority in your
              jurisdiction, whichever is higher).
            </li>
            <li>
              Have the legal capacity to enter into a binding contract with
              Melly.
            </li>
            <li>
              Not be prohibited from using the Service under any applicable law.
            </li>
            <li>
              Not have been previously removed, banned, or suspended from the
              Service by Melly.
            </li>
            <li>
              Not be required to register as a sex offender in any jurisdiction.
            </li>
            <li>
              Not have been convicted of a felony or any crime involving
              violence, harassment, dishonesty, or a sex-related offense, where
              such a restriction is permitted by applicable law.
            </li>
          </ul>
          <p>
            We reserve the right to request verification of your identity and
            age at any time. Failure to provide satisfactory verification may
            result in suspension or termination of your account.
          </p>

          <h2>2. Account Registration &amp; Security</h2>
          <p>
            You must create an account to use the Service. When registering, you
            agree to:
          </p>
          <ul>
            <li>
              Provide accurate, current, and complete information as requested
              during the registration process.
            </li>
            <li>
              Maintain and promptly update your information to keep it accurate
              and current.
            </li>
            <li>
              Maintain the security and confidentiality of your login
              credentials and not share them with any third party.
            </li>
            <li>
              Immediately notify us at{" "}
              <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a> of
              any unauthorized use of your account or any other breach of
              security.
            </li>
          </ul>
          <p>
            You are solely responsible for all activity that occurs under your
            account. Melly is not liable for any loss or damage arising from
            your failure to maintain the security of your account credentials.
            Each person may maintain only one active account.
          </p>

          <h2>3. Description of the Service</h2>
          <p>
            Melly is a dating and social connection platform that uses
            quiz-based compatibility assessments to help users discover
            meaningful connections. The Service includes, but is not limited to:
          </p>
          <ul>
            <li>
              Personality and compatibility quizzes designed to generate
              compatibility scores between users.
            </li>
            <li>
              User profiles displaying quiz results, photos, and personal
              information.
            </li>
            <li>
              A matching system based on quiz compatibility and user
              preferences.
            </li>
            <li>In-app messaging between matched users.</li>
            <li>
              Optional premium features available through paid subscriptions or
              in-app purchases.
            </li>
          </ul>
          <p>
            <strong>Melly does not conduct background checks on users.</strong>{" "}
            We do not verify the identity, background, or statements of any
            user. You are solely responsible for your interactions with other
            users, both online and offline. We strongly encourage you to
            exercise caution, use good judgment, and follow our{" "}
            <a href="/safety">Safety Tips</a> when communicating with or meeting
            other users.
          </p>

          <h2>4. User Conduct &amp; Community Guidelines</h2>
          <p>
            You agree to use the Service in a lawful, respectful manner and in
            accordance with these Terms. You agree that you will not:
          </p>

          <h3>4.1 Prohibited Content</h3>
          <ul>
            <li>
              Post, upload, or transmit any content that is illegal, harmful,
              threatening, abusive, harassing, defamatory, vulgar, obscene,
              invasive of another&apos;s privacy, hateful, or discriminatory
              based on race, ethnicity, national origin, religion, gender,
              gender identity, sexual orientation, disability, or age.
            </li>
            <li>
              Upload sexually explicit or pornographic material, including nude
              images.
            </li>
            <li>
              Post content that promotes violence, self-harm, illegal drug use,
              or any criminal activity.
            </li>
            <li>
              Impersonate any person or entity, or falsely state or misrepresent
              your identity, age, affiliations, or qualifications.
            </li>
            <li>
              Post content that infringes any patent, trademark, trade secret,
              copyright, or other proprietary right of any party.
            </li>
          </ul>

          <h3>4.2 Prohibited Behavior</h3>
          <ul>
            <li>
              Harass, stalk, intimidate, threaten, or bully any other user.
            </li>
            <li>
              Solicit money, passwords, or personal information from any user
              for fraudulent or unlawful purposes.
            </li>
            <li>
              Use the Service for any commercial purpose, including advertising,
              solicitation, or promotion of goods or services, without our prior
              written consent.
            </li>
            <li>
              Use the Service to distribute spam, chain letters, or unsolicited
              messages.
            </li>
            <li>
              Use any automated system, including bots, scrapers, crawlers, or
              other automated means, to access the Service or collect data from
              it.
            </li>
            <li>
              Attempt to interfere with, compromise, or disrupt the Service or
              its servers, networks, or infrastructure.
            </li>
            <li>
              Reverse-engineer, decompile, disassemble, or otherwise attempt to
              derive the source code of the Service or any part thereof.
            </li>
            <li>
              Create multiple accounts, or create a new account after having
              been banned, without our explicit permission.
            </li>
            <li>
              Use the Service while located in a country embargoed by the United
              States or on any U.S. government list of prohibited or restricted
              parties.
            </li>
          </ul>
          <p>
            We reserve the right, but have no obligation, to monitor user
            activity and content. We may, in our sole discretion, investigate,
            remove content, warn, suspend, or permanently ban any user who
            violates these Terms or whose conduct we deem harmful to other
            users, the Service, or third parties.
          </p>

          <h2>5. User Content</h2>

          <h3>5.1 Ownership</h3>
          <p>
            You retain ownership of all content you submit, post, or display
            through the Service (&quot;User Content&quot;), including photos,
            text, quiz responses, and messages. Melly does not claim ownership
            of your User Content.
          </p>

          <h3>5.2 License Grant</h3>
          <p>
            By submitting User Content to the Service, you grant Melly a
            worldwide, non-exclusive, royalty-free, transferable, sublicensable
            license to use, reproduce, modify, adapt, publish, display, and
            distribute your User Content solely for the purposes of operating,
            developing, providing, promoting, and improving the Service. This
            license continues for so long as your User Content is on the Service
            and for a reasonable period after deletion to account for backup and
            caching systems, after which it terminates.
          </p>

          <h3>5.3 Representations</h3>
          <p>By posting User Content, you represent and warrant that:</p>
          <ul>
            <li>
              You own or have the necessary rights and permissions to use and
              authorize the use of your User Content as described herein.
            </li>
            <li>
              Your User Content does not infringe, misappropriate, or violate
              the intellectual property, privacy, publicity, or other rights of
              any third party.
            </li>
            <li>
              Your User Content complies with these Terms and all applicable
              laws and regulations.
            </li>
          </ul>

          <h3>5.4 Content Removal</h3>
          <p>
            We reserve the right to remove or disable access to any User Content
            that, in our sole judgment, violates these Terms, our Community
            Guidelines, or applicable law, or is otherwise objectionable. We are
            not obligated to store, maintain, or provide copies of your User
            Content.
          </p>

          <h2>6. Subscriptions, Purchases &amp; Billing</h2>

          <h3>6.1 Paid Features</h3>
          <p>
            Melly may offer premium subscriptions and in-app purchases
            (&quot;Premium Features&quot;). Pricing and available features will
            be displayed at the point of purchase. All prices are in U.S.
            dollars unless otherwise stated and are inclusive of applicable
            taxes unless otherwise noted.
          </p>

          <h3>6.2 Subscription Renewal</h3>
          <p>
            Subscriptions automatically renew at the end of each billing cycle
            (monthly or annually, depending on your selected plan) unless you
            cancel at least 24 hours before the end of the current billing
            period. Renewal charges will be made to the payment method
            associated with your account at the then-current subscription rate.
          </p>

          <h3>6.3 Cancellation</h3>
          <p>
            You may cancel your subscription at any time through the
            subscription management settings on your device (Apple App Store or
            Google Play Store). Cancellation takes effect at the end of the
            current billing period. You will retain access to Premium Features
            until the end of your paid period. Melly does not offer prorated
            refunds for unused portions of a subscription period.
          </p>

          <h3>6.4 Refunds</h3>
          <p>
            All purchases are final and non-refundable, except as required by
            applicable law or as expressly stated in these Terms. If you
            purchased your subscription through the Apple App Store or Google
            Play Store, refund requests are governed by the respective
            platform&apos;s refund policies. For any billing disputes or errors,
            contact us at{" "}
            <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>.
          </p>

          <h3>6.5 Free Trials &amp; Promotions</h3>
          <p>
            We may offer free trials or promotional pricing from time to time.
            If you do not cancel before the free trial period ends, your
            subscription will automatically convert to a paid subscription at
            the standard rate. Free trials are limited to one per user.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            The Service, including all software, algorithms, user interface
            designs, graphics, logos, trademarks, quiz content, compatibility
            scoring methodologies, and all other proprietary content
            (collectively, &quot;Melly IP&quot;), is owned by or licensed to
            Melly and is protected by copyright, trademark, patent, trade
            secret, and other intellectual property laws.
          </p>
          <p>
            Subject to your compliance with these Terms, we grant you a limited,
            non-exclusive, non-transferable, non-sublicensable, revocable
            license to access and use the Service for your personal,
            non-commercial use. This license does not include the right to:
          </p>
          <ul>
            <li>
              Modify, copy, or create derivative works of the Service or Melly
              IP.
            </li>
            <li>
              Use data mining, robots, scraping, or similar data-gathering
              methods on the Service.
            </li>
            <li>
              Download, copy, or store any Melly IP except as expressly
              permitted by the Service&apos;s intended functionality (e.g.,
              caching for offline use).
            </li>
            <li>
              Use the Melly name, logo, or trademarks without our prior written
              consent.
            </li>
          </ul>

          <h2>8. Copyright Infringement &amp; DMCA</h2>
          <p>
            We respect the intellectual property rights of others. If you
            believe that any content on the Service infringes your copyright,
            please submit a notice under the Digital Millennium Copyright Act
            (DMCA) to our designated copyright agent:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>
            </li>
            <li>
              <strong>Mail:</strong> Escondido Development LLC, Attn: DMCA
              Agent, hello@meetmelly.com
            </li>
          </ul>
          <p>Your notice must include:</p>
          <ul>
            <li>
              A physical or electronic signature of the copyright owner or a
              person authorized to act on their behalf.
            </li>
            <li>
              Identification of the copyrighted work claimed to have been
              infringed.
            </li>
            <li>
              Identification of the material claimed to be infringing, with
              sufficient detail for us to locate it on the Service.
            </li>
            <li>Your contact information (address, telephone, email).</li>
            <li>
              A statement that you have a good faith belief that use of the
              material is not authorized by the copyright owner, its agent, or
              the law.
            </li>
            <li>
              A statement, under penalty of perjury, that the information in the
              notice is accurate and that you are the copyright owner or
              authorized to act on the owner&apos;s behalf.
            </li>
          </ul>

          <h2>9. Data Privacy &amp; Your Data Rights</h2>
          <p>
            Our collection, use, and protection of your Personal Data is
            governed by our <a href="/privacy">Privacy Policy</a>, which is
            incorporated into these Terms by reference. By using the Service,
            you consent to the data practices described therein. The following
            provisions highlight key data-related obligations and rights that
            apply directly under these Terms:
          </p>

          <h3>9.1 Consent to Data Processing</h3>
          <p>
            By creating an account and using the Service, you explicitly consent
            to the collection and processing of your Personal Data — including
            Sensitive Personal Data such as sexual orientation, gender identity,
            religious beliefs, and ethnicity — as necessary to provide
            quiz-based compatibility matching and related Service features. You
            may withdraw this consent at any time as described in our{" "}
            <a href="/privacy">Privacy Policy</a>, though withdrawal may limit
            your ability to use certain features of the Service.
          </p>

          <h3>9.2 Data You Share with Other Users</h3>
          <p>
            You acknowledge that certain information you provide — including
            your profile content, quiz results, compatibility scores, and
            messages — will be visible to other users of the Service. Once you
            share information with another user (e.g., via messages), Melly
            cannot control how that user may use, store, or disclose such
            information. You accept all risk associated with sharing personal
            information with other users.
          </p>

          <h3>9.3 Quiz Data &amp; Algorithmic Matching</h3>
          <p>
            You understand and agree that your quiz responses are processed by
            our proprietary algorithms to generate compatibility scores and
            match recommendations. This constitutes automated decision-making
            and profiling under the GDPR. Compatibility scores are generated for
            informational and entertainment purposes only and should not be
            relied upon as a definitive measure of relationship compatibility.
            You have the right to request human review of any significant
            automated decision as described in our{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>

          <h3>9.4 Your Data Rights</h3>
          <p>
            Depending on your jurisdiction, you may have certain rights
            regarding your Personal Data, including the right to access,
            correct, delete, port, restrict processing of, and object to the
            processing of your data. California residents have additional rights
            under the CCPA/CPRA, and residents of the EEA, UK, and Switzerland
            have rights under the GDPR. Full details of these rights and how to
            exercise them are provided in our{" "}
            <a href="/privacy">Privacy Policy</a>. You may also exercise your
            rights by contacting us at{" "}
            <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>.
          </p>

          <h3>9.5 Data Retention &amp; Account Deletion</h3>
          <p>
            When you delete your account, we will delete or anonymize your
            Personal Data in accordance with the retention schedule set forth in
            our <a href="/privacy">Privacy Policy</a>. Certain data may be
            retained for longer periods where required by law, necessary for
            legitimate business purposes (e.g., resolving disputes, enforcing
            agreements), or related to an active safety or fraud investigation.
            Payment records are retained as required by applicable tax and
            financial regulations.
          </p>
          <p>
            You may request deletion of your account and all associated data at
            any time by visiting our{" "}
            <a href="/delete-account">Account Deletion Request</a> page, using
            the in-app Settings &gt; Account &gt; Delete Account option, or
            emailing{" "}
            <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>.
          </p>

          <h3>9.6 Data Security Obligations</h3>
          <p>
            We implement industry-standard technical and organizational measures
            to protect your data, including encryption in transit and at rest,
            role-based access controls, and regular third-party security
            assessments. However, no method of electronic storage or
            transmission is entirely secure. You are responsible for maintaining
            the confidentiality of your account credentials and for any activity
            that occurs under your account. In the event of a data breach that
            poses a risk to your rights and freedoms, we will notify affected
            users and relevant supervisory authorities in accordance with
            applicable law.
          </p>

          <h3>9.7 International Data Transfers</h3>
          <p>
            Your data may be transferred to and processed in countries other
            than your country of residence, including the United States. Such
            transfers are made in accordance with applicable data protection
            laws and are subject to appropriate safeguards, including Standard
            Contractual Clauses (SCCs) approved by the European Commission and
            the UK International Data Transfer Agreement. By using the Service,
            you acknowledge and consent to such transfers. Full details are
            provided in our <a href="/privacy">Privacy Policy</a>.
          </p>

          <h3>9.8 Children&apos;s Data</h3>
          <p>
            The Service is not directed to individuals under the age of 18 (or
            the age of majority in your jurisdiction, whichever is higher). We
            do not knowingly collect Personal Data from minors. If we discover
            that a minor has created an account, we will promptly terminate the
            account and delete all associated data. If you believe a minor is
            using the Service, please report it to{" "}
            <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>.
          </p>

          <h3>9.9 Third-Party Services &amp; SDKs</h3>
          <p>
            The Service may integrate with or contain links to third-party
            services, including analytics providers, cloud infrastructure,
            payment processors, and social login providers. These third parties
            may collect data in accordance with their own privacy policies. We
            require all third-party service providers to enter into Data
            Processing Agreements (DPAs) that impose obligations no less
            protective than those described in our Privacy Policy. We are not
            responsible for the privacy practices of third-party services and
            encourage you to review their policies.
          </p>

          <h3>9.10 Changes to Data Practices</h3>
          <p>
            If we make material changes to how we collect, use, or share your
            Personal Data, we will update our{" "}
            <a href="/privacy">Privacy Policy</a> and notify you through the
            Service or by email at least 30 days before the changes take effect.
            Where required by law, we will obtain your consent before
            implementing material changes. Your continued use of the Service
            after such changes constitutes acceptance of the updated practices.
          </p>

          <h2>10. Disclaimers</h2>
          <p>
            <strong>
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER
              EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              TITLE, AND NON-INFRINGEMENT.
            </strong>
          </p>
          <p>Without limiting the foregoing, Melly does not warrant that:</p>
          <ul>
            <li>
              The Service will be uninterrupted, timely, secure, or error-free.
            </li>
            <li>
              The results obtained from the Service, including quiz results and
              compatibility scores, will be accurate, reliable, or meaningful.
            </li>
            <li>
              Any information provided by other users is truthful, accurate, or
              complete.
            </li>
            <li>Any defects or errors in the Service will be corrected.</li>
          </ul>
          <p>
            <strong>
              MELLY DOES NOT CONDUCT CRIMINAL BACKGROUND CHECKS OR IDENTITY
              VERIFICATION ON ALL USERS.
            </strong>{" "}
            You acknowledge and agree that Melly is not responsible for the
            conduct of any user, whether online or offline. You agree to use
            caution and good judgment in all interactions with other users,
            particularly if you decide to communicate outside the Service or
            meet in person.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            <strong>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL MELLY, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES,
              AGENTS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR
              OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH:
            </strong>
          </p>
          <ul>
            <li>Your access to, use of, or inability to use the Service.</li>
            <li>
              Any conduct or content of any user or third party on the Service.
            </li>
            <li>
              Any content obtained from the Service, including reliance on quiz
              results or compatibility scores.
            </li>
            <li>
              Unauthorized access, use, or alteration of your content or
              account.
            </li>
          </ul>
          <p>
            <strong>
              IN NO EVENT SHALL MELLY&apos;S TOTAL AGGREGATE LIABILITY TO YOU
              FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE
              SERVICE EXCEED THE GREATER OF (A) THE AMOUNT YOU HAVE PAID TO
              MELLY IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE
              HUNDRED U.S. DOLLARS ($100.00).
            </strong>
          </p>
          <p>
            Some jurisdictions do not allow the exclusion or limitation of
            certain damages. In such jurisdictions, the above limitations shall
            apply to the maximum extent permitted by applicable law.
          </p>

          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Melly and its
            affiliates, officers, directors, employees, agents, and licensors
            from and against any and all claims, liabilities, damages, losses,
            costs, and expenses (including reasonable attorneys&apos; fees)
            arising out of or in any way related to:
          </p>
          <ul>
            <li>Your access to or use of the Service.</li>
            <li>Your User Content.</li>
            <li>Your violation of these Terms.</li>
            <li>
              Your violation of any applicable law or the rights of any third
              party.
            </li>
            <li>
              Your interactions with other users, whether online or offline.
            </li>
          </ul>

          <h2>13. Dispute Resolution &amp; Arbitration</h2>

          <h3>13.1 Informal Resolution</h3>
          <p>
            Before initiating any formal dispute resolution proceeding, you
            agree to first contact us at{" "}
            <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a> and
            attempt to resolve the dispute informally for at least 30 days.
          </p>

          <h3>13.2 Binding Arbitration</h3>
          <p>
            If the dispute cannot be resolved informally, you and Melly agree
            that any dispute, claim, or controversy arising out of or relating
            to these Terms or the Service shall be resolved by binding
            arbitration administered by the American Arbitration Association
            (&quot;AAA&quot;) under its Consumer Arbitration Rules.
          </p>
          <p>
            The arbitrator&apos;s decision shall be final and binding and may be
            entered as a judgment in any court of competent jurisdiction. The
            arbitrator may award the same damages and relief that a court could
            award.
          </p>

          <h3>13.3 Class Action Waiver</h3>
          <p>
            <strong>
              YOU AND MELLY AGREE THAT EACH PARTY MAY BRING CLAIMS AGAINST THE
              OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR
              CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR
              REPRESENTATIVE ACTION.
            </strong>{" "}
            The arbitrator may not consolidate more than one person&apos;s
            claims and may not preside over any form of representative or class
            proceeding.
          </p>

          <h3>13.4 Exceptions</h3>
          <p>
            Notwithstanding the above, either party may bring an individual
            action in small claims court for disputes within its jurisdictional
            limits. Additionally, either party may seek injunctive or other
            equitable relief in any court of competent jurisdiction to prevent
            the actual or threatened infringement, misappropriation, or
            violation of intellectual property rights.
          </p>

          <h3>13.5 Opt-Out</h3>
          <p>
            You may opt out of the arbitration and class action waiver
            provisions by sending written notice to{" "}
            <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a> within
            30 days of first accepting these Terms. Your notice must include
            your name, account email, and a clear statement that you wish to opt
            out of binding arbitration. If you opt out, disputes will be
            resolved in the state or federal courts located in Sheridan County.
          </p>

          <h2>14. Termination</h2>

          <h3>14.1 Termination by You</h3>
          <p>
            You may delete your account at any time through the in-app Settings
            menu, by submitting a request on our{" "}
            <a href="/delete-account">Account Deletion Request</a> page, or by
            contacting us at{" "}
            <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>.
            Account deletion is subject to the data retention periods described
            in our <a href="/privacy">Privacy Policy</a>.
          </p>

          <h3>14.2 Termination by Melly</h3>
          <p>
            We may suspend or terminate your account, at our sole discretion,
            with or without notice, for any reason, including but not limited
            to:
          </p>
          <ul>
            <li>Violation of these Terms or our Community Guidelines.</li>
            <li>
              Conduct that is harmful to other users, third parties, or the
              Service.
            </li>
            <li>At the request of law enforcement or government agencies.</li>
            <li>Extended periods of inactivity.</li>
            <li>Discontinuation or material modification of the Service.</li>
          </ul>

          <h3>14.3 Effect of Termination</h3>
          <p>
            Upon termination, your right to use the Service immediately ceases.
            The following provisions survive termination: Sections 5.2 (License
            Grant, with respect to content already distributed), 10
            (Disclaimers), 11 (Limitation of Liability), 12 (Indemnification),
            13 (Dispute Resolution), and 16 (General Provisions).
          </p>

          <h2>15. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the State of Wyoming, without regard to its conflict of
            law provisions. To the extent that any lawsuit or court proceeding
            is permitted hereunder, you and Melly agree to submit to the
            exclusive personal jurisdiction of the state and federal courts
            located in Sheridan County, Wyoming.
          </p>

          <h2>16. General Provisions</h2>

          <h3>16.1 Entire Agreement</h3>
          <p>
            These Terms, together with the <a href="/privacy">Privacy Policy</a>{" "}
            and any supplemental terms or policies referenced herein, constitute
            the entire agreement between you and Melly regarding the Service and
            supersede all prior agreements, understandings, and communications.
          </p>

          <h3>16.2 Severability</h3>
          <p>
            If any provision of these Terms is held to be invalid, illegal, or
            unenforceable, the remaining provisions shall continue in full force
            and effect. The invalid provision shall be modified to the minimum
            extent necessary to make it valid and enforceable while preserving
            its original intent.
          </p>

          <h3>16.3 Waiver</h3>
          <p>
            The failure of Melly to enforce any right or provision of these
            Terms shall not constitute a waiver of such right or provision. A
            waiver of any provision shall be effective only if made in writing
            and signed by an authorized representative of Melly.
          </p>

          <h3>16.4 Assignment</h3>
          <p>
            You may not assign or transfer these Terms or any rights or
            obligations hereunder without our prior written consent. Melly may
            assign these Terms without restriction. Any attempted assignment in
            violation of this section shall be null and void.
          </p>

          <h3>16.5 Force Majeure</h3>
          <p>
            Melly shall not be liable for any failure or delay in performing its
            obligations under these Terms due to events beyond its reasonable
            control, including but not limited to natural disasters, acts of
            government, pandemics, wars, terrorism, labor disputes, power
            failures, internet disruptions, or cyberattacks.
          </p>

          <h3>16.6 Notices</h3>
          <p>
            All notices to Melly under these Terms must be sent to{" "}
            <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>.
            Notices to you may be sent to the email address associated with your
            account or delivered through the Service. Notice is deemed received
            upon delivery.
          </p>

          <h2>17. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Legal inquiries</td>
                <td>
                  <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>
                </td>
              </tr>
              <tr>
                <td>Billing &amp; subscription</td>
                <td>
                  <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>
                </td>
              </tr>
              <tr>
                <td>General support</td>
                <td>
                  <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>
                </td>
              </tr>
              <tr>
                <td>DMCA &amp; copyright</td>
                <td>
                  <a href="mailto:hello@meetmelly.com">hello@meetmelly.com</a>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </main>

      <Footer currentPage="terms" />
    </div>
  );
}
