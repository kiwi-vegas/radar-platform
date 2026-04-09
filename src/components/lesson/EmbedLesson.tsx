'use client'

import type { Lesson, EmbedContent } from '@/lib/types'

interface EmbedLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  completing: boolean
}

export default function EmbedLesson({ lesson, isCompleted, onComplete, completing }: EmbedLessonProps) {
  const content = lesson.content as EmbedContent

  return (
    <div className="space-y-5">
      {/* Description */}
      <div className="rounded-xl bg-surface border border-surface-border px-5 py-4">
        <p className="text-tx-secondary text-sm leading-relaxed">{content.description}</p>
      </div>

      {/* Embed */}
      <div
        className="rounded-2xl overflow-hidden border border-surface-border"
        dangerouslySetInnerHTML={{ __html: content.embedHtml }}
      />

      {/* Complete button */}
      <div className="pt-2">
        {isCompleted ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Lesson Complete
          </div>
        ) : (
          <button
            onClick={onComplete}
            disabled={completing}
            className="px-8 py-3 rounded-xl text-white font-semibold bg-brand-orange hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {completing ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Saving…
              </>
            ) : (
              <>
                Mark Complete & Continue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
