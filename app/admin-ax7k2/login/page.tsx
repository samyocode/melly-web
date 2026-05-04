// app/admin-ax7k2/login/page.tsx
//
// The ONLY discoverable surface for admin login. Path is intentionally
// unguessable. Even reaching this page reveals nothing — submitting any
// email returns the same generic message.

import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-block w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900">Melly Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
