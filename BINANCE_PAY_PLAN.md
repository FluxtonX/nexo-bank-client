# Binance Pay Merchant QR Payment Integration Plan

This plan details the implementation of secure Binance Pay Merchant QR Code payments in North Union. All sensitive operations and API key usage will be handled securely in the backend via Supabase Edge Functions, ensuring that credentials are never exposed to the frontend client.

## Proposed Changes

### Database & Schema (Supabase Migrations)

#### [NEW] [binance_pay_migration.sql](file:///e:/canadian%20Digital/North%20Union/northUnion/supabase/sql/binance_pay_migration.sql)
A new migration file to create the tables, indexes, and Row Level Security (RLS) policies for:
- `payment_orders`: Tracks the lifetime of Binance Pay orders and holds QR/deeplink parameters.
- `wallet_ledger`: Financial ledger capturing all balance changes.
- `user_wallets`: Users' current balances, synchronized via ledger transactions.

```sql
-- Create payment_orders table
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

create policy "Users can read own payment orders"
  on public.payment_orders for select to authenticated
  using (auth.uid() = user_id);

-- Create wallet_ledger table
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

create policy "Users can read own ledger"
  on public.wallet_ledger for select to authenticated
  using (auth.uid() = user_id);

-- Create user_wallets table
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

create policy "Users can read own wallets"
  on public.user_wallets for select to authenticated
  using (auth.uid() = user_id);

-- Create database indexes for performance
create index if not exists payment_orders_user_id_idx on public.payment_orders(user_id);
create index if not exists payment_orders_status_idx on public.payment_orders(status);
create index if not exists payment_orders_merchant_trade_no_idx on public.payment_orders(merchant_trade_no);
create index if not exists payment_orders_prepay_id_idx on public.payment_orders(prepay_id);
create index if not exists payment_orders_transaction_id_idx on public.payment_orders(transaction_id);
create index if not exists wallet_ledger_user_id_idx on public.wallet_ledger(user_id);
create index if not exists user_wallets_user_id_currency_idx on public.user_wallets(user_id, currency);
```

---

### Supabase Edge Functions

We will create four Edge Functions in `supabase/functions/` to securely handle all Binance Pay communications:

1. `create-binance-pay-order`:
   - Validates authenticated Supabase user.
   - Generates signature using HMAC_SHA512.
   - Sends POST to `/binancepay/openapi/v3/order`.
   - Records pending order in `payment_orders`.
2. `binance-pay-webhook`:
   - Validates webhook signature using certificate SN and public keys.
   - Idempotently updates order status to `PAID`, adds ledger deposit, and updates user wallet.
3. `get-binance-payment-status`:
   - Returns status of an order for authenticated user querying it.
4. `query-binance-pay-order` (fallback verification):
   - Securely queries order status via Binance Pay API, updating the DB if webhooks are delayed.

---

### Frontend Components & Pages

#### [MODIFY] [deposit-workspace.tsx](file:///e:/canadian%20Digital/North%20Union/northUnion/src/components/dashboard/deposit-workspace.tsx)
- Change `/api/deposit/create-order` and `/api/deposit/verify-order` calls to target the new Supabase Edge Functions directly.
- Read credentials and call backend API endpoints via `supabase.functions.invoke(...)`.
- Update component states to handle expiry countdown, QR visual styling, mobile links (`deeplink`/`universalUrl`), and status tracking.

---

## Verification Plan

### Automated Tests
- Test edge functions locally using Supabase CLI: `supabase start`, `supabase functions serve`.
- Execute test scripts to trigger webhook mock signals and ensure no double-crediting occurs.

### Manual Verification
- Generate Binance Pay QR via frontend for USDT.
- Verify status changes to PENDING.
- Simulate webhook payload for the corresponding `merchantTradeNo`.
- Verify wallet balance increases and ledger logs deposit.
