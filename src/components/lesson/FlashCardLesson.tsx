'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Lesson, FlashCardContent } from '@/lib/types'

interface FlashCardLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: () => void
  completing: boolean
}

type CardResult = 'correct' | 'incorrect' | null

export default function FlashCardLesson({
  lesson,
  isCompleted,
  onComplete,
  completing,
}: FlashCardLessonProps) {
  const content = lesson.content as FlashCardContent
  const cards = content.cards

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [results, setResults] = useState<CardResult[]>(new Array(cards.length).fill(null))
  const [showSummary, setShowSummary] = useState(isCompleted)

  const current = cards[currentIndex]
  const isLast = currentIndex === cards.length - 1
  const currentResult = results[currentIndex]

  // The card shows answer when flipped OR hovered
  const showAnswer = isFlipped || isHovered

  const correctCount = results.filter((r) => r === 'correct').length

  function handleScore(result: 'correct' | 'incorrect') {
    const newResults = [...results]
    newResults[currentIndex] = result
    setResults(newResults)

    // Auto-advance after a short pause
    setTimeout(() => {
      if (isLast) {
        setShowSummary(true)
      } else {
        setIsFlipped(false)
        setIsHovered(false)
        setTimeout(() => setCurrentIndex((i) => i + 1), 150)
      }
    }, 300)
  }

  function handleCardClick() {
    // Click toggles flip (useful for mobile, or for desktop if they want to lock the answer visible)
    setIsFlipped((f) => !f)
  }

  function restart() {
    setIsFlipped(false)
    setIsHovered(false)
    setResults(new Array(cards.length).fill(null))
    setShowSummary(false)
    setTimeout(() => setCurrentIndex(0), 150)
  }

  // --- Summary screen ---
  if (showSummary) {
    const pct = Math.round((correctCount / cards.length) * 100)
    const passed = pct >= 70

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Score card */}
        <div className={`rounded-2xl border p-8 text-center ${passed ? 'bg-green-500/5 border-green-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
          <div className="text-5xl font-bold mb-2" style={{ color: passed ? '#22c55e' : '#F97316' }}>
            {correctCount}/{cards.length}
          </div>
          <div className="text-tx-secondary text-sm mb-1">{pct}% correct</div>
          <div className={`text-lg font-semibold mt-4 ${passed ? 'text-green-400' : 'text-brand-orange'}`}>
            {passed ? 'Great work!' : 'Keep practicing!'}
          </div>
          <p className="text-tx-muted text-sm mt-2">
            {passed
              ? 'You have a solid grasp of the core concepts.'
              : 'Review the cards you missed and try again.'}
          </p>
        </div>

        {/* Per-card breakdown */}
        <div className="space-y-2">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="flex items-start gap-3 px-4 py-3 rounded-xl bg-surface-card border border-surface-border"
            >
              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${results[i] === 'correct' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {results[i] === 'correct' ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-tx-secondary text-xs leading-snug">{card.question}</p>
                {results[i] === 'incorrect' && (
                  <p className="text-brand-orange text-xs mt-1 font-medium">{card.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={restart}
            className="flex-1 py-3 rounded-xl border border-surface-border text-tx-secondary hover:text-tx-primary hover:border-surface-hover transition-colors text-sm font-medium"
          >
            ↺ Try Again
          </button>
          {!isCompleted && (
            <button
              onClick={onComplete}
              disabled={completing}
              className="flex-1 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-brand-orange flex items-center justify-center gap-2 text-sm"
            >
              {completing ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Complete & Continue
                </>
              )}
            </button>
          )}
          {isCompleted && (
            <div className="flex-1 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-sm flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Lesson Complete
            </div>
          )}
        </div>
      </div>
    )
  }

  // --- Card drill screen ---
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Intro */}
      {content.intro && (
        <div className="bg-surface-card border border-surface-border rounded-xl px-5 py-4">
          <p className="text-tx-secondary text-sm leading-relaxed">{content.intro}</p>
        </div>
      )}

      {/* Progress dots */}
      <div className="flex items-center justify-between text-xs text-tx-muted">
        <span>Card {currentIndex + 1} of {cards.length}</span>
        <div className="flex gap-1.5 items-center">
          {cards.map((_, i) => {
            const r = results[i]
            return (
              <div
                key={i}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === currentIndex ? '20px' : '8px',
                  background:
                    r === 'correct' ? '#22c55e'
                    : r === 'incorrect' ? '#ef4444'
                    : i === currentIndex ? '#F97316'
                    : '#1E2A3B',
                }}
              />
            )
          })}
        </div>
        <span className="text-brand-orange font-medium tabular-nums">
          {correctCount}/{cards.length}
        </span>
      </div>

      {/* Flashcard */}
      <div
        className="perspective cursor-pointer select-none"
        style={{ height: current.questionImage ? '380px' : '260px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div
          className={`transform-style-3d relative w-full h-full transition-transform duration-500 ${showAnswer ? 'rotate-y-180' : ''}`}
        >
          {/* Front — question */}
          <div className="backface-hidden absolute inset-0 bg-surface-card border border-surface-border rounded-2xl overflow-hidden flex flex-col">
            {current.questionImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={current.questionImage}
                  alt={current.question}
                  fill
                  className="object-contain"
                  sizes="(max-width: 896px) 100vw, 768px"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="text-xs font-semibold text-tx-muted uppercase tracking-wider mb-4">Question</div>
                <p className="text-tx-primary text-lg font-medium leading-snug">{current.question}</p>
              </div>
            )}
            {/* Hover hint */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <span className="text-xs text-tx-muted bg-surface-card/80 backdrop-blur-sm px-3 py-1 rounded-full border border-surface-border">
                Hover to reveal · Click to lock
              </span>
            </div>
          </div>

          {/* Back — answer */}
          <div
            className="backface-hidden absolute inset-0 rounded-2xl overflow-hidden flex flex-col rotate-y-180"
            style={{ borderColor: '#F9731644', border: '1px solid #F9731444', background: '#F9731608' }}
          >
            {current.answerImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={current.answerImage}
                  alt={current.answer}
                  fill
                  className="object-contain"
                  sizes="(max-width: 896px) 100vw, 768px"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-4">Answer</div>
                <p className="text-tx-primary text-lg font-medium leading-snug">{current.answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scoring buttons — appear once answer is visible */}
      <div
        className="transition-all duration-300 overflow-hidden"
        style={{ maxHeight: showAnswer ? '120px' : '0', opacity: showAnswer ? 1 : 0 }}
      >
        <div className="pt-1">
          <p className="text-center text-xs text-tx-muted mb-3">Did you get it right?</p>
          <div className="flex gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); handleScore('incorrect') }}
              disabled={currentResult !== null}
              className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ borderColor: '#ef444440', color: '#ef4444', background: '#ef444408' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Missed it
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleScore('correct') }}
              disabled={currentResult !== null}
              className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ borderColor: '#22c55e40', color: '#22c55e', background: '#22c55e08' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Got it!
            </button>
          </div>
        </div>
      </div>

      {/* Manual nav (prev only, since scoring auto-advances) */}
      <button
        onClick={() => {
          if (currentIndex === 0) return
          setIsFlipped(false)
          setIsHovered(false)
          setTimeout(() => setCurrentIndex((i) => i - 1), 150)
        }}
        disabled={currentIndex === 0}
        className="w-full py-2.5 rounded-xl border border-surface-border text-tx-muted hover:text-tx-secondary hover:border-surface-hover transition-colors text-xs font-medium disabled:opacity-20 disabled:cursor-not-allowed"
      >
        ← Back to previous card
      </button>
    </div>
  )
}
