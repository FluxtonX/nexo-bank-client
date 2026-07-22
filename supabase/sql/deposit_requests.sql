create table if not exists public.deposit_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset text not null,
  network text not null,
  company_address text not null,
  expected_amount numeric(36, 18) not null,
  tx_hash text not null,
  status text not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

alter table public.deposit_requests enable row level security;

create policy "Users can insert their own deposit requests"
on public.deposit_requests
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can read their own deposit requests"
on public.deposit_requests
for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all deposit requests"
on public.deposit_requests
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "Admins can update deposit requests"
on public.deposit_requests
for update
to authenticated
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

create index if not exists deposit_requests_user_id_idx
on public.deposit_requests (user_id);

create index if not exists deposit_requests_status_created_at_idx
on public.deposit_requests (status, created_at desc);
