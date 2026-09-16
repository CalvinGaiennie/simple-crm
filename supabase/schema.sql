-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- to set up the CRM's contacts table with row-level security.

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  status text not null default 'cold'
    check (status in (
      'cold', 'warm', 'contacted', 'meeting_set', 'proposal_sent',
      'closed', 'active', 'invoiced', 'paid_in_full', 'passed'
    )),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists contacts_user_id_idx on public.contacts (user_id);

alter table public.contacts enable row level security;

drop policy if exists "Users manage their own contacts" on public.contacts;
create policy "Users manage their own contacts"
  on public.contacts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
