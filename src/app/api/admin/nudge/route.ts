import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

function textToHtml(text: string): string {
  return '<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a; max-width: 600px;">' +
    text
      .split('\n\n')
      .map((para) =>
        `<p style="margin: 0 0 16px 0;">${para.replace(/\n/g, '<br>')}</p>`
      )
      .join('') +
    '</div>'
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
      html: textToHtml(emailBody),
    }),
  })

  const sendData = await sendRes.json().catch(() => ({}))

  if (!sendRes.ok) {
    console.error('Resend error:', sendData)
    // Log failed attempt
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
