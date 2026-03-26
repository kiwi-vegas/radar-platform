'use client'

import { useState } from 'react'
import type { Lesson, QuizContent } from '@/lib/types'

interface QuizLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: (score: number) => void
  completing: boolean
}

type AnswerMap = Record<string, number>

export default function QuizLesson({
  lesson,
  isCompleted,
  onComplete,
  completing,
}: QuizLessonProps) {
  const content = lesson.content as QuizContent
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [submitted, setSubmitted] = useState(isCompleted)
  const [score, setScore] = useState<number | null>(null)

  const allAnswered = content.questions.every((q) => answers[q.id] !== undefined)

  function handleSelect(questionId: string, optionIndex: number) {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  function handleSubmit() {
    const correct = content.questions.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length
    const pct = Math.round((correct / content.questions.length) * 100)
    setScore(pct)
    setSubmitted(true)
  }

  function handlePass() {
    onComplete(score ?? 0)
  }

  const passed = score !== null && score >= content.passingScore

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Intro */}
      {content.intro && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
          <p className="text-tx-secondary text-sm leading-relaxed">{content.intro}</p>
        </div>
      )}

      {/* Score banner — shown after submission */}
      {submitted && score !== null && (
        <div
          className={`rounded-2xl p-5 border flex items-center gap-4 ${
            passed
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${
              passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
          >
            {passed ? '🎯' : '📚'}
          </div>
          <div>
            <div className={`font-bold text-lg ${passed ? 'text-green-400' : 'text-red-400'}`}>
              {score}% — {passed ? 'Passed!' : 'Not quite'}
            </div>
            <p className={`text-sm ${passed ? 'text-green-300' : 'text-red-300'}`}>
              {passed
                ? `You got ${content.questions.filter((q) => answers[q.id] === q.correctIndex).length} out of ${content.questions.length} correct.`
                : `You need ${content.passingScore}% to pass. Review the answers below and try again.`}
            </p>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {content.questions.map((question, qIdx) => {
          const selected = answers[question.id]
          const isCorrect = submitted && selected === question.correctIndex
          const isWrong = submitted && selected !== question.correctIndex

          return (
            <div
              key={question.id}
              className="bg-surface-card border border-surface-border rounded-2xl p-5"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-surface border border-surface-border flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-tx-muted">{qIdx + 1}</span>
                </div>
                <p className="text-tx-primary text-sm font-medium leading-relaxed">
                  {question.question}
                </p>
              </div>

              <div className="space-y-2 ml-9">
                {question.options.map((option, oIdx) => {
                  const isSelected = selected === oIdx
                  const isAnswer = question.correctIndex === oIdx

                  let borderColor = '#1E2A3B'
                  let bgColor = 'transparent'
                  let textColor = '#94A3B8'

                  if (submitted) {
                    if (isAnswer) {
                      borderColor = '#22c55e'
                      bgColor = '#22c55e14'
                      textColor = '#86efac'
                    } else if (isSelected && !isAnswer) {
                      borderColor = '#ef444444'
                      bgColor = '#ef444414'
                      textColor = '#fca5a5'
                    }
                  } else if (isSelected) {
                    borderColor = '#F97316'
                    bgColor = '#F9731614'
                    textColor = '#F1F5F9'
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(question.id, oIdx)}
                      disabled={submitted}
                      className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3 disabled:cursor-default"
                      style={{ borderColor, background: bgColor, color: textColor }}
                    >
                      <div
                        className="w-4 h-4 rounded-full border shrink-0 flex items-center justify-center"
                        style={{ borderColor }}
                      >
                        {isSelected && !submitted && (
                          <div className="w-2 h-2 rounded-full bg-brand-orange" />
                        )}
                        {submitted && isAnswer && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                        {submitted && isSelected && !isAnswer && (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        )}
                      </div>
                      {option}
                    </button>
                  )
                })}

                {/* Explanation */}
                {submitted && question.explanation && (
                  <div className="mt-2 px-4 py-3 rounded-xl bg-surface border border-surface-border">
                    <p className="text-xs text-tx-secondary leading-relaxed">
                      <span className="font-semibold text-tx-primary">Explanation: </span>
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Submit / retry / complete */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full py-4 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed bg-brand-orange"
        >
          {allAnswered ? 'Submit Answers' : 'Answer all questions to submit'}
        </button>
      ) : passed && !isCompleted ? (
        <button
          onClick={handlePass}
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
              Complete & Continue
            </>
          )}
        </button>
      ) : !passed ? (
        <button
          onClick={() => {
            setSubmitted(false)
            setScore(null)
            setAnswers({})
          }}
          className="w-full py-4 rounded-xl border border-brand-orange text-brand-orange font-semibold hover:bg-brand-orange/5 transition-colors"
        >
          Try Again
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
