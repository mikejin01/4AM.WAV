-- ============================================
-- Sample events for 4AM.WAV
-- Run this in Supabase SQL Editor AFTER 001
-- ============================================

-- Event 1: Chris Stussy
insert into public.events (id, title, description, image_url, venue_name, venue_address, starts_at, ends_at)
values (
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Chris Stussy | Lost, Found & Forgotten - NY',
  'An unforgettable night of deep house and melodic techno with Chris Stussy.',
  'https://dice-media.imgix.net/attachments/2026-02-20/84cdfdfc-98b7-4a38-b095-5f315cd9f497.jpg?rect=0%2C0%2C1080%2C1080&auto=format%2Ccompress&q=40&w=204&h=204&fit=crop&crop=faces%2Ccenter&dpr=2',
  'Brooklyn Army Terminal: Pier 4',
  '58th St, Brooklyn, NY 11220',
  '2026-06-27 23:00:00-04',
  '2026-06-28 04:00:00-04'
);

insert into public.ticket_tiers (event_id, name, price_cents, quantity)
values (
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Free RSVP',
  0,
  500
);

-- Event 2: Teksupport Rafael
insert into public.events (id, title, description, image_url, venue_name, venue_address, starts_at, ends_at)
values (
  'a1b2c3d4-0002-4000-8000-000000000002',
  'Teksupport: Rafael (open to close)',
  'Rafael takes control for a marathon open-to-close set on the Brooklyn rooftop.',
  'https://dice-media.imgix.net/attachments/2026-03-25/820d9b64-a6a8-4d28-9eb4-51ff4ca0d16f.jpg?rect=0%2C0%2C1080%2C1080&auto=format%2Ccompress&q=40&w=204&h=204&fit=crop&crop=faces%2Ccenter&dpr=2',
  'Sunset Park Rooftop',
  '14b 53rd St, Brooklyn, NY 11232',
  '2026-06-13 23:00:00-04',
  '2026-06-14 04:00:00-04'
);

insert into public.ticket_tiers (event_id, name, price_cents, quantity)
values (
  'a1b2c3d4-0002-4000-8000-000000000002',
  'General Admission',
  6881,
  300
);
