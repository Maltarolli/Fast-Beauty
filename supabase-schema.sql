-- ============================================
-- FastBeauty — Supabase Database Schema
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  created_at timestamp with time zone default now(),
  trial_ends_at timestamp with time zone default (now() + interval '15 days'),
  subscription_status text not null default 'trialing' check (subscription_status in ('active', 'inactive', 'trialing')),
  stripe_customer_id text,
  stripe_subscription_id text
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. CLIENTS TABLE
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  phone text not null,
  observations text,
  last_visit date,
  created_at timestamp with time zone default now()
);

alter table public.clients enable row level security;
create policy "Users manage own clients" on public.clients
  for all using (auth.uid() = user_id);

create index idx_clients_user_id on public.clients(user_id);
create index idx_clients_phone on public.clients(user_id, phone);

-- 4. SERVICES TABLE
create table public.services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  duration_minutes integer not null default 30,
  created_at timestamp with time zone default now()
);

alter table public.services enable row level security;
create policy "Users manage own services" on public.services
  for all using (auth.uid() = user_id);

create index idx_services_user_id on public.services(user_id);

-- 5. APPOINTMENTS TABLE
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  appointment_date date not null,
  appointment_time time not null,
  client_name text not null,
  client_phone text not null default '',
  service_name text not null default '',
  price numeric(10,2) not null default 0,
  observations text,
  is_paid boolean not null default false,
  created_at timestamp with time zone default now()
);

alter table public.appointments enable row level security;
create policy "Users manage own appointments" on public.appointments
  for all using (auth.uid() = user_id);

create index idx_appointments_user_date on public.appointments(user_id, appointment_date);

-- 6. TIME BLOCKS TABLE
create table public.time_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  block_date date not null,
  is_full_day boolean not null default false,
  start_time time,
  end_time time,
  reason text,
  created_at timestamp with time zone default now()
);

alter table public.time_blocks enable row level security;
create policy "Users manage own blocks" on public.time_blocks
  for all using (auth.uid() = user_id);

create index idx_time_blocks_user_date on public.time_blocks(user_id, block_date);

-- 7. TRANSACTIONS TABLE
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('entrada', 'saida')),
  title text not null,
  amount numeric(10,2) not null default 0,
  category text not null default 'Outros',
  transaction_date date not null,
  source text not null default 'manual' check (source in ('manual', 'agenda', 'estoque', 'fixo')),
  source_id uuid,
  created_at timestamp with time zone default now()
);

alter table public.transactions enable row level security;
create policy "Users manage own transactions" on public.transactions
  for all using (auth.uid() = user_id);

create index idx_transactions_user_date on public.transactions(user_id, transaction_date);
create index idx_transactions_source on public.transactions(source, source_id);

-- 8. PRODUCTS TABLE
create table public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  brand text,
  category text,
  quantity integer not null default 0,
  min_quantity integer not null default 2,
  created_at timestamp with time zone default now()
);

alter table public.products enable row level security;
create policy "Users manage own products" on public.products
  for all using (auth.uid() = user_id);

create index idx_products_user_id on public.products(user_id);

-- 9. FIXED RULES TABLE
create table public.fixed_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  amount numeric(10,2) not null default 0,
  category text not null default 'Fixo',
  day_of_month integer not null default 1 check (day_of_month >= 1 and day_of_month <= 31),
  created_at timestamp with time zone default now()
);

alter table public.fixed_rules enable row level security;
create policy "Users manage own fixed rules" on public.fixed_rules
  for all using (auth.uid() = user_id);

create index idx_fixed_rules_user_id on public.fixed_rules(user_id);

-- 10. PURCHASE ITEMS TABLE
create table public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null default 0,
  total_price numeric(10,2) not null default 0,
  purchase_date date not null,
  created_at timestamp with time zone default now()
);

alter table public.purchase_items enable row level security;
create policy "Users manage own purchase items" on public.purchase_items
  for all using (auth.uid() = user_id);

create index idx_purchase_items_transaction on public.purchase_items(transaction_id);
