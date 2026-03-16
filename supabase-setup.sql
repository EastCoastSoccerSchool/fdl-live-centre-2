-- Run this in Supabase SQL Editor

create table if not exists public.match_scores (
  fixture_id text primary key,
  home_score integer,
  away_score integer,
  updated_by_email text,
  updated_at timestamptz default now()
);

alter table public.match_scores enable row level security;

-- Public can read scores
create policy "public read scores"
on public.match_scores
for select
to anon, authenticated
using (true);

-- Logged-in users can insert and update scores
create policy "authenticated insert scores"
on public.match_scores
for insert
to authenticated
with check (true);

create policy "authenticated update scores"
on public.match_scores
for update
to authenticated
using (true)
with check (true);

-- Realtime
alter publication supabase_realtime add table public.match_scores;