import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401, user: null }
  const { data: profile } = await supabase.from('user_profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return { error: 'Forbidden', status: 403, user: null }
  return { error: null, status: 200, user }
}

// GET /api/admin/team — list all admins with active/pending status
export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let admin: ReturnType<typeof createAdminClient>
  try { admin = createAdminClient() } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Admin client error' }, { status: 500 })
  }

  const { data: adminProfiles } = await admin
    .from('user_profiles')
    .select('id, full_name, is_admin')
    .eq('is_admin', true)

  const { data: authData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const authMap = new Map((authData?.users ?? []).map((u) => [u.id, u]))

  const admins = (adminProfiles ?? []).map((p) => {
    const authUser = authMap.get(p.id)
    return {
      id: p.id,
      fullName: p.full_name ?? authUser?.email?.split('@')[0] ?? 'Unknown',
      email: authUser?.email ?? '(no account)',
      lastSignInAt: authUser?.last_sign_in_at ?? null,
      status: authUser?.last_sign_in_at ? 'active' : 'pending',
    }
  })

  admins.sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1
    if (a.status !== 'active' && b.status === 'active') return 1
    return a.email.localeCompare(b.email)
  })

  return NextResponse.json({ admins })
}

// POST /api/admin/team — grant admin to an email address
export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

  let admin: ReturnType<typeof createAdminClient>
  try { admin = createAdminClient() } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Admin client error' }, { status: 500 })
  }

  const { data: authData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const found = authData?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase().trim())

  if (!found) {
    return NextResponse.json({ error: 'No account found for this email. They need to sign up first at /auth/signup, then try again.' }, { status: 404 })
  }

  await admin.from('user_profiles').update({ is_admin: true }).eq('id', found.id)

  return NextResponse.json({ ok: true, email: found.email })
}

// DELETE /api/admin/team — revoke admin from a user id
export async function DELETE(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { userId } = await request.json()
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  if (userId === auth.user?.id) return NextResponse.json({ error: 'Cannot revoke your own admin access' }, { status: 400 })

  let admin: ReturnType<typeof createAdminClient>
  try { admin = createAdminClient() } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Admin client error' }, { status: 500 })
  }

  await admin.from('user_profiles').update({ is_admin: false }).eq('id', userId)
  return NextResponse.json({ ok: true })
}
