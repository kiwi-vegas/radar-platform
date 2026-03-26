-- ============================================================
-- RADAR Training Platform — PPC Plus Waitlist
-- Run this in your Supabase SQL editor
-- ============================================================

CREATE TABLE IF NOT EXISTS ppc_waitlist (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email        TEXT NOT NULL,
  full_name    TEXT,
  signed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id)
);

ALTER TABLE ppc_waitlist ENABLE ROW LEVEL SECURITY;

-- Users can insert and view their own waitlist entry
CREATE POLICY "Users can join waitlist"
  ON ppc_waitlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own waitlist entry"
  ON ppc_waitlist FOR SELECT
  USING (auth.uid() = user_id);
