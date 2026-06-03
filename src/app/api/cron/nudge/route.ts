import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// In-course sequence timing (days between nudges)
const DAYS_BEFORE_FIRST_NUDGE = 3
const COURSE_SEQUENCE: Array<{ after: string | null; days: number; send: string }> = [
  { after: null,           days: DAYS_BEFORE_FIRST_NUDGE, send: 'nudge-3day'   },
  { after: 'nudge-3day',   days: 4,                       send: 'nudge-4day'   },
  { after: 'nudge-4day',   days: 7,                       send: 'nudge-7day'   },
  { after: 'nudge-7day',   days: 7,                       send: 'nudge-week2a' },
  { after: 'nudge-week2a', days: 4,                       send: 'nudge-week2b' },
  { after: 'nudge-week2b', days: 7,                       send: 'nudge-week3a' },
  { after: 'nudge-week3a', days: 4,                       send: 'nudge-week3b' },
  { after: 'nudge-week3b', days: 7,                       send: 'nudge-week4a' },
  { after: 'nudge-week4a', days: 4,                       send: 'nudge-week4b' },
  // nudge-week4b sent → sequence complete
]

// Invite nudge sequence timing (days after invited_at / last_nudge_at)
const INVITE_SEQUENCE: Array<{ nudgeCount: number; days: number; templateId: string }> = [
  { nudgeCount: 0, days: 1, templateId: 'invite-nudge-1' },
  { nudgeCount: 1, days: 3, templateId: 'invite-nudge-2' },
  { nudgeCount: 2, days: 7, templateId: 'invite-nudge-3' },
]

const COURSE_TEMPLATE_IDS = [
  'nudge-3day', 'nudge-4day', 'nudge-7day',
  'nudge-week2a', 'nudge-week2b',
  'nudge-week3a', 'nudge-week3b',
  'nudge-week4a', 'nudge-week4b',
] as const

const INVITE_TEMPLATE_IDS = ['invite-nudge-1', 'invite-nudge-2', 'invite-nudge-3'] as const

type CourseTemplateId = (typeof COURSE_TEMPLATE_IDS)[number]
type InviteTemplateId = (typeof INVITE_TEMPLATE_IDS)[number]

interface Template { subject: string; body: string }

const FALLBACK_COURSE: Record<CourseTemplateId, Template> = {
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
  'nudge-week2a': {
    subject: 'Still rooting for you',
    body: "Hey — Barry here.\n\nJust wanted to check in. The agents using RADAR right now are building real momentum — and I don't want you to miss out.\n\nJump back in today, even just one lesson.\n\n— Barry",
  },
  'nudge-week2b': {
    subject: 'The gap is widening',
    body: "Hey — it's Barry.\n\nEvery week that passes is a week the agents using this system are getting further ahead.\n\nYou have the same access. You just need to use it.\n\nGet back in the course today.\n\n— Barry",
  },
  'nudge-week3a': {
    subject: "What's getting in the way?",
    body: "Hey — Barry here.\n\nSomething keeps pulling you away from finishing this — and I get it. Life is busy.\n\nBut the agents who carve out time for this are the ones who look back 90 days later and say it changed everything.\n\n— Barry",
  },
  'nudge-week3b': {
    subject: 'A win I want to share with you',
    body: "Hey — it's Barry.\n\nAn agent finished RADAR last week and already booked two listing appointments. Two appointments. One week.\n\nThat's the system working. Come back and finish what you started.\n\n— Barry",
  },
  'nudge-week4a': {
    subject: "One month in — let's talk",
    body: "Hey — Barry here.\n\nIt's been about a month since you got access to RADAR, and I just wanted to reach out one more time.\n\nThe agents winning right now know exactly who to call, what to say, and when. That's what RADAR teaches.\n\nIt's all waiting for you inside.\n\n— Barry",
  },
  'nudge-week4b': {
    subject: "I'll keep the door open for you",
    body: "Hey — Barry here. Last check-in.\n\nI don't want to keep filling your inbox, so this is my final follow-up for now.\n\nThe course isn't going anywhere. Whenever you're ready, I'll be here.\n\nGood luck out there.\n\n— Barry",
  },
}

