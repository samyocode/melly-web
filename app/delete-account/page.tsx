// app/delete-account/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Your Account – Melly",
  description:
    "Request deletion of your Melly account and all associated personal data.",
};

export default function DeleteAccountPage() {
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
            Delete Your Account
          </h1>
          <p className="text-lg text-gray-500">
            Request permanent deletion of your account and personal data.
          </p>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="py-20">
        <div className="max-w-2xl px-6 mx-auto">
          {/* --- INFO SECTION --- */}
          <div className="mb-12 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              What happens when you delete your account
            </h2>
            <div className="space-y-4 text-base text-gray-600 leading-relaxed">
              <p>
                We respect your right to control your personal data. When you
                submit an account deletion request, here is what to expect:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="mb-2 text-2xl">🗑️</div>
                  <h3 className="mb-1 text-sm font-bold text-gray-900">
                    Profile &amp; content removed
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your profile, photos, quiz responses, compatibility scores,
                    and bio will be permanently deleted and no longer visible to
                    other users.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="mb-2 text-2xl">💬</div>
                  <h3 className="mb-1 text-sm font-bold text-gray-900">
                    Messages erased
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your message history will be deleted. Other users will no
                    longer be able to see your side of any conversation.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="mb-2 text-2xl">⏳</div>
                  <h3 className="mb-1 text-sm font-bold text-gray-900">
                    30-day grace period
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your account will be deactivated immediately. You have 30
                    days to change your mind and reactivate before permanent
                    deletion begins.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="mb-2 text-2xl">📋</div>
                  <h3 className="mb-1 text-sm font-bold text-gray-900">
                    Limited retention
                  </h3>
                  <p className="text-sm text-gray-500">
                    Certain records (e.g., payment history, safety reports) may
                    be retained as required by law. See our{" "}
                    <a
                      href="/privacy"
                      className="text-primary hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>{" "}
                    for details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- DIVIDER --- */}
          <hr className="mb-12 border-gray-100" />

          {/* --- DELETION FORM --- */}
          <div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Submit a deletion request
            </h2>
            <p className="mb-8 text-base text-gray-500">
              Enter the email address associated with your Melly account. We
              will send you a verification email to confirm your identity before
              processing the request.
            </p>

            {/*
              NOTE: This form uses a standard HTML action. Replace the action
              URL with your actual API endpoint or server action that handles
              deletion requests (e.g., /api/delete-account). For a Next.js
              Server Action, convert this to a form with the `action` prop
              pointing to your server action function.
            */}
            <form
              action="/api/delete-account"
              method="POST"
              className="space-y-6"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Account email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Reason (optional) */}
              <div>
                <label
                  htmlFor="reason"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Reason for leaving{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <select
                  id="reason"
                  name="reason"
                  className="w-full px-4 py-3 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="">Select a reason…</option>
                  <option value="found_someone">I found someone</option>
                  <option value="not_useful">
                    The app isn&apos;t useful for me
                  </option>
                  <option value="privacy_concerns">
                    Privacy or data concerns
                  </option>
                  <option value="too_many_notifications">
                    Too many notifications
                  </option>
                  <option value="bad_experience">I had a bad experience</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Additional comments */}
              <div>
                <label
                  htmlFor="comments"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Additional comments{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows={3}
                  placeholder="Anything else you'd like us to know…"
                  className="w-full px-4 py-3 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none transition resize-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                ></textarea>
              </div>

              {/* Confirmation checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirm"
                  name="confirm"
                  required
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label
                  htmlFor="confirm"
                  className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                >
                  I understand that this action is{" "}
                  <strong>permanent and irreversible</strong> after the 30-day
                  grace period. My profile, quiz data, matches, and messages
                  will be permanently deleted. Any active subscription will not
                  be refunded for the remaining period.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full px-6 py-4 text-base font-bold text-white transition rounded-xl bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-lg shadow-red-600/20"
              >
                Request Account Deletion
              </button>

              <p className="text-center text-sm text-gray-400">
                We will send a confirmation email to verify your identity. Your
                account will not be deleted until you confirm via that email.
              </p>
            </form>
          </div>

          {/* --- ALTERNATIVE METHODS --- */}
          <div className="mt-16 p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <h3 className="mb-3 text-base font-bold text-gray-900">
              Other ways to delete your account
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <strong>In the app:</strong> Go to Settings &gt; Account &gt;
                Delete Account and follow the prompts.
              </li>
              <li>
                <strong>By email:</strong> Send a request from your registered
                email to{" "}
                <a
                  href="mailto:privacy@meetmelly.com"
                  className="text-primary hover:underline font-medium"
                >
                  privacy@meetmelly.com
                </a>{" "}
                with the subject line &quot;Account Deletion Request.&quot;
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-400">
              All deletion requests are processed within 30 days of identity
              verification, in accordance with our{" "}
              <a
                href="/privacy"
                className="text-primary hover:underline font-medium"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
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
