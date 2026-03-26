'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Course, Lesson, Section } from '@/lib/types'
import VideoLesson from './VideoLesson'
import FlashCardLesson from './FlashCardLesson'
import ReflectionLesson from './ReflectionLesson'
import QuizLesson from './QuizLesson'
import RoleplayLesson from './RoleplayLesson'

interface LessonPlayerProps {
  course: Course
  lesson: Lesson
  section: Section
  completedIds: string[]
  nextLessonId: string | null
  prevLessonId: string | null
  isLastLesson: boolean
}

const TYPE_LABEL: Record<string, string> = {
  video: 'Video Lesson',
  flashcard: 'Flashcard Drill',
  reflection: 'Reflection',
  quiz: 'Knowledge Check',
  roleplay: 'Practice Call',
}

export default function LessonPlayer({
  course,
  lesson,
  section,
  completedIds,
  nextLessonId,
  prevLessonId,
  isLastLesson,
}: LessonPlayerProps) {
  const router = useRouter()
  const isAlreadyCompleted = completedIds.includes(lesson.id)
  const [completing, setCompleting] = useState(false)
  const [completeError, setCompleteError] = useState<string | null>(null)
  const [showGraduation, setShowGraduation] = useState(false)

  const markComplete = useCallback(
    async (score?: number) => {
      if (completing) return
      setCompleting(true)
      setCompleteError(null)

      try {
        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseSlug: course.slug,
            lessonId: lesson.id,
            score,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || `Server error ${res.status}`)
        }

        if (isLastLesson) {
          setShowGraduation(true)
        } else if (nextLessonId) {
          router.push(`/courses/${course.slug}/lessons/${nextLessonId}`)
        }
      } catch (err) {
        console.error('Failed to mark complete:', err)
        setCompleteError(err instanceof Error ? err.message : 'Failed to save progress. Please try again.')
        setCompleting(false)
      }
    },
    [completing, course.slug, lesson.id, isLastLesson, nextLessonId, router]
  )

  // Graduation screen
  if (showGraduation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center animate-slide-up">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: `${course.coverColor}22`, border: `2px solid ${course.coverColor}44` }}
          >
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-tx-primary mb-3">Congratulations!</h1>
          <p className="text-tx-secondary mb-2 text-lg">
            You've completed <span className="text-tx-primary font-semibold">{course.title}</span>.
          </p>
          <p className="text-tx-muted text-sm mb-8">
            You've earned your RADAR certification. The system works when you do. Now go build some relationships.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: course.coverColor }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Lesson header — with optional image backdrop for non-video lessons */}
      {lesson.image && lesson.type !== 'video' ? (
        <div className="relative overflow-hidden border-b border-surface-border">
          <div className="absolute inset-0">
            <Image
              src={lesson.image}
              alt={lesson.title}
              fill
              className="object-cover object-center opacity-25"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-surface/80 to-surface" />
          </div>
          <div className="relative px-6 lg:px-10 pt-8 pb-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-xs text-tx-muted mb-2">
                <span>{section.title}</span>
                <span>›</span>
                <span className="text-tx-secondary">{TYPE_LABEL[lesson.type]}</span>
                <span>·</span>
                <span>{lesson.durationMinutes} min</span>
              </div>
              <h1 className="text-xl font-bold text-tx-primary leading-snug">{lesson.title}</h1>
              {isAlreadyCompleted && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-green-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Completed
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 lg:px-10 pt-8 pb-6 border-b border-surface-border">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-tx-muted mb-2">
              <span>{section.title}</span>
              <span>›</span>
              <span className="text-tx-secondary">{TYPE_LABEL[lesson.type]}</span>
              <span>·</span>
              <span>{lesson.durationMinutes} min</span>
            </div>
            <h1 className="text-xl font-bold text-tx-primary leading-snug">{lesson.title}</h1>
            {isAlreadyCompleted && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-green-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Completed
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lesson content */}
      <div className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-3xl mx-auto">
          {completeError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {completeError}
            </div>
          )}
          {lesson.type === 'video' && (
            <VideoLesson
              lesson={lesson}
              isCompleted={isAlreadyCompleted}
              onComplete={() => markComplete()}
              completing={completing}
              nextLessonId={nextLessonId}
              courseSlug={course.slug}
            />
          )}

          {lesson.type === 'flashcard' && (
            <FlashCardLesson
              lesson={lesson}
              isCompleted={isAlreadyCompleted}
              onComplete={() => markComplete()}
              completing={completing}
            />
          )}

          {lesson.type === 'reflection' && (
            <ReflectionLesson
              lesson={lesson}
              isCompleted={isAlreadyCompleted}
              onComplete={() => markComplete()}
              completing={completing}
            />
          )}

          {lesson.type === 'quiz' && (
            <QuizLesson
              lesson={lesson}
              isCompleted={isAlreadyCompleted}
              onComplete={(score) => markComplete(score)}
              completing={completing}
            />
          )}

          {lesson.type === 'roleplay' && (
            <RoleplayLesson
              lesson={lesson}
              isCompleted={isAlreadyCompleted}
              onComplete={(score) => markComplete(score)}
              completing={completing}
            />
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="border-t border-surface-border px-6 lg:px-10 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {prevLessonId ? (
            <button
              onClick={() => router.push(`/courses/${course.slug}/lessons/${prevLessonId}`)}
              className="flex items-center gap-2 text-sm text-tx-secondary hover:text-tx-primary transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Previous
            </button>
          ) : (
            <div />
          )}

          {nextLessonId && isAlreadyCompleted && (
            <button
              onClick={() => router.push(`/courses/${course.slug}/lessons/${nextLessonId}`)}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: course.coverColor }}
            >
              Next lesson
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
