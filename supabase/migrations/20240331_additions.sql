-- supabase/migrations/20240331_additions.sql

-- Cloned prompts table (Pro feature)
create table if not exists cloned_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  brand_id uuid references brands(id) on delete set null,
  source_image_url text,
  vision_analysis jsonb,
  generated_prompt text,
  disclaimer_accepted_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

-- Admin logs table
create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references profiles(id),
  action text not null,
  target_user_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Acquisition source for UTM tracking
alter table profiles add column if not exists acquisition_source jsonb;

-- RLS for new tables
alter table cloned_prompts enable row level security;
alter table admin_logs enable row level security;

create policy "Users can view their own cloned prompts" on cloned_prompts for select using (auth.uid() = user_id);
create policy "Users can insert their own cloned prompts" on cloned_prompts for insert with check (auth.uid() = user_id);

-- Performance indexes
create index if not exists idx_brands_user_id on brands (user_id) where deleted_at is null;
create index if not exists idx_prompts_user_id_created on prompts (user_id, created_at desc) where deleted_at is null;
create index if not exists idx_prompts_brand_id on prompts (brand_id) where deleted_at is null;
create index if not exists idx_cloned_prompts_user_id on cloned_prompts (user_id, created_at desc) where deleted_at is null;
create index if not exists idx_usage_events_user_type on usage_events (user_id, event_type);
create index if not exists idx_usage_events_created on usage_events (created_at desc);
create index if not exists idx_guest_usage_fingerprint on guest_usage (fingerprint);
