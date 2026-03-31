-- supabase/migrations/20240330_initial_schema.sql

-- Enable uuid extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  plan text default 'free',              -- 'free' | 'basic' | 'pro'
  role text default 'user',             -- 'user' | 'admin'
  onboarding_completed boolean default false,
  active_brand_id uuid,                  -- set after onboarding
  prompts_used int default 0,
  prompts_reset_at timestamptz default now() + interval '30 days',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Brands table
create table brands (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  niche text,
  description text,
  color_mode text check (color_mode in ('manual', 'palette', 'ai')),
  colors jsonb,                          -- { primary, secondary, accent }
  content_mode text check (content_mode in ('manual', 'ai')),
  font_mode text default 'ai' check (font_mode in ('manual', 'ai')),
  fonts jsonb,                           -- { title, body, accent }
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Prompts table
create table prompts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  brand_id uuid references brands(id) on delete set null,
  format text check (format in ('feed', 'story', 'carousel')),
  has_persona boolean default false,
  raw_input jsonb,
  generated_prompt text,
  generated_copy jsonb,                  -- { hook, body, cta, hashtags }
  copy_tone text,
  is_preset boolean default false,
  preset_name text,
  is_public boolean default false,
  result_image_url text,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

-- Prompt Feedbacks table
create table prompt_feedbacks (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references prompts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  feedback text not null,
  created_at timestamptz default now()
);

-- System Prompts table
create table system_prompts (
  id text primary key,                   -- 'generate' | 'copy' | 'clone' | 'suggest_colors' | 'suggest_content'
  content text not null,
  description text,
  version int default 1,
  updated_at timestamptz default now()
);

-- Guest Usage table
create table guest_usage (
  id uuid primary key default uuid_generate_v4(),
  fingerprint text unique not null,
  used boolean default false,
  created_at timestamptz default now()
);

-- Usage Events table
create table usage_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- RLS Policies
alter table profiles enable row level security;
alter table brands enable row level security;
alter table prompts enable row level security;
alter table prompt_feedbacks enable row level security;
alter table system_prompts enable row level security;
alter table guest_usage enable row level security;
alter table usage_events enable row level security;

-- Profile policies
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Brand policies
create policy "Users can view their own brands" on brands for select using (auth.uid() = user_id);
create policy "Users can insert their own brands" on brands for insert with check (auth.uid() = user_id);
create policy "Users can update their own brands" on brands for update using (auth.uid() = user_id);
create policy "Users can delete their own brands" on brands for update using (auth.uid() = user_id); -- For soft delete

-- Prompt policies
create policy "Users can view their own prompts" on prompts for select using (auth.uid() = user_id);
create policy "Users can insert their own prompts" on prompts for insert with check (auth.uid() = user_id);
create policy "Public can view public prompts" on prompts for select using (is_public = true);

-- System Prompts (Read-only for internal logic via service_role, blocked for users)
-- No public policies means only service_role can access.

-- Seed initial system prompts placeholders
insert into system_prompts (id, description, content) values
  ('generate',        'Geração de prompt de imagem para Google ImageFX', 'Act as an expert image prompt engineer...'),
  ('copy',            'Geração de copy de conversão para Instagram',      'Generate high-conversion Instagram copy...'),
  ('clone',           'Análise de imagem e clonagem via GPT Vision',      'Analyze this image and extract its style...'),
  ('suggest_colors',  'Sugestão de paleta de cores por nicho',            'Suggest a color palette for...'),
  ('suggest_content', 'Sugestão de texto e objetivo por nicho',           'Suggest creative content ideas for...');
