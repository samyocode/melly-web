"use client";

// components/admin/AdminNav.tsx
// Sidebar navigation for the admin shell. Moderation-class links are hidden
// from roles that can't moderate (support/ops) — the pages also re-check
// server-side; this is just UX.

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  moderationOnly?: boolean;
  superAdminOnly?: boolean;
}

const ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/moderation", label: "Moderation", moderationOnly: true },
  { href: "/admin/reports", label: "Reports", moderationOnly: true },
  { href: "/admin/events", label: "Events", moderationOnly: true },
  { href: "/admin/settings", label: "Settings", superAdminOnly: true },
];

export default function AdminNav({
  canModerate,
  isSuperAdmin,
}: {
  canModerate: boolean;
  isSuperAdmin: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {ITEMS.filter(
        (i) =>
          (!i.moderationOnly || canModerate) &&
          (!i.superAdminOnly || isSuperAdmin),
      ).map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-pink-50 text-pink-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
