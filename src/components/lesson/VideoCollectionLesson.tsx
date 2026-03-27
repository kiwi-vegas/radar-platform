'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Lesson, VideoCollectionContent } from '@/lib/types'

interface VideoCollectionLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  completing: boolean
}

interface VideoProgress {
  current: number   // seconds elapsed
  duration: number  // total seconds
  percent: number   // 0–1
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VideoCollectionLesson({
  lesson,
  isCompleted,
  onComplete,
  completing,
}: VideoCollectionLessonProps) {
  const content = lesson.content as VideoCollectionContent
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState<Record<number, VideoProgress>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null)

  const current = content.videos[activeIdx]
  const isFirst = activeIdx === 0
  const isLast = activeIdx === content.videos.length - 1
  const currentProgress = progress[activeIdx]

  const initPlayer = useCallback(
    async (idx: number) => {
      if (!containerRef.current) return

      // Destroy previous instance
      if (playerRef.current) {
        try { await playerRef.current.destroy() } catch { /* ignore */ }
        playerRef.current = null
      }

      // Clear container
      containerRef.current.innerHTML = ''

      const { default: Player } = await import('@vimeo/player')
      const player = new Player(containerRef.current, {
        id: parseInt(content.videos[idx].vimeoId),
        color: 'F97316',
        title: false,
        byline: false,
        portrait: false,
        responsive: true,
        dnt: true,
      })

      playerRef.current = player

      player.on('timeupdate', ({ seconds, duration, percent }: { seconds: number; duration: number; percent: number }) => {
        setProgress(prev => ({
          ...prev,
          [idx]: { current: seconds, duration, percent },
        }))
      })
    },
    [content.videos]
  )

  useEffect(() => {
    initPlayer(activeIdx)
    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { /* ignore */ }
        playerRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx])

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
        {content.videos.map((v, i) => {
          const p = progress[i]
          const pct = p ? Math.round(p.percent * 100) : 0
          const watched = pct >= 90
          const isActive = activeIdx === i

          return (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="flex flex-col items-start gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? '#F9731620' : '#131A2B',
                color: isActive ? '#F97316' : '#6b7280',
                border: isActive ? '1px solid #F9731650' : '1px solid #1E2A3B',
                minWidth: 0,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: watched ? '#22c55e' : isActive ? '#F97316' : '#1E2A3B',
                    color: watched || isActive ? 'white' : '#6b7280',
                  }}
                >
                  {watched ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="text-left leading-tight">{v.title}</span>
              </div>

              {/* Per-video progress bar */}
              {pct > 0 && !watched && (
                <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: '#1E2A3B' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: isActive ? '#F97316' : '#6b7280' }}
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Video player */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0B0F1A' }}>
        <div ref={containerRef} className="w-full" />
      </div>

      {/* Progress bar + time */}
      <div className="space-y-1.5">
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: '#1E2A3B' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: currentProgress ? `${Math.round(currentProgress.percent * 100)}%` : '0%',
              background: '#F97316',
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs" style={{ color: '#6b7280' }}>
          <span>{currentProgress ? formatTime(currentProgress.current) : '0:00'}</span>
          <span className="font-medium" style={{ color: '#9ca3af' }}>
            {current.title}
            {currentProgress?.duration ? ` · ${formatTime(currentProgress.duration)}` : ''}
          </span>
          <span>
            {currentProgress && currentProgress.duration > 0
              ? `${Math.round(currentProgress.percent * 100)}%`
              : activeIdx + 1 + ' of ' + content.videos.length}
          </span>
        </div>
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
