'use client'

import { useState } from 'react'
import type { Lesson, ReadingContent } from '@/lib/types'

interface ReadingLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  completing: boolean
}

function renderBody(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <span key={i}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j}>{part.slice(2, -2)}</strong>
            : part
        )}
        <br />
      </span>
    )
  })
}

export default function ReadingLesson({ lesson, isCompleted, onComplete, completing }: ReadingLessonProps) {
  const content = lesson.content as ReadingContent
  const [checked, setChecked] = useState<boolean[]>(() => content.sections.map(() => false))

  const allChecked = checked.every(Boolean)

  function toggle(i: number) {
    setChecked(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Instruction banner */}
      <div
        className="rounded-xl px-5 py-4 flex items-start gap-3"
        style={{ background: 'rgba(123,193,9,0.08)', border: '1px solid rgba(123,193,9,0.2)' }}
      >
        <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7BC109" strokeWidth="2.5">
          <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        <p className="text-sm font-semibold" style={{ color: '#7BC109' }}>
          Quickly read each section, check the box when done, then move on to the next module.
        </p>
      </div>

      {content.intro && (
        <p className="text-base leading-relaxed" style={{ color: '#94a3b8' }}>
          {content.intro}
        </p>
      )}

      <div className="space-y-4">
        {content.sections.map((section, i) => {
          const done = checked[i]
          return (
            <div
              key={i}
              className="rounded-xl p-5 transition-all duration-300"
              style={{
                background: done ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.03)',
                border: done ? '1px solid rgba(123,193,9,0.06)' : '1px solid rgba(123,193,9,0.12)',
                opacity: done ? 0.45 : 1,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggle(i)}
                  className="flex-shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-all"
                  style={{
                    background: done ? '#7BC109' : 'transparent',
                    border: done ? '2px solid #7BC109' : '2px solid rgba(123,193,9,0.4)',
                  }}
                  aria-label={done ? 'Mark unread' : 'Mark as read'}
                >
                  {done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0B0F1A" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  {section.heading && (
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: done ? 'rgba(123,193,9,0.3)' : '#7BC109', color: '#0B0F1A' }}
                      >
                        {i + 1}
                      </div>
                      <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: done ? 'rgba(123,193,9,0.5)' : '#7BC109', fontFamily: 'Raleway, sans-serif' }}>
                        {section.heading}
                      </h4>
                    </div>
                  )}
                  <div className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                    {renderBody(section.body)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress hint */}
      {!isCompleted && !allChecked && (
        <p className="text-xs text-center" style={{ color: 'rgba(148,163,184,0.5)' }}>
          {checked.filter(Boolean).length} of {content.sections.length} sections read
        </p>
      )}

      <div className="pt-1">
        <button
          onClick={onComplete}
          disabled={completing || isCompleted || !allChecked}
          className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all"
          style={{
            background: isCompleted
              ? 'rgba(123,193,9,0.15)'
              : allChecked
                ? '#7BC109'
                : 'rgba(123,193,9,0.1)',
            color: isCompleted
              ? '#7BC109'
              : allChecked
                ? '#0B0F1A'
                : 'rgba(123,193,9,0.35)',
            border: isCompleted ? '1px solid rgba(123,193,9,0.3)' : 'none',
            cursor: completing || isCompleted || !allChecked ? 'default' : 'pointer',
          }}
        >
          {isCompleted ? '✓ Completed' : completing ? 'Saving…' : allChecked ? "All Read — Continue →" : `Check all ${content.sections.length} sections to continue`}
        </button>
      </div>
    </div>
  )
}
