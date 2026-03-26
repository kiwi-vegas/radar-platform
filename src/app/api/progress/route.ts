import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/progress?courseSlug=radar
// Returns all completed lesson IDs for the current user + course
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseSlug = searchParams.get('courseSlug')

  if (!courseSlug) {
    return NextResponse.json({ error: 'courseSlug is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id, completed, score, completed_at')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .eq('completed', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const completedLessonIds = (data ?? []).map((r) => r.lesson_id)

  // Also check graduation status
  const { data: enrollment } = await supabase
    .from('user_course_enrollments')
    .select('graduated_at')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .single()

  return NextResponse.json({
    completedLessonIds,
    graduatedAt: enrollment?.graduated_at ?? null,
  })
}

// POST /api/progress
// Marks a lesson as complete (with optional score)
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { courseSlug, lessonId, score } = body as {
    courseSlug: string
    lessonId: string
    score?: number
  }

  if (!courseSlug || !lessonId) {
    return NextResponse.json({ error: 'courseSlug and lessonId are required' }, { status: 400 })
  }

  // Upsert progress record
  const { error } = await supabase.from('user_lesson_progress').upsert(
    {
      user_id: user.id,
      course_slug: courseSlug,
      lesson_id: lessonId,
      completed: true,
      score: score ?? null,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,course_slug,lesson_id' }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Ensure enrollment record exists
  await supabase.from('user_course_enrollments').upsert(
    { user_id: user.id, course_slug: courseSlug },
    { onConflict: 'user_id,course_slug', ignoreDuplicates: true }
  )

  return NextResponse.json({ success: true })
}
