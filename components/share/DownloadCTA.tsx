// components/share/DownloadCTA.tsx

import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";

/**
 * The conversion surface: every share page ends here. If the app is installed,
 * the universal link opens it directly and the web page is never hit — so this
 * is the not-installed path by definition (see SHARE_SYSTEM_SPEC.md).
 */
export function DownloadCTA({ context }: { context?: string }) {
  return (
    <section className="mt-10 rounded-3xl border border-pink-100 bg-white p-6 text-center shadow-sm sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-gray-900">
        Get the full picture in Melly
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
        {context ??
          "Save places, make plans, and do things with people you trust. It's all in the app."}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-gray-800"
        >
          Download on the App Store
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-900 transition hover:bg-gray-50"
        >
          Get it on Google Play
        </a>
      </div>
    </section>
  );
}
