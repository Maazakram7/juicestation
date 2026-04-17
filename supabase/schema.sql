-- ============================================================
-- JUICEeSTATION — Supabase schema
-- Run this in the Supabase SQL editor.
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- USERS (optional — populated best-effort on order placement)
-- ------------------------------------------------------------
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists users_email_idx on users(email);

-- ------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_id text unique not null,        -- human-friendly (e.g. JS-A4B7C2)
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  delivery_address text not null,
  notes text,
  items jsonb not null,                 -- [{id, name, price, qty, meta?}]
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_intent_id text,               -- for Stripe
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists orders_order_id_idx on orders(order_id);
create index if not exists orders_customer_email_idx on orders(customer_email);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);

-- ------------------------------------------------------------
-- SUBSCRIPTIONS (weekly delivery signups)
-- Status lifecycle: pending → active → paused → cancelled
-- ------------------------------------------------------------
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  subscription_id text unique not null,          -- e.g. JSS-A4B7C2
  tier text not null
    check (tier in ('weekly-litre', 'big-bottle-plus', 'household-litres')),
  tier_name text not null,
  price_per_week numeric(10,2) not null check (price_per_week >= 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  delivery_address text not null,
  delivery_postcode text not null,
  juice_preference text,
  preferred_start_date date,
  notes text,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'paused', 'cancelled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  next_delivery_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists subscriptions_subscription_id_idx on subscriptions(subscription_id);
create index if not exists subscriptions_customer_email_idx on subscriptions(customer_email);
create index if not exists subscriptions_status_idx on subscriptions(status);
create index if not exists subscriptions_postcode_idx on subscriptions(delivery_postcode);

-- ------------------------------------------------------------
-- TRIGGERS — keep updated_at fresh
-- ------------------------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_updated_at on users;
create trigger users_updated_at before update on users
  for each row execute function set_updated_at();

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at before update on orders
  for each row execute function set_updated_at();

drop trigger if exists subscriptions_updated_at on subscriptions;
create trigger subscriptions_updated_at before update on subscriptions
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
-- We run writes from the Express server with the SERVICE ROLE key,
-- which bypasses RLS. RLS is still enabled so the ANON key can't
-- read private data from the browser.
alter table users enable row level security;
alter table orders enable row level security;
alter table subscriptions enable row level security;

-- No public policies = nothing accessible via anon key.
-- (If you later let customers look up their own orders by email +
--  magic link, add a policy for authenticated users here.)
