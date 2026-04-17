'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import type { Lesson, RoleplayContent } from '@/lib/types'

interface RoleplayLessonProps {
  lesson: Lesson
  isCompleted: boolean
  onComplete: (score: number) => void
  completing: boolean
}

export default function RoleplayLesson({
  lesson,
  isCompleted,
  onComplete,
  completing,
}: RoleplayLessonProps) {
  const content = lesson.content as RoleplayContent

  const [step, setStep] = useState<'prep' | 'upload' | 'done'>(
    isCompleted ? 'done' : 'prep'
  )
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [reportScore, setReportScore] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scoreTooLow = reportScore !== null && reportScore < content.minimumScore
  const canSubmit = uploadedFile !== null && reportScore !== null && !scoreTooLow

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFile(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleSubmit() {
    if (!canSubmit || reportScore === null) return
    setStep('done')
    onComplete(reportScore)
  }

  function handleRetry() {
    setUploadedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setReportScore(null)
    setStep('prep')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Intro */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
        <p className="text-tx-secondary text-sm leading-relaxed">{content.intro}</p>
      </div>

      {/* Lesson thumbnail */}
      {lesson.image && (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <Image
            src={lesson.image}
            alt={lesson.title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 768px"
          />
        </div>
      )}

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-surface-card border border-surface-border rounded-xl p-4">
          <div className="text-xs font-semibold text-tx-muted uppercase tracking-wider mb-2">Minimum to Pass</div>
          <div className="text-3xl font-bold text-brand-orange">{content.minimumScore}/10</div>
          <div className="text-xs text-tx-muted mt-1">Required on your report card</div>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-4">
          <div className="text-xs font-semibold text-tx-muted uppercase tracking-wider mb-2">Practice Line</div>
          <a
            href={`tel:${content.phoneNumber.replace(/\D/g, '')}`}
            className="text-xl font-bold text-brand-orange hover:opacity-80 transition-opacity block"
          >
            {content.phoneNumber}
          </a>
          <div className="text-xs text-tx-muted mt-1">Call now to start</div>
        </div>
      </div>

      {/* Call instructions */}
      <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.18a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-brand-orange mb-1">How This Works</div>
            <p className="text-tx-secondary text-sm leading-relaxed">{content.callInstructions}</p>
          </div>
        </div>
      </div>

      {/* Prep step */}
      {step === 'prep' && (
        <button
          onClick={() => setStep('upload')}
          className="w-full py-4 rounded-xl text-white font-semibold bg-brand-orange hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.18a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          I Made the Call — Upload My Report Card
        </button>
      )}

      {/* Upload step */}
      {step === 'upload' && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="font-semibold text-tx-primary mb-1">Upload your report card</h3>
            <p className="text-tx-secondary text-xs leading-relaxed">
              You should have received a score report via text. Take a screenshot and upload it here. You need an 8 or better to continue.
            </p>
          </div>

          {/* File upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed rounded-xl cursor-pointer transition-colors hover:border-brand-orange/40"
            style={{ borderColor: uploadedFile ? '#F9731644' : '#1E2A3B', minHeight: '140px' }}
          >
            {previewUrl ? (
              <div className="relative w-full rounded-xl overflow-hidden" style={{ minHeight: '140px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Report card"
                  className="w-full h-auto rounded-xl object-contain max-h-64"
                />
                <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Uploaded
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="text-tx-secondary text-sm font-medium">Tap to upload screenshot</p>
                <p className="text-tx-muted text-xs mt-1">PNG, JPG, or any image format</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {uploadedFile && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-tx-muted hover:text-tx-secondary transition-colors underline underline-offset-2"
            >
              Replace image
            </button>
          )}

          {/* Score entry */}
          <div>
            <div className="text-sm font-semibold text-tx-primary mb-3">What score did you receive?</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button
                  key={n}
                  onClick={() => setReportScore(n)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${
                    reportScore === n
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

            {reportScore !== null && (
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                reportScore >= content.minimumScore
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {reportScore >= content.minimumScore
                  ? `${reportScore}/10 — Passing score! You're ready to move on.`
                  : `${reportScore}/10 — You need an ${content.minimumScore} or better. Call again and re-upload.`
                }
              </div>
            )}
          </div>

          {/* Remediation */}
          {scoreTooLow && content.remediation && (
            <div className="bg-surface border border-surface-border rounded-xl p-4">
              <div className="text-xs font-semibold text-tx-muted uppercase tracking-wider mb-2">Coaching note</div>
              <p className="text-tx-secondary text-sm leading-relaxed">{content.remediation}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {scoreTooLow ? (
              <button
                onClick={handleRetry}
                className="flex-1 py-3 rounded-xl border border-brand-orange text-brand-orange font-semibold text-sm hover:bg-brand-orange/5 transition-colors"
              >
                Try Again
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || completing}
                className="flex-1 py-3 rounded-xl text-white font-semibold text-sm bg-brand-orange hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    Submit & Continue
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Done state */}
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
