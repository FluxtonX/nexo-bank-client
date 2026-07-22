-- Supabase Migration: Platform Wallets Management
-- This script creates the platform_wallets table and seeds it with initial data.
--
-- IMPORTANT: Run this in your Supabase SQL Editor.

-- Create platform_wallets table
create table if not exists public.platform_wallets (
  wallet_id text primary key,
  type text not null check (type in ('Hot', 'Cold')),
  crypto text not null,
  address text not null,
  balance_crypto text not null,
  balance_cad numeric not null,
  status text not null check (status in ('Active', 'Paused', 'Suspended')) default 'Active',
  last_activity text not null,
  network text not null,
  transactions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.platform_wallets enable row level security;

-- Drop policies if they already exist
drop policy if exists "Admins can read platform wallets" on public.platform_wallets;
drop policy if exists "Admins can update platform wallets" on public.platform_wallets;
drop policy if exists "Admins can insert platform wallets" on public.platform_wallets;

-- Create policies for admin role
create policy "Admins can read platform wallets"
  on public.platform_wallets for select to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "Admins can update platform wallets"
  on public.platform_wallets for update to authenticated
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

create policy "Admins can insert platform wallets"
  on public.platform_wallets for insert to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Seed Initial platform wallets
insert into public.platform_wallets (
  wallet_id, type, crypto, address, balance_crypto, balance_cad, status, last_activity, network, transactions
) values 
(
  'WALLET-HOT-BTC-001', 
  'Hot', 
  'BTC', 
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 
  '2.58340000 BTC', 
  254123.45, 
  'Active', 
  'Jun 2, 11:30 a.m.', 
  'Bitcoin Mainnet', 
  '[
    {"txId": "TX-90214", "type": "Deposit", "amountCad": 15400, "amountCrypto": "0.155 BTC", "timestamp": "Jun 2, 11:30 a.m.", "txHash": "0xfd8a9e22db38cf9e8f17b3c2f0f9b6e8d646a782bcfd992d9f1092e038ff1234"},
    {"txId": "TX-90192", "type": "Withdrawal", "amountCad": 5000, "amountCrypto": "0.051 BTC", "timestamp": "Jun 1, 04:15 p.m.", "txHash": "0x6a2c94db8e11a28a3f890a82746b1c0a876a345e82b7cd1e86ba20d6f3e1a2b3"}
  ]'::jsonb
),
(
  'WALLET-COLD-BTC-001', 
  'Cold', 
  'BTC', 
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 
  '45.23410000 BTC', 
  4451234.12, 
  'Active', 
  'Jun 1, 09:00 a.m.', 
  'Bitcoin Mainnet Secure Vault', 
  '[
    {"txId": "TX-89210", "type": "Deposit", "amountCad": 500000, "amountCrypto": "5.09 BTC", "timestamp": "Jun 1, 09:00 a.m.", "txHash": "0x3a9b8c7d6e5f4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c"}
  ]'::jsonb
),
(
  'WALLET-HOT-ETH-001', 
  'Hot', 
  'ETH', 
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 
  '125.45230000 ETH', 
  541234.56, 
  'Active', 
  'Jun 2, 10:45 a.m.', 
  'Ethereum Mainnet', 
  '[
    {"txId": "TX-90201", "type": "Deposit", "amountCad": 25000, "amountCrypto": "10.4 ETH", "timestamp": "Jun 2, 10:45 a.m.", "txHash": "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b"},
    {"txId": "TX-90180", "type": "Withdrawal", "amountCad": 12000, "amountCrypto": "5.0 ETH", "timestamp": "Jun 2, 08:30 a.m.", "txHash": "0xbc8d9f1092e038ff1234fd8a9e22db38cf9e8f17b3c2f0f9b6e8d646a782bcfd"}
  ]'::jsonb
),
(
  'WALLET-COLD-ETH-001', 
  'Cold', 
  'ETH', 
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 
  '834.23410000 ETH', 
  3598765.43, 
  'Active', 
  'May 30, 02:20 p.m.', 
  'Ethereum Cold Vault (Multi-Sig)', 
  '[
    {"txId": "TX-87129", "type": "Deposit", "amountCad": 1200000, "amountCrypto": "500 ETH", "timestamp": "May 30, 02:20 p.m.", "txHash": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"}
  ]'::jsonb
),
(
  'WALLET-HOT-USDT-001', 
  'Hot', 
  'USDT', 
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 
  '250000.00 USDT', 
  340000.00, 
  'Active', 
  'Jun 2, 11:15 a.m.', 
  'TRON (TRC-20) / Ethereum', 
  '[
    {"txId": "TX-90208", "type": "Deposit", "amountCad": 50000, "amountCrypto": "50000 USDT", "timestamp": "Jun 2, 11:15 a.m.", "txHash": "0x7a8d9f1092e038ff1234fd8a9e22db38cf9e8f17b3c2f0f9b6e8d646a782bcfd9"}
  ]'::jsonb
)
on conflict (wallet_id) do nothing;

-- Enable Realtime for platform_wallets table safely
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'platform_wallets'
  ) then
    alter publication supabase_realtime add table public.platform_wallets;
  end if;
end $$;
