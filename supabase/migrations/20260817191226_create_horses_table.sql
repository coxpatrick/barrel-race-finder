create table public.horses (
  id uuid primary key default gen_random_uuid(),

  owner_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null,

  rider_name text,

  breed text,
  color text,
  sex text,
  birth_year integer,
  height_hands numeric(4,2),

  photo_url text,

  is_public boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.horses enable row level security;

create policy "Public horses are viewable by everyone"
on public.horses
for select
using (
  is_public = true
  or owner_id = auth.uid()
);

create policy "Users can add their own horses"
on public.horses
for insert
to authenticated
with check (
  owner_id = auth.uid()
);

create policy "Users can update their own horses"
on public.horses
for update
to authenticated
using (
  owner_id = auth.uid()
)
with check (
  owner_id = auth.uid()
);

create policy "Users can delete their own horses"
on public.horses
for delete
to authenticated
using (
  owner_id = auth.uid()
);
create index horses_owner_id_idx
on public.horses(owner_id);