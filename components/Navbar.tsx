// components/Navbar.tsx
//
// Minimal nav for the placeholder phase: logo + legal links only. The marketing
// links (Quizzes / The List / waitlist / download) were removed while the site
// is a placeholder — restore from git history when marketing returns. The
// `variant` prop is retained for call-site compatibility but no longer changes
// the rendered links.

import Link from "next/link";
import MellyOrb from "@/components/MellyOrb";

interface NavbarProps {
  /** Use "fixed" on full-bleed pages, "sticky" on inner/content pages */
  position?: "fixed" | "sticky";
  /** Retained for compatibility; no longer affects rendering. */
  variant?: "landing" | "inner";
}

export default function Navbar({ position = "sticky" }: NavbarProps) {
  return (
    <nav
      className={`${position} top-0 left-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-pink-100`}
    >
      <div className="flex items-center justify-between max-w-7xl px-4 sm:px-8 py-3 sm:py-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <MellyOrb size={32} />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Melly
          </span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-6 text-sm font-medium text-gray-600">
          <Link href="/privacy" className="hover:text-pink-500 transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-pink-500 transition">
            Terms
          </Link>
        </div>
      </div>
    </nav>
  );
}
