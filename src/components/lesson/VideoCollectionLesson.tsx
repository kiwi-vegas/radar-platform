'use client'

import { useState } from 'react'
import type { Lesson, VideoCollectionContent } from '@/lib/types'

interface VideoCollectionLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  completing: boolean
}

export default function VideoCollectionLesson({
  lesson,
  isCompleted,
  onComplete,
  completing,
}: VideoCollectionLessonProps) {
  const content = lesson.content as VideoCollectionContent
  const [activeIdx, setActiveIdx] = useState(0)

  const current = content.videos[activeIdx]
  const isFirst = activeIdx === 0
  const isLast = activeIdx === content.videos.length - 1

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Intro */}
      {content.intro && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
          <p className="text-tx-secondary text-sm leading-relaxed">{content.intro}</p>
        </div>
      )}

      {/* Video tab bar */}
      <div className="flex gap-2 flex-wrap">
        {content.videos.map((v, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeIdx === i ? '#F9731620' : '#131A2B',
              color: activeIdx === i ? '#F97316' : '#6b7280',
              border: activeIdx === i ? '1px solid #F9731650' : '1px solid #1E2A3B',
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: activeIdx === i ? '#F97316' : '#1E2A3B',
                color: activeIdx === i ? 'white' : '#6b7280',
              }}
            >
              {i + 1}
            </span>
            {v.title}
          </button>
        ))}
      </div>

      {/* Video player */}
      <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', background: '#0B0F1A' }}>
        <iframe
          key={current.vimeoId}
          src={`https://player.vimeo.com/video/${current.vimeoId}?color=F97316&title=0&byline=0&portrait=0`}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveIdx((i) => i - 1)}
          disabled={isFirst}
          className="flex items-center gap-1.5 text-sm text-tx-secondary hover:text-tx-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Previous
        </button>

        <span className="text-xs text-tx-muted">
          {activeIdx + 1} of {content.videos.length}
        </span>

        <button
          onClick={() => setActiveIdx((i) => i + 1)}
          disabled={isLast}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: isLast ? '#6b7280' : '#F97316' }}
        >
          Next video
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* Complete CTA */}
      {isCompleted ? (
        <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-sm flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Section Complete
        </div>
      ) : (
        <button
          onClick={onComplete}
          disabled={completing}
          className="w-full py-4 rounded-xl text-white font-semibold bg-brand-orange hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
      )}
    </div>
  )
}
