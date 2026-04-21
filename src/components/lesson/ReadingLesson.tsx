'use client'

import type { Lesson, ReadingContent } from '@/lib/types'

interface ReadingLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  completing: boolean
}

function renderBody(text: string) {
  // Split by newline, render **bold** inline
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

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {content.intro && (
        <p className="text-base leading-relaxed" style={{ color: '#94a3b8' }}>
          {content.intro}
        </p>
      )}

      <div className="space-y-6">
        {content.sections.map((section, i) => (
          <div
            key={i}
            className="rounded-xl p-5"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(123,193,9,0.12)',
            }}
          >
            {section.heading && (
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: '#7BC109', color: '#0B0F1A' }}
                >
                  {i + 1}
                </div>
                <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: '#7BC109', fontFamily: 'Raleway, sans-serif' }}>
                  {section.heading}
                </h4>
              </div>
            )}
            <div className="text-sm leading-relaxed" style={{ color: '#94a3b8', paddingLeft: section.heading ? '36px' : '0' }}>
              {renderBody(section.body)}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={onComplete}
          disabled={completing || isCompleted}
          className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all"
          style={{
            background: isCompleted ? 'rgba(123,193,9,0.15)' : '#7BC109',
            color: isCompleted ? '#7BC109' : '#0B0F1A',
            border: isCompleted ? '1px solid rgba(123,193,9,0.3)' : 'none',
            cursor: completing || isCompleted ? 'default' : 'pointer',
          }}
        >
          {isCompleted ? '✓ Completed' : completing ? 'Saving…' : 'Got It — Continue →'}
        </button>
      </div>
    </div>
  )
}
