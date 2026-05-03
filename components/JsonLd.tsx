// components/JsonLd.tsx
//
// Inline JSON-LD via next/script, the documented Next.js pattern for
// schema.org structured data. The script's children become the script
// body's textContent — no HTML parsing, no escaping concerns.

import Script from "next/script";

export function JsonLd({ id, data }: { id: string; data: unknown }) {
  return (
    <Script id={id} type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(data)}
    </Script>
  );
}
