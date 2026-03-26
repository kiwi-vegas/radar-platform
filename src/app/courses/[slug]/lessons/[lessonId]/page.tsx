import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getCourseBySlug,
  getLessonById,
  getNextLesson,
  getPrevLesson,
  isLessonLocked,
} from '@/data/courses'
import CourseSidebar from '@/components/course/CourseSidebar'
import LessonPlayer from '@/components/lesson/LessonPlayer'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const course = getCourseBySlug(slug)
  if (!course) notFound()

  const found = getLessonById(course, lessonId)
  if (!found) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Load user progress
  const { data } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('course_slug', slug)
    .eq('completed', true)

  const completedIds = (data ?? []).map((r: { lesson_id: string }) => r.lesson_id)

  // Block access if lesson is locked
  if (isLessonLocked(course, lessonId, completedIds)) {
    redirect(`/courses/${slug}`)
  }

  const nextLesson = getNextLesson(course, lessonId)
  const prevLesson = getPrevLesson(course, lessonId)
  const isLastLesson = !nextLesson

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <CourseSidebar
        course={course}
        currentLessonId={lessonId}
        completedIds={completedIds}
      />

      {/* Main lesson area */}
      <main className="flex-1 overflow-y-auto">
        <LessonPlayer
          course={course}
          lesson={found.lesson}
          section={found.section}
          completedIds={completedIds}
          nextLessonId={nextLesson?.lesson.id ?? null}
          prevLessonId={prevLesson?.lesson.id ?? null}
          isLastLesson={isLastLesson}
        />
      </main>
    </div>
  )
}
