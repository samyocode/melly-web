// components/VenueFAQ.tsx

import type { FAQPair } from "@/lib/seo";

export default function VenueFAQ({
  faqs,
  venueName,
}: {
  faqs: FAQPair[];
  venueName: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <section
      aria-labelledby="venue-faq-heading"
      className="mb-6 p-5 sm:p-6 rounded-2xl bg-white border border-gray-200"
    >
      <h2
        id="venue-faq-heading"
        className="text-lg sm:text-xl font-extrabold text-gray-900 mb-4"
      >
        About {venueName}
      </h2>
      <div className="divide-y divide-gray-100">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-3" open={i === 0}>
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
              <h3 className="text-sm font-bold text-gray-900">
                {faq.question}
              </h3>
              <svg
                className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="text-sm text-gray-600 leading-relaxed mt-2 pr-6">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
