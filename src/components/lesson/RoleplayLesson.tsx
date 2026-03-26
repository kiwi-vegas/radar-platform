'use client'

import { useState } from 'react'
import type { Lesson, RoleplayContent } from '@/lib/types'

interface RoleplayLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: (score: number) => void
  completing: boolean
}

const SCORE_LABELS: Record<number, string> = {
  1: 'Very rough',
  2: 'Struggled throughout',
  3: 'Missed most beats',
  4: 'Some good moments',
  5: 'Getting there',
  6: 'Decent — a few gaps',
  7: 'Solid, one clear miss',
  8: 'Strong — minor polish needed',
  9: 'Very smooth and natural',
  10: 'Perfect execution',
}

export default function RoleplayLesson({
  lesson,
  isCompleted,
  onComplete,
  completing,
}: RoleplayLessonProps) {
  const content = lesson.content as RoleplayContent

  const [step, setStep] = useState<'prep' | 'calling' | 'scoring' | 'done'>(
    isCompleted ? 'done' : 'prep'
  )
  const [selfScore, setSelfScore] = useState<number | null>(null)
  const scoreTooLow = selfScore !== null && selfScore < content.minimumScore

  function handleCallDone() {
    setStep('scoring')
  }

  function handleSubmitScore() {
    if (selfScore === null) return
    if (selfScore >= content.minimumScore) {
      setStep('done')
      onComplete(selfScore)
    } else {
      setStep('prep') // retry
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Intro */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
        <p className="text-tx-secondary text-sm leading-relaxed">{content.intro}</p>
      </div>

      {/* Script */}
      <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">Your Script</span>
        </div>
        <div className="p-5">
          <pre className="text-tx-secondary text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {content.script}
          </pre>
        </div>
      </div>

      {/* Scoring criteria callout */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-surface-card border border-surface-border rounded-xl p-4">
          <div className="text-xs font-semibold text-tx-muted uppercase tracking-wider mb-2">Minimum to Pass</div>
          <div className="text-3xl font-bold text-brand-orange">{content.minimumScore}/10</div>
          <div className="text-xs text-tx-muted mt-1">Score yourself honestly</div>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-4">
          <div className="text-xs font-semibold text-tx-muted uppercase tracking-wider mb-2">Practice Line</div>
          <a
            href={`tel:${content.phoneNumber.replace(/\D/g, '')}`}
            className="text-xl font-bold text-brand-orange hover:text-brand-orange-light transition-colors block"
          >
            {content.phoneNumber}
          </a>
          <div className="text-xs text-tx-muted mt-1">Maverick practice system</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.18a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-brand-orange mb-1">Call Instructions</div>
            <p className="text-tx-secondary text-sm leading-relaxed">{content.callInstructions}</p>
          </div>
        </div>
      </div>

      {/* Step-based CTA */}
      {step === 'prep' && (
        <button
          onClick={handleCallDone}
          className="w-full py-4 rounded-xl text-white font-semibold bg-brand-orange hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.18a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          I Made the Call — Score Myself
        </button>
      )}

      {step === 'scoring' && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="font-semibold text-tx-primary mb-1">How did that call go?</h3>
            <p className="text-tx-secondary text-xs">
              Be honest with yourself. An 8 means it was genuinely smooth and natural — not perfect, but solid.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button
                  key={n}
                  onClick={() => setSelfScore(n)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${
                    selfScore === n
                      ? n >= content.minimumScore
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-red-500 border-red-500 text-white'
                      : 'border-surface-border text-tx-secondary hover:border-brand-orange/40'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {selfScore && (
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selfScore >= content.minimumScore
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {SCORE_LABELS[selfScore]} {selfScore >= content.minimumScore ? '✓ Passing' : '✗ Retry required'}
              </div>
            )}
          </div>

          {scoreTooLow && content.remediation && (
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <div className="text-xs font-semibold text-tx-muted uppercase tracking-wider mb-2">Coaching note</div>
              <p className="text-tx-secondary text-sm leading-relaxed">{content.remediation}</p>
            </div>
          )}

          <button
            onClick={handleSubmitScore}
            disabled={selfScore === null || completing}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              scoreTooLow
                ? 'border border-brand-orange text-brand-orange hover:bg-brand-orange/5'
                : 'bg-brand-orange text-white hover:opacity-90'
            }`}
          >
            {completing ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Saving…
              </>
            ) : scoreTooLow ? (
              'Try Again (call again, then re-score)'
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Submit Score & Continue
              </>
            )}
          </button>
        </div>
      )}

      {(step === 'done' || isCompleted) && (
        <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-sm flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Practice Call Passed
        </div>
      )}
    </div>
  )
}
