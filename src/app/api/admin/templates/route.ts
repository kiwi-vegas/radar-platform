import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  if (!profile?.is_admin) return null
  return user
}

// GET /api/admin/templates — list all templates
export async function GET() {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('email_templates')
    .select('*')
    .order('id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ templates: data })
}

// PUT /api/admin/templates — update a template
export async function PUT(request: Request) {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { id, subject, body: emailBody, name } = body as {
    id: string
    name?: string
    subject: string
    body: string
  }

  if (!id || !subject || !emailBody) {
    return NextResponse.json({ error: 'id, subject, and body are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('email_templates')
    .update({ subject, body: emailBody, ...(name ? { name } : {}), updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
