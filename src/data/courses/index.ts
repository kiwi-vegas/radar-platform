import { radarCourse } from './radar'
import type { Course } from '@/lib/types'

export const allCourses: Course[] = [radarCourse]

export function getCourseBySlug(slug: string): Course | undefined {
  return allCourses.find((c) => c.slug === slug)
}

export function getAllLessonIds(course: Course): string[] {
  return course.sections.flatMap((s) => s.lessons.map((l) => l.id))
}

export function getLessonById(course: Course, lessonId: string) {
  for (const section of course.sections) {
    const lesson = section.lessons.find((l) => l.id === lessonId)
    if (lesson) return { lesson, section }
  }
  return null
}

export function getNextLesson(course: Course, currentLessonId: string) {
  const flat = course.sections.flatMap((s) =>
    s.lessons.map((l) => ({ lesson: l, section: s }))
  )
  const idx = flat.findIndex((x) => x.lesson.id === currentLessonId)
  return idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null
}

export function getPrevLesson(course: Course, currentLessonId: string) {
  const flat = course.sections.flatMap((s) =>
    s.lessons.map((l) => ({ lesson: l, section: s }))
  )
  const idx = flat.findIndex((x) => x.lesson.id === currentLessonId)
  return idx > 0 ? flat[idx - 1] : null
}

/** First lesson that is not yet completed, or the first lesson if all complete */
export function getCurrentLesson(course: Course, completedIds: string[]) {
  const flat = course.sections.flatMap((s) =>
    s.lessons.map((l) => ({ lesson: l, section: s }))
  )
  return (
    flat.find((x) => !completedIds.includes(x.lesson.id)) ?? flat[0] ?? null
  )
}

/** A lesson is locked if the lesson immediately before it is not complete */
export function isLessonLocked(
  course: Course,
  lessonId: string,
  completedIds: string[]
): boolean {
  const flat = course.sections.flatMap((s) => s.lessons.map((l) => l.id))
  const idx = flat.indexOf(lessonId)
  if (idx <= 0) return false // first lesson is always unlocked
  return !completedIds.includes(flat[idx - 1])
}
