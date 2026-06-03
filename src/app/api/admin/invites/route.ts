import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Admin client init failed' }, { status: 500 })
  }

  const { data: inviteRows } = await admin
    .from('course_invites')
    .select('id, email, invited_at, accepted_at, nudge_count, last_nudge_at')
    .eq('course_slug', 'radar')
    .order('invited_at', { ascending: false })

  // Detect newly accepted invites (email now exists in auth.users)
  const { data: authData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const signedUpEmails = new Set(
    (authData?.users ?? []).map((u) => u.email?.toLowerCase()).filter(Boolean)
  )

  const toAccept = (inviteRows ?? []).filter((i) => !i.accepted_at && signedUpEmails.has(i.email))
  if (toAccept.length) {
    const now = new Date().toISOString()
    await admin.from('course_invites').update({ accepted_at: now }).in('id', toAccept.map((i) => i.id))
    toAccept.forEach((i) => { i.accepted_at = now })
  }

  const invites = (inviteRows ?? []).map((i) => ({
    id: i.id,
    email: i.email,
    invitedAt: i.invited_at,
    acceptedAt: i.accepted_at,
    nudgeCount: i.nudge_count,
    lastNudgeAt: i.last_nudge_at,
    status: i.accepted_at ? 'accepted' : 'pending',
  }))

  const stats = {
    total: invites.length,
    accepted: invites.filter((i) => i.status === 'accepted').length,
    pending: invites.filter((i) => i.status === 'pending').length,
  }

  return NextResponse.json({ invites, stats })
}
