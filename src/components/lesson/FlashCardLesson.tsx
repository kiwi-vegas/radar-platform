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

export default function FlashCardLesson({
  lesson,
  isCompleted,
  onComplete,
  completing,
}: FlashCardLessonProps) {
  const content = lesson.content as FlashCardContent
  const cards = content.cards

  const [currentIndex, setCurrentIndex] = useState(0)
  // 'front' → 'collapsing' (scaleX→0) → 'back' (scaleX→1): avoids 3D backface-visibility bugs
  const [flipPhase, setFlipPhase] = useState<'front' | 'collapsing' | 'back'>('front')
  const [showClarification, setShowClarification] = useState(false)
  const showingAnswer = flipPhase === 'back'
  const [reviewedCount, setReviewedCount] = useState(0)
  const [reviewed, setReviewed] = useState<boolean[]>(new Array(cards.length).fill(false))
  const [showSummary, setShowSummary] = useState(isCompleted)

  const current = cards[currentIndex]
  const isLast = currentIndex === cards.length - 1

  function advance() {
    const newReviewed = [...reviewed]
    newReviewed[currentIndex] = true
    setReviewed(newReviewed)
    if (!reviewed[currentIndex]) setReviewedCount((n) => n + 1)

    if (isLast) {
      setShowSummary(true)
    } else {
      setFlipPhase('front')
      setShowClarification(false)
      setTimeout(() => setCurrentIndex((i) => i + 1), 150)
    }
  }

  function handleCardClick() {
    if (flipPhase !== 'front') return
    setFlipPhase('collapsing')
    setTimeout(() => setFlipPhase('back'), 130)
  }

  // --- Summary screen ---
  if (showSummary) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-2xl border p-8 text-center" style={{ background: '#7BC10908', borderColor: '#7BC10930' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#7BC10920', border: '2px solid #F9731440' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7BC109" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-tx-primary mb-2">All {cards.length} cards reviewed.</h3>
          <p className="text-tx-secondary text-sm max-w-sm mx-auto">
            You&apos;ve been through everything in this lesson. The quiz later will test how much has stuck — but for now, you&apos;re ready to move on.
          </p>
        </div>

        {/* Card list recap */}
        <div className="space-y-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-start gap-3 px-4 py-3 rounded-xl bg-surface-card border border-surface-border"
            >
              <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#7BC10920', color: '#7BC109' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-tx-secondary text-xs leading-snug">{card.question}</p>
                <p className="text-xs leading-snug font-medium" style={{ color: '#7BC109' }}>{card.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Complete button */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setCurrentIndex(0)
              setFlipPhase('front')
              setShowClarification(false)
              setReviewed(new Array(cards.length).fill(false))
              setReviewedCount(0)
              setShowSummary(false)
            }}
            className="py-3 px-5 rounded-xl border border-surface-border text-tx-secondary hover:text-tx-primary hover:border-surface-hover transition-colors text-sm font-medium whitespace-nowrap"
          >
            ↺ Let&apos;s do it again
          </button>
          {!isCompleted && (
            <button
              onClick={onComplete}
              disabled={completing}
              className="flex-1 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-brand-green flex items-center justify-center gap-2 text-sm"
            >
              {completing ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Saving…
                </>
              ) : (
                <>
                  Continue Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
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

  // --- Card review screen ---
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Intro */}
      {content.intro && (
        <div className="bg-surface-card border border-surface-border rounded-xl px-5 py-4">
          <p className="text-tx-secondary text-sm leading-relaxed">{content.intro}</p>
        </div>
      )}

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5">
        {cards.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === currentIndex ? '20px' : '8px',
              background: reviewed[i] ? '#7BC109' : i === currentIndex ? '#7BC10980' : '#1E2A3B',
            }}
          />
        ))}
      </div>

      {/* Flashcard — scaleX collapse/expand avoids 3D backface-visibility browser bugs */}
      <div
        className="cursor-pointer select-none"
        style={{ height: (current.questionImage || current.answerImage) ? '380px' : '300px' }}
        onClick={handleCardClick}
      >
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden"
          style={{
            transform: flipPhase === 'collapsing' ? 'scaleX(0)' : 'scaleX(1)',
            transition: 'transform 0.13s ease-in-out',
            background: showingAnswer ? '#7BC10908' : undefined,
            border: showingAnswer ? '1px solid #7BC10944' : '1px solid #1E2A3B',
          }}
        >
          {!showingAnswer ? (
            /* Front — question */
            <div className="bg-surface-card flex flex-col w-full h-full">
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
                  <p className="text-tx-primary text-lg font-medium leading-snug whitespace-pre-line">{current.question}</p>
                </div>
              )}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <span className="text-xs text-tx-muted bg-surface-card/80 backdrop-blur-sm px-3 py-1 rounded-full border border-surface-border">
                  Click to reveal answer
                </span>
              </div>
            </div>
          ) : (
            /* Back — answer */
            <div className="flex flex-col w-full h-full">
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
                  <div className="text-xs font-semibold text-brand-green uppercase tracking-wider mb-4">Answer</div>
                  <p className="text-tx-primary text-lg font-medium leading-snug whitespace-pre-line">{current.answer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons — appear once answer is visible */}
      <div
        className="transition-all duration-300 overflow-hidden"
        style={{ maxHeight: showingAnswer ? '300px' : '0', opacity: showingAnswer ? 1 : 0 }}
      >
        <div className="pt-1 space-y-3">
          {/* Clarification panel */}
          {showClarification && current.clarification && (
            <div className="rounded-xl border px-5 py-4 animate-fade-in" style={{ background: '#131A2B', borderColor: '#7BC10930' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7BC109' }}>
                Why this matters
              </p>
              <p className="text-tx-secondary text-sm leading-relaxed">{current.clarification}</p>
            </div>
          )}

          <div className="flex gap-3">
            {/* Clarification button — only shown if card has clarification and panel isn't open */}
            {current.clarification && !showClarification && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowClarification(true) }}
                className="flex-1 py-3 rounded-xl border text-sm font-medium transition-colors"
                style={{ borderColor: '#1E2A3B', color: '#94a3b8', background: 'transparent' }}
              >
                I need more clarification
              </button>
            )}

            {/* Got it button */}
            <button
              onClick={(e) => { e.stopPropagation(); advance() }}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: '#7BC109' }}
            >
              Got it, next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Back nav */}
      <button
        onClick={() => {
          if (currentIndex === 0) return
          setFlipPhase('front')
          setShowClarification(false)
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
