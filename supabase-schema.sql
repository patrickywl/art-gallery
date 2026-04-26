-- Run this in the Supabase SQL Editor to set up the database.

-- Artworks table
create table if not exists artworks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null default '',
  price numeric(10,2) not null default 0,
  category text not null default 'Uncategorized',
  image_url text not null default '',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Site settings (key-value store)
create table if not exists site_settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- Default site settings
insert into site_settings (key, value) values
  ('artist_name', 'Artist Name'),
  ('artist_bio', 'Welcome to my gallery. I create unique artworks inspired by nature and emotion.'),
  ('hero_image_url', ''),
  ('contact_email', 'hello@example.com')
on conflict (key) do nothing;

-- Enable Row Level Security
alter table artworks enable row level security;
alter table site_settings enable row level security;

-- Public read access for artworks
create policy "Public can view artworks"
  on artworks for select
  using (true);

-- Authenticated users can manage artworks
create policy "Auth users can insert artworks"
  on artworks for insert
  to authenticated
  with check (true);

create policy "Auth users can update artworks"
  on artworks for update
  to authenticated
  using (true);

create policy "Auth users can delete artworks"
  on artworks for delete
  to authenticated
  using (true);

-- Public read access for site settings
create policy "Public can view site_settings"
  on site_settings for select
  using (true);

-- Authenticated users can update site settings
create policy "Auth users can update site_settings"
  on site_settings for update
  to authenticated
  using (true);

-- Storage bucket for artwork images
-- (Create via Supabase Dashboard > Storage > New bucket: "artworks", public)

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger artworks_updated_at
  before update on artworks
  for each row execute function update_updated_at();

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function update_updated_at();
