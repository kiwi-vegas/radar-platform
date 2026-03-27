import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getCourseBySlug, getAllLessonIds, getCurrentLesson, isLessonLocked } from '@/data/courses'

const LESSON_TYPE_ICONS: Record<string, string> = {
  video: '▶',
  flashcard: '🃏',
  reflection: '✍',
  quiz: '⚡',
  roleplay: '📞',
  'video-collection': '▶',
}

const LESSON_TYPE_LABELS: Record<string, string> = {
  video: 'Video',
  flashcard: 'Flashcards',
  reflection: 'Reflection',
  quiz: 'Quiz',
  roleplay: 'Practice Call',
  'video-collection': 'Video Series',
}

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('course_slug', slug)
    .eq('completed', true)

  const completedIds = (data ?? []).map((r) => r.lesson_id)
  const totalLessons = getAllLessonIds(course).length
  const pct = totalLessons > 0 ? Math.round((completedIds.length / totalLessons) * 100) : 0
  const currentLesson = getCurrentLesson(course, completedIds)

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-surface-border bg-surface-sidebar">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-tx-muted hover:text-tx-secondary text-sm transition-colors flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Dashboard
          </Link>
          <span className="text-surface-border">/</span>
          <span className="text-tx-primary text-sm font-medium">{course.title}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Course header */}
        <div className="mb-10">
          {/* Hero thumbnail */}
          {course.coverImage && (
            <div className="relative w-full rounded-2xl overflow-hidden mb-7" style={{ aspectRatio: '16/5' }}>
              <Image
                src={course.coverImage}
                alt={course.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white w-fit mb-2"
                  style={{ background: course.coverColor }}>
                  {course.subtitle}
                </div>
                <h1 className="text-3xl font-bold text-white drop-shadow">{course.title}</h1>
              </div>
            </div>
          )}

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              {!course.coverImage && (
                <>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                    style={{ background: course.coverColor }}>
                    {course.subtitle}
                  </div>
                  <h1 className="text-3xl font-bold text-tx-primary mb-2">{course.title}</h1>
                </>
              )}
              <p className="text-tx-secondary max-w-2xl leading-relaxed">{course.description}</p>
            </div>

            {currentLesson && (
              <Link
                href={`/courses/${course.slug}/lessons/${currentLesson.lesson.id}`}
                className="shrink-0 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: course.coverColor }}
              >
                {completedIds.length === 0 ? 'Start Course' : 'Continue'}
              </Link>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-tx-secondary mb-2">
              <span>{completedIds.length} of {totalLessons} lessons complete</span>
              <span className="font-semibold" style={{ color: course.coverColor }}>{pct}%</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${course.coverColor}, ${course.coverColor}99)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {course.sections.map((section, sIdx) => {
            const sectionLessonIds = section.lessons.map((l) => l.id)
            const sectionCompleted = sectionLessonIds.every((id) => completedIds.includes(id))
            const sectionProgress = sectionLessonIds.filter((id) => completedIds.includes(id)).length

            return (
              <div key={section.id} className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                {/* Section header */}
                <div className="px-6 py-5 border-b border-surface-border flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      {sectionCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-surface-border flex items-center justify-center">
                          <span className="text-xs font-bold text-tx-muted">{sIdx + 1}</span>
                        </div>
                      )}
                      <h2 className="font-semibold text-tx-primary">{section.title}</h2>
                    </div>
                    {section.description && (
                      <p className="text-tx-muted text-xs ml-7">{section.description}</p>
                    )}
                  </div>
                  <span className="text-tx-muted text-xs shrink-0">
                    {sectionProgress}/{section.lessons.length}
                  </span>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-surface-border">
                  {section.lessons.map((lesson, lIdx) => {
                    const isCompleted = completedIds.includes(lesson.id)
                    const isLocked = isLessonLocked(course, lesson.id, completedIds)
                    const isCurrent =
                      currentLesson?.lesson.id === lesson.id

                    return (
                      <div
                        key={lesson.id}
                        className={`px-5 py-3.5 flex items-center gap-4 transition-colors ${
                          isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-surface-hover cursor-pointer'
                        } ${isCurrent ? 'bg-surface-hover' : ''}`}
                      >
                        {/* Lesson thumbnail */}
                        <div className="shrink-0 w-24 h-14 rounded-lg overflow-hidden bg-surface border border-surface-border relative">
                          {lesson.image ? (
                            <Image
                              src={lesson.image}
                              alt={lesson.title}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          ) : (
                            <LessonPlaceholder type={lesson.type} color={course.coverColor} index={lIdx + 1} />
                          )}
                          {/* Completion overlay */}
                          {isCompleted && (
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              </div>
                            </div>
                          )}
                          {/* Lock overlay */}
                          {isLocked && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                            </div>
                          )}
                          {/* Current indicator */}
                          {isCurrent && !isCompleted && (
                            <div className="absolute bottom-1 left-1 right-1 h-0.5 rounded-full" style={{ background: course.coverColor }} />
                          )}
                        </div>

                        {/* Content */}
                        {isLocked ? (
                          <div className="flex-1 min-w-0">
                            <p className="text-tx-secondary text-sm font-medium truncate">{lesson.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-tx-muted">{LESSON_TYPE_LABELS[lesson.type]}</span>
                              <span className="text-tx-muted text-xs">·</span>
                              <span className="text-xs text-tx-muted">{lesson.durationMinutes} min</span>
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={`/courses/${course.slug}/lessons/${lesson.id}`}
                            className="flex-1 min-w-0 block"
                          >
                            <p className={`text-sm font-medium truncate ${isCurrent ? 'text-tx-primary' : 'text-tx-secondary'}`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-tx-muted">
                                {LESSON_TYPE_ICONS[lesson.type]} {LESSON_TYPE_LABELS[lesson.type]}
                              </span>
                              <span className="text-tx-muted text-xs">·</span>
                              <span className="text-xs text-tx-muted">{lesson.durationMinutes} min</span>
                            </div>
                          </Link>
                        )}

                        {/* Arrow */}
                        {!isLocked && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" className="shrink-0">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

// ── Placeholder thumbnail for lessons without a custom image ────────────────
const TYPE_BG: Record<string, string> = {
  video:      'from-blue-900/60 to-blue-800/30',
  flashcard:  'from-purple-900/60 to-purple-800/30',
  reflection: 'from-amber-900/60 to-amber-800/30',
  quiz:       'from-emerald-900/60 to-emerald-800/30',
  roleplay:   'from-rose-900/60 to-rose-800/30',
}

function LessonPlaceholder({ type, color, index }: { type: string; color: string; index: number }) {
  const bg = TYPE_BG[type] ?? 'from-slate-900/60 to-slate-800/30'
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${bg} flex flex-col items-center justify-center gap-1`}>
      <span className="text-xs font-bold" style={{ color: `${color}99` }}>{index}</span>
    </div>
  )
}
