-- ============================================================
-- RADAR Training Platform — Admin Schema Extensions
-- Run this AFTER schema.sql in your Supabase SQL editor
-- ============================================================

-- Add admin flag to user profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- ============================================================
-- EMAIL TEMPLATES
-- Stores editable nudge email templates (admin-managed)
-- ============================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  subject     TEXT NOT NULL,
  body        TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No RLS policies: only accessible via service role key (used in admin API routes)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- EMAIL NUDGE LOG
-- Tracks every nudge email sent (with the exact content sent)
-- ============================================================
CREATE TABLE IF NOT EXISTS email_nudges (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id  TEXT NOT NULL,
  subject      TEXT NOT NULL,   -- exact subject sent (may differ from template if edited)
  body         TEXT NOT NULL,   -- exact body sent
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_by      UUID REFERENCES auth.users(id),
  status       TEXT NOT NULL DEFAULT 'sent'  -- 'sent' | 'failed'
);

-- No RLS policies: only accessible via service role key
ALTER TABLE email_nudges ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED EMAIL TEMPLATES
-- Pre-load the 3 nudge sequences. Re-running updates them.
-- ============================================================

INSERT INTO email_templates (id, name, subject, body) VALUES
(
  'nudge-3day',
  '3-Day Nudge',
  'Quick check-in 👋',
  $body_3day$Hey — Barry here.

I saw you got started with RADAR, and I just wanted to personally check in.

Most agents never even take that first step… so you're already ahead of 90% of the industry.

But here's the truth:

The agents who win with this aren't the ones who start — they're the ones who finish and execute.

I've watched hundreds of agents take this exact playbook and turn it into consistent deals… the kind that turn into big months and even bigger years.

And the opportunity sitting in front of you right now? Most agents don't even know it exists — let alone how to convert it.

You're in a position to change that.

If you got stuck, got busy, or just fell out of rhythm — no problem. That happens.

Just jump back in today and pick up where you left off.

And if you need anything at all, we've got you.

— Barry$body_3day$
),
(
  'nudge-4day',
  '4-Day Follow-Up',
  'Don''t leave this sitting on the table',
  $body_4day$Hey — it's Barry again.

I wanted to follow up with you because I've seen this happen too many times…

Agents get access to something that could genuinely change their business — and then life gets busy, and it just sits there.

I don't want that to be you.

Because what we're teaching inside RADAR isn't theory.

This is exactly how my team creates consistent deal flow, agents stop relying on random leads, and people start stacking real commission checks month after month.

These are real opportunities already out there, happening every single day.

The difference is simple: the agents who know how to work them vs the ones who don't.

You're already inside the room.

You just need to finish what you started.

Block 20–30 minutes today. That's it. Get back in, knock out the next section, and keep moving.

Momentum is everything here.

Let's not let this one slip.

— Barry$body_4day$
),
(
  'nudge-7day',
  '7-Day Final Push',
  'Real talk for a second',
  $body_7day$Hey — Barry here.

I'm going to be direct with you.

If you don't finish this… nothing changes.

You go back to chasing the same leads, dealing with the same inconsistency, hoping the next month is better than the last.

And I know that's not what you want.

Because the agents who lean into this — who actually commit and follow through — they don't just get a few extra deals…

They build predictable income. They stop guessing. They stop relying on luck. They start creating big, repeatable months.

That's what this is about.

Not hype. Not theory.

Execution.

You already raised your hand by starting. Now finish it.

Even if it's just one section today — get back in and move forward.

I promise you… this is worth it.

— Barry$body_7day$
)
ON CONFLICT (id) DO UPDATE SET
  name       = EXCLUDED.name,
  subject    = EXCLUDED.subject,
  body       = EXCLUDED.body,
  updated_at = NOW();

-- ============================================================
-- TO MAKE YOURSELF AN ADMIN:
-- Run this after creating your account, replacing the email:
--
-- UPDATE user_profiles
-- SET is_admin = TRUE
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
-- ============================================================
