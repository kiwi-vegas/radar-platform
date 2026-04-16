'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Lesson, CertificateContent } from '@/lib/types'

interface CertificateLessonProps {
  lesson: Lesson
  isCompleted: boolean
  showCompleted: boolean
  onComplete: () => void
  completing: boolean
  courseSlug: string
}

export default function CertificateLesson({
  lesson,
  showCompleted,
  onComplete,
  completing,
  courseSlug,
}: CertificateLessonProps) {
  const content = lesson.content as CertificateContent
  const [userName, setUserName] = useState<string>('Graduate')
  const router = useRouter()

  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const name =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split('@')[0] ||
          'Graduate'
        setUserName(name)
      }
    })
  }, [])

  const handleDownload = () => {
    const win = window.open('', '_blank')
    if (!win) return

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>RADAR Certificate — ${userName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f8f4ef;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
      padding: 40px 20px;
    }
    .page {
      width: 800px;
      background: #fff;
      padding: 60px;
    }
    .outer-border {
      border: 3px double #c8a96e;
      padding: 48px;
      position: relative;
    }
    .corner {
      position: absolute;
      width: 32px;
      height: 32px;
      border-color: #F97316;
      border-style: solid;
    }
    .corner-tl { top: 8px; left: 8px; border-width: 2px 0 0 2px; }
    .corner-tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; }
    .corner-bl { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; }
    .corner-br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }
    .badge {
      text-align: center;
      margin-bottom: 8px;
    }
    .badge svg { display: inline-block; }
    .cert-label {
      text-align: center;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: #F97316;
      margin-bottom: 24px;
    }
    .divider {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 20px 0;
    }
    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, #c8a96e, transparent);
    }
    .divider-diamond {
      width: 6px;
      height: 6px;
      background: #F97316;
      transform: rotate(45deg);
    }
    .certifies {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 16px;
      color: #666;
      margin-bottom: 16px;
    }
    .student-name {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.1;
      margin-bottom: 16px;
    }
    .completed-text {
      text-align: center;
      font-size: 14px;
      color: #666;
      font-weight: 400;
      margin-bottom: 8px;
    }
    .course-name {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    .course-subtitle {
      text-align: center;
      font-size: 13px;
      color: #888;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .modules {
      text-align: center;
      font-size: 12px;
      color: #F97316;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e8e0d0;
    }
    .footer-left, .footer-right {
      font-size: 12px;
      color: #888;
    }
    .footer-value {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    .footer-right { text-align: right; }
    @media print {
      body { background: white; padding: 0; }
      .page { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="outer-border">
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>

      <div class="badge">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#FFF7ED" stroke="#F97316" stroke-width="1.5"/>
          <path d="M24 12L27.09 19.26L35 20.27L29.5 25.64L30.89 33.5L24 29.77L17.11 33.5L18.5 25.64L13 20.27L20.91 19.26L24 12Z" fill="#F97316"/>
        </svg>
      </div>

      <p class="cert-label">Certificate of Completion</p>

      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-diamond"></div>
        <div class="divider-line"></div>
      </div>

      <p class="certifies">This certifies that</p>
      <h1 class="student-name">${userName}</h1>
      <p class="completed-text">has successfully completed the full training program</p>

      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-diamond"></div>
        <div class="divider-line"></div>
      </div>

      <p class="course-name">${content.courseName}: ${content.courseSubtitle}</p>
      <p class="course-subtitle">Training Program</p>
      <p class="modules">${content.modules.join('  ·  ')}</p>

      <div class="footer">
        <div class="footer-left">
          <div class="footer-value">${completionDate}</div>
          Date of Completion
        </div>
        <div class="footer-right">
          <div class="footer-value">${content.instructorName}</div>
          ${content.instructorTitle}
        </div>
      </div>
    </div>
  </div>
  <script>window.onload = () => { window.print() }<\/script>
</body>
</html>`)
    win.document.close()
  }

  // Completed state — full certificate
  if (showCompleted) {
    return (
      <div className="py-4">
        {/* Celebration header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#F9731620', border: '2px solid #F9731640' }}
          >
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" fill="#F9731610" stroke="#F97316" strokeWidth="1.5"/>
              <path d="M24 12L27.09 19.26L35 20.27L29.5 25.64L30.89 33.5L24 29.77L17.11 33.5L18.5 25.64L13 20.27L20.91 19.26L24 12Z" fill="#F97316"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-tx-primary mb-2">You did it.</h2>
          <p className="text-tx-secondary text-sm max-w-md mx-auto">
            You&apos;ve completed the full RADAR Training Program. Your certificate is ready to download and share.
          </p>
        </div>

        {/* Certificate card */}
        <div
          className="rounded-2xl border-2 p-8 mb-6 max-w-2xl mx-auto"
          style={{ background: '#0D1320', borderColor: '#c8a96e44' }}
        >
          {/* Inner border */}
          <div className="rounded-xl border p-6 text-center" style={{ borderColor: '#c8a96e33' }}>
            {/* Star badge */}
            <div className="mb-4">
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none" className="mx-auto">
                <circle cx="24" cy="24" r="22" fill="#F9731610" stroke="#F97316" strokeWidth="1.5"/>
                <path d="M24 12L27.09 19.26L35 20.27L29.5 25.64L30.89 33.5L24 29.77L17.11 33.5L18.5 25.64L13 20.27L20.91 19.26L24 12Z" fill="#F97316"/>
              </svg>
            </div>

            <p className="text-xs font-semibold tracking-[0.35em] uppercase mb-4" style={{ color: '#F97316' }}>
              Certificate of Completion
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8a96e66, transparent)' }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#F97316' }} />
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #c8a96e66, transparent)' }} />
            </div>

            <p className="text-tx-muted text-sm italic mb-2">This certifies that</p>
            <h3 className="text-3xl font-bold text-tx-primary mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              {userName}
            </h3>
            <p className="text-tx-muted text-sm mb-2">has successfully completed the full training program</p>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8a96e66, transparent)' }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#F97316' }} />
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #c8a96e66, transparent)' }} />
            </div>

            <p className="text-xl font-bold text-tx-primary mb-1">
              {content.courseName}: {content.courseSubtitle}
            </p>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#888' }}>
              Training Program
            </p>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#F97316' }}>
              {content.modules.join('  ·  ')}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-end mt-6 pt-5 border-t" style={{ borderColor: '#1E2A3B' }}>
              <div className="text-left">
                <p className="text-sm font-semibold text-tx-primary">{completionDate}</p>
                <p className="text-xs text-tx-muted">Date of Completion</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-tx-primary">{content.instructorName}</p>
                <p className="text-xs text-tx-muted">{content.instructorTitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: '#F97316' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Certificate
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            style={{ background: '#1E2A3B', color: '#94a3b8' }}
          >
            Back to Dashboard
          </button>
        </div>

        <p className="text-center text-xs text-tx-muted mt-4">
          Share your certificate with your team leader to unlock your RADAR leads.
        </p>
      </div>
    )
  }

  // Preview state — before completion
  return (
    <div className="py-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-tx-primary mb-2">You&apos;re almost there.</h2>
        <p className="text-tx-secondary text-sm max-w-lg mx-auto">
          Complete all three sections of RADAR training to earn your certificate. Once you graduate, you can download and share this with your team leader.
        </p>
      </div>

      {/* Certificate preview — slightly dimmed */}
      <div
        className="rounded-2xl border-2 p-8 mb-6 max-w-2xl mx-auto opacity-60"
        style={{ background: '#0D1320', borderColor: '#c8a96e33' }}
      >
        <div className="rounded-xl border p-6 text-center" style={{ borderColor: '#c8a96e22' }}>
          <div className="mb-4">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none" className="mx-auto">
              <circle cx="24" cy="24" r="22" fill="#F9731610" stroke="#F97316" strokeWidth="1.5"/>
              <path d="M24 12L27.09 19.26L35 20.27L29.5 25.64L30.89 33.5L24 29.77L17.11 33.5L18.5 25.64L13 20.27L20.91 19.26L24 12Z" fill="#F97316"/>
            </svg>
          </div>
          <p className="text-xs font-semibold tracking-[0.35em] uppercase mb-4" style={{ color: '#F97316' }}>
            Certificate of Completion
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8a96e44, transparent)' }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#F97316' }} />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #c8a96e44, transparent)' }} />
          </div>
          <p className="text-tx-muted text-sm italic mb-2">This certifies that</p>
          <h3 className="text-3xl font-bold text-tx-primary mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            {userName || 'Your Name'}
          </h3>
          <p className="text-tx-muted text-sm mb-4">has successfully completed the full training program</p>
          <p className="text-xl font-bold text-tx-primary mb-1">
            {content.courseName}: {content.courseSubtitle}
          </p>
          <p className="text-xs tracking-widest uppercase mt-3" style={{ color: '#F97316' }}>
            {content.modules.join('  ·  ')}
          </p>
        </div>
      </div>

      {/* Graduate button */}
      <div className="text-center">
        <button
          onClick={onComplete}
          disabled={completing}
          className="px-10 py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: '#F97316' }}
        >
          {completing ? 'Graduating…' : 'Graduate & Claim Certificate →'}
        </button>
      </div>
    </div>
  )
}
