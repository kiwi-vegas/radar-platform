'use client'

import { useState } from 'react'
import type { Lesson, ReflectionContent, ReflectionQuestion } from '@/lib/types'

interface ReflectionLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  completing: boolean
}

export default function ReflectionLesson({
  lesson,
  isCompleted,
  onComplete,
  completing,
}: ReflectionLessonProps) {
  const content = lesson.content as ReflectionContent
  const [answers, setAnswers] = useState<Record<string, string | number>>({})

  const allAnswered = content.questions.every((q) => {
    const val = answers[q.id]
    if (q.type === 'scale') return val !== undefined
    if (q.type === 'text') return typeof val === 'string' && val.trim().length > 0
    return false
  })

  function setAnswer(questionId: string, value: string | number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Intro */}
      {content.intro && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
              </svg>
            </div>
            <p className="text-tx-secondary text-sm leading-relaxed">{content.intro}</p>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {content.questions.map((question, idx) => (
          <QuestionBlock
            key={question.id}
            question={question}
            index={idx + 1}
            value={answers[question.id]}
            onChange={(val) => setAnswer(question.id, val)}
            disabled={isCompleted}
          />
        ))}
      </div>

      {/* Outro */}
      {content.outro && (
        <div className="bg-surface-card border border-surface-border rounded-xl px-5 py-4 text-center">
          <p className="text-tx-secondary text-sm italic">{content.outro}</p>
        </div>
      )}

      {/* CTA */}
      {!isCompleted ? (
        <button
          onClick={onComplete}
          disabled={!allAnswered || completing}
          className="w-full py-4 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed bg-brand-orange flex items-center justify-center gap-2"
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
              {allAnswered ? 'Submit & Continue' : 'Answer all questions to continue'}
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

function QuestionBlock({
  question,
  index,
  value,
  onChange,
  disabled,
}: {
  question: ReflectionQuestion
  index: number
  value: string | number | undefined
  onChange: (val: string | number) => void
  disabled: boolean
}) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-6 h-6 rounded-full bg-surface border border-surface-border flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-semibold text-tx-muted">{index}</span>
        </div>
        <p className="text-tx-primary text-sm font-medium leading-relaxed">{question.question}</p>
      </div>

      {question.type === 'scale' && (
        <ScaleInput
          min={question.scaleMin ?? 1}
          max={question.scaleMax ?? 10}
          minLabel={question.scaleMinLabel}
          maxLabel={question.scaleMaxLabel}
          value={value as number | undefined}
          onChange={(n) => onChange(n)}
          disabled={disabled}
        />
      )}

      {question.type === 'text' && (
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
          placeholder="Type your response here…"
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-brand-orange transition-colors text-sm resize-none disabled:opacity-60"
        />
      )}
    </div>
  )
}

function ScaleInput({
  min,
  max,
  minLabel,
  maxLabel,
  value,
  onChange,
  disabled,
}: {
  min: number
  max: number
  minLabel?: string
  maxLabel?: string
  value: number | undefined
  onChange: (n: number) => void
  disabled: boolean
}) {
  const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {nums.map((n) => (
          <button
            key={n}
            onClick={() => !disabled && onChange(n)}
            disabled={disabled}
            className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all ${
              value === n
                ? 'bg-brand-orange border-brand-orange text-white'
                : 'border-surface-border text-tx-secondary hover:border-brand-orange/40 hover:text-tx-primary'
            } disabled:cursor-not-allowed`}
          >
            {n}
          </button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between mt-2">
          {minLabel && <span className="text-xs text-tx-muted">{minLabel}</span>}
          {maxLabel && <span className="text-xs text-tx-muted">{maxLabel}</span>}
        </div>
      )}
    </div>
  )
}
