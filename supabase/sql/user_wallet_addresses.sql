-- Supabase Migration: User-Specific Wallet Addresses
-- This script creates the user_wallet_addresses table to allow per-user wallet address overrides.
--
-- IMPORTANT: Run this in your Supabase SQL Editor.

-- Create user_wallet_addresses table
create table if not exists public.user_wallet_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  crypto text not null,
  network text not null,
  address text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, crypto, network)
);

-- Enable RLS
alter table public.user_wallet_addresses enable row level security;

-- Drop policies if they already exist
drop policy if exists "Users can read their own wallet addresses" on public.user_wallet_addresses;
drop policy if exists "Users can insert their own wallet addresses" on public.user_wallet_addresses;
drop policy if exists "Admins can read all user wallet addresses" on public.user_wallet_addresses;
drop policy if exists "Admins can update user wallet addresses" on public.user_wallet_addresses;
drop policy if exists "Admins can delete user wallet addresses" on public.user_wallet_addresses;

-- Create policies for users
create policy "Users can read their own wallet addresses"
  on public.user_wallet_addresses for select to authenticated
  using (user_id = auth.uid());

-- Create policies for admins
create policy "Admins can read all user wallet addresses"
  on public.user_wallet_addresses for select to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can update user wallet addresses"
  on public.user_wallet_addresses for update to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can delete user wallet addresses"
  on public.user_wallet_addresses for delete to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Note: Users cannot insert their own addresses - only admins can set custom addresses for users
-- This prevents users from setting arbitrary addresses

-- Create index for faster lookups
create index if not exists idx_user_wallet_addresses_user_crypto on public.user_wallet_addresses(user_id, crypto);

-- Enable Realtime for user_wallet_addresses table safely
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'user_wallet_addresses'
  ) then
    alter publication supabase_realtime add table public.user_wallet_addresses;
  end if;
end $$;

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
drop trigger if exists update_user_wallet_addresses_updated_at on public.user_wallet_addresses;
create trigger update_user_wallet_addresses_updated_at
  before update on public.user_wallet_addresses
  for each row
  execute function public.handle_updated_at();
