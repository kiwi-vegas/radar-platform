'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Course } from '@/lib/types'
import { isLessonLocked } from '@/data/courses'

interface CourseSidebarProps {
  course: Course
  currentLessonId: string
  completedIds: string[]
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  video: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  flashcard: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  reflection: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  quiz: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  roleplay: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.18a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  'video-collection': (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
}

export default function CourseSidebar({ course, currentLessonId, completedIds }: CourseSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-brand-orange text-white shadow-lg flex items-center justify-center"
        aria-label="Toggle course outline"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {collapsed ? <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></> : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-surface-sidebar border-r border-surface-border
        flex flex-col z-40 overflow-hidden transition-transform duration-300
        ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
      `}>
        {/* Course title */}
        <div className="px-5 py-5 border-b border-surface-border shrink-0">
          <Link href={`/courses/${course.slug}`} className="block">
            <div className="text-xs text-tx-muted mb-1 font-medium uppercase tracking-wider">Course</div>
            <div className="font-bold text-tx-primary leading-snug">{course.title}</div>
            <div className="text-tx-secondary text-xs mt-0.5">{course.subtitle}</div>
          </Link>

          {/* Progress */}
          <div className="mt-3">
            {(() => {
              const allIds = course.sections.flatMap((s) => s.lessons.map((l) => l.id))
              const pct = Math.round((completedIds.length / allIds.length) * 100)
              return (
                <>
                  <div className="flex justify-between text-xs text-tx-muted mb-1.5">
                    <span>{completedIds.length}/{allIds.length} lessons</span>
                    <span style={{ color: course.coverColor }}>{pct}%</span>
                  </div>
                  <div className="h-1 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: course.coverColor }}
                    />
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* Lessons list */}
        <nav className="flex-1 overflow-y-auto py-2">
          {course.sections.map((section) => (
            <div key={section.id}>
              <div className="px-5 pt-4 pb-2">
                <span className="text-xs font-semibold text-tx-muted uppercase tracking-wider">
                  {section.title}
                </span>
              </div>

              {section.lessons.map((lesson) => {
                const isCompleted = completedIds.includes(lesson.id)
                const isCurrent = lesson.id === currentLessonId
                const isLocked = isLessonLocked(course, lesson.id, completedIds)

                return (
                  <div key={lesson.id}>
                    {isLocked ? (
                      <div className="flex items-center gap-3 px-5 py-2.5 opacity-35 cursor-not-allowed">
                        <StatusDot completed={false} current={false} locked={true} color={course.coverColor} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-tx-muted truncate leading-snug">{lesson.title}</p>
                        </div>
                        <div className="text-tx-muted shrink-0">{TYPE_ICON[lesson.type]}</div>
                      </div>
                    ) : (
                      <Link
                        href={`/courses/${course.slug}/lessons/${lesson.id}`}
                        onClick={() => setCollapsed(true)}
                        className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
                          isCurrent
                            ? 'bg-surface-hover border-r-2'
                            : 'hover:bg-surface-hover'
                        }`}
                        style={isCurrent ? { borderRightColor: course.coverColor } : {}}
                      >
                        <StatusDot completed={isCompleted} current={isCurrent} locked={false} color={course.coverColor} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs truncate leading-snug ${
                            isCurrent ? 'text-tx-primary font-medium' : 'text-tx-secondary'
                          }`}>
                            {lesson.title}
                          </p>
                        </div>
                        <div className={`shrink-0 ${isCurrent ? 'text-brand-orange' : 'text-tx-muted'}`}>
                          {TYPE_ICON[lesson.type]}
                        </div>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Dashboard link */}
        <div className="px-5 py-4 border-t border-surface-border shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-tx-muted hover:text-tx-secondary text-xs transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </aside>
    </>
  )
}

function StatusDot({
  completed,
  current,
  locked,
  color,
}: {
  completed: boolean
  current: boolean
  locked: boolean
  color: string
}) {
  if (locked) {
    return (
      <div className="w-4 h-4 shrink-0 flex items-center justify-center">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
    )
  }
  if (completed) {
    return (
      <div className="w-4 h-4 shrink-0 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    )
  }
  if (current) {
    return (
      <div
        className="w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: color }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      </div>
    )
  }
  return (
    <div className="w-4 h-4 shrink-0 rounded-full border border-surface-border" />
  )
}
