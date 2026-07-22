-- Drop policies if they exist to prevent "already exists" errors when re-running the script
drop policy if exists "Users can read own payment orders" on public.payment_orders;
drop policy if exists "Users can insert own payment orders" on public.payment_orders;
drop policy if exists "Users can read own ledger" on public.wallet_ledger;
drop policy if exists "Users can read own wallets" on public.user_wallets;

-- Create payment_orders table to track Binance Pay requests and status
create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'BINANCE_PAY',
  merchant_trade_no text unique not null,
  prepay_id text unique,
  transaction_id text,
  currency text not null,
  amount numeric(30, 8) not null,
  status text not null default 'PENDING',
  qrcode_link text,
  qr_content text,
  checkout_url text,
  deeplink text,
  universal_url text,
  expire_time bigint,
  paid_at timestamptz,
  raw_response jsonb,
  raw_webhook jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on payment_orders
alter table public.payment_orders enable row level security;

-- Policies for payment_orders
create policy "Users can read own payment orders"
  on public.payment_orders for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own payment orders"
  on public.payment_orders for insert to authenticated
  with check (auth.uid() = user_id);

-- Create wallet_ledger table to track user financial transactions securely
create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_order_id uuid references public.payment_orders(id) on delete set null,
  type text not null default 'DEPOSIT',
  provider text not null default 'BINANCE_PAY',
  currency text not null,
  amount numeric(30, 8) not null,
  status text not null default 'COMPLETED',
  created_at timestamptz not null default now()
);

-- Enable RLS on wallet_ledger
alter table public.wallet_ledger enable row level security;

-- Policies for wallet_ledger
create policy "Users can read own ledger"
  on public.wallet_ledger for select to authenticated
  using (auth.uid() = user_id);

-- Create user_wallets table to hold current user balance per currency
create table if not exists public.user_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  currency text not null,
  balance numeric(30, 8) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, currency)
);

-- Enable RLS on user_wallets
alter table public.user_wallets enable row level security;

-- Policies for user_wallets
create policy "Users can read own wallets"
  on public.user_wallets for select to authenticated
  using (auth.uid() = user_id);

-- Create indexes for efficient querying
create index if not exists payment_orders_user_id_idx on public.payment_orders(user_id);
create index if not exists payment_orders_status_idx on public.payment_orders(status);
create index if not exists payment_orders_merchant_trade_no_idx on public.payment_orders(merchant_trade_no);
create index if not exists payment_orders_prepay_id_idx on public.payment_orders(prepay_id);
create index if not exists payment_orders_transaction_id_idx on public.payment_orders(transaction_id);
create index if not exists wallet_ledger_user_id_idx on public.wallet_ledger(user_id);
create index if not exists user_wallets_user_id_currency_idx on public.user_wallets(user_id, currency);

-- Stored procedure to atomically complete payment and credit user wallets (Safe & Idempotent)
create or replace function public.complete_payment_order(
  p_merchant_trade_no text,
  p_transaction_id text,
  p_raw_webhook jsonb
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_user_id uuid;
  v_amount numeric(30, 8);
  v_currency text;
  v_status text;
begin
  -- Retrieve order details with lock (SELECT FOR UPDATE)
  select id, user_id, amount, currency, status
  into v_order_id, v_user_id, v_amount, v_currency, v_status
  from public.payment_orders
  where merchant_trade_no = p_merchant_trade_no
  for update;

  if v_order_id is null then
    return false;
  end if;

  -- If order is already paid, do nothing (idempotent check)
  if v_status = 'PAID' then
    return true;
  end if;

  -- Update order status
  update public.payment_orders
  set status = 'PAID',
      transaction_id = p_transaction_id,
      raw_webhook = p_raw_webhook,
      paid_at = now(),
      updated_at = now()
  where id = v_order_id;

  -- Insert ledger entry
  insert into public.wallet_ledger (
    user_id,
    payment_order_id,
    type,
    provider,
    currency,
    amount,
    status
  ) values (
    v_user_id,
    v_order_id,
    'DEPOSIT',
    'BINANCE_PAY',
    v_currency,
    v_amount,
    'COMPLETED'
  );

  -- Upsert wallet balance
  insert into public.user_wallets (
    user_id,
    currency,
    balance,
    updated_at
  ) values (
    v_user_id,
    v_currency,
    v_amount,
    now()
  )
  on conflict (user_id, currency)
  do update set
    balance = public.user_wallets.balance + v_amount,
    updated_at = now();

  return true;
end;
$$;
