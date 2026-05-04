// components/admin/TopBar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopBar({ email }: { email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/admin-auth/logout", { method: "POST" });
    } finally {
      router.replace("/");
    }
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-4">
      <span className="text-sm text-gray-500">{email}</span>
      <button
        onClick={logout}
        disabled={busy}
        className="text-sm text-gray-600 hover:text-gray-900 transition disabled:opacity-50"
      >
        Sign out
      </button>
    </header>
  );
}
