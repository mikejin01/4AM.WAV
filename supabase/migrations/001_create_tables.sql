-- ============================================
-- 4AM.WAV Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Events
create table public.events (
  id uuid default gen_random_uuid() primary key,
  created_by uuid references auth.users on delete set null,
  title text not null,
  description text,
  image_url text,
  venue_name text not null,
  venue_address text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Events are publicly readable"
  on public.events for select
  using (true);

create policy "Authenticated users can create events"
  on public.events for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Creators can update their own events"
  on public.events for update
  to authenticated
  using (auth.uid() = created_by);

-- 2. Ticket tiers (each event can have multiple ticket types)
create table public.ticket_tiers (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events on delete cascade not null,
  name text not null,
  price_cents integer not null default 0,
  quantity integer not null default 0,
  sold_count integer not null default 0,
  created_at timestamptz default now()
);

alter table public.ticket_tiers enable row level security;

create policy "Ticket tiers are publicly readable"
  on public.ticket_tiers for select
  using (true);

create policy "Event creators can manage ticket tiers"
  on public.ticket_tiers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events
      where id = event_id and created_by = auth.uid()
    )
  );

-- 3. Orders (one per user per purchase/RSVP)
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  event_id uuid references public.events on delete cascade not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  total_cents integer not null default 0,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Authenticated users can create orders"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 4. Order items (individual ticket line items within an order)
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  ticket_tier_id uuid references public.ticket_tiers on delete cascade not null,
  quantity integer not null default 1,
  unit_price_cents integer not null default 0,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "Users can view their own order items"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can create order items"
  on public.order_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );
