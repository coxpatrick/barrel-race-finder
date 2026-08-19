create table public.runs (
  id uuid primary key default gen_random_uuid(),

  horse_id uuid not null
    references public.horses(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  event_id uuid
    references public.events(id)
    on delete set null,

  event_name text not null,
  arena_name text,
  run_date date not null,

  run_time numeric(6,3),

  class_name text,
  place integer,

  barrels_hit integer not null default 0,
  penalty_seconds numeric(5,2) not null default 0,

  payout numeric(10,2) not null default 0,

  ground_rating integer
    check (ground_rating between 1 and 5),

  notes text,
  video_url text,

  is_public boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.runs enable row level security;

create policy "Public runs are viewable by everyone"
on public.runs
for select
to anon, authenticated
using (
  user_id = (select auth.uid())
  or (
    is_public = true
    and exists (
      select 1
      from public.horses h
      where h.id = runs.horse_id
        and h.is_public = true
    )
  )
);

create policy "Users can add runs for their own horses"
on public.runs
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.horses h
    where h.id = runs.horse_id
      and h.owner_id = (select auth.uid())
  )
);

create policy "Users can update runs for their own horses"
on public.runs
for update
to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.horses h
    where h.id = runs.horse_id
      and h.owner_id = (select auth.uid())
  )
)
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.horses h
    where h.id = runs.horse_id
      and h.owner_id = (select auth.uid())
  )
);

create policy "Users can delete runs for their own horses"
on public.runs
for delete
to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.horses h
    where h.id = runs.horse_id
      and h.owner_id = (select auth.uid())
  )
);
create index runs_horse_id_run_date_idx
on public.runs(horse_id, run_date desc);

create index runs_user_id_idx
on public.runs(user_id);

create index runs_event_id_idx
on public.runs(event_id);