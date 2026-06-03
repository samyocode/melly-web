// app/page.tsx
//
// Placeholder landing for meetmelly.com. The previous dating-quiz marketing
// homepage is preserved in git history (commit 84eaf33 and earlier) — restore
// it when the marketing site is ready. Legal pages (privacy/terms/safety/
// delete-account) and the share pages + .well-known files remain reachable.

import type { Metadata } from "next";
import MellyOrb from "@/components/MellyOrb";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "Melly. Coming soon.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fdf2f8]">
      <Navbar position="sticky" />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <MellyOrb size={88} />
        <h1 className="mt-7 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {SITE_NAME}
        </h1>
        <span className="mt-8 inline-flex items-center rounded-full border border-pink-200 bg-white/70 px-4 py-2 text-sm font-medium text-pink-600">
          Coming soon
        </span>
        <a
          href="mailto:hello@meetmelly.com"
          className="mt-6 text-sm text-gray-500 underline-offset-4 transition hover:text-pink-500 hover:underline"
        >
          hello@meetmelly.com
        </a>
      </main>
      <Footer />
    </div>
  );
}
