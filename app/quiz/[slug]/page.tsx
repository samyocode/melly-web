// app/quiz/[slug]/page.tsx
//
// Server component: handles SSG, metadata, JSON-LD, and crawlable SEO
// content. The interactive chat is delegated to the client island in
// QuizExperience.tsx so that crawlers see the title/description/questions
// even before any JS runs.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { QUIZ_REGISTRY, QUIZ_PREVIEWS } from "@/lib/quiz-data";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { QuizChat, ComingSoonPage } from "./QuizExperience";

const CLD =
  "https://res.cloudinary.com/ddwerzvdw/image/upload/f_auto,q_auto/quizzes";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    ...Object.keys(QUIZ_REGISTRY),
    ...Object.keys(QUIZ_PREVIEWS),
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const quiz = QUIZ_REGISTRY[slug];
  const preview = QUIZ_PREVIEWS[slug];

  if (!quiz && !preview) {
    return { title: "Quiz not found" };
  }

  const title = quiz?.title ?? preview?.title ?? "";
  const description = quiz?.description ?? preview?.description ?? "";
  const coverKey = quiz?.cover_image_key ?? preview?.cover_image_key;
  const ogImage = coverKey
    ? `${CLD}/${coverKey}.webp`
    : `${SITE_URL}/icon.png`;
  const url = absoluteUrl(`/quiz/${slug}`);

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function QuizRoutePage({ params }: { params: Params }) {
  const { slug } = await params;
  const quiz = QUIZ_REGISTRY[slug];
  const preview = QUIZ_PREVIEWS[slug];

  if (!quiz && !preview) notFound();

  const title = (quiz?.title ?? preview?.title) as string;
  const description = (quiz?.description ?? preview?.description) as string;
  const url = absoluteUrl(`/quiz/${slug}`);

  // QAPage with mainEntity gives a real shot at "People also ask" surfaces
  // by exposing the quiz questions to Google.
  const qaJsonLd = quiz
    ? {
        "@context": "https://schema.org",
        "@type": "QAPage",
        mainEntity: quiz.questions.map((q) => ({
          "@type": "Question",
          name: q.text,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.options.map((o) => o.text).join(" / "),
          },
        })),
      }
    : null;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Quizzes",
        item: absoluteUrl("/quizzes"),
      },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  return (
    <>
      {/* SEO content visible only to crawlers + screen readers — preserves
          existing UX while giving Google rich content to index. */}
      <div className="sr-only">
        <h1>{title}</h1>
        <p>{description}</p>
        {quiz && (
          <>
            <p>
              {quiz.questions.length} question quiz. Possible results:{" "}
              {quiz.results.map((r) => r.name).join(", ")}.
            </p>
            <ol>
              {quiz.questions.map((q) => (
                <li key={q.id}>{q.text}</li>
              ))}
            </ol>
            <h2>Related quizzes</h2>
            <ul>
              {Object.entries(QUIZ_REGISTRY)
                .filter(([s]) => s !== slug)
                .slice(0, 5)
                .map(([s, q]) => (
                  <li key={s}>
                    <Link href={`/quiz/${s}`}>{q.title}</Link>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>

      {qaJsonLd && <JsonLd id="ld-quiz-qa" data={qaJsonLd} />}
      <JsonLd id="ld-quiz-breadcrumbs" data={breadcrumbs} />

      {quiz ? (
        <QuizChat quiz={quiz} slug={slug} />
      ) : (
        <ComingSoonPage slug={slug} preview={preview} />
      )}
    </>
  );
}
