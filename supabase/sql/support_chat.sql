-- Supabase Migration: Live Chat Support (Updated for Production)
-- This script creates/updates the required database tables, indices, triggers,
-- and enables realtime for the live chat support feature.
--
-- IMPORTANT: Run this in your Supabase SQL Editor.
-- This script is idempotent — safe to run multiple times.

-- ═══════════════════════════════════════════════════════════════════
-- 1. Create support_threads table
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.support_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  status text not null default 'Waiting', -- 'Active' | 'Waiting' | 'Resolved'
  unread_count_admin integer not null default 0,
  unread_count_user integer not null default 0,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  is_ticket boolean not null default false,
  category text,
  ticket_id text
);

-- ═══════════════════════════════════════════════════════════════════
-- 2. Create support_messages table
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.support_threads(id) on delete cascade,
  sender text not null, -- 'Client' | 'Admin'
  text text not null,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- 3. Disable RLS (admin panel uses service role key, not Supabase Auth)
-- ═══════════════════════════════════════════════════════════════════
alter table public.support_threads disable row level security;
alter table public.support_messages disable row level security;

-- Grant access to the anon and authenticated roles so both the
-- client-side (authenticated) and admin (anon/service-role) can
-- read/write these tables without RLS blocking them.
grant all on public.support_threads to anon, authenticated, service_role;
grant all on public.support_messages to anon, authenticated, service_role;

-- ═══════════════════════════════════════════════════════════════════
-- 4. Trigger: auto-update unread counts + thread status on new message
-- ═══════════════════════════════════════════════════════════════════
create or replace function public.handle_new_support_message()
returns trigger as $$
begin
  if NEW.sender = 'Client' then
    update public.support_threads
    set unread_count_admin = unread_count_admin + 1,
        last_message_at = NEW.created_at,
        status = 'Waiting'
    where id = NEW.thread_id;
  elsif NEW.sender = 'Admin' then
    update public.support_threads
    set unread_count_user = unread_count_user + 1,
        last_message_at = NEW.created_at,
        status = 'Active'
    where id = NEW.thread_id;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to prevent error on re-run
drop trigger if exists on_new_support_message on public.support_messages;

create trigger on_new_support_message
  after insert on public.support_messages
  for each row execute procedure public.handle_new_support_message();

-- ═══════════════════════════════════════════════════════════════════
-- 5. Indices for performance
-- ═══════════════════════════════════════════════════════════════════
create index if not exists support_threads_user_id_idx on public.support_threads(user_id);
create index if not exists support_threads_last_message_at_idx on public.support_threads(last_message_at desc);
create index if not exists support_messages_thread_id_idx on public.support_messages(thread_id);
create index if not exists support_messages_created_at_idx on public.support_messages(created_at asc);

-- ═══════════════════════════════════════════════════════════════════
-- 6. Enable Realtime (idempotent — checks before adding)
-- ═══════════════════════════════════════════════════════════════════
do $$
begin
  -- Create publication if not exists
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;

  -- Add support_threads if not already added
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
      and schemaname = 'public' 
      and tablename = 'support_threads'
  ) then
    alter publication supabase_realtime add table public.support_threads;
  end if;

  -- Add support_messages if not already added
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
      and schemaname = 'public' 
      and tablename = 'support_messages'
  ) then
    alter publication supabase_realtime add table public.support_messages;
  end if;
end;
$$;

-- ═══════════════════════════════════════════════════════════════════
-- 7. Add email column to profiles table if it doesn't exist
--    (so the admin chat join can fetch it directly)
-- ═══════════════════════════════════════════════════════════════════
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'email'
  ) then
    alter table public.profiles add column email text;
  end if;
end;
$$;

-- Backfill email from auth.users into profiles for existing users
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and (p.email is null or p.email = '');

-- ═══════════════════════════════════════════════════════════════════
-- 8. Auto-sync email trigger: when a user signs up or updates email,
--    keep profiles.email in sync
-- ═══════════════════════════════════════════════════════════════════
create or replace function public.handle_auth_user_email_sync()
returns trigger as $$
begin
  update public.profiles
  set email = NEW.email
  where id = NEW.id;
  return NEW;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to prevent error on re-run
drop trigger if exists on_auth_user_email_sync on auth.users;

create trigger on_auth_user_email_sync
  after insert or update of email on auth.users
  for each row execute procedure public.handle_auth_user_email_sync();

-- ═══════════════════════════════════════════════════════════════════
-- Done! Verify tables exist:
-- ═══════════════════════════════════════════════════════════════════
-- select * from public.support_threads;
-- select * from public.support_messages;
