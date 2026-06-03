// components/share/Unavailable.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DownloadCTA } from "@/components/share/DownloadCTA";

/** Shown when a token is missing/expired/invalid, or points at a type we can't
 *  render on the web yet. Friendly dead-end that still converts to a download. */
export function Unavailable({
  title = "This link isn't available",
  message = "The link may have expired or been turned off. If someone shared this with you, ask them for a fresh link.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-pink-50/30">
      <Navbar position="sticky" variant="inner" />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-gray-500">{message}</p>
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}