const FALLBACK_INVITE: Record<InviteTemplateId, Template> = {
  'invite-nudge-1': {
    subject: 'Did you get a chance to check this out?',
    body: "Hey — Barry here.\n\nI sent you an invite to the RADAR training yesterday and just wanted to make sure it didn't get buried.\n\nIt only takes a few minutes to get your account set up, and then you can move at your own pace.\n\n— Barry",
  },
  'invite-nudge-2': {
    subject: 'Still thinking about it?',
    body: "Hey — it's Barry.\n\nI know things get busy — I get it.\n\nBut I'd hate for this to fall through the cracks. Your invite is still open. Just click below to get started.\n\n— Barry",
  },
  'invite-nudge-3': {
    subject: "Last time I'll reach out about this",
    body: "Hey — Barry here. One last message.\n\nIf the timing isn't right, no worries. But if you've been on the fence — this is me telling you it's worth it.\n\nThe invite is still open whenever you're ready.\n\n— Barry",
  },
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function textToHtml(text: string, ctaUrl: string, ctaText: string): string {
  const body = text
    .split('\n\n')
    .map((para) => `<p style="margin: 0 0 16px 0;">${para.replace(/\n/g, '<br>')}</p>`)
    .join('')
  const cta = `
    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <a href="${ctaUrl}" style="display: inline-block; background-color: #7BC109; color: #ffffff; font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
        ${ctaText} →
      </a>
    </div>`
  return `<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a; max-width: 600px;">${body}${cta}</div>`
}

async function loadTemplates(admin: ReturnType<typeof createAdminClient>) {
  const courseTemplates = { ...FALLBACK_COURSE }
  const inviteTemplates = { ...FALLBACK_INVITE }
  try {
    const allIds = [...COURSE_TEMPLATE_IDS, ...INVITE_TEMPLATE_IDS]
    const { data } = await admin.from('email_templates').select('id, subject, body').in('id', allIds)
    for (const row of data ?? []) {
      if (row.id in courseTemplates) courseTemplates[row.id as CourseTemplateId] = { subject: row.subject, body: row.body }
      if (row.id in inviteTemplates) inviteTemplates[row.id as InviteTemplateId] = { subject: row.subject, body: row.body }
    }
  } catch { /* fall back to hardcoded */ }
  return { courseTemplates, inviteTemplates }
}

async function sendEmail(
  resendKey: string,
  fromEmail: string,
  to: string,
  subject: string,
  body: string,
  ctaUrl: string,
  ctaText: string,
) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      reply_to: 'kiwi@ylopo.com',
      subject,
      text: body,
      html: textToHtml(body, ctaUrl, ctaText),
    }),
  })
}

