-- ============================================================
-- RADAR Training Platform — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- USER PROGRESS
-- Tracks which lessons a user has completed
-- ============================================================
create table if not exists user_lesson_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_id   text not null,
  completed   boolean not null default false,
  score       int,                    -- optional: for quiz/roleplay scored lessons
  completed_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  unique (user_id, course_slug, lesson_id)
);

-- ============================================================
-- COURSE ENROLLMENTS
-- Tracks when users enrolled and if they graduated
-- ============================================================
create table if not exists user_course_enrollments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  course_slug   text not null,
  enrolled_at   timestamptz not null default now(),
  graduated_at  timestamptz,         -- null until all lessons complete

  unique (user_id, course_slug)
);

-- ============================================================
-- USER PROFILES
-- Extends auth.users with display name, etc.
-- ============================================================
create table if not exists user_profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Users can only read/write their own data
-- ============================================================

alter table user_lesson_progress enable row level security;
alter table user_course_enrollments enable row level security;
alter table user_profiles enable row level security;

-- Progress policies
create policy "Users can view their own progress"
  on user_lesson_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on user_lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on user_lesson_progress for update
  using (auth.uid() = user_id);

-- Enrollment policies
create policy "Users can view their own enrollments"
  on user_course_enrollments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own enrollments"
  on user_course_enrollments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own enrollments"
  on user_course_enrollments for update
  using (auth.uid() = user_id);

-- Profile policies
create policy "Users can view their own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_user_lesson_progress_updated_at
  before update on user_lesson_progress
  for each row execute procedure update_updated_at_column();

create trigger update_user_profiles_updated_at
  before update on user_profiles
  for each row execute procedure update_updated_at_column();
