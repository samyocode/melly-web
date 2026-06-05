"use client";

// components/admin/LogoutButton.tsx
// Clears the admin cookie via the logout route, then sends the browser to the
// (unguessable) login path.

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/admin-auth/logout", { method: "POST" });
    } finally {
      router.push("/admin-ax7k2/login");
      router.refresh();
    }
  }

  return (
    <button
      onClick={logout}
      disabled={busy}
      className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
