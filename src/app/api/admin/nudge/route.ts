import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const COURSE_URL = 'https://radar-platform-black.vercel.app/'

function textToHtml(text: string): string {
  const body = text
    .split('\n\n')
    .map((para) =>
      `<p style="margin: 0 0 16px 0;">${para.replace(/\n/g, '<br>')}</p>`
    )
    .join('')

  const cta = `
    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <a href="${COURSE_URL}" style="display: inline-block; background-color: #7BC109; color: #ffffff; font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
        Jump Back Into the Course →
      </a>
    </div>
  `

  return `<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a; max-width: 600px;">${body}${cta}</div>`
}

function textToHtmlCongrats(text: string): string {
  const body = text
    .split('\n\n')
    .map((para) =>
      `<p style="margin: 0 0 16px 0;">${para.replace(/\n/g, '<br>')}</p>`
    )
    .join('')

  const sharingNote = `
    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px 0; font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; color: #172F44;">
        Your certificate is attached 🎓
      </p>
      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #555555;">
        Be sure to <strong>share it and post about your success</strong> — on LinkedIn, Instagram, or with your team leader.
        You've earned this, and we're proud of you.
      </p>
    </div>
  `

  return `<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a; max-width: 600px;">${body}${sharingNote}</div>`
}

// POST /api/admin/nudge — send a nudge email to a user
export async function POST(request: Request) {
  // Verify admin
  const supabase = await createClient()
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: myProfile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', adminUser.id)
    .single()

  if (!myProfile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { userId, templateId, subject, emailBody } = body as {
    userId: string
    templateId: string
    subject: string
    emailBody: string
  }

  if (!userId || !templateId || !subject || !emailBody) {
    return NextResponse.json({ error: 'userId, templateId, subject, and emailBody are required' }, { status: 400 })
  }

  // Check Resend API key
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json(
      { error: 'Email not configured. Please add RESEND_API_KEY to your environment variables.' },
      { status: 503 }
    )
  }

  // Get recipient email from auth admin
  const admin = createAdminClient()
  const { data: { user: recipient }, error: userError } = await admin.auth.admin.getUserById(userId)
  if (userError || !recipient?.email) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const fromEmail = process.env.NUDGE_FROM_EMAIL || 'Barry Jenkins <onboarding@resend.dev>'
  const replyTo = 'kiwi@ylopo.com'
  const isCongrats = templateId === 'congrats'

  // For congrats emails, generate a certificate PNG attachment
  let attachments: Array<{ filename: string; content: string }> = []
  if (isCongrats) {
    try {
      // Get user's display name
      const { data: profile } = await admin
        .from('user_profiles')
        .select('full_name')
        .eq('id', userId)
        .single()

      const userName =
        profile?.full_name ||
        recipient.user_metadata?.full_name ||
        recipient.user_metadata?.name ||
        recipient.email.split('@')[0]

      // Get graduation date
      const { data: enrollment } = await admin
        .from('user_course_enrollments')
        .select('graduated_at')
        .eq('user_id', userId)
        .eq('course_slug', 'radar')
        .single()

      const { generateCertificatePng } = await import('@/lib/generateCertificate')
      const pngBuffer = await generateCertificatePng(
        userName,
        enrollment?.graduated_at ?? null,
      )

      attachments = [{
        filename: `Radar-Certificate-${userName.replace(/\s+/g, '-')}.png`,
        content: pngBuffer.toString('base64'),
      }]
    } catch (err) {
      console.error('Certificate generation failed — sending without attachment:', err)
      // Non-fatal: email still sends without attachment
    }
  }

  // Send via Resend REST API
  const sendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [recipient.email],
      reply_to: replyTo,
      subject,
      text: emailBody,
      html: isCongrats ? textToHtmlCongrats(emailBody) : textToHtml(emailBody),
      ...(attachments.length > 0 ? { attachments } : {}),
    }),
  })

  const sendData = await sendRes.json().catch(() => ({}))

  if (!sendRes.ok) {
    console.error('Resend error:', sendData)
    await admin.from('email_nudges').insert({
      user_id: userId,
      template_id: templateId,
      subject,
      body: emailBody,
      sent_by: adminUser.id,
      status: 'failed',
    })
    return NextResponse.json(
      { error: sendData?.message || `Email send failed (${sendRes.status})` },
      { status: 500 }
    )
  }

  // Log successful send
  await admin.from('email_nudges').insert({
    user_id: userId,
    template_id: templateId,
    subject,
    body: emailBody,
    sent_by: adminUser.id,
    status: 'sent',
  })

  return NextResponse.json({ success: true, email: recipient.email })
}
