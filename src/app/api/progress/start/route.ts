import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/progress/start
// Stamps started_at on first lesson open. Idempotent: if a row already
// exists for (user, course, lesson), it's left untouched — so re-opens,
// reviews, and completed lessons all keep their original started_at.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { courseSlug, lessonId } = body as { courseSlug: string; lessonId: string }

  if (!courseSlug || !lessonId) {
    return NextResponse.json({ error: 'courseSlug and lessonId are required' }, { status: 400 })
  }

  await supabase.from('user_lesson_progress').upsert(
    {
      user_id: user.id,
      course_slug: courseSlug,
      lesson_id: lessonId,
      started_at: new Date().toISOString(),
      completed: false,
    },
    { onConflict: 'user_id,course_slug,lesson_id', ignoreDuplicates: true },
  )

  return NextResponse.json({ ok: true })
}
