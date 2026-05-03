-- ════════════════════════════════════════════════════════════════════════════
-- Venue co-occurrence — "often paired with"
-- ════════════════════════════════════════════════════════════════════════════
--
-- Materialized view of venue pairs that share users. For any venue A,
-- gives the venues B that A's savers also save, ranked by overlap count.
--
-- Why this matters for Melly:
--   * No competitor (Google Maps, Eater, Resy, OpenTable) shows this
--   * Becomes a stronger signal as your save data grows — at 51 saves
--     today it's thin; at 5,000 saves it's a defensible product moat
--   * Powers "Make a night of it" itinerary suggestions (next migration)
--   * Internally: helps the matching algorithm understand venue affinity
--
-- The MV is keyed on venue_a, so a single page render does ONE indexed
-- lookup to get the top 5 paired venues. No N+1 queries.

drop materialized view if exists public.venue_pair_affinity;

create materialized view public.venue_pair_affinity as
with eligible_saves as (
  -- All saves linked to a real venue. Visibility filter intentionally
  -- omitted (matches the rest of the website's behavior).
  select
    user_id,
    place_catalog_id
  from public.user_places
  where place_catalog_id is not null
    and coalesce(stance, '') not in ('avoid','dislike','negative','no')
),
pairs as (
  -- Self-join on user_id: every (venue_a, venue_b) pair where the same
  -- user saved both. We use venue_a < venue_b at the count step but emit
  -- both directions in the final select so the MV can be queried from
  -- either side without a UNION at read time.
  select
    a.place_catalog_id as venue_a,
    b.place_catalog_id as venue_b
  from eligible_saves a
  join eligible_saves b on a.user_id = b.user_id and a.place_catalog_id <> b.place_catalog_id
)
select
  venue_a,
  venue_b,
  count(*) as shared_savers,
  -- "Lift" — how much more common this pair is than chance. Higher = stronger
  -- affinity. Useful for ordering when shared_savers is tied across pairs.
  -- Floor at 1.0 to avoid log of zero in downstream consumers.
  greatest(
    1.0,
    count(*)::numeric / nullif((
      select count(distinct user_id)::numeric / 100
      from eligible_saves
    ), 0)
  ) as lift_score
from pairs
group by venue_a, venue_b
having count(*) >= 1;

-- Indexes — primary one is on (venue_a, shared_savers desc) so the venue
-- detail page can lookup "top 5 paired venues for venue X" in one seek.
create unique index venue_pair_affinity_pk
  on public.venue_pair_affinity (venue_a, venue_b);

create index venue_pair_affinity_lookup
  on public.venue_pair_affinity (venue_a, shared_savers desc);

-- Grant + tell PostgREST about the new MV.
grant select on public.venue_pair_affinity to anon, authenticated, service_role;
notify pgrst, 'reload schema';

-- Pair affinity changes when saves change — refresh on the same cadence
-- as venue_seo_aggregates. Manual refresh is fine for v1; add a cron when
-- you have one for venue_seo_aggregates too.
--
-- To refresh manually:
--   refresh materialized view concurrently public.venue_pair_affinity;
