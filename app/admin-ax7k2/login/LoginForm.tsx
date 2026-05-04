// app/admin-ax7k2/login/LoginForm.tsx
"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/admin-auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(
        data?.message ??
          "If this email is authorized, a sign-in link has been sent.",
      );
      setStatus("sent");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
    >
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        disabled={status === "sending"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
        placeholder="you@meetmelly.com"
      />
      <button
        type="submit"
        disabled={status === "sending" || !email}
        className="w-full mt-4 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {status === "sending" ? "Sending..." : "Send sign-in link"}
      </button>
      {message && (
        <p className="mt-4 text-sm text-gray-600 text-center">{message}</p>
      )}
    </form>
  );
}
