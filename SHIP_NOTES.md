# Ship notes — pSEO foundation + date-spots

What landed and what you need to do before this is live in prod.

## What changed

**Foundation**

- `app/quiz/[slug]/page.tsx` — server component (was `"use client"`). Adds `generateStaticParams`, `generateMetadata`, JSON-LD (`QAPage` + `BreadcrumbList`), and a `sr-only` block with title / description / questions / related quizzes for crawlers.
- `app/quiz/[slug]/QuizExperience.tsx` — extracted the original chat / coming-soon UI into a client island. Behavior is unchanged.
- `app/sitemap.ts` — quizzes + cities + venues + static pages.
- `app/robots.ts` — allow-all + sitemap pointer; `/delete-account` disallowed.
- `app/layout.tsx` — `metadataBase` set so OG image URLs resolve absolutely; default title template added.
- `components/JsonLd.tsx` — schema.org injector via `next/script`.
- `lib/site.ts` — single source of truth for site URL, store URLs, OG defaults.
- `lib/supabase-server.ts` — server-only Supabase client (anon key, 1h fetch revalidate).
- `lib/slugify.ts`, `lib/date-spots.ts` — query helpers + display utils for date-spots routes.
- `next.config.ts` — Google Places photo hosts whitelisted.

**Date spots**

- `app/date-spots/page.tsx` — city directory (≥5 venues per city to publish).
- `app/date-spots/[city]/page.tsx` — top 50 venues per city, ranked by `date_friendliness_score`. SSG.
- `app/date-spots/[city]/[venueSlug]/page.tsx` — venue page with hero, Melly stats (saves, recent visits, top intent), editorial summary, vibe/intent chips, public notes, amenities, related venues, app CTA. On-demand SSR + `Restaurant`/`LocalBusiness` JSON-LD.

**Database**

- `supabase/migrations/20260503000000_pseo_foundation.sql` — see "Run before deploy" below.

## Run before deploy

### 1. Apply the migration

Either:

```bash
supabase db push
```

…or paste `supabase/migrations/20260503000000_pseo_foundation.sql` into the Supabase SQL editor. The migration is idempotent.

This creates:

- `places_catalog.slug` (backfilled, unique, NOT NULL) and `places_catalog.city_slug` (generated from `city`).
- `user_places.note_safe_for_web` (default `false`).
- `venue_seo_aggregates` materialized view: per-venue counts, top intents, and sample notes — built only from `visibility = 'public'` saves with non-negative stance and `note_safe_for_web = true` notes.
- `cities_with_venue_counts` view.
- RLS policy allowing anon `SELECT` on `places_catalog` (it's enrichment data, no PII).
- `refresh_venue_seo_aggregates()` function for refreshing the MV.

### 2. Set the site URL

Add to your hosting env (Vercel → Settings → Environment Variables):

```
NEXT_PUBLIC_SITE_URL=https://www.meetmelly.com
```

Defaults to `https://www.meetmelly.com` if unset; override per-environment if your prod domain differs.

### 3. Replace placeholder store URLs

`lib/site.ts` has placeholder iOS/Android store URLs (carried over from the existing landing page). Update `APP_STORE_URL` and `PLAY_STORE_URL` once the real listings are live.

### 4. Schedule MV refresh

The materialized view is a snapshot — saves added after the last refresh won't show until you refresh it. Pick one:

- **pg_cron** (in Supabase): `select cron.schedule('refresh-venue-seo', '0 */6 * * *', $$ select public.refresh_venue_seo_aggregates(); $$);`
- **Vercel cron** hitting an API route that calls `supabase.rpc('refresh_venue_seo_aggregates')` with a service-role key.

Hourly is overkill; every 6h or daily is plenty for SEO.

### 5. Submit to Search Console

- Verify `www.meetmelly.com` in Google Search Console (DNS or HTML file method).
- Submit `https://www.meetmelly.com/sitemap.xml`.

## Open decisions you (Sam) need to make

These are baked-in defaults that I had to guess at — verify and adjust.

1. **Negative-stance values** in `user_places.stance`. The MV currently filters out rows where `stance IN ('avoid', 'dislike', 'negative', 'no')`. If your actual vocabulary uses different values, edit the `safe_saves` CTE in the migration and re-run.
2. **`note_safe_for_web` policy.** Defaults to `false`, so no notes appear on indexed pages until you mark them safe. Decide your moderation flow:
   - Manual review queue (most defensive).
   - Auto-approve rules (length, language detection, no profanity, no proper nouns) + admin override.
   - Opt-in toggle when the user saves with a note.
3. **Intent taxonomy.** Lock the public values in `user_places.intent[]` before they hit the sitemap. URL changes after Google indexes them bleed authority. The `intent_legacy` column suggests this has already shifted once — pick your canonical set now and don't change it.
4. **Min thresholds** in `lib/date-spots.ts`:
   - `MIN_PUBLIC_SAVES_FOR_VENUE_PAGE = 0` — currently any venue with `date_friendliness_score` is publishable. Bump to 5+ once you have volume to avoid thin pages.
   - `MIN_VENUES_FOR_CITY_PAGE = 5` — only cities with ≥5 venues get a hub page.

## Deferred (good v2 work)

- **Quiz result landing pages** (`/quiz/[slug]/result/[code]`). The data shape supports this but each result currently has ~80 words — too thin to ship without enrichment. Worth doing once you write a "what this means for dating" paragraph per result (or LLM-generate one with manual review).
- **Vibe/intent filter pages** (`/date-spots/[city]/vibe/[tag]`, `/date-spots/[city]/intent/[intent]`). Wait until Search Console shows real demand for these queries before building.
- **OG image generation** — currently uses your Cloudinary cover for quizzes and Google Places photo for venues. A per-page generated OG image (Next 16 supports this via `opengraph-image.tsx`) would lift social CTR.
- **Compatibility matrix pages** (`/match/[type-a]/[type-b]`) — separate route tree, but high-volume search demand.

## How to verify it's working

After deploying + running the migration:

1. `curl https://www.meetmelly.com/robots.txt` — should show your sitemap URL.
2. `curl https://www.meetmelly.com/sitemap.xml | head -50` — should list quizzes + cities + venues.
3. View source on `/quiz/clingy-or-cool` — should see `<title>`, `<meta name="description">`, two `<script type="application/ld+json">` blocks, and `sr-only` content with the questions.
4. Hit `/date-spots` — should list cities. If empty, either the migration didn't run or no city has ≥5 venues with a `date_friendliness_score`.
5. Google Search Console → URL Inspection on a quiz URL after a few days — check that "Crawled as: Googlebot smartphone" sees the rendered HTML.
