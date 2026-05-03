-- ════════════════════════════════════════════════════════════════════════════
-- Editorial blurb field for venue pages
-- ════════════════════════════════════════════════════════════════════════════
--
-- `editorial_summary` is Google's description (e.g. "Sushi & sashimi are
-- offered along with classic appetizers in this laid-back Japanese eatery").
-- It's fine but generic — every directory has it.
--
-- `melly_blurb` is YOUR voice. 1-2 sentences explaining why a venue earns
-- its place on The Melly List. This is what differentiates the page from
-- Google Maps / TripAdvisor / Eater. Examples to write:
--
-- Isao:    "The omakase counter seats 6 — close enough for shoulders to touch,
--           quiet enough to actually hear each other. Reserve it for an
--           anniversary, not a Tuesday."
--
-- PIN.BKK: "Velvet booths, dim lighting, a piano that someone might play.
--           Order the Fig Old Fashioned and stay later than you planned."
--
-- Larder BKK: "Brunch that doesn't feel like brunch — quiet enough for
--              first-date conversation, polished enough that you can dress up."
--
-- The website queries this column and prefers it over editorial_summary
-- when present, falling back to Google's text when not.

alter table public.places_catalog
  add column if not exists melly_blurb text;

comment on column public.places_catalog.melly_blurb is
  'Editorial blurb in Melly''s voice. 1-2 sentences. Prefer over editorial_summary on the website.';

-- Optional: an admin index for quickly finding venues that still need a blurb.
create index if not exists places_catalog_needs_blurb_idx
  on public.places_catalog (id)
  where melly_blurb is null and date_friendliness_score is not null;
