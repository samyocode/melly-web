-- ============================================================================
-- pSEO foundation: slugs, public read access, venue aggregates MV
-- ----------------------------------------------------------------------------
-- Run with: supabase db push   (or paste into the Supabase SQL editor)
--
-- Idempotent: safe to re-run. Each step is `if not exists` / `or replace`.
-- ============================================================================

create extension if not exists unaccent;

-- ─── slugify helper ─────────────────────────────────────────────────────────

create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    lower(unaccent(coalesce(input, ''))),
    '[^a-z0-9]+', '-', 'g'
  ))
$$;

-- ─── places_catalog: slug + city_slug ───────────────────────────────────────

alter table public.places_catalog
  add column if not exists slug text,
  add column if not exists city_slug text generated always as (
    public.slugify(coalesce(city, ''))
  ) stored;

-- Backfill slug for any NULL rows. Format: "<slugified-name>-<id-prefix>".
-- Including a 6-char id prefix guarantees uniqueness without name collisions.
update public.places_catalog
set slug = public.slugify(name) || '-' || left(id::text, 6)
where slug is null;

-- Once backfilled, enforce non-null + unique.
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'places_catalog'
      and constraint_name = 'places_catalog_slug_unique'
  ) then
    alter table public.places_catalog
      alter column slug set not null,
      add constraint places_catalog_slug_unique unique (slug);
  end if;
end$$;

create index if not exists idx_places_catalog_city_slug
  on public.places_catalog(city_slug)
  where city is not null;

create index if not exists idx_places_catalog_city_score
  on public.places_catalog(city_slug, date_friendliness_score desc nulls last)
  where city is not null and date_friendliness_score is not null;

-- ─── user_places: web-safe note flag ────────────────────────────────────────
-- Default false: notes only appear on indexed pages once explicitly approved
-- (by moderation pipeline, heuristic, or user opt-in).

alter table public.user_places
  add column if not exists note_safe_for_web boolean not null default false;

create index if not exists idx_user_places_seo
  on public.user_places(place_catalog_id)
  where visibility = 'public';

-- ─── places_catalog: anon read access ───────────────────────────────────────
-- All columns here are venue facts (Google data + Melly enrichment scores).
-- No PII. Safe to expose for SSR.

alter table public.places_catalog enable row level security;

drop policy if exists "places_catalog_public_read" on public.places_catalog;
create policy "places_catalog_public_read"
  on public.places_catalog
  for select
  to anon, authenticated
  using (true);

-- ─── venue_seo_aggregates materialized view ─────────────────────────────────
-- Aggregates *only* public, positively-stanced user_places saves into a
-- single row per venue. The MV is what the web tier reads — user_places
-- itself stays locked down.
--
-- Stance filter: we exclude a defensive list of negative-leaning values.
-- Verify the actual stance vocabulary in your app and update SHIP_NOTES if
-- new values need to be added or removed.

drop materialized view if exists public.venue_seo_aggregates cascade;

create materialized view public.venue_seo_aggregates as
with safe_saves as (
  select
    up.id,
    up.place_catalog_id,
    up.user_id,
    up.intent,
    up.user_note,
    up.note_safe_for_web,
    up.visited_at
  from public.user_places up
  where up.place_catalog_id is not null
    and up.visibility = 'public'
    and coalesce(up.stance, '') not in ('avoid', 'dislike', 'negative', 'no')
)
select
  pc.id as place_catalog_id,
  pc.slug,
  pc.city_slug,
  pc.city,
  pc.name,
  pc.neighborhood_label,
  count(s.id)::bigint as public_save_count,
  count(distinct s.user_id)::bigint as unique_savers,
  count(s.id) filter (
    where s.visited_at >= now() - interval '30 days'
  )::bigint as recent_visits_30d,
  (
    select array_agg(intent_value order by intent_count desc)
    from (
      select unnest(s2.intent) as intent_value, count(*) as intent_count
      from safe_saves s2
      where s2.place_catalog_id = pc.id
      group by 1
      order by 2 desc
      limit 3
    ) t
  ) as top_intents,
  (
    select array_agg(user_note)
    from (
      select s3.user_note
      from safe_saves s3
      where s3.place_catalog_id = pc.id
        and s3.note_safe_for_web = true
        and s3.user_note is not null
        and length(trim(s3.user_note)) >= 20
      order by random()
      limit 5
    ) t
  ) as sample_notes
from public.places_catalog pc
left join safe_saves s on s.place_catalog_id = pc.id
where pc.slug is not null
group by pc.id, pc.slug, pc.city_slug, pc.city, pc.name, pc.neighborhood_label;

create unique index if not exists idx_venue_seo_aggregates_pk
  on public.venue_seo_aggregates(place_catalog_id);

create index if not exists idx_venue_seo_aggregates_slug
  on public.venue_seo_aggregates(slug);

create index if not exists idx_venue_seo_aggregates_city
  on public.venue_seo_aggregates(city_slug);

grant select on public.venue_seo_aggregates to anon, authenticated;

-- ─── cities_with_venue_counts view ──────────────────────────────────────────
-- Drives the /date-spots index + per-city sitemap entries. Plain view (not
-- materialized) since the underlying counts shift slowly and the query is
-- cheap.

create or replace view public.cities_with_venue_counts as
select
  city,
  city_slug,
  count(*)::bigint as venue_count
from public.places_catalog
where city is not null
  and city_slug is not null
  and date_friendliness_score is not null
group by city, city_slug;

grant select on public.cities_with_venue_counts to anon, authenticated;

-- ─── refresh helper ─────────────────────────────────────────────────────────
-- Call from a scheduled function / pg_cron / Vercel cron job. Concurrent
-- refresh requires the unique index above (already in place).

create or replace function public.refresh_venue_seo_aggregates()
returns void
language sql
security definer
as $$
  refresh materialized view concurrently public.venue_seo_aggregates;
$$;

grant execute on function public.refresh_venue_seo_aggregates() to authenticated;

-- One-time initial populate so the view is queryable immediately.
refresh materialized view public.venue_seo_aggregates;
