'use client'

import Image from 'next/image'
import type { Lesson, VideoContent } from '@/lib/types'

interface VideoLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  completing: boolean
  nextLessonId: string | null
  courseSlug: string
}

export default function VideoLesson({
  lesson,
  isCompleted,
  onComplete,
  completing,
}: VideoLessonProps) {
  const content = lesson.content as VideoContent

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Video embed */}
      {content.vimeoId ? (
        <div className="rounded-2xl overflow-hidden bg-black aspect-video">
          <iframe
            src={`https://player.vimeo.com/video/${content.vimeoId}?autoplay=0&title=0&byline=0&portrait=0&dnt=1`}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={lesson.title}
          />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden bg-surface-card border border-surface-border aspect-video relative flex flex-col items-center justify-center gap-3">
          {lesson.image ? (
            <>
              <Image
                src={lesson.image}
                alt={lesson.title}
                fill
                className="object-cover opacity-60"
                sizes="(max-width: 896px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-black/40" />
            </>
          ) : null}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8" fill="#94A3B8" stroke="none"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm font-medium">Video coming soon</p>
              <p className="text-white/50 text-xs mt-0.5">This lesson will be available shortly</p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
        <h2 className="font-semibold text-tx-primary mb-2">About this lesson</h2>
        <p className="text-tx-secondary text-sm leading-relaxed">{content.description}</p>

        {content.keyPoints && content.keyPoints.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-tx-muted uppercase tracking-wider mb-3">Key takeaways</h3>
            <ul className="space-y-2">
              {content.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-tx-secondary">
                  <div className="w-5 h-5 rounded-full bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Complete button */}
      {!isCompleted ? (
        <button
          onClick={onComplete}
          disabled={completing}
          className="w-full py-4 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-brand-orange flex items-center justify-center gap-2"
        >
          {completing ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Mark Complete & Continue
            </>
          )}
        </button>
      ) : (
        <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-sm flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Lesson Complete
        </div>
      )}
    </div>
  )
}