// GET /api/cron/nudge — called daily by Vercel Cron
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 503 })

  const courseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://radar-platform-black.vercel.app'
  const signupUrl = `${courseUrl}/auth/signup`
  const fromEmail = process.env.NUDGE_FROM_EMAIL || 'Barry Jenkins <onboarding@resend.dev>'

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Admin client init failed' }, { status: 500 })
  }

  const { courseTemplates, inviteTemplates } = await loadTemplates(admin)
  const results = { sent: 0, skipped: 0, errors: 0 }
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  // ─── Part 1: In-course nudges ────────────────────────────────────────────────

  const { data: enrollments } = await admin
    .from('user_course_enrollments')
    .select('user_id, enrolled_at')
    .eq('course_slug', 'radar')
    .is('graduated_at', null)

  if (enrollments?.length) {
    const userIds = enrollments.map((e) => e.user_id)

    const { data: adminProfiles } = await admin.from('user_profiles').select('id').eq('is_admin', true)
    const adminIds = new Set((adminProfiles ?? []).map((p: { id: string }) => p.id))

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
      if (!existing || row.completed_at > existing) lastLessonAt.set(row.user_id, row.completed_at)
    }

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

    const { data: authData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const authUserMap = new Map((authData?.users ?? []).map((u) => [u.id, u]))

    for (const enrollment of enrollments) {
      const { user_id, enrolled_at } = enrollment
      if (adminIds.has(user_id)) { results.skipped++; continue }

      const authUser = authUserMap.get(user_id)
      if (!authUser?.email) { results.skipped++; continue }

      try {
        const lastLesson = lastLessonAt.get(user_id) ?? null
        const candidates = [lastLesson, enrolled_at].filter(Boolean) as string[]
        if (!candidates.length) { results.skipped++; continue }
        const lastActivityAt = candidates.reduce((a, b) => (a > b ? a : b))

        const currentPeriodNudges = (nudgesByUser.get(user_id) ?? [])
          .filter((n) => n.sentAt > lastActivityAt)
          .sort((a, b) => b.sentAt.localeCompare(a.sentAt))

        const lastNudge = currentPeriodNudges[0] ?? null

        let templateId: CourseTemplateId | null = null

        for (const step of COURSE_SEQUENCE) {
          if (step.after === null) {
            // First nudge: no prior nudge in this period + inactive long enough
            if (!lastNudge && daysSince(lastActivityAt) >= step.days) {
              templateId = step.send as CourseTemplateId
            }
          } else if (lastNudge?.templateId === step.after) {
            if (daysSince(lastNudge.sentAt) >= step.days) {
              templateId = step.send as CourseTemplateId
            }
          }
          if (templateId) break
        }

        if (!templateId) { results.skipped++; continue }

        const tpl = courseTemplates[templateId]
        const sendRes = await sendEmail(resendKey, fromEmail, authUser.email, tpl.subject, tpl.body, courseUrl, 'Jump Back Into the Course')

        const status = sendRes.ok ? 'sent' : 'failed'
        await admin.from('email_nudges').insert({
          user_id,
          template_id: templateId,
          subject: tpl.subject,
          body: tpl.body,
          sent_by: null,
          status,
        })

        if (sendRes.ok) { results.sent++; await sleep(350) }
        else {
          console.error(`Course nudge ${templateId} failed for ${authUser.email}`)
          results.errors++
        }
      } catch (err) {
        console.error(`Cron course nudge error for user ${user_id}:`, err)
        results.errors++
      }
    }
  }

  // ─── Part 2: Invite nudges ───────────────────────────────────────────────────

  const { data: pendingInvites } = await admin
    .from('course_invites')
    .select('id, email, invited_at, nudge_count, last_nudge_at, accepted_at')
    .eq('course_slug', 'radar')
    .is('accepted_at', null)
    .lt('nudge_count', INVITE_SEQUENCE.length)

  if (pendingInvites?.length) {
    // Detect newly accepted invites (signed up since we last checked)
    const { data: authData2 } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const signedUpEmails = new Set(
      (authData2?.users ?? []).map((u) => u.email?.toLowerCase()).filter(Boolean)
    )

    for (const invite of pendingInvites) {
      // Skip if they've now signed up
      if (signedUpEmails.has(invite.email)) {
        await admin.from('course_invites').update({ accepted_at: new Date().toISOString() }).eq('id', invite.id)
        results.skipped++
        continue
      }

      try {
        const step = INVITE_SEQUENCE.find((s) => s.nudgeCount === invite.nudge_count)
        if (!step) { results.skipped++; continue }

        const referenceDate = invite.nudge_count === 0 ? invite.invited_at : invite.last_nudge_at
        if (!referenceDate || daysSince(referenceDate) < step.days) { results.skipped++; continue }

        const tpl = inviteTemplates[step.templateId as InviteTemplateId]
        const sendRes = await sendEmail(resendKey, fromEmail, invite.email, tpl.subject, tpl.body, signupUrl, 'Create Your Free Account')

        if (sendRes.ok) {
          await admin.from('course_invites').update({
            nudge_count: invite.nudge_count + 1,
            last_nudge_at: new Date().toISOString(),
          }).eq('id', invite.id)
          results.sent++
          await sleep(350)
        } else {
          console.error(`Invite nudge failed for ${invite.email}`)
          results.errors++
        }
      } catch (err) {
        console.error(`Cron invite nudge error for ${invite.email}:`, err)
        results.errors++
      }
    }
  }

  console.log('Nudge cron complete:', results)
  return NextResponse.json(results)
}
