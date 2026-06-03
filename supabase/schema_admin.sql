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
-- COURSE INVITES
-- Tracks email invitations sent to potential students
-- ============================================================
CREATE TABLE IF NOT EXISTS course_invites (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT NOT NULL,
  course_slug   TEXT NOT NULL DEFAULT 'radar',
  invited_by    UUID REFERENCES auth.users(id),
  invited_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at   TIMESTAMPTZ,
  nudge_count   INT NOT NULL DEFAULT 0,
  last_nudge_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS course_invites_email_idx ON course_invites(email);

ALTER TABLE course_invites ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED WEEK 2–4 NUDGE TEMPLATES + INVITE TEMPLATES
-- ============================================================

INSERT INTO email_templates (id, name, subject, body) VALUES
(
  'nudge-week2a',
  'Week 2 — Nudge A',
  'Still rooting for you',
  $body$Hey — Barry here.

I just wanted to check in on you.

The agents who are using RADAR right now are building real momentum — in this market, where most people are sitting on their hands wondering what to do next.

They're not waiting for things to get easier. They're identifying serious sellers, starting real conversations, and stacking listings while their competition is still trying to figure out where the deals are.

You started this for a reason.

Don't let that slip away.

Jump back in today — even just one lesson. That's all it takes to get the momentum going again.

— Barry$body$
),
(
  'nudge-week2b',
  'Week 2 — Nudge B',
  'The gap is widening',
  $body$Hey — it's Barry.

I want to be honest with you about something.

Every week that passes is a week the agents who are using this system are getting further ahead of the ones who aren't.

And I don't want that to be your story.

Because the gap between agents who know how to find motivated sellers and those who don't — it's not small. It's the difference between a great year and a frustrating one.

You have the same access they do. You just need to use it.

Get back in the course today. This is the work that separates the agents who thrive from the ones who just survive.

— Barry$body$
),
(
  'nudge-week3a',
  'Week 3 — Nudge A',
  'What''s getting in the way?',
  $body$Hey — Barry here.

I've been thinking about you.

Something keeps pulling you away from finishing this — and I get it. Life is busy. The business is demanding. There's always something urgent competing for your time.

But I've worked with enough agents to know this:

The ones who carve out time for this — even when it's inconvenient, even when it's hard — they're the ones who look back 90 days later and say that decision changed everything for them.

What would it mean for you to have consistent seller conversations every single month?

No more feast or famine. No more hoping the phone rings. Just a real, repeatable system for finding motivated sellers before anyone else does.

That's what's waiting for you on the other side of finishing this.

— Barry$body$
),
(
  'nudge-week3b',
  'Week 3 — Nudge B',
  'A win I want to share with you',
  $body$Hey — it's Barry.

I had an agent finish RADAR last week, and she already booked two listing appointments using exactly what we teach.

Two appointments. One week.

That's not a coincidence. That's the system working.

She wasn't some superstar agent with a huge database. She just followed the playbook, made the calls, and the results showed up.

I want that to be you. I really do.

Come back and finish what you started. You're closer than you think — and the system works when you do.

— Barry$body$
),
(
  'nudge-week4a',
  'Week 4 — Nudge A',
  'One month in — let''s talk',
  $body$Hey — Barry here.

It's been about a month since you got access to RADAR, and I just wanted to reach out one more time.

Not to pressure you. Not to give you a hard sell.

But because I've seen this transform enough careers that I'd feel like I was letting you down if I didn't follow up.

The agents winning in this market have one thing in common: they know exactly who to call, what to say, and when to say it.

They're not guessing. They're not cold-calling random lists hoping something sticks. They have a real system.

That's what RADAR gives you.

It's all waiting for you inside. The course isn't going anywhere — and whenever you're ready to finish, I'll be here.

— Barry$body$
),
(
  'nudge-week4b',
  'Week 4 — Nudge B',
  'I''ll keep the door open for you',
  $body$Hey — Barry here. One last check-in.

I don't want to keep filling your inbox, so this is my final follow-up for now.

But I want you to know something before I close the loop:

The course isn't going anywhere. The opportunity isn't going anywhere.

Whenever the timing is right — whether that's this week, next month, or six months from now — RADAR will be here, and so will I.

And when you're ready to finish, I promise it'll be worth it.

I've seen too many agents on the other side of this — with more listings, more consistency, and more confidence in their business — to not believe that for you too.

Good luck out there.

— Barry$body$
),
(
  'invite-nudge-1',
  'Invite Follow-Up — Day 1',
  'Did you get a chance to check this out?',
  $body$Hey — Barry here.

I sent you an invite to the RADAR training yesterday and just wanted to make sure it didn't get buried.

This is something I genuinely believe can make a real difference for your business — and I wouldn't have reached out personally if I didn't mean that.

It only takes a few minutes to get your account set up, and then you can move through the course at your own pace.

— Barry$body$
),
(
  'invite-nudge-2',
  'Invite Follow-Up — Day 4',
  'Still thinking about it?',
  $body$Hey — it's Barry.

I know things get busy — I get it.

But I'd hate for this to fall through the cracks, because the agents who've gone through RADAR are seeing real results right now.

More seller conversations. More listings. More consistent months.

Your invite is still open. It takes less than two minutes to create your account and get started.

— Barry$body$
),
(
  'invite-nudge-3',
  'Invite Follow-Up — Week 1',
  'Last time I''ll reach out about this',
  $body$Hey — Barry here. One last message.

I've sent you a couple of reminders about the RADAR training, and I don't want to keep showing up in your inbox if the timing isn't right.

But before I close the loop — I want you to know this is the real deal.

The agents who go through this aren't just learning theory. They're adding deals to their pipeline right now, in this market.

If you've been on the fence, this is me telling you: it's worth it.

If now isn't the right time, no worries at all. You know where to find us.

— Barry$body$
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
