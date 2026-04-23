import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// DELETE /api/admin/users/[id] — permanently remove a user and all their data
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  // Verify requester is admin
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

  const { id } = params

  // Prevent self-deletion
  if (id === adminUser.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Deleting the auth user cascades to user_profiles, user_course_enrollments,
  // user_lesson_progress, and email_nudges via ON DELETE CASCADE
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
