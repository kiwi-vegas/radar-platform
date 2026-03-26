import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/waitlist — join the PPC Plus waitlist
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { error } = await supabase.from('ppc_waitlist').insert({
    user_id: user.id,
    email: user.email,
    full_name: profile?.full_name ?? null,
  })

  // Ignore duplicate — already on waitlist
  if (error && !error.message.includes('duplicate') && !error.code?.includes('23505')) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
