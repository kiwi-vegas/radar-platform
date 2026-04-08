'use client'

import Image from 'next/image'
import type { Lesson, IntroContent } from '@/lib/types'

interface IntroLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  completing: boolean
}

export default function IntroLesson({ lesson, onComplete, completing }: IntroLessonProps) {
  const content = lesson.content as IntroContent

  return (
    <div className="space-y-6">
      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden border border-surface-border" style={{ aspectRatio: '16 / 6' }}>
        <Image
          src={content.instructorImage}
          alt={content.instructorName}
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 896px) 100vw, 768px"
        />
      </div>

      {/* Name + title */}
      <div>
        <div className="text-xs font-semibold text-brand-orange uppercase tracking-widest mb-1.5">
          Your Instructor
        </div>
        <h2 className="text-2xl font-bold text-tx-primary">{content.instructorName}</h2>
        <p className="text-tx-secondary text-sm mt-1">{content.instructorTitle}</p>
      </div>

      {/* Credentials */}
      {content.credentials && content.credentials.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {content.credentials.map((cred) => (
            <div
              key={cred.label}
              className="rounded-xl bg-surface border border-surface-border p-4 text-center"
            >
              <div className="text-xl font-bold text-tx-primary">{cred.value}</div>
              <div className="text-xs text-tx-muted mt-0.5 leading-tight">{cred.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Bio */}
      <div className="rounded-2xl bg-surface border border-surface-border p-6">
        <div className="text-xs font-semibold text-tx-muted uppercase tracking-wider mb-3">About Barry</div>
        <p className="text-tx-secondary text-sm leading-relaxed">{content.bio}</p>
      </div>

      {/* CTA */}
      <div className="flex justify-center sm:justify-start pt-2">
        <button
          onClick={onComplete}
          disabled={completing}
          className="px-10 py-4 rounded-xl text-white font-semibold bg-brand-orange hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 text-base"
        >
          {completing ? 'Loading…' : (content.ctaLabel ?? 'Begin Training')}
          {!completing && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
