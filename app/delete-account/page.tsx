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
          {/* --- WHAT HAPPENS --- */}
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

          {/* --- HOW TO DELETE --- */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              How to delete your account
            </h2>

            {/* Method 1: In-app */}
            <div className="mb-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-base font-bold text-gray-900">
                    In the Melly app (recommended)
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Open the Melly app and go to{" "}
                    <strong>Settings → Account → Delete Account</strong>. Follow
                    the on-screen prompts to confirm. Your account will be
                    deactivated immediately and permanently deleted after the
                    30-day grace period.
                  </p>
                </div>
              </div>
            </div>

            {/* Method 2: Email */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-base font-bold text-gray-900">
                    By email
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                    Send an email from the address associated with your Melly
                    account to{" "}
                    <a
                      href="mailto:hello@meetmelly.com?subject=Account%20Deletion%20Request"
                      className="text-primary hover:underline font-medium"
                    >
                      hello@meetmelly.com
                    </a>{" "}
                    with the subject line{" "}
                    <strong>&quot;Account Deletion Request.&quot;</strong> We
                    will verify your identity and process your request within 30
                    days.
                  </p>
                  <a
                    href="mailto:hello@meetmelly.com?subject=Account%20Deletion%20Request"
                    className="inline-flex px-5 py-2.5 text-sm font-bold text-white rounded-full bg-primary hover:bg-primaryDark transition shadow-md shadow-primary/20"
                  >
                    Send Deletion Request
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* --- NOTE --- */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
            <h3 className="mb-2 text-base font-bold text-gray-900">
              Before you go
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you have an active subscription, deleting your account does not
              automatically cancel it. Please cancel your subscription through
              your device&apos;s subscription settings (
              <strong>Apple App Store</strong> or{" "}
              <strong>Google Play Store</strong>) before deleting your account
              to avoid future charges.
            </p>
          </div>

          {/* --- FOOTER NOTE --- */}
          <p className="mt-8 text-center text-sm text-gray-400">
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
