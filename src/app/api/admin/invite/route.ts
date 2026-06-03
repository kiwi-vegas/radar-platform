import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const DEFAULT_SUBJECT = "You're invited — RADAR training is now open for you"
const DEFAULT_BODY = `Hey there,

Barry Jenkins here.

I wanted to personally reach out and invite you to the RADAR training program.

This is the exact system my team uses to identify serious sellers before they hit the market — and it's been a game changer for the agents who've gone through it.

We're not talking about theory or generic scripts. This is a step-by-step playbook for finding motivated sellers, starting real conversations, and converting them into listings.

The agents I've seen go through RADAR don't just pick up a few extra deals. They build consistent, predictable income.

I'd love to see you get the same results.

Click below to create your free account and get started today. The whole program is self-paced, so you can move through it on your schedule.

And if you have any questions at all — just hit reply. I personally read every response.

Looking forward to seeing you inside.

— Barry`

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

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const reqBody = await request.json()
  const email = (reqBody.email as string | undefined)?.toLowerCase().trim()
  const subject = reqBody.subject || DEFAULT_SUBJECT
  const emailBody = reqBody.body || DEFAULT_BODY

  if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 503 })

  const fromEmail = process.env.NUDGE_FROM_EMAIL || 'Barry Jenkins <onboarding@resend.dev>'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://radar-platform-black.vercel.app'

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Admin client init failed' }, { status: 500 })
  }

  // Reject if there's already a pending (non-accepted) invite for this email
  const { data: existing } = await admin
    .from('course_invites')
    .select('id, accepted_at')
    .eq('email', email)
    .eq('course_slug', 'radar')
    .order('invited_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing && !existing.accepted_at) {
    return NextResponse.json({ error: 'This email already has a pending invite' }, { status: 409 })
  }

  const signupUrl = `${siteUrl}/auth/signup`

  const sendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      reply_to: 'kiwi@ylopo.com',
      subject,
      text: emailBody,
      html: textToHtml(emailBody, signupUrl, 'Get Started Free'),
    }),
  })

  if (!sendRes.ok) {
    const data = await sendRes.json().catch(() => ({}))
    return NextResponse.json({ error: data.message || `Email send failed: ${sendRes.status}` }, { status: 500 })
  }

  const { error: insertError } = await admin.from('course_invites').insert({
    email,
    course_slug: 'radar',
    invited_by: user.id,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
