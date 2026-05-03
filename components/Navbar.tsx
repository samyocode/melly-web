// components/Navbar.tsx

import Link from "next/link";
import MellyOrb from "@/components/MellyOrb";

interface NavbarProps {
  /** Use "fixed" on the landing page, "sticky" on inner pages */
  position?: "fixed" | "sticky";
  /** Show waitlist CTA (landing) vs download CTA (inner pages) */
  variant?: "landing" | "inner";
}

export default function Navbar({
  position = "sticky",
  variant = "inner",
}: NavbarProps) {
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

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {variant === "inner" ? (
            <Link href="/" className="hover:text-pink-500 transition">
              Home
            </Link>
          ) : (
            <a href="#meet-melly" className="hover:text-pink-500 transition">
              Meet Melly
            </a>
          )}
          <a
            href={variant === "landing" ? "#quizzes" : "/#quizzes"}
            className="hover:text-pink-500 transition"
          >
            Quizzes
          </a>
          <a
            href={variant === "landing" ? "#the-list" : "/date-spots"}
            className="hover:text-pink-500 transition"
          >
            The List
          </a>
          <a
            href="mailto:hello@meetmelly.com"
            className="hover:text-pink-500 transition"
          >
            Contact
          </a>
        </div>

        {variant === "landing" ? (
          <a
            href="#waitlist"
            className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-bold text-white rounded-full bg-pink-500 hover:bg-pink-600 transition shadow-md shadow-pink-500/20"
          >
            Join Waitlist
          </a>
        ) : (
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-gray-600 hover:text-pink-500 transition">
              Log in
            </button>
            <button className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-bold text-white rounded-full bg-pink-500 hover:bg-pink-600 transition shadow-md shadow-pink-500/20">
              Download
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
