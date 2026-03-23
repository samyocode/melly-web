// components/Footer.tsx

import MellyOrb from "@/components/MellyOrb";

interface FooterProps {
  /** Which link to highlight as current (won't be rendered as a link) */
  currentPage?: "privacy" | "terms" | "safety" | "safety-standards";
}

export default function Footer({ currentPage }: FooterProps) {
  const links = [
    { href: "/privacy", label: "Privacy", key: "privacy" as const },
    { href: "/terms", label: "Terms", key: "terms" as const },
    { href: "/safety", label: "Safety", key: "safety" as const },
  ];

  return (
    <footer className="py-10 sm:py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MellyOrb size={24} />
            <span className="text-sm font-bold text-gray-900">Melly</span>
            <span className="text-sm text-gray-400 ml-1">© 2026</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm">
            {links.map((link) =>
              currentPage === link.key ? (
                <span key={link.key} className="text-pink-500 font-medium">
                  {link.label}
                </span>
              ) : (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-gray-500 hover:text-pink-500 transition"
                >
                  {link.label}
                </a>
              ),
            )}
            <a
              href="mailto:hello@meetmelly.com"
              className="text-gray-500 hover:text-pink-500 transition"
            >
              hello@meetmelly.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
