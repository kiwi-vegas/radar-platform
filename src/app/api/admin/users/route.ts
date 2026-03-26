import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { allCourses, getAllLessonIds } from '@/data/courses'

// Total lessons per course (pre-computed for progress % calculation)
const courseTotals: Record<string, number> = {}
for (const course of allCourses) {
  courseTotals[course.slug] = getAllLessonIds(course).length
}

function daysSince(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  const ms = Date.now() - new Date(dateStr).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export async function GET() {
  // Verify requesting user is an admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: myProfile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!myProfile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Use service role for all data queries (bypasses RLS)
  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Admin client init failed' }, { status: 500 })
  }

  // 1. All auth users
  const { data: authData, error: authError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
  const authUsers = authData.users

  // 2. All profiles
  const { data: profiles } = await admin.from('user_profiles').select('id, full_name, is_admin')
  const profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string | null; is_admin: boolean }) => [p.id, p]))

  // 3. All enrollments (RADAR course)
  const { data: enrollments } = await admin
    .from('user_course_enrollments')
    .select('user_id, course_slug, enrolled_at, graduated_at')
  const enrollmentMap = new Map(
    (enrollments ?? []).map((e: { user_id: string; course_slug: string; enrolled_at: string | null; graduated_at: string | null }) => [`${e.user_id}:${e.course_slug}`, e])
  )

  // 4. All completed lesson progress
  const { data: progressRows } = await admin
    .from('user_lesson_progress')
    .select('user_id, course_slug, lesson_id, completed_at')
    .eq('completed', true)

  // Group progress by user+course
  const progressMap = new Map<string, { count: number; maxCompletedAt: string | null }>()
  for (const row of progressRows ?? []) {
    const key = `${row.user_id}:${row.course_slug}`
    const existing = progressMap.get(key)
    if (!existing) {
      progressMap.set(key, { count: 1, maxCompletedAt: row.completed_at })
    } else {
      existing.count++
      if (row.completed_at && (!existing.maxCompletedAt || row.completed_at > existing.maxCompletedAt)) {
        existing.maxCompletedAt = row.completed_at
      }
    }
  }

  // 5. Last nudge sent per user
  const { data: nudgeRows } = await admin
    .from('email_nudges')
    .select('user_id, template_id, sent_at')
    .order('sent_at', { ascending: false })

  const lastNudgeMap = new Map<string, { templateId: string; sentAt: string }>()
  for (const n of nudgeRows ?? []) {
    if (!lastNudgeMap.has(n.user_id)) {
      lastNudgeMap.set(n.user_id, { templateId: n.template_id, sentAt: n.sent_at })
    }
  }

  // Build user rows (filter out admins for cleaner view, but include them)
  const users = authUsers.map((u) => {
    const profile = profileMap.get(u.id)
    const courseSlug = 'radar'
    const enrollment = enrollmentMap.get(`${u.id}:${courseSlug}`)
    const progress = progressMap.get(`${u.id}:${courseSlug}`)
    const totalLessons = courseTotals[courseSlug] ?? 0
    const completedLessons = progress?.count ?? 0
    const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    const graduatedAt = enrollment?.graduated_at ?? null
    const enrolledAt = enrollment?.enrolled_at ?? null
    const lastLessonAt = progress?.maxCompletedAt ?? null
    const lastSignInAt = u.last_sign_in_at ?? null

    // Last activity = latest of: last lesson completed, last sign in
    const activityDates = [lastLessonAt, lastSignInAt].filter(Boolean) as string[]
    const lastActivityAt = activityDates.length > 0
      ? activityDates.reduce((a, b) => (a > b ? a : b))
      : null

    // Determine status
    let status: 'not-started' | 'in-progress' | 'graduated'
    if (graduatedAt) {
      status = 'graduated'
    } else if (completedLessons > 0 || enrolledAt) {
      status = 'in-progress'
    } else {
      status = 'not-started'
    }

    // Inactive days (relative to last lesson activity only — sign-in doesn't count as course activity)
    const courseDates = [lastLessonAt, enrolledAt].filter(Boolean) as string[]
    const lastCourseActivityAt = courseDates.length > 0
      ? courseDates.reduce((a, b) => (a > b ? a : b))
      : null
    const inactiveDays = daysSince(lastCourseActivityAt ?? u.created_at)

    // At risk: started (or enrolled) + not graduated + inactive 3+ days
    const isAtRisk = status === 'in-progress' && (inactiveDays ?? 0) >= 3

    const lastNudge = lastNudgeMap.get(u.id) ?? null

    return {
      id: u.id,
      email: u.email ?? '',
      fullName: (profile as { full_name?: string | null } | undefined)?.full_name ?? u.email?.split('@')[0] ?? 'Unknown',
      isAdmin: (profile as { is_admin?: boolean } | undefined)?.is_admin ?? false,
      joinedAt: u.created_at,
      lastSignInAt,
      lastActivityAt,
      lastCourseActivityAt,
      enrolledAt,
      graduatedAt,
      completedLessons,
      totalLessons,
      pct,
      status,
      inactiveDays,
      isAtRisk,
      lastNudge,
    }
  })

  // Sort: at-risk first, then by inactiveDays desc
  users.sort((a, b) => {
    if (a.isAtRisk && !b.isAtRisk) return -1
    if (!a.isAtRisk && b.isAtRisk) return 1
    return (b.inactiveDays ?? 0) - (a.inactiveDays ?? 0)
  })

  return NextResponse.json({ users })
}
