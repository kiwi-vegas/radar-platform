import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Sequence timing
const DAYS_BEFORE_FIRST_NUDGE = 3  // days inactive → send nudge-3day
const DAYS_AFTER_3DAY_NUDGE   = 4  // days after nudge-3day → send nudge-4day
const DAYS_AFTER_4DAY_NUDGE   = 7  // days after nudge-4day → send nudge-7day

const TEMPLATE_IDS = ['nudge-3day', 'nudge-4day', 'nudge-7day'] as const
type TemplateId = (typeof TEMPLATE_IDS)[number]

interface Template { subject: string; body: string }

// Fallback template content if DB read fails
const FALLBACK_TEMPLATES: Record<TemplateId, Template> = {
  'nudge-3day': {
    subject: 'Quick check-in 👋',
    body: 'Hey — Barry here.\n\nI saw you got started with Radar, and I just wanted to personally check in.\n\nIf you got stuck, got busy, or just fell out of rhythm — no problem. That happens.\n\nJust jump back in today and pick up where you left off.\n\n— Barry',
  },
  'nudge-4day': {
    subject: "Don't leave this sitting on the table",
    body: "Hey — it's Barry again.\n\nI don't want to see this opportunity slip by for you.\n\nBlock 20–30 minutes today. Get back in, knock out the next section, and keep moving.\n\nMomentum is everything here.\n\n— Barry",
  },
  'nudge-7day': {
    subject: 'Real talk for a second',
    body: "Hey — Barry here.\n\nI'm going to be direct with you.\n\nIf you don't finish this… nothing changes.\n\nYou already raised your hand by starting. Now finish it.\n\nEven if it's just one section today — get back in and move forward.\n\n— Barry",
  },
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function textToHtml(text: string, courseUrl: string): string {
  const body = text
    .split('\n\n')
    .map((para) => `<p style="margin: 0 0 16px 0;">${para.replace(/\n/g, '<br>')}</p>`)
    .join('')
  const cta = `
    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <a href="${courseUrl}" style="display: inline-block; background-color: #7BC109; color: #ffffff; font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
        Jump Back Into the Course →
      </a>
    </div>`
  return `<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a; max-width: 600px;">${body}${cta}</div>`
}

async function loadTemplates(
  admin: ReturnType<typeof createAdminClient>,
): Promise<Record<TemplateId, Template>> {
  const result = { ...FALLBACK_TEMPLATES }
  try {
    const { data } = await admin
      .from('email_templates')
      .select('id, subject, body')
      .in('id', TEMPLATE_IDS as unknown as string[])
    for (const row of data ?? []) {
      if (row.id in result) {
        result[row.id as TemplateId] = { subject: row.subject, body: row.body }
      }
    }
  } catch {
    // fall back to hardcoded defaults
  }
  return result
}

// GET /api/cron/nudge — called daily by Vercel Cron
export async function GET(request: Request) {
  // Verify Vercel cron secret (if configured)
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 503 })
  }

  const courseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://radar-platform-black.vercel.app/'
  const fromEmail = process.env.NUDGE_FROM_EMAIL || 'Barry Jenkins <onboarding@resend.dev>'

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Admin client init failed' }, { status: 500 })
  }

  // 1. All non-graduated radar enrollments
  const { data: enrollments } = await admin
    .from('user_course_enrollments')
    .select('user_id, enrolled_at')
    .eq('course_slug', 'radar')
    .is('graduated_at', null)

  if (!enrollments?.length) {
    return NextResponse.json({ sent: 0, skipped: 0, errors: 0 })
  }

  const userIds = enrollments.map((e) => e.user_id)

  // 2. Exclude admins
  const { data: adminProfiles } = await admin
    .from('user_profiles')
    .select('id')
    .eq('is_admin', true)
  const adminIds = new Set((adminProfiles ?? []).map((p: { id: string }) => p.id))

  // 3. Last lesson completion per user
  const { data: progressRows } = await admin
    .from('user_lesson_progress')
    .select('user_id, completed_at')
    .eq('course_slug', 'radar')
    .eq('completed', true)
    .in('user_id', userIds)

  const lastLessonAt = new Map<string, string>()
  for (const row of progressRows ?? []) {
    if (!row.completed_at) continue
    const existing = lastLessonAt.get(row.user_id)
    if (!existing || row.completed_at > existing) {
      lastLessonAt.set(row.user_id, row.completed_at)
    }
  }

  // 4. Nudge history per user (sent only), most recent first
  const { data: nudgeRows } = await admin
    .from('email_nudges')
    .select('user_id, template_id, sent_at')
    .eq('status', 'sent')
    .in('user_id', userIds)
    .order('sent_at', { ascending: false })

  const nudgesByUser = new Map<string, Array<{ templateId: string; sentAt: string }>>()
  for (const n of nudgeRows ?? []) {
    const arr = nudgesByUser.get(n.user_id) ?? []
    arr.push({ templateId: n.template_id, sentAt: n.sent_at })
    nudgesByUser.set(n.user_id, arr)
  }

  // 5. Auth users for email addresses
  const { data: authData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const authUserMap = new Map((authData?.users ?? []).map((u) => [u.id, u]))

  // 6. Load templates from DB (with fallback)
  const templates = await loadTemplates(admin)

  const results = { sent: 0, skipped: 0, errors: 0 }

  for (const enrollment of enrollments) {
    const { user_id, enrolled_at } = enrollment

    if (adminIds.has(user_id)) { results.skipped++; continue }

    const authUser = authUserMap.get(user_id)
    if (!authUser?.email) { results.skipped++; continue }

    try {
      // Last course activity = later of (last lesson completed, enrolled_at)
      const lastLesson = lastLessonAt.get(user_id) ?? null
      const candidates = [lastLesson, enrolled_at].filter(Boolean) as string[]
      if (!candidates.length) { results.skipped++; continue }
      const lastActivityAt = candidates.reduce((a, b) => (a > b ? a : b))

      // Nudges sent during this current inactive stretch (after lastActivityAt)
      const currentPeriodNudges = (nudgesByUser.get(user_id) ?? [])
        .filter((n) => n.sentAt > lastActivityAt)
        .sort((a, b) => b.sentAt.localeCompare(a.sentAt))

      const lastNudge = currentPeriodNudges[0] ?? null

      let templateId: TemplateId | null = null

      if (!lastNudge) {
        // No nudge yet in this inactive period — send first one after 3 days
        if (daysSince(lastActivityAt) >= DAYS_BEFORE_FIRST_NUDGE) {
          templateId = 'nudge-3day'
        }
      } else if (lastNudge.templateId === 'nudge-3day') {
        if (daysSince(lastNudge.sentAt) >= DAYS_AFTER_3DAY_NUDGE) {
          templateId = 'nudge-4day'
        }
      } else if (lastNudge.templateId === 'nudge-4day') {
        if (daysSince(lastNudge.sentAt) >= DAYS_AFTER_4DAY_NUDGE) {
          templateId = 'nudge-7day'
        }
      }
      // nudge-7day sent → sequence complete for this period

      if (!templateId) { results.skipped++; continue }

      const tpl = templates[templateId]

      // Send via Resend
      const sendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [authUser.email],
          reply_to: 'kiwi@ylopo.com',
          subject: tpl.subject,
          text: tpl.body,
          html: textToHtml(tpl.body, courseUrl),
        }),
      })

      const sendData = await sendRes.json().catch(() => ({}))
      const status = sendRes.ok ? 'sent' : 'failed'

      // Log every attempt
      await admin.from('email_nudges').insert({
        user_id,
        template_id: templateId,
        subject: tpl.subject,
        body: tpl.body,
        sent_by: null, // automated
        status,
      })

      if (sendRes.ok) {
        results.sent++
      } else {
        console.error(`Nudge ${templateId} failed for ${authUser.email}:`, sendData)
        results.errors++
      }
    } catch (err) {
      console.error(`Cron nudge error for user ${user_id}:`, err)
      results.errors++
    }
  }

  console.log(`Nudge cron complete:`, results)
  return NextResponse.json(results)
}
