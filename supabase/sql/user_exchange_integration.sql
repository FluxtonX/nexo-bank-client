-- Supabase Migration: Client-Side Wallets & Exchange Integration
-- This script creates the secure execute_trade function, trigger, and backfills
-- to make client-side wallets and buy/sell functionality functional.
--
-- IMPORTANT: Run this in your Supabase SQL Editor.

-- Secure transaction-safe trade execution function (brokerage model)
create or replace function public.execute_trade(
  p_user_id uuid,
  p_side text,            -- 'buy' or 'sell'
  p_crypto_symbol text,    -- e.g. 'BTC', 'ETH'
  p_fiat_currency text,   -- 'USDT' or 'CAD'
  p_usd_amount numeric,    -- amount of USD/USDT/CAD
  p_crypto_amount numeric  -- amount of cryptocurrency
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_fiat_balance numeric;
  v_crypto_balance numeric;
begin
  -- Ensure side is valid
  if p_side not in ('buy', 'sell') then
    raise exception 'Invalid trade side. Must be buy or sell.';
  end if;

  -- Ensure fiat currency is valid
  if p_fiat_currency not in ('USDT', 'CAD') then
    raise exception 'Invalid fiat currency. Must be USDT or CAD.';
  end if;

  if p_side = 'buy' then
    -- Deduct Fiat (USDT or CAD), Credit Crypto
    -- 1. Check fiat balance with row lock to prevent race conditions
    select balance into v_fiat_balance
    from public.user_wallets
    where user_id = p_user_id and currency = p_fiat_currency
    for update;

    if v_fiat_balance is null or v_fiat_balance < p_usd_amount then
      raise exception 'Insufficient % balance to complete this purchase.', p_fiat_currency;
    end if;

    -- 2. Deduct fiat balance
    update public.user_wallets
    set balance = balance - p_usd_amount,
        updated_at = now()
    where user_id = p_user_id and currency = p_fiat_currency;

    -- 3. Credit Crypto balance
    insert into public.user_wallets (user_id, currency, balance, updated_at)
    values (p_user_id, p_crypto_symbol, p_crypto_amount, now())
    on conflict (user_id, currency)
    do update set
      balance = public.user_wallets.balance + p_crypto_amount,
      updated_at = now();

    -- 4. Record ledger log
    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (p_user_id, 'DEPOSIT', 'EXCHANGE_BUY', p_crypto_symbol, p_crypto_amount, 'COMPLETED');

    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (p_user_id, 'WITHDRAWAL', 'EXCHANGE_BUY', p_fiat_currency, p_usd_amount, 'COMPLETED');

  else
    -- Deduct Crypto, Credit Fiat (USDT or CAD)
    -- 1. Check Crypto balance with row lock
    select balance into v_crypto_balance
    from public.user_wallets
    where user_id = p_user_id and currency = p_crypto_symbol
    for update;

    if v_crypto_balance is null or v_crypto_balance < p_crypto_amount then
      raise exception 'Insufficient % balance to complete this sale.', p_crypto_symbol;
    end if;

    -- 2. Deduct Crypto balance
    update public.user_wallets
    set balance = balance - p_crypto_amount,
        updated_at = now()
    where user_id = p_user_id and currency = p_crypto_symbol;

    -- 3. Credit fiat balance
    insert into public.user_wallets (user_id, currency, balance, updated_at)
    values (p_user_id, p_fiat_currency, p_usd_amount, now())
    on conflict (user_id, currency)
    do update set
      balance = public.user_wallets.balance + p_usd_amount,
      updated_at = now();

    -- 4. Record ledger log
    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (p_user_id, 'WITHDRAWAL', 'EXCHANGE_SELL', p_crypto_symbol, p_crypto_amount, 'COMPLETED');

    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (p_user_id, 'DEPOSIT', 'EXCHANGE_SELL', p_fiat_currency, p_usd_amount, 'COMPLETED');

  end if;

  return true;
end;
$$;

-- Trigger to automatically create default wallets for new signups (USDT $50k only for Mudassir)
create or replace function public.handle_new_user_wallets()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Give Mudassir $50,000 USDT seed balance, others $0
  insert into public.user_wallets (user_id, currency, balance)
  values (new.id, 'USDT', case when new.email = 'muhammedmudassir40@gmail.com' then 50000.00 else 0.00 end)
  on conflict (user_id, currency) do nothing;
  
  -- Also give them 0 balance for BTC, ETH, and CAD so they show up in portfolios
  insert into public.user_wallets (user_id, currency, balance)
  values (new.id, 'BTC', 0.00000000)
  on conflict (user_id, currency) do nothing;
  
  insert into public.user_wallets (user_id, currency, balance)
  values (new.id, 'ETH', 0.00000000)
  on conflict (user_id, currency) do nothing;
  
  insert into public.user_wallets (user_id, currency, balance)
  values (new.id, 'CAD', 0.00)
  on conflict (user_id, currency) do nothing;
  
  return new;
end;
$$;

-- Create trigger safely
drop trigger if exists on_auth_user_created_wallets on auth.users;
create trigger on_auth_user_created_wallets
  after insert on auth.users
  for each row execute procedure public.handle_new_user_wallets();

-- Backfill Muhammed Mudassir with USDT ($50k) and empty BTC/ETH wallets if they don't have them
insert into public.user_wallets (user_id, currency, balance)
select id, 'USDT', 50000.00
from auth.users
where email = 'muhammedmudassir40@gmail.com'
  and not exists (
    select 1 from public.user_wallets where user_id = auth.users.id and currency = 'USDT'
  )
on conflict (user_id, currency) do nothing;

insert into public.user_wallets (user_id, currency, balance)
select id, 'BTC', 0.00000000
from auth.users
where email = 'muhammedmudassir40@gmail.com'
  and not exists (
    select 1 from public.user_wallets where user_id = auth.users.id and currency = 'BTC'
  )
on conflict (user_id, currency) do nothing;

insert into public.user_wallets (user_id, currency, balance)
select id, 'ETH', 0.00000000
from auth.users
where email = 'muhammedmudassir40@gmail.com'
  and not exists (
    select 1 from public.user_wallets where user_id = auth.users.id and currency = 'ETH'
  )
on conflict (user_id, currency) do nothing;


-- Trigger to automatically credit user's wallet and log to ledger when a manual deposit is approved
create or replace function public.handle_manual_deposit_approval()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.status = 'approved' and (old.status is null or old.status != 'approved') then
    -- 1. Credit the client's wallet balance
    insert into public.user_wallets (user_id, currency, balance, updated_at)
    values (new.user_id, new.asset, new.expected_amount, now())
    on conflict (user_id, currency)
    do update set
      balance = public.user_wallets.balance + new.expected_amount,
      updated_at = now();

    -- 2. Log in wallet_ledger
    insert into public.wallet_ledger (user_id, type, provider, currency, amount, status)
    values (new.user_id, 'DEPOSIT', 'MANUAL_DEPOSIT', new.asset, new.expected_amount, 'COMPLETED');
  end if;
  
  return new;
end;
$$;

-- Register trigger safely
drop trigger if exists on_deposit_requests_approved on public.deposit_requests;
create trigger on_deposit_requests_approved
  after update on public.deposit_requests
  for each row execute procedure public.handle_manual_deposit_approval();

