-- 마음담음 cloud sync schema.
-- Run this once in the Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query).

create table if not exists public.relationships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  name text not null,
  relation_type text not null,
  closeness int not null,
  tone_preference text not null,
  memory_notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, client_id)
);

create table if not exists public.message_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  relationship_name text not null,
  relation_type text not null,
  category text not null,
  primary_keyword_label text not null,
  sub_keyword_labels jsonb not null default '[]'::jsonb,
  format text not null,
  selected_text text not null,
  candidates jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, client_id)
);

alter table public.relationships enable row level security;
alter table public.message_history enable row level security;

create policy "Users manage their own relationships"
  on public.relationships for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own message history"
  on public.message_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
