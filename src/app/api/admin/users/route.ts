import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { allCourses, getAllLessonIds } from '@/data/courses'

// Total lessons + valid lesson ID sets per course (pre-computed)
const courseTotals: Record<string, number> = {}
const courseValidLessonIds: Record<string, Set<string>> = {}
const courseLessonDurations: Record<string, Record<string, number>> = {}
for (const course of allCourses) {
  const ids = getAllLessonIds(course)
  courseTotals[course.slug] = ids.length
  courseValidLessonIds[course.slug] = new Set(ids)
  const durations: Record<string, number> = {}
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      durations[lesson.id] = lesson.durationMinutes ?? 0
    }
  }
  courseLessonDurations[course.slug] = durations
}

// Cap per-lesson elapsed time at 3× expected duration to absorb idle / tab-left-open
const TIME_CAP_MULTIPLIER = 3

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

  // 3. All enrollments (Radar course)
  const { data: enrollments } = await admin
    .from('user_course_enrollments')
    .select('user_id, course_slug, enrolled_at, graduated_at')
  const enrollmentMap = new Map(
    (enrollments ?? []).map((e: { user_id: string; course_slug: string; enrolled_at: string | null; graduated_at: string | null }) => [`${e.user_id}:${e.course_slug}`, e])
  )

  // 4. All completed lesson progress
  // Try with started_at; if the column hasn't been migrated yet, fall back so
  // the dashboard keeps working — time-spent will use the durationMinutes estimate.
  type ProgressRow = {
    user_id: string
    course_slug: string
    lesson_id: string
    completed_at: string | null
    started_at?: string | null
  }
  let progressRows: ProgressRow[] | null = null
  const withStartedAt = await admin
    .from('user_lesson_progress')
    .select('user_id, course_slug, lesson_id, completed_at, started_at')
    .eq('completed', true)
  if (withStartedAt.error) {
    const fallback = await admin
      .from('user_lesson_progress')
      .select('user_id, course_slug, lesson_id, completed_at')
      .eq('completed', true)
    progressRows = fallback.data as ProgressRow[] | null
  } else {
    progressRows = withStartedAt.data as ProgressRow[] | null
  }

  // Group progress by user+course — only count lessons still in the course
  const progressMap = new Map<string, { count: number; maxCompletedAt: string | null }>()
  // Total time-on-platform per user across all completed lessons
  const timeSpentMs = new Map<string, number>()
  for (const row of progressRows ?? []) {
    const validIds = courseValidLessonIds[row.course_slug]
    if (validIds && !validIds.has(row.lesson_id)) continue
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

    // Time-spent contribution for this lesson:
    //   - both timestamps present → real elapsed, capped at 3× expected
    //   - missing started_at (legacy) → fall back to expected durationMinutes
    const expectedMin = courseLessonDurations[row.course_slug]?.[row.lesson_id] ?? 0
    let lessonMs = 0
    if (row.started_at && row.completed_at) {
      const elapsed = new Date(row.completed_at).getTime() - new Date(row.started_at).getTime()
      const cap = expectedMin * TIME_CAP_MULTIPLIER * 60_000
      lessonMs = Math.max(0, Math.min(elapsed, cap || elapsed))
    } else {
      lessonMs = expectedMin * 60_000
    }
    timeSpentMs.set(row.user_id, (timeSpentMs.get(row.user_id) ?? 0) + lessonMs)
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
  const users = await Promise.all(authUsers.map(async (u) => {
    const profile = profileMap.get(u.id)
    const courseSlug = 'radar'
    const enrollment = enrollmentMap.get(`${u.id}:${courseSlug}`)
    const progress = progressMap.get(`${u.id}:${courseSlug}`)
    const totalLessons = courseTotals[courseSlug] ?? 0
    const completedLessons = progress?.count ?? 0
    const pct = totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0

    let graduatedAt = enrollment?.graduated_at ?? null
    const enrolledAt = enrollment?.enrolled_at ?? null
    const lastLessonAt = progress?.maxCompletedAt ?? null
    const lastSignInAt = u.last_sign_in_at ?? null

    // Last activity = latest of: last lesson completed, last sign in
    const activityDates = [lastLessonAt, lastSignInAt].filter(Boolean) as string[]
    const lastActivityAt = activityDates.length > 0
      ? activityDates.reduce((a, b) => (a > b ? a : b))
      : null

    // Backfill graduated_at if they've finished all lessons but it was never stamped
    if (!graduatedAt && completedLessons >= totalLessons && totalLessons > 0) {
      const backfillDate = progress?.maxCompletedAt ?? new Date().toISOString()
      await admin
        .from('user_course_enrollments')
        .update({ graduated_at: backfillDate })
        .eq('user_id', u.id)
        .eq('course_slug', courseSlug)
        .is('graduated_at', null)
      graduatedAt = backfillDate
    }

    // Determine status
    let status: 'not-started' | 'in-progress' | 'graduated'
    if (graduatedAt || (completedLessons >= totalLessons && totalLessons > 0)) {
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
    const timeSpentMinutes = Math.round((timeSpentMs.get(u.id) ?? 0) / 60_000)

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
      timeSpentMinutes,
    }
  }))

  // Sort: at-risk first, then by inactiveDays desc
  users.sort((a, b) => {
    if (a.isAtRisk && !b.isAtRisk) return -1
    if (!a.isAtRisk && b.isAtRisk) return 1
    return (b.inactiveDays ?? 0) - (a.inactiveDays ?? 0)
  })

  return NextResponse.json({ users })
}
